import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MonitoringChart from './MonitoringChart';
import DataTable from './DataTable';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import api from '../services/api';
import './Dashboard.css';
import Navbar from './Navbar'; // <-- IMPORT NAVBAR
import ModalDataTable from './ModalDataTable'; // <-- IMPORT MODAL

// ... (Keep all your constants like THRESHOLDS, SESSION_THRESHOLDS, etc. exactly as they were)
const THRESHOLDS = {
  "OS LOAD": { warning: 3, critical: 4 },
  "REDO LOG SPACE REQUESTS": { warning: 1, critical: 2 },
  "TABLESPACE USAGE": { warning: 85, critical: 90 },
  "SGA": { warning: 90, critical: 95 },
  "PGA": { warning: 90, critical: 95 },
  "BUFFER CACHE HIT RATIO": { warning: 90, critical: 85, isGoodHigh: true },
  "LIBRARY CACHE HIT RATIO": { warning: 95, critical: 90, isGoodHigh: true },
  "INVALID OBJECTS COUNT": { warning: 0, critical: 0 } // any > 0 critica
};

const SESSION_THRESHOLDS = {
  ACTIVE: { warning: 8, critical: 16 },
  INACTIVE: { warning: 200, critical: 500 }
};

const getSessionAlertLevel = (status, count) => {
  const threshold = SESSION_THRESHOLDS[status.toUpperCase()];
  if (!threshold) return null;
  const numericCount = parseInt(count, 10);
  if (isNaN(numericCount)) return null;
  if (numericCount >= threshold.critical) return "critical";
  if (numericCount >= threshold.warning) return "warning";
  return null;
};

const getAlertClass = (level) => {
  if (level === "critical") return "critical-blink";
  if (level === "warning") return "warning-pulse";
  return "";
};

const getAlertStyle = (level) => {
  if (level === "critical") return { color: "#C40000", fontWeight: "bold" };
  if (level === "warning") return { color: "#FFA500", fontWeight: "bold" };
  return {};
};

