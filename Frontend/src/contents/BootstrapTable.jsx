  import React, { useState, useEffect } from "react";
  import { FaChevronDown, FaChevronUp } from "react-icons/fa";
  import { AgGridReact } from "ag-grid-react";
  import "ag-grid-community/styles/ag-grid.css";
  import "ag-grid-enterprise";
  import "ag-grid-community/styles/ag-theme-alpine.css";
  import "./BootstrapTable.css";
  import jsonData from "../dummy.json"; // Import the static JSON data

  const BootstrapTable = () => {  
    const [gridApi, setGridApi] = useState(null);
    const [data, setData] = useState([]);
    const [tableMaximized, setTableMaximized] = useState(true);
    const toggleTable = () => {
      setTableMaximized(!tableMaximized);
    };


    useEffect(() => {
      setData(jsonData);
    }, []);

    const columnDefs = [
      {
        field: "select",
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      { headerName: "S.No", field: "S.No", width: 80 },
      { headerName: "Partition", field: "Partition", width: 115 },
      { headerName: "Leads", field: "Leads", width: 110 },
      {
        headerName: "Intra viols (SPV)",
        children: [
          {
            headerName: "WNS",
            field: "Intra viols (SPV).wns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "TNS",
            field: "Intra viols (SPV).tns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "NVP",
            field: "Intra viols (SPV).nvp",
            filter: "agNumberColumnFilter",
            width: 100,
          },
        ],
      },
      {
        headerName: "Intra viols (PBA)",
        children: [
          {
            headerName: "WNS",
            field: "Intra viols (PBA).wns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "TNS",
            field: "Intra viols (PBA).tns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "NVP",
            field: "Intra viols (PBA).nvp",
            filter: "agNumberColumnFilter",
            width: 100,
          },
        ],
      },
      {
        headerName: "Inter viols (SPV)",
        children: [
          {
            headerName: "WNS",
            field: "Intra viols (PBA).wns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "TNS",
            field: "Intra viols (PBA).tns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "NVP",
            field: "Intra viols (PBA).nvp",
            filter: "agNumberColumnFilter",
            width: 100,
          },
        ],
      },
      {
        headerName: "Inter viols (PBA)",
        children: [
          {
            headerName: "WNS",
            field: "Intra viols (PBA).wns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "TNS",
            field: "Intra viols (PBA).tns",
            filter: "agNumberColumnFilter",
            width: 100,
          },
          {
            headerName: "NVP",
            field: "Intra viols (PBA).nvp",
            filter: "agNumberColumnFilter",
            width: 100,
          },
        ],
      },
      { headerName: "Util %\n(TRO)", field: "Util %\n(TRO)", width: 130 },
      {
        headerName: "Congestion\n(preCTS))",
        field: "Congestion\n(preCTS)",
        width: 185,
      },
      { headerName: "Shorts\n(TRO)", field: "Shorts\n(TRO)", width: 135 },
      { headerName: "ETA", field: "ETA", width: 110 },
      {
        headerName: "Comments",
        field: "Comments",
        width: 130,
        cellClass: "word-wrap",
      },
      { headerName: "Plan of Action", field: "Plan of Action", width: 140 },
      { headerName: "DB \nPointer", field: "DB \nPointer", width: 200 },
      // Add other columns as needed
    ];

    const onGridReady = (params) => {
      setGridApi(params.api);
    };
    return (
      <div
        className={`tableContainer ${tableMaximized ? "maximized" : "minimized"}`}
      >
        <div className="tableHeader">
          <h3>Data Dashboard</h3>
          <button className="toggle-button" onClick={toggleTable}>
            {tableMaximized ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
        <div
        className="ag-theme-alpine "
        style={{ height: "890px", width: "100%" }}

      >
        <AgGridReact
          onGridReady={onGridReady}
          rowData={data}
          columnDefs={columnDefs}
          rowSelection="multiple" // Enable multiple-row selection
          enableRangeSelection={true}
          defaultColDef={{
            resizable: true,
            filter: true,
            editable: true,
          }}
        ></AgGridReact>
      </div>
      </div>
    );
  }

  export default BootstrapTable;


