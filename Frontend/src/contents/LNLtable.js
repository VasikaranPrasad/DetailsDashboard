import React, { useState, useEffect, useRef, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./LNLtable.css";
import jsonData from "./DetailLNLData.json"; // Import the static JSON data
// import jsonData from "../Displayfiles/Detail.json"; // Import the static JSON data
import "./Popup.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { animateScroll as scroll } from 'react-scroll';
import ScrollableFeed from 'react-scrollable-feed';
import axios from "axios";

const LNLtable = () => {
  const [gridApi, setGridApi] = useState(null);
  const [data, setData] = useState([]);
  const [tableMaximized, setTableMaximized] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("default");
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [filterValue, setFilterValue] = useState(""); // State for filter input value
  const [filteredCount, setFilteredCount] = useState(0); // State for filtered count
  const [filteredRows, setFilteredRows] = useState([]);
  const [buttonsVisible, setButtonsVisible] = useState(false); // State to track button visibility
  const [pageSize, setPageSize] = useState(15); // Default page size

  const scrollableRef = useRef();
  


  const toggleButtons = () => {
    setButtonsVisible(!buttonsVisible); // Toggle button visibility
  };

  useEffect(() => {
    setData(jsonData);
  }, []);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    // Filter the data and update the filtered count
    const filteredData = jsonData.filter((row) => {
      // Combine all fields you want to filter on into a single string
      const rowString =
        `${row.Label} ${row.Partition} ${row.Dst} ${row.WNS} ${row.TNS} ${row.Viols} ${row["MaxTrans Viols"]} ${row["MaxCap Viols"]} ${row["Net Length"]} ${row["Net Count"]} ${row.Short} ${row["NullShort"]} ${row["Real Short"]} ${row["Total DRCs"]} ${row["Both %"]} ${row["Horz %"]} ${row["Vert %"]} ${row["Cell Area"]} ${row["Die Area Utilization %"]} ${row["Design Utilization %"]} ${row.Gatecount} ${row.All} ${row.Stdcell} ${row.Seq} ${row["Buf/Inv"]} ${row["Hold Buf/Inv"]} ${row["Unclocked Seqs"]} ${row["Stdcell Growth %"]} ${row["Clk Buf/Inv"]} ${row["Clk Gates"]} ${row.Combinational} ${row.Pfet} ${row.Macro} ${row["Mbit flop %"]} ${row["Octa flop %"]} ${row["Non-RP Octa flop %"]} ${row["Datapath fubs count"]} ${row.Inputs} ${row.Outputs} ${row.Feedthrus} ${row["Total Z"]} ${row["Norm Z"]} ${row["Avg Z"]} ${row["Avg Norm Z"]} ${row.svt} ${row.lvtll} ${row.lvt} ${row.ulvtll} ${row.ulvt} ${row["ulvt %"]} ${row["ulvtll %"]} ${row["lvt %"]} ${row["svt %"]} ${row["lvtll %"]} ${row.Clk} ${row.Internal} ${row.Switching} ${row.Leakage} ${row.Total} ${row["5_2"]} ${row["5_16"]} ${row["5_20"]} ${row["7_2"]} ${row["10_6"]} ${row["Task TPT (hrs)"]} ${row["Cumulative TPT (hrs)"]} ${row["Memory (MB)"]}`.toLowerCase();

      return rowString.includes(value.toLowerCase()); // Check if the filter value exists in the rowString
    });

    setFilteredCount(filteredData.length);
    setFilteredRows(filteredData); // Store filtered rows in state
    setData(filteredData);

    // Update the rowData to display the filtered data
    setData(filteredData);
  };


  
  const openFileAndHighlight = (cellPath, cellValue) => {
    fetch('http://localhost:4001/api/openFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path: cellPath, searchValue: cellValue }),
    })
      .then(response => response.text())
      .then(fileContent => {
        const newTab = window.open('', '_blank');
        newTab.document.write('');
  
        const highlightedContent = fileContent.replace(
          new RegExp(cellValue, 'g'),
          `<span style="background-color: yellow">${cellValue}</span>`
        );
  
        newTab.document.write(`
          <html>
            <head>
              <style>
                /* Add some custom styling if needed */
              </style>
            </head>
            <body>
              <pre>${highlightedContent}</pre>
            </body>
          </html>
        `);
  
        newTab.document.close();
  
        // After the content is loaded, scroll to the last highlighted occurrence
        newTab.onload = () => {
          const highlightedElements = newTab.document.querySelectorAll('span[style*="background-color: yellow"]');
          if (highlightedElements.length > 0) {
            const lastHighlightedElement = highlightedElements[highlightedElements.length - 1];
            lastHighlightedElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        };
      })
      .catch(error => {
        console.error(error);
        alert('Error fetching file content');
      });
  };
  
 
  
  const onCellClicked = (params) => {
    const cellPath = params.data.path;
    const cellValue = params.value;
    openFileAndHighlight(cellPath, cellValue);
  };


  const timingDataColumnDefs = [
    // Define column definitions for timingData category here
    
    {
      headerName: "Partition",
      field: "Partition",
      width: 125,
      filter: "agMultiColumnFilter",
      sortable: true,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "Dst",
      field: "Dst",
      filter: "agMultiColumnFilter",
      sortable: true,
      width: 220,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },

    {
      headerName: "TIMING",
      children: [
        {
          headerName: "typ_0p85v_85c_typ_max:IO",
          children: [
            {
              headerName: "WNS",
              field: "WNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "TNS",
              field: "TNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Viols",
              field: "Viols",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "typ_0p85v_85c_typ_max:R2R",
          children: [
            {
              headerName: "WNS",
              field: "WNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "TNS",
              field: "TNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Viols",
              field: "Viols",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },
  ];
  const routingDataColumnDefs = [
    // Define column definitions for routingData category here
    
    {
      headerName: "Partition",
      field: "Partition",
      filter: "agMultiColumnFilter",
      sortable: true,
      width: 125,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "Dst",
      field: "Dst",
      filter: "agMultiColumnFilter",
      sortable: true,
      width: 220,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "ROUTE",
      children: [
        {
          headerName: "Routing",
          children: [
            {
              headerName: "Net Length",
              field: "Net Length",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Net Count",
              field: "Net Count",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Short",
              field: "Short",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "NullShort",
              field: "NullShort",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Real Short",
              field: "Real Short",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Total DRCs",
              field: "Total DRCs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 135,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Congestion",
          children: [
            {
              headerName: "Both %",
              field: "Both %",
              filter: "agNumberColumnFilter",
              sortable: true,
              sortable: true,
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Horz %",
              field: "Horz %",
              filter: "agNumberColumnFilter",
              sortable: true,
              sortable: true,
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Vert %",
              field: "Vert %",
              filter: "agNumberColumnFilter",
              sortable: true,
              sortable: true,
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },
  ];
  const designDataColumnDefs = [
   
    {
      headerName: "Partition",
      field: "Partition",
      filter: "agMultiColumnFilter",
      sortable: true,
      width: 125,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "Dst",
      field: "Dst",
      filter: "agMultiColumnFilter",
      sortable: true,
      width: 220,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },

    {
      headerName: "DESIGN",
      children: [
        {
          headerName: "Area",
          children: [
            {
              headerName: "Cell Area",
              field: "Cell Area",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Die Area Utilization %",
              field: "Die Area Utilization %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 230,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },

            {
              headerName: "Design Utilization %",
              field: "Design Utilization %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 230,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Gatecount",
              field: "Gatecount",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Counts",
          children: [
            {
              headerName: "All",
              field: "All",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell",
              field: "Stdcell",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Seq",
              field: "Seq",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Buf/Inv",
              field: "Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Hold Buf/Inv",
              field: "Hold Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Unclocked Seqs",
              field: "Unclocked Seqs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 175,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Area",
          children: [
            {
              headerName: "All",
              field: "All",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell",
              field: "Stdcell",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell Growth %",
              field: "Stdcell Growth %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 185,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Seq",
              field: "Seq",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Buf/Inv",
              field: "Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Hold Buf/Inv",
              field: "Hold Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk Buf/Inv",
              field: "Clk Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk Gates",
              field: "Clk Gates",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Combinational",
              field: "Combinational",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "pfet",
              field: "pfet",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Macro",
              field: "Macro",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Flops",
          children: [
            {
              headerName: "Mbit flop %",
              field: "Mbit flop %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Octa flop %",
              field: "Octa flop %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Non-RP Octa flop %",
              field: "Non-RP Octa flop %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 200,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "num_dcudp_datapathfubs",
          children: [
            {
              headerName: "Datapath fubs count",
              field: "Datapath fubs count",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 230,
              cellClass: "num_dcudp_datapathfubs",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Ports",
          children: [
            {
              headerName: "Inputs",
              field: "Inputs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Outputs",
              field: "Outputs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Feedthrus",
              field: "Feedthrus",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },
  ];
  const powerDataColumnDefs = [
    
    {
      headerName: "Partition",
      field: "Partition",
      filter: "agMultiColumnFilter",
      sortable: true,
      width: 125,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "Dst",
      field: "Dst",
      filter: "agMultiColumnFilter",
      sortable: true,
      width: 220,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },

    {
      headerName: "POWER",
      children: [
        {
          headerName: "Z",
          children: [
            {
              headerName: "Total Z",
              field: "Total Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Total_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Norm Z",
              field: "Norm Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Avg Z",
              field: "Avg Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Avg Norm Z",
              field: "Avg Norm Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 140,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "svt",
              field: "svt",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "svt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvtll",
              field: "lvtll",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvt",
              field: "lvt",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvtll",
              field: "ulvtll",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },

            {
              headerName: "ulvt",
              field: "ulvt",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvt %",
              field: "ulvt %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvtll %",
              field: "ulvtll %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvt %",
              field: "lvt %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "svt %",
              field: "svt %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvtll %",
              field: "lvtll %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk",
              field: "Clk",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Clk",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Constant_Switching_Activity",
          children: [
            {
              headerName: "Internal",
              field: "Internal",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Switching",
              field: "Switching",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Leakage",
              field: "Leakage",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Total",
              field: "Total",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },
  ];
  const CaliberSummaryDataColumnDefs = [
    {
      field: "select",
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: "left",
    },
    {
      headerName: "Partition",
      field: "Partition",
      width: 125,
      pinned: "left",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Dst",
      field: "Dst",
      width: 220,
      pinned: "left",
      filter: "agTextColumnFilter",
    },
    {
      headerName: "Caliber_Summary",
      children: [
        {
          headerName: "typ_0p85v_85c_typ_max",
          children: [
            {
              headerName: "5_2",
              field: "5_2",
              filter: "agNumberColumnFilter",
              width: 125,
            },
            {
              headerName: "5_16",
              field: "5_16",
              filter: "agNumberColumnFilter",
              width: 125,
            },
            {
              headerName: "5_20",
              field: "5_20",
              filter: "agNumberColumnFilter",
              width: 125,
            },
            {
              headerName: "7_2",
              field: "7_2",
              filter: "agNumberColumnFilter",
              width: 125,
            },
            {
              headerName: "10_6",
              field: "10_6",
              filter: "agNumberColumnFilter",
              width: 125,
            },
          ],
        },
      ],
    },
  ];
  const computeDataColumnsDefs = [
    
    {
      headerName: "Partition",
      field: "Partition",
      filter: "agMultiColumnFilter",
      width: 125,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "Dst",
      field: "Dst",
      sortable: true,
      width: 220,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },

    {
      headerName: "COMPUTE",
      children: [
        {
          headerName: "TPT",
          children: [
            {
              headerName: "Task TPT (hrs)",
              field: "Task TPT (hrs)",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 160,
              cellClass: "TPT",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Cumulative TPT (hrs)",
              field: "Cumulative TPT (hrs)",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 205,
              cellClass: "TPT",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Mem",
          children: [
            {
              headerName: "Memory (MB)",
              field: "Memory (MB)",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 160,
              cellClass: "Mem",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },
  ];

  const defaultColumnDefs = [
    {
      headerName: "Partition",
      field: "Partition",
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "Dst",
      field: "Dst",
      filter: "agTextColumnFilter",
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },

    // Timing Data
    {
      headerName: "TIMING",
      children: [
        {
          headerName: "typ_0p85v_85c_typ_max:IO",
          children: [
            {
              headerName: "WNS",
              field: "WNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "TNS",
              field: "TNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Viols",
              field: "Viols",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "typ_0p85v_85c_typ_max:R2R",
          children: [
            {
              headerName: "WNS",
              field: "WNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "TNS",
              field: "TNS",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Viols",
              field: "Viols",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Routing Data
    {
      headerName: "ROUTE",
      children: [
        {
          headerName: "Routing",
          children: [
            {
              headerName: "Net Length",
              field: "Net Length",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Net Count",
              field: "Net Count",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Short",
              field: "Short",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "NullShort",
              field: "NullShort",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Real Short",
              field: "Real Short",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Total DRCs",
              field: "Total DRCs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 135,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Congestion",
          children: [
            {
              headerName: "Both %",
              field: "Both %",
              filter: "agNumberColumnFilter",
              sortable: true,
              sortable: true,
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Horz %",
              field: "Horz %",
              filter: "agNumberColumnFilter",
              sortable: true,
              sortable: true,
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Vert %",
              field: "Vert %",
              filter: "agNumberColumnFilter",
              sortable: true,
              sortable: true,
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Design Data
    {
      headerName: "DESIGN",
      children: [
        {
          headerName: "Area",
          children: [
            {
              headerName: "Cell Area",
              field: "Cell Area",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Die Area Utilization %",
              field: "Die Area Utilization %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 230,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },

            {
              headerName: "Design Utilization %",
              field: "Design Utilization %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 230,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Gatecount",
              field: "Gatecount",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Counts",
          children: [
            {
              headerName: "All",
              field: "All",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell",
              field: "Stdcell",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Seq",
              field: "Seq",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Buf/Inv",
              field: "Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Hold Buf/Inv",
              field: "Hold Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Unclocked Seqs",
              field: "Unclocked Seqs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 175,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Area",
          children: [
            {
              headerName: "All",
              field: "All",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell",
              field: "Stdcell",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell Growth %",
              field: "Stdcell Growth %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 185,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Seq",
              field: "Seq",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Buf/Inv",
              field: "Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Hold Buf/Inv",
              field: "Hold Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk Buf/Inv",
              field: "Clk Buf/Inv",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk Gates",
              field: "Clk Gates",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Combinational",
              field: "Combinational",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "pfet",
              field: "pfet",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Macro",
              field: "Macro",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Flops",
          children: [
            {
              headerName: "Mbit flop %",
              field: "Mbit flop %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Octa flop %",
              field: "Octa flop %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 165,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Non-RP Octa flop %",
              field: "Non-RP Octa flop %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 200,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "num_dcudp_datapathfubs",
          children: [
            {
              headerName: "Datapath fubs count",
              field: "Datapath fubs count",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 230,
              cellClass: "num_dcudp_datapathfubs",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Ports",
          children: [
            {
              headerName: "Inputs",
              field: "Inputs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Outputs",
              field: "Outputs",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Feedthrus",
              field: "Feedthrus",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Power Data
    {
      headerName: "POWER",
      children: [
        {
          headerName: "Z",
          children: [
            {
              headerName: "Total Z",
              field: "Total Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Total_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Norm Z",
              field: "Norm Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Avg Z",
              field: "Avg Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Avg Norm Z",
              field: "Avg Norm Z",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 140,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "svt",
              field: "svt",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "svt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvtll",
              field: "lvtll",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvt",
              field: "lvt",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvtll",
              field: "ulvtll",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },

            {
              headerName: "ulvt",
              field: "ulvt",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvt %",
              field: "ulvt %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvtll %",
              field: "ulvtll %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvt %",
              field: "lvt %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "svt %",
              field: "svt %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvtll %",
              field: "lvtll %",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk",
              field: "Clk",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Clk",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Constant_Switching_Activity",
          children: [
            {
              headerName: "Internal",
              field: "Internal",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Switching",
              field: "Switching",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Leakage",
              field: "Leakage",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Total",
              field: "Total",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Compute Data
    {
      headerName: "COMPUTE",
      children: [
        {
          headerName: "TPT",
          children: [
            {
              headerName: "Task TPT (hrs)",
              field: "Task TPT (hrs)",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 160,
              cellClass: "TPT",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Cumulative TPT (hrs)",
              field: "Cumulative TPT (hrs)",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 205,
              cellClass: "TPT",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Mem",
          children: [
            {
              headerName: "Memory (MB)",
              field: "Memory (MB)",
              filter: "agNumberColumnFilter",
              sortable: true,
              width: 160,
              cellClass: "Mem",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },
  ];

  const getCategoryColumnDefs = () => {
    switch (selectedCategory) {
      case "default":
        return defaultColumnDefs;
      case "timingData":
        return timingDataColumnDefs;
      case "routingData":
        return routingDataColumnDefs;
      case "powerData":
        return powerDataColumnDefs;
      case "designData":
        return designDataColumnDefs;
      case "caliberSummaryData":
        return CaliberSummaryDataColumnDefs;
      case "computeData":
        return computeDataColumnsDefs;
      // Add cases for other categories here
      default:
        return [
          {
            sortable: true,
            flex: 1,
            minWidth: 100,
            filter: true,
            resizable: true,
          },
        ];
    }
  };

  const gridOptions = {
    onCellClicked: (params) => {
      const cellValue = params.value;
      setSelectedCell(cellValue);
      // Find the corresponding row data based on the selected cell value and dynamic field
      const fieldNameToSearch = params.colDef.field;
      const rowData = jsonData.find(
        (row) => row[fieldNameToSearch] === cellValue
      );
      setSelectedData(rowData);
      setSelectedField(fieldNameToSearch);
    },

    getRowStyle: (params) => {
      const partitionValue = params.data.Partition;

      // Create a map to store unique colors for each unique "Partition" value
      if (!gridOptions.colorMap) {
        gridOptions.colorMap = {};
      }

      const colors = [
        "rgba(255, 0, 0, 0.2)", // Very Light Red
        "rgba(0, 255, 0, 0.2)", // Very Light Green
        "rgba(0, 0, 255, 0.2)", // Very Light Blue
        "rgba(255, 255, 0, 0.2)", // Very Light Yellow
        "rgba(128, 0, 128, 0.2)", // Very Light Purple
        "rgba(255, 165, 0, 0.2)", // Very Light Orange
        "rgba(255, 182, 193, 0.5)", // Very Light Pink
        "rgba(173, 216, 230, 0.5)", // Very Light Cyan
        "rgba(255, 215, 0, 0.5)", // Very Light Gold
        "rgba(230, 230, 250, 0.5)", // Very Light Lavender
        "rgba(152, 251, 152, 0.5)", // Very Light Mint
      ];
      // If the partition value is not in the map, assign it a color
      if (!gridOptions.colorMap[partitionValue]) {
        // Get the next color from the array and assign it to the partition value
        const colorIndex =
          Object.keys(gridOptions.colorMap).length % colors.length;
        gridOptions.colorMap[partitionValue] = colors[colorIndex];
      }

      // Apply the background color based on the assigned color
      return { background: gridOptions.colorMap[partitionValue] };
    },
    pagination: true,
    paginationPageSize: pageSize,
  };

  const onCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.paginationSetPageSize(pageSize);
    }
  }, [gridApi, pageSize]);

 

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setPageSize(newSize);
    }
  };
  const rowCount = jsonData.length; // Assuming your JSON data is an array

  return (
    <div className="mainWrapper" >
      
      <div className="mainContainer" ref={scrollableRef}>
        <h3>Detail Dashboard</h3>
        <div className="header-right">
          {/* Filter input on the left */}
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search..."
              value={filterValue}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <div className="filtered-count">{filteredCount} items</div>
          </div>

          {/* Blue round icon on the right */}
          <div className="blue-round-icon" onClick={toggleButtons}>
            𝐕𝐢𝐞𝐰
          </div>
        </div>
        {/* Container for category buttons */}
        <div
          className={`categoryButtonsContainer ${
            buttonsVisible ? "visible" : ""
          }`}
        >
          {/* Category buttons */}
          <button
            className={`category-button ${
              selectedCategory === "default" ? "active" : ""
            } purple-button`}
            onClick={() => onCategoryChange("default")}
          >
            𝐃𝐄𝐅𝐀𝐔𝐋𝐓
          </button>
          <button
            className={`category-button ${
              selectedCategory === "timingData" ? "active" : ""
            } red-button`}
            onClick={() => onCategoryChange("timingData")}
          >
            𝐓𝐈𝐌𝐈𝐍𝐆
          </button>
          <button
            className={`category-button ${
              selectedCategory === "routingData" ? "active" : ""
            } yellow-button `}
            onClick={() => onCategoryChange("routingData")}
          >
            𝐑𝐎𝐔𝐓𝐄
          </button>
          <button
            className={`category-button ${
              selectedCategory === "designData" ? "active" : ""
            } green-button `}
            onClick={() => onCategoryChange("designData")}
          >
            𝐃𝐄𝐒𝐈𝐆𝐍
          </button>
          <button
            className={`category-button ${
              selectedCategory === "powerData" ? "active" : ""
            } blue-button`}
            onClick={() => onCategoryChange("powerData")}
          >
            𝐏𝐎𝐖𝐄𝐑
          </button>
          <button
            className={`category-button ${
              selectedCategory === "computeData" ? "active" : ""
            } orange-button`}
            onClick={() => onCategoryChange("computeData")}
          >
            𝐂𝐎𝐌𝐏𝐔𝐓𝐄
          </button>
        </div>
      </div>
      <div className="ag-theme-alpine">
        <AgGridReact 
          onGridReady={onGridReady}
          gridOptions={gridOptions}
          rowData={data}
          columnDefs={getCategoryColumnDefs()}
          rowSelection="multiple"
          enableRangeSelection={true}
          suppressMenuHide={true}
          onCellDoubleClicked={onCellClicked}
        ></AgGridReact>
      </div>

      <div>
        <label htmlFor="pageSizeInput">Rows per Page:</label>
        <input
          id="pageSizeInput"
          type="number"
          min="1"
          value={pageSize}
          onChange={handlePageSizeChange}
        />
      </div>
      
     
      <div className="row-count">Total Rows: {rowCount}</div>
    </div>
  );
};

export default LNLtable;