const dummyData = {
  "DATABASE NAME": [
    { "col1": "U7CIR1D1" }
  ],
  "DATABASE VERSION": [
    { "col1": "19.0.0.0.0" }
  ],
  "INSTANCE NAME": [
    { "col1": "Instance", "col2": "Name" },
    { "col1": "u7cir1d1" }
  ],
  "STARTUP TIME": [
    { "col1": "Startup", "col2": "Time" },
    { "col1": "2025-08-06", "col2": "17:10:03" }
  ],
  "UPTIME": [
    { "col1": "786.62" }
  ],
  "OS LOAD": [
    { "col1": "0" }
  ],
  "REDO LOG SPACE REQUESTS": [
    { "col1": "437863" }
  ],
  "SGA": [
    { "col1": "NAME", "col2": "Value_MB" },
    { "col1": "Fixed", "col2": "Size", "col3": "9" },
    { "col1": "Variable", "col2": "Size", "col3": "2640" },
    { "col1": "Database", "col2": "Buffers", "col3": "1408" },
    { "col1": "Redo", "col2": "Buffers", "col3": "39" }
  ],
  "PGA": [
    { "col1": "NAME", "col2": "Value_MB" },
    { "col1": "total", "col2": "PGA", "col3": "inuse", "col4": "339" },
    { "col1": "total", "col2": "PGA", "col3": "allocated", "col4": "503" }
  ],
  "TABLESPACE USAGE": [
    { "col1": "TABLESPACE_NAME", "col2": "Used_MB", "col3": "Free_MB" },
    { "col1": "SYSTEM", "col2": "1992", "col3": "3128" },
    { "col1": "SYSAUX", "col2": "3873", "col3": "1247" },
    { "col1": "UNDO", "col2": "62", "col3": "73666" },
    { "col1": "TEMP", "col2": "0", "col3": "230400" },
    { "col1": "AUDIT_DATA", "col2": "419", "col3": "1629" },
    { "col1": "TOOLS", "col2": "1", "col3": "2047" },
    { "col1": "USERS", "col2": "1", "col3": "2047" },
    { "col1": "CIRCLE_DATA", "col2": "493830", "col3": "749306" }
  ],
  "SESSIONS": [
    { "col1": "STATUS", "col2": "Count" },
    { "col1": "INACTIVE", "col2": "5" },
    { "col1": "ACTIVE", "col2": "60" }
  ],
  "TOP WAIT EVENTS": [
    { "col1": "EVENT", "col2": "TOTAL_WAITS" },
    { "col1": "Parameter_File_I/O", "col2": "50278" },
    { "col1": "rdbms_ipc_message", "col2": "31230971" },
    { "col1": "Disk_file_operations_I/O", "col2": "9273407" },
    { "col1": "direct_path_sync", "col2": "2052" },
    { "col1": "Datapump_dump_file_I/O", "col2": "5946" }
  ],
  "DB OPEN AND LOG MODE": [
    { "col1": "READ", "col2": "WRITE", "col3": "ARCHIVELOG" }
  ],
  "DB MOUNT STATUS": [
    { "col1": "OPEN" }
  ],
  "TOP SQL BY RESOURCE USAGE": [
    { "col1": "SQL_ID", "col2": "EXECUTIONS", "col3": "CPU_TIME", "col4": "ELAPSED_TIME", "col5": "DISK_READS", "col6": "BUFFER_GETS" },
    { "col1": "b6usrg82hwsa3", "col2": "73", "col3": "8619624740", "col4": "1.6474E+10", "col5": "67919062", "col6": "403033235" },
    { "col1": "4xm1ruvkx3awx", "col2": "33", "col3": "2339399422", "col4": "4903623886", "col5": "21285084", "col6": "963959366" },
    { "col1": "as2dr3ag24gay", "col2": "33", "col3": "1671587234", "col4": "1744782516", "col5": "96", "col6": "27188313" },
    { "col1": "6mcpb06rctk0x", "col2": "73", "col3": "225237605", "col4": "7281437121", "col5": "691899", "col6": "29481757" },
    { "col1": "22356bkgsdcnh", "col2": "6985", "col3": "221630602", "col4": "241981474", "col5": "0", "col6": "9" },
    { "col1": "fhf8upax5cxsz", "col2": "1591", "col3": "205913264", "col4": "813570845", "col5": "12489", "col6": "690595" },
    { "col1": "0w26sk6t6gq98", "col2": "1535", "col3": "157301377", "col4": "210124100", "col5": "2027", "col6": "259299" },
    { "col1": "1fvsn5j51ugz3", "col2": "3227", "col3": "110588078", "col4": "168193926", "col5": "6", "col6": "63" },
    { "col1": "28bgqbzpa87xf", "col2": "3132", "col3": "93549033", "col4": "119910197", "col5": "6", "col6": "74" },
    { "col1": "4hja0ydaxxqfg", "col2": "8291536", "col3": "73473082", "col4": "152505430", "col5": "0", "col6": "0" }
  ],
  "BUFFER CACHE HIT RATIO": [
    { "col1": "NAME", "col2": "VALUE" },
    { "col1": "db_block_gets", "col2": "3068777045" },
    { "col1": "consistent_gets", "col2": "1.3115E+10" },
    { "col1": "physical_reads", "col2": "588805849" }
  ],
  "LIBRARY CACHE HIT RATIO": [
    { "col1": "NAMESPACE", "col2": "GETS", "col3": "GETHITS", "col4": "PINS", "col5": "PINHITS", "col6": "GET_HIT_RATIO", "col7": "PIN_HIT_RATIO" },
    { "col1": "SQL_AREA", "col2": "1909466", "col3": "1790489", "col4": "127867249", "col5": "127357256", "col6": "93.77", "col7": "99.6" },
    { "col1": "TABLE/PROCEDURE", "col2": "2426875", "col3": "2409533", "col4": "62144764", "col5": "62046089", "col6": "99.29", "col7": "99.84" },
    { "col1": "BODY", "col2": "174346", "col3": "174012", "col4": "2178358", "col5": "2177511", "col6": "99.81", "col7": "99.96" },
    { "col1": "TRIGGER", "col2": "34751", "col3": "34735", "col4": "34841", "col5": "34822", "col6": "99.95", "col7": "99.95" },
    { "col1": "INDEX", "col2": "127256", "col3": "125794", "col4": "120270", "col5": "103231", "col6": "98.85", "col7": "85.83" },
    { "col1": "CLUSTER", "col2": "40194", "col3": "40173", "col4": "45719", "col5": "45698", "col6": "99.95", "col7": "99.95" },
    { "col1": "PIPE", "col2": "33", "col3": "22", "col4": "33", "col5": "22", "col6": "66.67", "col7": "66.67" },
    { "col1": "DIRECTORY", "col2": "160", "col3": "155", "col4": "395", "col5": "387", "col6": "96.88", "col7": "97.97" },
    { "col1": "QUEUE", "col2": "3328", "col3": "3148", "col4": "90598", "col5": "90062", "col6": "94.59", "col7": "99.41" },
    { "col1": "SUMMARY", "col2": "450", "col3": "449", "col4": "428", "col5": "424", "col6": "99.78", "col7": "99.07" },
    { "col1": "APP_CONTEXT", "col2": "44", "col3": "43", "col4": "86", "col5": "85", "col6": "97.73", "col7": "98.84" },
    { "col1": "RULESET", "col2": "2895", "col3": "2190", "col4": "42050", "col5": "40993", "col6": "75.65", "col7": "97.49" },
    { "col1": "XML_SCHEMA", "col2": "21", "col3": "14", "col4": "36", "col5": "21", "col6": "66.67", "col7": "58.33" },
    { "col1": "SUBSCRIPTION", "col2": "442", "col3": "88", "col4": "442", "col5": "88", "col6": "19.91", "col7": "19.91" },
    { "col1": "JAVA_DATA", "col2": "4", "col3": "0", "col4": "3", "col5": "2", "col6": "0", "col7": "66.67" },
    { "col1": "RULE", "col2": "1496", "col3": "1144", "col4": "1496", "col5": "1144", "col6": "76.47", "col7": "76.47" },
    { "col1": "XDB_CONFIG", "col2": "1", "col3": "0", "col4": "0", "col5": "0", "col6": "0", "col7": "0" },
    { "col1": "TEMPORARY_TABLE", "col2": "25952", "col3": "25580", "col4": "25952", "col5": "0", "col6": "98.57", "col7": "0" },
    { "col1": "TEMPORARY_INDEX", "col2": "9526", "col3": "9053", "col4": "9526", "col5": "0", "col6": "95.03", "col7": "0" },
    { "col1": "EDITION", "col2": "105707", "col3": "105706", "col4": "211247", "col5": "211245", "col6": "100", "col7": "100" },
    { "col1": "DBLINK", "col2": "351779", "col3": "351743", "col4": "0", "col5": "0", "col6": "99.99", "col7": "0" },
    { "col1": "OBJECT_ID", "col2": "7218", "col3": "0", "col4": "0", "col5": "0", "col6": "0", "col7": "0" },
    { "col1": "SCHEMA", "col2": "117947", "col3": "117754", "col4": "0", "col5": "0", "col6": "99.84", "col7": "0" },
    { "col1": "DBINSTANCE", "col2": "1", "col3": "0", "col4": "0", "col5": "0", "col6": "0", "col7": "0" },
    { "col1": "SQL_AREA_STATS", "col2": "208350", "col3": "142107", "col4": "208350", "col5": "142107", "col6": "68.21", "col7": "68.21" },
    { "col1": "ACCOUNT_STATUS", "col2": "683870", "col3": "683682", "col4": "0", "col5": "0", "col6": "99.97", "col7": "0" },
    { "col1": "PCTABL", "col2": "264", "col3": "132", "col4": "0", "col5": "0", "col6": "50", "col7": "0" },
    { "col1": "SQL_AREA_BUILD", "col2": "204009", "col3": "139120", "col4": "0", "col5": "0", "col6": "68.19", "col7": "0" },
    { "col1": "KGLNEDSYNC", "col2": "1", "col3": "0", "col4": "0", "col5": "0", "col6": "0", "col7": "0" },
    { "col1": "PDB", "col2": "2", "col3": "1", "col4": "0", "col5": "0", "col6": "50", "col7": "0" },
    { "col1": "AUDIT_POLICY", "col2": "180688", "col3": "180686", "col4": "180688", "col5": "180686", "col6": "100", "col7": "100" },
    { "col1": "USER_PRIVILEGE", "col2": "532", "col3": "524", "col4": "531", "col5": "525", "col6": "98.5", "col7": "98.87" },
    { "col1": "FED_APP", "col2": "21353", "col3": "21352", "col4": "21353", "col5": "21352", "col6": "100", "col7": "100" },
    { "col1": "APP_STATE", "col2": "979", "col3": "978", "col4": "0", "col5": "0", "col6": "99.9", "col7": "0" },
    { "col1": "CMP", "col2": "25407", "col3": "7616", "col4": "25407", "col5": "7616", "col6": "29.98", "col7": "29.98" }
  ],
  "ARCHIVE LOG GENERATION RATE": [
    { "col1": "LOG_DATE", "col2": "LOGS_GENERATED", "col3": "MB_GENERATED" },
    { "col1": "07-SEP-25", "col2": "2", "col3": "365.640625" }
  ],
  "INVALID OBJECTS SUMMARY": [
    { "col1": "INST_ID", "col2": "USERNAME", "col3": "STATUS", "col4": "SESSION_COUNT" },
    { "col1": "1", "col2": "CNTL_CIRCLE_BE", "col3": "INACTIVE", "col4": "1" },
    { "col1": "1", "col2": "DBSNMP", "col3": "INACTIVE", "col4": "2" },
    { "col1": "1", "col2": "M91363", "col3": "ACTIVE", "col4": "1" },
    { "col1": "1", "col2": "OTHER", "col3": "ACTIVE", "col4": "58" },
    { "col1": "1", "col2": "S01_CIRCLE_BE", "col3": "INACTIVE", "col4": "1" },
    { "col1": "1", "col2": "SYS", "col3": "ACTIVE", "col4": "1" },
    { "col1": "1", "col2": "XMIT_CIRCLE_BE", "col3": "INACTIVE", "col4": "1" }
  ],
  "INVALID OBJECTS COUNT": [
    { "col1": "OWNER", "col2": "OBJECT_TYPE", "col3": "COUNT(*)" },
    { "col1": "M91363", "col2": "FUNCTION", "col3": "2" },
    { "col1": "M91363", "col2": "PACKAGE_BODY", "col3": "9" },
    { "col1": "M91363", "col2": "PROCEDURE", "col3": "7" },
    { "col1": "M91363", "col2": "VIEW", "col3": "6" }
  ],
  "INVALID OBJECTS DETAILS": [
    { "col1": "OWNER", "col2": "OBJECT_NAME", "col3": "OBJECT_TYPE", "col4": "STATUS" },
    { "col1": "M91363", "col2": "GENERIC_PURGE_NEWW", "col3": "PROCEDURE", "col4": "INVALID" },
    { "col1": "M91363", "col2": "GET_PCT_FREE_HISTORY", "col3": "PROCEDURE", "col4": "INVALID" },
    { "col1": "M91363", "col2": "MONITOR_LSOMSPK3", "col3": "PROCEDURE", "col4": "INVALID" },
    { "col1": "M91363", "col2": "MONITOR_LSOMSPKC", "col3": "PROCEDURE", "col4": "INVALID" },
    { "col1": "M91363", "col2": "MONITOR_LSOMSPS3", "col3": "PROCEDURE", "col4": "INVALID" },
    { "col1": "M91363", "col2": "MONITOR_LSOMSPSL", "col3": "PROCEDURE", "col4": "INVALID" },
    { "col1": "M91363", "col2": "AUDIT_VIEW1", "col3": "VIEW", "col4": "INVALID" },
    { "col1": "M91363", "col2": "AUDIT_VIEW2", "col3": "VIEW", "col4": "INVALID" },
    { "col1": "M91363", "col2": "AUDIT_VIEW_WEEKLY", "col3": "VIEW", "col4": "INVALID" },
    { "col1": "M91363", "col2": "CING_DBA_ROLE_PRIVS_VW", "col3": "VIEW", "col4": "INVALID" },
    { "col1": "M91363", "col2": "RMT_DBA_LOCKS", "col3": "VIEW", "col4": "INVALID" },
    { "col1": "M91363", "col2": "NERS_INC", "col3": "VIEW", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ADBA_PKG", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ANALYZE_SPACE_USAGE_OMS", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ANALYZE_SPACE_USAGE", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ANALYZE_SCHEMA", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ANALYZE_SPACE_USAGE_OMS_PSL", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ADBA_2_PKG", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ADBA_1_PKG", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ADBA_LZ2574_PKG", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "ADBA_TRUNC", "col3": "PACKAGE_BODY", "col4": "INVALID" },
    { "col1": "M91363", "col2": "VAT", "col3": "FUNCTION", "col4": "INVALID" },
    { "col1": "M91363", "col2": "TAX_AMT", "col3": "FUNCTION", "col4": "INVALID" },
    { "col1": "M91363", "col2": "TAX_AMT1", "col3": "PROCEDURE", "col4": "INVALID" }
  ],
  "ACTIVE SESSIONS DETAILS": [
    { "col1": "USERNAME", "col2": "SID", "col3": "SERIAL#", "col4": "OSUSER", "col5": "MACHINE", "col6": "MODULE", "col7": "PROGRAM", "col8": "STATUS", "col9": "LOGON_TIME", "col10": "COUNT(*)" },
    { "col1": "M91363", "col2": "974", "col3": "42391", "col4": "appdba", "col5": "zld06360", "col6": "SQL*Plus", "col7": "sqlplus@zld06360_(TNS_V1-V3)", "col8": "INACTIVE", "col9": "09-SEP-2025_01:04:57", "col10": "1" },
    { "col1": "M91363", "col2": "587", "col3": "10847", "col4": "appdba", "col5": "zld06360", "col6": "SQL*Plus", "col7": "sqlplus@zld06360_(TNS_V1-V3)", "col8": "ACTIVE", "col9": "09-SEP-2025_02:54:07", "col10": "1" },
    { "col1": "M91363", "col2": "969", "col3": "26170", "col4": "d1c2d606", "col5": "zld06360", "col6": "DBMS_SCHEDULER", "col7": "oracle@zld06360_(J001)", "col8": "ACTIVE", "col9": "09-SEP-2025_02:51:47", "col10": "1" }
  ],
  "connectionString": "m91363/M0bil1tyAc4dia_25@u7cir1d1.db.att.com"
};


