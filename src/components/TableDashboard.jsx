import React from "react";
import NonMeddDb from './NonMeddDb.jsx';
import MeddDb from './MeddDb.jsx';
import "./TableDashboard.css";
import { Routes, Route, Link } from 'react-router-dom';

const TableDashboard = () => {
  const data = [
    ["DB Type", "Production DB", "", "QA1", "", "", "QA3", "", "E2E", "", "PERF", ""],
    ["DATA_CNTR", "ALN DC1", "BTH DC2", "ALN DC1(Active)", "Domain/ Schema", "BTH DC2(Passive)", "ALN DC1(Active)", "BTH DC2(Passive)", "ALN DC1", "BTH DC2", "ALN DC1", "BTH DC2"],
    ["DM0 (Calling)", "<span class='green'>PPAAFWDT</span>", "<span class='highlight-blue'>PPBAFWDT</span>", "Q001FWDT", "FWD_D00", "Q011FWDT", "Q041FWDT", "Q051FWDT", "Q061FWDT", "<s class='red'>Q071FWDT</s>", "Q081FWDT", "<s class='red'>Q086FWDT</s>"],
    ["DM1 (Calling)", "<span class='green'>PPABFWDT</span>", "<span class='highlight-blue'>PPBBFWDT</span>", "Q002FWDT", "FWD_D01", "Q012FWDT", "Q042FWDT", "Q052FWDT", "Q062FWDT", "<s class='red'>Q072FWDT</s>", "Q082FWDT", "<s class='red'>Q087FWDT</s>"],
    ["DM2 (Calling)", "<span class='green'>PPACFWDT</span>", "<span class='highlight-blue'>PPBCFWDT</span>", "<s class='red'>Q003FWDT</s>", "FWD_D02", "<s class='red'>Q013FWDT</s>", "<s class='red'>Q043FWDT</s>", "<s class='red'>Q053FWDT</s>", "Q063FWDT", "<s class='red'>Q073FWDT</s>", "Q083FWDT", ""],
    ["DM3 (Calling)", "<span class='green'>PPADFWDT</span>", "<span class='highlight-blue'>PPBDFWDT</span>", "<s class='red'>Q004FWDT</s>", "FWD_D03", "<s class='red'>Q014FWDT</s>", "<s class='red'>Q044FWDT</s>", "<s class='red'>Q054FWDT</s>", "Q064FWDT", "<s class='red'>Q074FWDT</s>", "Q084FWDT", ""],
    ["DM4 (Calling)", "<span class='green'>PPAEFWDT</span>", "<span class='highlight-blue'>PPBEFWDT</span>", "<s class='red'>Q005FWDT</s>", "FWD_D04", "<s class='red'>Q015FWDT</s>", "<s class='red'>Q045FWDT</s>", "<s class='red'>Q055FWDT</s>", "Q065FWDT", "<s class='red'>Q075FWDT</s>", "Q085FWDT", ""],
    ["DM5 (Calling)", "<span class='highlight-blue'>PPAFFWDT</span>", "<span class='green'>PPBFFWDT</span>", "Q006FWDT", "FWD_D05", "Q016FWDT", "Q046FWDT", "Q056FWDT", "Q066FWDT", "<s class='red'>Q076FWDT</s>", "", ""],
    ["DM6 (Calling)", "<span class='highlight-blue'>PPAGFWDT</span>", "<span class='green'>PPBGFWDT</span>", "Q007FWDT", "FWD_D06", "Q017FWDT", "Q047FWDT", "Q057FWDT", "Q067FWDT", "<s class='red'>Q077FWDT</s>", "", ""],
    ["DM7 (Calling)", "<span class='highlight-blue'>PPAHFWDT</span>", "<span class='green'>PPBHFWDT</span>", "Q008FWDT", "FWD_D07", "Q018FWDT", "Q048FWDT", "Q058FWDT", "Q068FWDT", "<s class='red'>Q078FWDT</s>", "", ""],
    ["DM8 (Calling)", "<span class='highlight-blue'>PPAIFWDT</span>", "<span class='green'>PPBIFWDT</span>", "Q009FWDT", "FWD_D08", "Q019FWDT", "Q049FWDT", "Q059FWDT", "Q069FWDT", "<s class='red'>Q079FWDT</s>", "", ""],
    ["DM9 (Calling)", "<span class='highlight-blue'>PPAJFWDT</span>", "<span class='green'>PPBJFWDT</span>", "Q010FWDT", "FWD_D09", "Q020FWDT", "Q050FWDT", "Q060FWDT", "Q070FWDT", "<s class='red'>Q080FWDT</s>", "", ""],
    ["UDMN (SMS)", "<span >PPAAFWSM</span>", "<span >PPBAFWSM</span>", "Q001FWSM", "FWD_UDMN", "Q002FWSM", "Q005FWSM", "Q006FWSM", "Q007FWSM", "Q008FWSM", "Q009FWSM", ""],
    ["REPORTING", "<span >PPAAFWRE</span>", "<span >PPBAFWRE</span>", "Q01FWRE", "", "Q02FWRE", "Q05FWRE", "Q06FWRE", "<span class='red'>NA</span>", "<span class='red'>NA</span>", "<span class='red'>NA</span>", "<span class='red'>NA</span>"],
    ["ARC", "<span >PPAAFWAR</span>", "<span >PPBAFWAR</span>", "Q01FWAR", "", "", "Q03FWAR", "", "NA", "", "NA", ""],
    ["DUOP (", "<span >PPAAFWDU</span>", "<span >PPBAFWDU</span>", "t1c2d65", "", "", "t1c2d63", "", "t1c2d70", "", "t1c2d57", ""],
    ["DG", "P1C1D907", "", "t1c2d279", "", "", "t1c2d286", "", "t1c2d70", "", "t1c2d280", ""],
    ["REF", "p1mai2d1", "p2mai2d1 (std-by)", "t1c2d281", "", "", "t1c2d283", "", "T1C2D289", "", "t1c2d282", ""],
    ["MAI", "p1mai1d1", "p2mai1d1 (std-by)", "T1C2D227", "Q01FWAR", "", "T1C2D228", "Q03FWAR", "t1c2d285", "Q02FWAR", "Q01FWDU", "Q02FWAR"],
    ["server name", "ulvp0279.madc.att.com", "", "oltv0208.bodc.att.com", "oltv0208.bodc.att.com", "", "oltv0341.bodc.att.com", "", "oltv0109.bodc.att.com", "oltv0127.bodc.att.com", "oltv0519.bodc.att.com", ""]
  ];

  return (
    <>
     {/* <nav>
          <Link to="/">DB Monitor</Link> |{' '}
          <Link to="/tableDashboard">Table Dashboard</Link>
        </nav> */}
    <div className="dashboard-outer">
      <div className="dashboard-container">
        <h3 className="section-title">*** Domain Databases ***</h3>
        <table className="dashboard-table">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`cell row-${rowIndex} col-${colIndex}`}
                    dangerouslySetInnerHTML={{ __html: cell }}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    <MeddDb />
    <NonMeddDb />
     </>
  );
};

export default TableDashboard;
