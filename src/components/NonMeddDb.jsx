import React from "react";
import "./TableDashboard.css";

const NonMeddDb = () => {
  const data = [
    ["MOTS ID", "App", "DB SID", "Versions", "Area", "ENV"],
    ["18273", "Catalyst", "p7cty1d1_p7cty1d1.az.3pc.att.com", "19", "WLNP App Tools", "PROD"],
    ["", "Catalyst", "u7cty1d1_u7cty1d1.az.3pc.att.com", "19", "WLNP App Tools", "TEST"],
    ["18292", "CIRCLE", "p7cir1d1_p7cir1d1.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "CIRCLE", "p7cir1d2_p7cir1d2.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "CIRCLE", "p7cir1d3_p7cir1d3.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "CIRCLE", "p7cir1d4_p7cir1d4.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "CIRCLE", "r7cir1d4_r7cir1d4.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "CIRCLE", "r7cir1d3_r7cir1d3.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "CIRCLE", "r7cir1d2_r7cir1d2.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "CIRCLE", "r7cir1d1_r7cir1d1.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["18292", "Circle", "u7cir1d1_u7cir1d1.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "u7cir1d2_u7cir1d2.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "u7cir1d3_u7cir1d3.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "u7cir1d4_u7cir1d4.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "u7cir2d1_u7cir2d1.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "u7cir2d2_u7cir2d2.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "u7cir2d3_u7cir2d3.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "u7cir2d4_u7cir2d4.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["", "Circle", "d7cir1d2_d7cir1d2.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["", "Circle", "d7cir1d3_d7cir1d3.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["", "Circle", "d7cir1d4_d7cir1d4.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["", "Circle", "d7cir1d1_d7cir1d1.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["", "ICORE", "r7ior1d1_r7ior1d1.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "ICORE", "r7ior1d2_r7ior1d2.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "ICORE", "r7ior1d3_r7ior1d3.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "ICORE", "r7ior1d4_r7ior1d4.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["18276", "ICORE", "u7ior1d1_u7ior1d1.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "u7ior1d2_u7ior1d2.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "u7ior1d3_u7ior1d3.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "u7ior1d4_u7ior1d4.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "u7ior2d1_u7ior2d1.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "u7ior2d2_u7ior2d2.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "u7ior2d3_u7ior2d3.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "u7ior2d4_u7ior2d4.az.3pc.att.com", "19", "Roaming", "TEST"],
    ["18276", "ICORE", "d7ior1d1_d7ior1d1.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["18276", "ICORE", "d7ior1d2_d7ior1d2.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["18276", "ICORE", "d7ior1d3_d7ior1d3.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["18276", "ICORE", "d7ior1d4_d7ior1d4.az.3pc.att.com", "19", "Roaming", "DEV"],
    ["18505", "ICTRT", "p7ict1d1.p7ict1d1.az.3pc.att.com", "19", "Roaming", "PROD"],
    ["", "ICTRT", "t7ict1d1_t7ict1d1.az.3pc.att.com", "19", "Roaming", "TEST"], 
    ["17891", "IPPT", "p7ipp1d1_p7ipp1d1.az.3pc.att.com", "12", "WLNP App Tools", "PROD"],
    ["", "IPPT", "r7ipp1d1_r7ipp1d1.az.3pc.att.com", "12", "WLNP App Tools", "PROD"],
    ["", "IPPT", "u7ipp1d1_u7ipp1d1.az.3pc.att.com", "12", "WLNP App Tools", "TEST"],
    ["17873", "MDE", "p7mde1d1_p7mde1d1.az.3pc.att.com", "19", "WLNP App Tools", "PROD"],
    ["", "MDE", "r7mde1d1_r7mde1d1.az.3pc.att.com", "19", "WLNP App Tools", "PROD"],
    ["", "MDE", "u7mde1d1_u7mde1d1.az.3pc.att.com", "19", "WLNP App Tools", "TEST"],
    ["18172", "NPP", "p1c4d501_zlp38243.vci.att.com", "12", "Provisioning", "PROD"],
    ["", "NPP", "a3c1d14_zlp38242.vci.att.com", "12", "Provisioning", "PROD"],
    ["", "NPP", "p1c4d497_zlp38040.vci.att.com", "12", "Provisioning", "PROD"],
    ["", "NPP", "a3c1d12_zlp38039.vci.att.com", "12", "Provisioning", "PROD"],
    ["", "NPP", "t1c5d938_zlt23598.vci.att.com", "12", "Provisioning", "TEST"],
    ["", "NPP", "t1c5d939_zlt23597.vci.att.com", "12", "Provisioning", "DEV"],
    ["", "NPP", "d1c2d648_zld06655.vci.att.com", "12", "Provisioning", "DEV"],
     ["18164", "NSM", "p1dy5d88_zlpy38864.vci.att.com(STL)", "19", "Provisioning", "PROD"],
 ["", "NSM", "r3dy1d40_zlpy34424.vci.att.com", "19", "Provisioning", "PROD"],
 ["", "NSM", "a2dy1d44_zlpy38911.vci.att.com", "19", "Provisioning", "PROD"],
 ["", "NSM", "p1dy5d75_zlpy30726.vci.att.com(DL)", "19", "Provisioning", "PROD"],
 ["", "NSM", "a2dy1d42_zlpy33492.vci.att.com", "19", "Provisioning", "PROD"],
 ["", "NSM", "r3dy1d38_zlpy30895.vci.att.com", "19", "Provisioning", "PROD"],
 ["", "NSM", "d2ddy2d3_zldy32021.vci.att.com", "19", "Provisioning", "DEV"],
 ["", "NSM", "d2ddy2d4_zldy31104.vci.att.com", "19", "Provisioning", "DEV"],
 ["", "NSM", "r2ddy1d2_zldy39787.vci.att.com", "19", "Provisioning", "DEV"],
 ["", "NSM", "r2ddy1d3_zldy39725.vci.att.com", "19", "Provisioning", "DEV"], 
 ["", "NSM", "t3dpy6d1_zlty31969.vci.att.com", "19", "Provisioning", "TEST"],
 ["", "NSM", "t3dpy6d2_zlty31684.vci.att.com", "19", "Provisioning", "TEST"],
 ["", "NSM", "t3dpy5d9_zlty37886.vci.att.com", "19", "Provisioning", "TEST"],
 ["", "NSM", "t3dpy5d8_zlty30419.vci.att.com", "19", "Provisioning", "TEST"],
 ["", "NSM", "r2dpy1d7_zlty35958.vci.att.com", "19", "Provisioning", "TEST"],
 ["", "NSM", "r2dpy1d8_zlty32663.vci.att.com", "19", "Provisioning", "TEST"],
 ["", "NSM", "r2dpy1d6_zlty32847.vci.att.com", "19", "Provisioning", "TEST"],
 ["", "NSM", "r2dpy1d5_zlty33055.vci.att.com", "19", "Provisioning", "TEST"],
 ["17803", "NNA Number Agent", "p1c2d115_zlp01479.vci.att.com", "11", "Roaming", "PROD"],
 ["", "NNA Number Agent", "p1c2d118_zlp01531.vci.att.com", "11", "Roaming", "PROD"],
 ["", "NNA", "t1c3d73_zlt01755.vci.att.com", "11", "Roaming", "TEST"],
 ["", "NNA", "t1c3d75_zlt01754.vci.att.com", "11", "Roaming", "TEST"],
 ["", "NNA", "t1c3d79_zlt01751.vci.att.com", "11", "Roaming", "TEST"],
 ["", "NNA", "d1c1d702_zld00615.vci.att.com", "11", "Roaming", "DEV"],
 ["17614", "NuT", "p7nut1d1_p7nut1d1.az.3pc.att.com", "19", "Roaming", "PROD"],
["17614", "NuT", "r7nut1d1_r7nut1d1.az.3pc.att.com", "19", "Roaming", "PROD"],
["17614", "NuT", "u7nut1d1_u7nut1d1.az.3pc.att.com", "19", "Roaming", "TEST"],
["17614", "NuT", "d7nut1d1_d7nut1d1.az.3pc.att.com", "19", "Roaming", "DEV"],
["17595", "OPTICAL", "p1c1d786_zlpv8849.vci.att.com", "19", "WLNP App Tools", "PROD"],
["", "OPTICAL", "p2opt_alpd517.aldc.att.com", "19", "WLNP App Tools", "PROD"],
["", "OPTICAL", "t1c2d278_zltv9241.vci.att.com", "19", "WLNP App Tools", "TEST"],
["", "OPTICAL", "d1c1d454_zldv7560.vci.att.com", "19", "WLNP App Tools", "DEV"],
["23827", "POD", "p7pod2d2_p7pod2d2.az.3pc.att.com", "19", "WLNP App Tools", "PROD"],
["23827", "POD", "d7pod2d2_d7pod2d2.az.3pc.att.com", "19", "WLNP App Tools", "TEST"],
["17714", "RMS-C", "p1c4d447_zlp37560.vci.att.com", "11", "Roaming", "PROD"],
["17714", "RMS-C", "p1dy6d20_zlpy34901.vci.att.com", "19", "Roaming", "PROD"],
["17714", "RMS-C", "p1ey1d60_zlpy34746.vci.att.com", "19", "Roaming", "PROD"],
["17714", "RMS-C", "p1ey2d69_zlpy49911.vci.att.com", "19", "Roaming", "PROD"],
["17714", "RMS-C", "r2c1d104_zlp37559.vci.att.com", "11", "Roaming", "PROD"],
["17714", "RMS-C", "r2dy1d77_zlpy31985.vci.att.com", "19", "Roaming", "PROD"],
["17714", "RMS-C", "r2ey1d13_zlpy32125.vci.att.com", "19", "Roaming", "PROD"],
["17714", "RMS-C", "t2dpy2d2_zlty23668.vci.att.com", "19", "Roaming", "TEST"],
["17714", "RMS-C", "t1c4d487_zlt10574.vci.att.com", "11", "Roaming", "TEST"],
["17714", "RMS-C", "t1dpy8d2_zlty22793.vci.att.com", "12", "Roaming", "TEST"],
["17714", "RMS-C", "t1c6d39_zlt24655.vci.att.com", "11", "Roaming", "TEST"],
["17714", "RMS-C", "t1c6d38_zlt24656.vci.att.com", "11", "Roaming", "TEST"],
["17714", "RMS-C", "d4cdy4d2_zldy23364.vci.att.com", "12", "Roaming", "DEV"],
["17714", "RMS-C", "d4cdy4d3_zldy26619.vci.att.com", "12", "Roaming", "DEV"],
["17714", "RMS-C", "d1c2d180_zld03440.vci.att.com", "11", "Roaming", "DEV"],
["17714", "RMS-C", "d4cdy4d4_zldy23328.vci.att.com", "12", "Roaming", "DEV"],
["17714", "RMS-C", "t7rmc1d1_t7rmc1d1.az.3pc.att.com", "19", "Roaming", "Install"],
["17714", "RMS-C", "u7rmc1d4_u7rmc1d4.az.3pc.att.com", "19", "Roaming", "Install"],
["17714", "RMS-C", "t7rmc1d2_t7rmc1d2.az.3pc.att.com", "19", "Roaming", "Install"],
["18187", "TORCH", "p1c4d62_zlp31127.vci.att.com", "12", "KMS", "PROD"],
["", "TORCH", "p1c4d74_zlp31625.vci.att.com", "12", "KMS", "PROD"],
["", "TORCH", "t1c6d292_zlt27082.vci.att.com", "12", "KMS", "TEST"],
["", "TORCH", "t1snp1d2_t1snp1d2.vci.att.com", "12", "KMS", "TEST"],
["", "TORCH", "d1snp1d3_d1snp1d3.vci.att.com", "12", "KMS", "DEV"],
["", "TORCH", "t7tch1d1_t7tch1d1.azprv.3pc.att.com", "19", "KMS", "INSTALL"],
["22793", "TPRPTG", "p7rpg1d2_p7rpg1d2.az.3pc.att.com", "19", "Roaming", "PROD"],
["", "TPRPTG", "t7rpg1d2_t7rpg1d2.az.3pc.att.com", "19", "Roaming", "TEST"],
["32052", "TAXCT", "P7TXC1D1_p7txc1d1.az.3pc.att.com", "19", "Roaming", "PROD"],
["", "TAXCT", "T7TXC1D1_t7txc1d1.az.3pc.att.com", "19", "Roaming", "TEST"]
 
  ];

  const getCellStyle = (value) => {
    if (["PPAFFWDT", "PPAGFWDT", "PPAHFWDT", "PPAIFWDT", "PPAJFWDT", "PPBAFWDT", "PPBBFWDT", "PPBCFWDT", "PPBDFWDT", "PPBEFWDT"].includes(value)) {
      return { backgroundColor: "#add8e6", color: "black" }; // Light blue background
    }
    if (value === "PROD") return { backgroundColor: "#d4edda" }; // Green
    if (value === "TEST") return { backgroundColor: "#d1ecf1" }; // Blue
    if (value === "DEV") return { backgroundColor: "#fff3cd" }; // Orange
    if (value === "Install") return { backgroundColor: "#f5c6cb" }; // Light red
    return {};
  };

  return (
    <div className="dashboard-outer">
      <div className="dashboard-container">
        <h3 className="section-title">*** Non-MEDD Databases ***</h3>
        <table className="dashboard-table">
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    key={colIndex}
                    className={`cell row-${rowIndex} col-${colIndex}`}
                    style={getCellStyle(cell)}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NonMeddDb;