const Dashboard = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [dbName, setDbName] = useState('');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  
  // NEW STATE FOR MODAL VISIBILITY AND DATA
  const [selectedTable, setSelectedTable] = useState(null);

  // ... (keep your other functions like maskConnectionString, handleFetchData, etc.)
  const handleFetchData = async (isManual = true) => {
    if (!username || !dbName) {
      alert('Please enter both username and database name.');
      return;
    }
    if (isManual) setLoading(true);
    
    try {
      // Dummy API call for now
      setTimeout(() => {
        setData(dummyData);
        setLoading(false);
      }, 1000);
    } catch (error) {
        setData({ error: 'Failed to fetch data' });
        setLoading(false);
    }
  };

  useEffect(() => {
    setData(dummyData);
  }, []);
  
  const getValueFromSection = (sectionName) => {
    const section = data[sectionName];
    if (Array.isArray(section) && section.length > 0) {
      if(sectionName === 'DB OPEN AND LOG MODE') {
        return Object.values(section[0]).join(' ');
      }
      return section[section.length - 1].col1 || 'N/A';
    }
    return 'N/A';
  };

  const preprocessMemoryData = (memoryData) => {
    if (!Array.isArray(memoryData)) return [];
    return memoryData.map(item => {
      const labelParts = [];
      if (item.col1) labelParts.push(item.col1);
      if (item.col2) labelParts.push(item.col2);
      if (item.col3) labelParts.push(item.col3);
      const label = labelParts.join(' ');
      let value = 0;
      if (item.col4) {
        value = parseFloat(item.col4) || 0;
      } else if (item.col3 && !isNaN(parseFloat(item.col3))) {
        value = parseFloat(item.col3);
      } else if (item.col2 && !isNaN(parseFloat(item.col2))) {
        value = parseFloat(item.col2);
      }
      return { col1: label, col2: value.toString() };
    });
  };

  const calculateMemoryTotals = (memoryData) => {
    if (!Array.isArray(memoryData)) return { total: 0 };
    let total = 0;
    memoryData.forEach(item => {
      let value = 0;
      if (item.col4) value = parseFloat(item.col4) || 0;
      else if (item.col3 && !isNaN(parseFloat(item.col3))) value = parseFloat(item.col3);
      else if (item.col2 && !isNaN(parseFloat(item.col2))) value = parseFloat(item.col2);
      total += value;
    });
    return { total: total.toFixed(2) };
  };

  const sgaTotals = calculateMemoryTotals(data["SGA"] || []);
  const pgaTotals = data["PGA"] ? {
    inuse: parseFloat(data["PGA"].find(item => item.col3 === 'inuse')?.col4 || 0).toFixed(2),
    allocated: parseFloat(data["PGA"].find(item => item.col3 === 'allocated')?.col4 || 0).toFixed(2)
  } : { inuse: 0, allocated: 0 };
  
  const normalizeTableRows = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return rows;
    const allKeys = new Set();
    rows.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));
    const keysArray = Array.from(allKeys);
    return rows.map(row => {
      const newRow = {};
      keysArray.forEach(key => { newRow[key] = row[key] !== undefined ? row[key] : ''; });
      return newRow;
    });
  };
  
  const preprocessTablespaceRows = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return rows;
    const newRows = JSON.parse(JSON.stringify(rows));
    newRows[0] = { ...newRows[0], col4: 'Free_GB', col5: 'USED %' };
    for (let i = 1; i < newRows.length; i++) {
      const usedMB = parseFloat(newRows[i].col2);
      const freeMB = parseFloat(newRows[i].col3);
      newRows[i].col4 = (freeMB / 1024).toFixed(2);
      newRows[i].col5 = ((usedMB / (usedMB + freeMB)) * 100).toFixed(2);
    }
    return newRows;
  };

  // HANDLERS FOR THE MODAL
  const handleTableButtonClick = (tableKey) => {
    setSelectedTable(tableKey);
  };

  const handleCloseModal = () => {
    setSelectedTable(null);
  };

  const inactiveSessionColor = theme.palette.grey[400];
  const activeSessionColor = '#64B5F6'; // Light Blue

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="center">
          <TextField label="Username" onChange={e => setUsername(e.target.value)} fullWidth />
          <TextField label="Database Name" onChange={e => setDbName(e.target.value)} fullWidth />
          <Button variant="contained" color="primary" onClick={() => handleFetchData(true)} sx={{ minWidth: 150 }}>
            Monitor
          </Button>
          <Button variant={autoRefreshEnabled ? 'contained' : 'outlined'} color={autoRefreshEnabled ? 'success' : 'secondary'} onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)} sx={{ minWidth: 150 }} className={autoRefreshEnabled ? 'live-monitoring-blink' : ''}>
            {autoRefreshEnabled ? 'Live On' : 'Live Off'}
          </Button>
        </Box>
      </Paper>
      
      {/* RENDER THE NAVBAR */}
      <Navbar onButtonClick={handleTableButtonClick} />

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        Object.keys(data).length > 0 && (
          <>
            {data.error ? (
              <Typography color="error">{data.error}</Typography>
            ) : (
              <Grid container spacing={3}>
                {/* --- TOP INFO ROW (SIMPLIFIED) --- */}
                <Grid item xs={12} md={3}>
                  <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Database Info</Typography>
                    <TableContainer component={Paper} elevation={0}>
                      <Table size="small">
                        <TableBody>
                          {["DATABASE NAME", "DATABASE VERSION", "INSTANCE NAME", "STARTUP TIME", "UPTIME", "OS LOAD", "DB MOUNT STATUS", "DB OPEN AND LOG MODE"].map((label) => (
                            <TableRow key={label}>
                              <TableCell sx={{ fontWeight: 'bold', border: 0 }}>{label.replace(/_/g, ' ')}</TableCell>
                              <TableCell sx={{ border: 0 }}>{getValueFromSection(label)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Card>
                </Grid>
                <Grid item xs={12} md={3}>
                  {data["SESSIONS"] && (
                    <Card variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Session Status</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 1, mt: 1 }}>
                        <Paper elevation={2} sx={{ p: 1, textAlign: 'center', flexGrow: 1 }}>
                          <Typography variant="body2" color="textSecondary">INACTIVE</Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{data["SESSIONS"].find(s => s.col1 === 'INACTIVE')?.col2 || '0'}</Typography>
                        </Paper>
                        <Paper elevation={2} sx={{ p: 1, textAlign: 'center', flexGrow: 1 }}>
                          <Typography variant="body2" color="textSecondary">ACTIVE</Typography>
                          <Typography variant="h6" sx={{ color: activeSessionColor, fontWeight: 'bold' }}>{data["SESSIONS"].find(s => s.col1 === 'ACTIVE')?.col2 || '0'}</Typography>
                        </Paper>
                      </Box>
                      <Box sx={{ flexGrow: 1, minHeight: 250, position: 'relative' }}><MonitoringChart sessionData={data["SESSIONS"]} chartType="session" /></Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mt: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}><Box sx={{ width: 14, height: 14, bgcolor: inactiveSessionColor, mr: 1, borderRadius: '2px' }} /><Typography variant="body2" color="textSecondary">INACTIVE</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}><Box sx={{ width: 14, height: 14, bgcolor: activeSessionColor, mr: 1, borderRadius: '2px' }} /><Typography variant="body2" color="textSecondary">ACTIVE</Typography></Box>
                      </Box>
                    </Card>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  {(data["SGA"] || data["PGA"]) && (
                    <Card variant="outlined" sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center' }}>Memory Usage</Typography>
                      <Box sx={{ flexGrow: 1 }}><MonitoringChart sgaData={preprocessMemoryData(data["SGA"])} pgaData={preprocessMemoryData(data["PGA"])} chartType="memory" /></Box>
                      <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', mt: 1 }}>SGA Total: {sgaTotals.total} MB | PGA Inuse: {pgaTotals.inuse} MB | PGA Allocated: {pgaTotals.allocated} MB</Typography>
                    </Card>
                  )}
                </Grid>
                {/* --- OTHER TABLES ARE NOW REMOVED FROM THE MAIN VIEW --- */}
              </Grid>
            )}
          </>
        )
      )}

      {/* RENDER THE MODAL (it will only be visible if selectedTable is not null) */}
      <ModalDataTable
        open={!!selectedTable}
        handleClose={handleCloseModal}
        tableKey={selectedTable}
        tableData={selectedTable ? data[selectedTable] : null}
        normalizeTableRows={normalizeTableRows}
      />
    </Container>
  );
};

export default Dashboard;
