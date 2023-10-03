import React, { useState, useEffect } from "react";
import { useTable } from "react-table";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
// import BootstrapTable from "./BootstrapTable";

import "bootstrap/dist/css/bootstrap.min.css";
import * as XLSX from "xlsx";
import "./BootstrapTable.css";
function TableComponents() {
  const [tableMaximized, setTableMaximized] = useState(true);

  const [jsonData, setJsonData] = useState([]);
  const [jsonFile, setJsonFile] = useState(null);
  const [apiUrl, setApiUrl] = useState("");
  const [rowColors, setRowColors] = useState({});

  const fetchJsonData = async () => {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (jsonFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = JSON.parse(event.target.result);
        setJsonData(data);
      };
      reader.readAsText(jsonFile);
    }
  }, [jsonFile]);

  const tableHeaders = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];

  const handleColorChange = (index, color) => {
    setRowColors((prevRowColors) => ({
      ...prevRowColors,
      [index]: color,
    }));
  };

  const handleDownload = () => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(jsonData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "table_data.xlsx";
    link.click();
  };

  const toggleTable = () => {
    setTableMaximized(!tableMaximized);
  };

  return (
    <div  className={`table-container ${
      tableMaximized ? "maximized" : "minimized"
    }`}>
      <div className="table-header">
        <h3>Header Table</h3>
        <button className="toggle-button" onClick={toggleTable}>
          {tableMaximized ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      <React.Fragment>
        <h1 className="mt-1">Data Dashboard</h1>
        {/* <div className="mb-3">
          <label>Upload File:</label>
          <input
            type="file"
            accept=".json"
            onChange={(e) => setJsonFile(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label>Fetch JSON Data from API:</label>
          <input
            type="text"
            className="mr-2"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <button className="btn btn-primary" onClick={fetchJsonData}>
            Fetch Data
          </button>
        </div> */}
        <div>
          <table className="table table-bordered table-striped custom-table">
            <thead className="thead-dark">
              <tr>
                <th>Color</th>
                <th rowSpan="2" className="text-center">
                  S.No
                </th>
                <th rowSpan="2" className="text-center">
                  Partition
                </th>
                <th rowSpan="2" className="text-center">
                  Leads
                </th>
                <th colSpan="3" className="text-center">
                  Intra viols (SPV)
                </th>
                <th colSpan="3" className="text-center">
                  Intra viols (PBA)
                </th>
                <th colSpan="3" className="text-center">
                  Inter viols (SPV)
                </th>
                <th colSpan="3" className="text-center">
                  Inter viols (PBA)
                </th>
                <th rowSpan="2" className="text-center">
                  Util % (TRO)
                </th>
                <th rowSpan="2" className="text-center">
                  Congestion (preCTS)
                </th>
                <th rowSpan="2" className="text-center">
                  Shorts (TRO)
                </th>
                <th rowSpan="2" className="text-center">
                  ETA
                </th>
                <th rowSpan="2" className="text-center">
                  Comments
                </th>
                <th rowSpan="2" className="text-center">
                  Plan of Action
                </th>
                <th rowSpan="2" className="text-center">
                  DB Pointer
                </th>
              </tr>
              <tr>
                <th></th>
                <th className="text-center">WNS</th>
                <th className="text-center">TNS</th>
                <th className="text-center">NVP</th>
                <th className="text-center">WNS</th>
                <th className="text-center">TNS</th>
                <th className="text-center">NVP</th>
                <th className="text-center">WNS</th>
                <th className="text-center">TNS</th>
                <th className="text-center">NVP</th>
                <th className="text-center">WNS</th>
                <th className="text-center">TNS</th>
                <th className="text-center">NVP</th>
              </tr>
            </thead>
            <tbody>
              {jsonData.map((item, index) => (
                <tr key={index} style={{ backgroundColor: rowColors[index] }}>
                  <td className="text-center">
                    <input
                      type="color"
                      value={rowColors[index] || ""}
                      onChange={(e) => handleColorChange(index, e.target.value)}
                    />
                  </td>
                  {tableHeaders.map((header) => (
                    <td
                      key={header}
                      style={{
                        backgroundColor: rowColors[index],
                        textAlign: "center", // Center-align the data
                      }}
                    >
                      {item[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <div className="mb-3">
          <button className="btn btn-success" onClick={handleDownload}>
            Download Excel
          </button>
        </div> */}
      </React.Fragment>
    </div>
  );
}

export default TableComponents;
