import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

/**
 * thresholds: { <columnLabel>: { warning: xx, critical: yy, isGoodHigh?: boolean }, ... }
 * Example:
 *   thresholds={{ "USED %": { warning: 85, critical: 90 }, "BUFFER CACHE HIT RATIO": { warning: 90, critical: 85, isGoodHigh: true } }}
 */
const DataTable = ({ title, rows, thresholds = {} }) => {
  const theme = useTheme();
  if (!rows || rows.length === 0) return null;

  // Detect/convert generic columns
  let columns = Object.keys(rows[0]);
  let dataRows = rows;
  const isGenericHeader = columns.every(col => /^col\d+$/.test(col));
  if (isGenericHeader && rows.length > 1) {
    const headerRow = rows[0];
    columns = Object.values(headerRow).map(val => val || '');
    dataRows = rows.slice(1);
  }

  // Determine which columns have thresholds and map index to column
  const thresholdColumnIndices = columns.reduce((map, label, idx) => {
    if (thresholds[label]) map[idx] = thresholds[label];
    return map;
  }, {});

  // Helper: returns alert class for a value in a thresholded column
 const getAlertClass = (value, thresholdConfig) => {
  if (!thresholdConfig) return '';
  let numeric = parseFloat(value);
  if (isNaN(numeric)) return '';
  if (thresholdConfig.isGoodHigh) {
    if (numeric < thresholdConfig.critical) return "critical-blink";
    if (numeric < thresholdConfig.warning) return "warning-pulse";  // yellow, no blink
    return "";
  }
  if (numeric >= thresholdConfig.critical) return "critical-blink";
  if (numeric >= thresholdConfig.warning) return "warning-pulse";  // yellow, no blink
  return "";
};


  return (
    <TableContainer component={Paper} sx={{ mb: 3, backgroundColor: theme.palette.background.paper }}>
      <Typography variant="h6" gutterBottom sx={{ color: theme.palette.text.primary, fontWeight: 'bold', textAlign: 'center' }}>{title}</Typography>
      <Table size="small" sx={{
        '& .MuiTableRow-root:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        '& .MuiTableRow-root:nth-of-type(even)': {
          backgroundColor: 'transparent',
        },
        '& .MuiTableCell-root': {
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.paper,
        },
        '& .MuiTableHead-root .MuiTableCell-root': {
          backgroundColor: theme.palette.action.selected,
          color: theme.palette.text.primary,
          fontWeight: 'bold',
        },
      }}>
        <TableHead>
          <TableRow>
            {columns.map((col, idx) => (
              <TableCell key={idx}><strong>{col}</strong></TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {dataRows.map((row, rowIdx) => (
            <TableRow key={rowIdx}>
              {columns.map((col, cidx) => {
                const val = isGenericHeader ? row['col' + (cidx + 1)] : row[col];
                const thresholdConfig = thresholdColumnIndices[cidx];
                const alertClass = getAlertClass(val, thresholdConfig);

                return (
                  <TableCell
                    key={cidx}
                    className={alertClass}
                    style={alertClass ? { fontWeight: 'bold' } : {}}
                  >
                    {val}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
