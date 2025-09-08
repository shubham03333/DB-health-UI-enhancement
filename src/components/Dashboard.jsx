import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MonitoringChart from './MonitoringChart';
import DataTable from './DataTable';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import api from '../services/api';
import { color } from 'chart.js/helpers';
import './Dashboard.css';


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


const Dashboard = () => {
  const [username, setUsername] = useState('');
  const [dbName, setDbName] = useState('');
  const [connectionString, setConnectionString] = useState('');
  const [maskedConnectionString, setMaskedConnectionString] = useState('');
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [timeoutError, setTimeoutError] = useState(false);
  const [timeoutMessage, setTimeoutMessage] = useState('');






  // Mask password in connection string (e.g., user/password@host => user/******@host)
  const maskConnectionString = (connStr) => {
    if (!connStr) return '';
    const regex = /^(.*?\/)(.*?)(@.*)$/;
    const match = connStr.match(regex);
    if (match) {
      return match[1] + '******' + match[3];
    }
    return connStr;
  };

  const handleFetchData = async (isManual = true) => {
    if (!username || !dbName) {
      alert('Please enter both username and database name.');
      return;
    }
    if (isManual) setLoading(true);
    
    // Clear any previous timeout errors
    setTimeoutError(false);
    setTimeoutMessage('');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 110000); // 110 seconds timeout

      const response = await api.post('/health/dynamic-monitor', {
        username: username.trim(),
        dbName: dbName.trim()
      }, {
        signal: controller.signal,
        timeout: 110000
      });
      
      clearTimeout(timeoutId);
      setData(response.data);

      const connStrFromBackend = response.data.connectionString || '';
      setConnectionString(connStrFromBackend);
      setMaskedConnectionString(maskConnectionString(connStrFromBackend));
    } catch (error) {
      console.error('Error while fetching monitoring data:', error);
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        setTimeoutError(true);
        setTimeoutMessage('Connection timeout: Unable to reach backend server after 110 seconds. Please check your network connection or contact system administrator.');
      } else {
        setData({ error: 'Failed to fetch data from backend | Check the User Name Or DB Name 🙂' });
      }
      
      setConnectionString('');
      setMaskedConnectionString('');
    } finally {
      if (isManual) setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;
    if (autoRefreshEnabled) {
      handleFetchData(false);
      intervalId = setInterval(() => {
        handleFetchData(false);
      }, 10000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefreshEnabled, username, dbName]);

  const toggleAutoRefresh = () => {
    setAutoRefreshEnabled((prev) => !prev);
  };

  // Helper to extract value from data section, works with string or table data
  const getValueFromSection = (sectionName) => {
    const section = data[sectionName];
    if (typeof section === 'string') {
      return section;
    }
    if (Array.isArray(section)) {
      if (sectionName === 'DB OPEN AND LOG MODE' && section.length > 0) {
        const firstRow = section[0];
        const values = Object.values(firstRow).filter(val => val && !/^[-\s]+$/.test(val));
        return values.length ? values.join(' ') : 'N/A';
      }
      const cleanRows = section
        .map(row => row?.col1 || row?.col2)
        .filter(val => val && !/^[-\s]+$/.test(val));
      return cleanRows.length ? cleanRows[cleanRows.length - 1] : 'N/A';
    }
    return 'N/A';
  };

  // Preprocess memory data for chart consumption
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

  // Normalize row keys so all rows have all keys (avoid "undefined" in table cells)
  const normalizeTableRows = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return rows;
    const allKeys = new Set();
    rows.forEach(row => {
      Object.keys(row).forEach(key => allKeys.add(key));
    });
    const keysArray = Array.from(allKeys);
    return rows.map(row => {
      const newRow = {};
      keysArray.forEach(key => {
        newRow[key] = row[key] !== undefined ? row[key] : '';
      });
      return newRow;
    });
  };

  // Special preprocessing for Tablespace free space in GB
  const preprocessTablespaceRows = (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) return rows;

    const headerRow = rows[0];

    // Check for generic header shape col1, col2, col3
    const isGenericHeader = ['col1', 'col2', 'col3'].every(k => k in headerRow);
    if (!isGenericHeader) return rows;

    const newRows = [...rows];

    // Add 'Free_GB' as col4 header (existing)
    newRows[0] = { ...newRows[0], col4: 'Free_GB' };

    // Add new header 'USED %' as col5
    newRows[0] = { ...newRows[0], col5: 'USED %' };

    for (let i = 1; i < newRows.length; i++) {
      const usedMB = parseFloat(newRows[i].col2);  // Used_MB
      const freeMB = parseFloat(newRows[i].col3);  // Free_MB

      // Calculate Free_GB
      const freeGB = isNaN(freeMB) ? '' : (freeMB / 1024).toFixed(2);

      // Calculate Used Percentage
      let usedPercent = '';
      if (!isNaN(usedMB) && !isNaN(freeMB) && (usedMB + freeMB) > 0) {
        usedPercent = ((usedMB / (usedMB + freeMB)) * 100).toFixed(2);
      }

      newRows[i] = {
        ...newRows[i],
        col4: freeGB,
        col5: usedPercent
      };
    }

    return newRows;
  };

  // Function to determine alert level based on thresholds
  const getAlertLevel = (label, value) => {
    const config = THRESHOLDS[label];
    if (!config) return null;
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return null;

    if (config.isGoodHigh) {
      if (numericValue < config.critical) return 'critical';
      if (numericValue < config.warning) return 'warning';
      return null;
    }

    if (numericValue >= config.critical) return 'critical';
    if (numericValue >= config.warning) return 'warning';
    return null;
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
     
      <Paper sx={{ p: 3, mb: 3 }}>
     

        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={2} alignItems="center">
          <TextField
            label="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            fullWidth
            sx={{ minWidth: 180 }}
            autoComplete="username"
          />
          <TextField
            label="Database Name"
            value={dbName}
            onChange={e => setDbName(e.target.value)}
            fullWidth
            sx={{ minWidth: 180 }}
            autoComplete="off"
          />
          <Button variant="contained" color="primary" onClick={() => handleFetchData(true)} sx={{ minWidth: 150 }}>
            Monitor
          </Button>
          <Button
            variant={autoRefreshEnabled ? 'contained' : 'outlined'}
            color={autoRefreshEnabled ? 'success' : 'secondary'}
            onClick={toggleAutoRefresh}
            sx={{ minWidth: 150 }}
            className={autoRefreshEnabled ? 'live-monitoring-blink' : ''}
          >
            {autoRefreshEnabled ? 'Live On' : 'Live Off'}
          </Button>
        </Box>

        {/* {connectionString && (
          <Typography sx={{ mt: 1, fontSize: '0.875rem', color: '#555' }}>
            Connection String: <strong>{maskedConnectionString || connectionString}</strong>
          </Typography>
        )} */}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        !loading &&
        Object.keys(data).length > 0 && (
          <>
            {data.error ? (
              <Typography color="error">{data.error}</Typography>
            ) : (
              <>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="h5" gutterBottom style={{ color: 'purple' }}>
                        Database Information
                      </Typography>
                      <Grid container spacing={2}>
                        {[
                          "DATABASE NAME",
                          "DATABASE VERSION",
                          "INSTANCE NAME",
                          "STARTUP TIME",
                          "UPTIME",
                          "OS LOAD",
                          "REDO LOG SPACE REQUESTS",
                          "DB MOUNT STATUS",
                          "DB OPEN AND LOG MODE"
                        ].map(label => (
                          <Grid item xs={12} sm={6} md={4} lg={4} key={label}>
                            <Typography sx={{ color: '#FFC72C', fontWeight: 'bold' }}>
                              <strong>{label.replace(/_/g, ' ')}:</strong>{' '}
                              <span
                                className={
                                  (() => {
                                    const alertLevel = getAlertLevel(label, getValueFromSection(label));
                                    if (alertLevel === 'critical') return 'critical-blink';
                                    if (alertLevel === 'warning') return 'warning-pulse';
                                    return '';
                                  })()
                                }
                                style={
                                  (() => {
                                    const alertLevel = getAlertLevel(label, getValueFromSection(label));
                                    if (alertLevel === 'critical') return { color: '#C40000', fontWeight: 'bold' };
                                    if (alertLevel === 'warning') return { color: '#FFA500', fontWeight: 'bold' };
                                    return { color: '#0096FF' };
                                  })()
                                }
                              >
                                {getValueFromSection(label)}
                              </span>
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Card>
                  </Grid>
                  {[
                    ["BLOCKING SESSIONS", "Blocking Sessions"],
                    ["DEADLOCKS", "Deadlocks"],
                  ].map(([key, title]) =>
                    data[key] ? (
                      <Grid item xs={12} key={key}>
                        <DataTable title={title} rows={normalizeTableRows(data[key])} />
                      </Grid>
                    ) : null
                  )}
                  {/* Arrange Tablespace, Sessions, and Memory Usage side by side */}
                  <Grid container spacing={3} sx={{ width: '100%', mb: 3 }}>
                    {/* Tablespace Usage */}
                    <Grid item xs={12} md={4} sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                      <DataTable
                        title="Tablespaces"
                        rows={normalizeTableRows(preprocessTablespaceRows(data["TABLESPACE USAGE"]))}
                        thresholds={{ "USED %": { warning: 85, critical: 90 } }}
                      />
                    </Grid>

                    {/* Session Status */}
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                      {data["SESSIONS"] && (
                        <Card variant="outlined" sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="h6" gutterBottom>
                            Session Status
                          </Typography>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            {data["SESSIONS"].map((session, idx) => {
                              const status = session.col1 || ""; // e.g., 'ACTIVE' or 'INACTIVE'
                              const count = session.col2 || "0";
                              const alertLevel = getSessionAlertLevel(status, count);
                              const alertClass = getAlertClass(alertLevel);
                              const alertStyle = getAlertStyle(alertLevel);

                              return (
                                <Grid item xs={12} sm={6} key={idx}>
                                  <Paper
                                    elevation={2}
                                    sx={{ p: 2, textAlign: "center" }}
                                    className={`session-card ${alertClass}`}
                                  >
                                    <Typography variant="subtitle2" color="textSecondary">
                                      {status}
                                    </Typography>
                                    <Typography variant="h6" style={alertStyle}>
                                      {count}
                                    </Typography>
                                  </Paper>
                                </Grid>
                              );
                            })}
                          </Grid>
                          <MonitoringChart sessionData={data["SESSIONS"]} chartType="session" />
                        </Card>
                      )}
                    </Grid>

                    {/* Memory Usage */}
                    <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
                      {(data["SGA"] || data["PGA"]) && (
                        <Card variant="outlined" sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="h6" gutterBottom>
                            Memory Usage
                          </Typography>
                          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <MonitoringChart
                              sgaData={preprocessMemoryData(data["SGA"] || [])}
                              pgaData={preprocessMemoryData(data["PGA"] || [])}
                              chartType="memory"
                            />
                          </Box>
                        </Card>
                      )}
                    </Grid>
                  </Grid>
                  {data["INVALID OBJECTS SUMMARY"] && (
                    <Grid item xs={12}>
                      <DataTable title="Session Status Summary" rows={normalizeTableRows(data["INVALID OBJECTS SUMMARY"])} />
                    </Grid>
                  )}
                  {/* The rest of your dashboard tables */}
                  {data["INVALID OBJECTS COUNT"] && (
                    <Grid item xs={12}>
                      <div className="critical-blink" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <DataTable title="Invalid Objects Count" rows={normalizeTableRows(data["INVALID OBJECTS COUNT"])} />
                      </div>
                    </Grid>
                  )}
                  {data["INVALID OBJECTS DETAILS"] && (
                    <Grid item xs={12}>
                      <div className="critical-blink" style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                        <DataTable title="Invalid Objects Details" rows={normalizeTableRows(data["INVALID OBJECTS DETAILS"])} />
                      </div>
                    </Grid>
                  )}


                  {data["ACTIVE SESSIONS DETAILS"] && (
                    <Grid item xs={12}>
                      <DataTable title="Active Sessions Details" rows={normalizeTableRows(data["ACTIVE SESSIONS DETAILS"])} />
                    </Grid>
                  )}

                  {[
                    ["TOP WAIT EVENTS", "Top Wait Events"],
                    ["BUFFER CACHE HIT RATIO", "Buffer Cache Hit Ratio", { "BUFFER CACHE HIT RATIO": { warning: 90, critical: 85, isGoodHigh: true } }],
                    ["ARCHIVE LOG GENERATION RATE", "Archive Log Generation Rate"],
                    ["TOP SQL BY RESOURCE USAGE", "Top SQL by Resource Usage"],
                    ["LIBRARY CACHE HIT RATIO", "Library Cache Hit Ratio", { "LIBRARY CACHE HIT RATIO": { warning: 95, critical: 90, isGoodHigh: true } }]
                  ].map(([key, title, thresholds]) =>
                    data[key] ? (
                      <Grid item xs={12} key={key}>
                        <DataTable
                          title={title}
                          rows={normalizeTableRows(data[key])}
                          thresholds={thresholds}
                        />
                      </Grid>
                    ) : null
                  )}
                </Grid>
              </>
            )}
          </>
        )
      )}
      {/* <Typography variant="body2" color="primary" align="center" sx={{ mt: 4, mb: 2}}>
        🚀 Developed by Shubham Jadhav 🔎
      </Typography> */}
    </Container>
  );
};

export default Dashboard;