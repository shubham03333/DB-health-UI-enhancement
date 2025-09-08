import React from "react";
import "./TableDashboard.css";

const MeddDb = () => {
  const data = [
    ["DB Type", "Production DB", "", "Functional Env 1", "", "", "Env 2", "","", "Env 3", "", "", "E2E Environment", "", "PERF", ""],
    [
      "DB Type",
      "SLS DC1",
      "BGM DC2",
      "SLS DC1",
      "Domain/ Schema",
      "BGM DC2",
      "SLS DC1",
      "Domain/ Schema",
      "BGM DC2",
      "SLS DC1",
      "Domain/ Schema",
      "BGM DC2",
      "SLS DC1",
      "Domain/ Schema",
      "SLS DC1",
      "Domain/ Schema"

    ],
    ["DM0", "PSAAMEDD", "PBAAMEDD", "t1c4d736", "FWW_D00", "t1c4d739", "t1c4d737", "FWW_D00", "t1c4d738", "Q09WILMD", "FWW_D00","Q10WILMD", "t1c4d722", "FWW_D00","d1c2d259","FWW_D00"],
    ["DM1", "PSABMEDD", "PBABMEDD", "t1c4d736", "FWW_D01", "t1c4d739", "t1c4d737", "FWW_D01", "t1c4d738", "Q09WILMD", "FWW_D01","Q10WILMD", "t1c4d722", "FWW_D01"],
    ["DM2", "PSACMEDD", "PBACMEDD", "t1c4d736", "FWW_D02", "t1c4d739", "t1c4d737", "FWW_D02", "t1c4d738", "Q09WILMD", "FWW_D02","Q10WILMD", "t1c4d722", "FWW_D02"],
    ["DM3", "PSADMEDD", "PBADMEDD", "t1c4d736", "FWW_D03", "t1c4d739", "t1c4d737", "FWW_D03", "t1c4d738", "Q09WILMD", "FWW_D03","Q10WILMD", "t1c4d722", "FWW_D03"],
    ["DM4", "PSAEMEDD", "PBAEMEDD", "t1c4d736", "FWW_D04", "t1c4d739", "t1c4d737", "FWW_D04", "t1c4d738", "Q09WILMD", "FWW_D04","Q10WILMD", "t1c4d722", "FWW_D04"],
    ["DM5", "PSAFMEDD", "PBAFMEDD", "t1c4d736", "FWW_D05", "t1c4d739", "t1c4d737", "FWW_D05", "t1c4d738", "Q09WILMD", "FWW_D05","Q10WILMD", "t1c4d722", "FWW_D05"],
    ["DM6", "PSAGMEDD", "PBAGMEDD", "t1c4d736", "FWW_D06", "t1c4d739", "t1c4d737", "FWW_D06", "t1c4d738", "Q09WILMD", "FWW_D06","Q10WILMD", "t1c4d722", "FWW_D06"],
    ["DM7", "PSAHMEDD", "PBAHMEDD", "t1c4d736", "FWW_D07", "t1c4d739", "t1c4d737", "FWW_D07", "t1c4d738", "Q09WILMD", "FWW_D07","Q10WILMD", "t1c4d722", "FWW_D07"],
    ["DM8", "PSAIMEDD", "PBAIMEDD", "t1c4d736", "FWW_D08", "t1c4d739", "t1c4d737", "FWW_D08", "t1c4d738", "Q09WILMD", "FWW_D08","Q10WILMD", "t1c4d722", "FWW_D08"],
    ["DM9", "PSAJMEDD", "PBAJMEDD", "t1c4d736", "FWW_D09", "t1c4d739", "t1c4d737", "FWW_D09", "t1c4d738", "Q09WILMD", "FWW_D09","Q10WILMD", "t1c4d722", "FWW_D09"],
    ["CMN", "", "", "t1c4d736", "FWW_CMN", "t1c4d739", "t1c4d737", "FWW_CMN", "t1c4d738", "Q09WILMD", "FWW_CMN","Q10WILMD", "t1c4d722", "FWW_CMN","d1c2d259","FWW_CMN"],
    ["ARC", "P1WLMDA", "P2WLMDA", "t1c4d746", "", "", "", "", "", "", "", ""],
    ["DG", "P1C1D907", "", "t1c2d65", "","", "t1c2d56", "","", "t1c2d63", "","", "t1c2d70", "", "t1c2d57", ""],
    ["REP", "p1mai2d1", "p2mai2d1", "t1c2d279","", "", "t1c2d287", "","", "t1c2d286", "","", "t1c2d289", "", "t1c2d280", ""],
    ["MAI", "p1mai1d1", "p2mai1d1", "t1c2d281", "","", "t1c2d284", "","", "t1c2d283", "","", "t1c2d285", "", "t1c2d282", ""],
    ["Server Name", "clpv0828.sldc.sbc.com","", "zlt12309.vci.att.com", "","", "zlt12324.vci.att.com", "", "", "", "", "", "","", "zld03685.vci.att.com", ""]
  ];


  const lightBlueCells = new Set([
    "PSAAMEDD", "PSABMEDD", "PSACMEDD", "PSADMEDD", "PSAEMEDD",
    "PBAFMEDD", "PBAGMEDD", "PBAHMEDD", "PBAIMEDD", "PBAJMEDD"
  ]);

  const greenCells = new Set([
   "t1c4d736", "FWW_D00", "t1c4d739", "t1c4d737", "FWW_D00", "t1c4d738", "Q09WILMD","FWW_D00", "Q10WILMD", "t1c4d722", "FWW_D00", "d1c2d259", "FWW_D00","t1c4d736", "FWW_D01", "t1c4d739", "t1c4d737", "FWW_D01", "t1c4d738", "Q09WILMD", "FWW_D01", "Q10WILMD", "t1c4d722", "FWW_D01","t1c4d736", "FWW_D05", "t1c4d739", "t1c4d737", "FWW_D05", "t1c4d738", "Q09WILMD", "FWW_D05", "Q10WILMD", "t1c4d722", "FWW_D05","t1c4d736", "FWW_D06", "t1c4d739", "t1c4d737", "FWW_D06", "t1c4d738", "Q09WILMD", "FWW_D06", "Q10WILMD", "t1c4d722", "FWW_D06"
  ]);

  const roseCells = new Set([
    "FWW_D02", "FWW_D03", "FWW_D04", "FWW_D07", "FWW_D08", "FWW_D09",
    "t1c4d746", "t1c2d65", "t1c2d279", "t1c2d281", "t1c2d70",
    "t1c2d289", "t1c2d285", "t1c2d57", "t1c2d280", "t1c2d282"
  ]);

  return (
    <div className="dashboard-outer">
      <div className="dashboard-container">
        <h3 className="section-title">*** MEDD Database Details ***</h3>
        <table className="dashboard-table" style={{fontSize: "8.4px"}}>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  const isHeader = rowIndex === 0;
                  const isBlue = lightBlueCells.has(cell);
                  const isGreen = greenCells.has(cell);
                  const isRose = roseCells.has(cell);

                  let backgroundColor = "white";
                  if (isHeader) backgroundColor = "#006699";
                  else if (isBlue) backgroundColor = "#add8e6";
                  else if (isGreen) backgroundColor = "#ccffcc";
                  else if (isRose) backgroundColor = "#D58A94";

                  return (
                    <td
                      key={colIndex}
                      className={`cell row-${rowIndex} col-${colIndex}`}
                      style={{
                        backgroundColor,
                        color: isHeader ? "white" : "black",
                        fontWeight: isHeader ? "bold" : "normal"
                      }}
                    >
                      {cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MeddDb;
