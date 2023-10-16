// import React, { useState } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import FileViewer from './FileViewer'; // Import the FileViewer component
// import FileViewerRenderer from './FileViewerRenderer';


// import jsonData from './LNL.json'; // Import JSON data from the file

// const DetailDashboard = () => {
//     const [showFileViewer, setShowFileViewer] = useState(false);
//     const [selectedFilePath, setSelectedFilePath] = useState('');
//     const [selectedLineNum, setSelectedLineNum] = useState('');
//     const [fileContent, setFileContent] = useState('');
  



// // Handle cell click in the Ag-Grid
// const handleCellClicked = (params) => {
//   const colId = params.column.getColId();
//   const data = params.data;
//   console.log(colId);

//   if (colId.includes('WNS')) {
//     // Access the relevant data fields and create a data object to send to the backend
//     const wnsValue = data.Timing['typ_0p85v_85c_typ_max:IO']['WNS']['value'];
//     const wnsLineNum = data.Timing['typ_0p85v_85c_typ_max:IO']['WNS']['LineNum'];
//     const filePath = data.Timing['typ_0p85v_85c_typ_max:IO']['WNS']['path'];

//     const postData = {
//       value: wnsValue,
//       LineNum: wnsLineNum,
//       path: filePath,
//     };

//     fetch('http://localhost:4001/backend-endpoint', {
//       method: 'POST',
//       body: JSON.stringify(postData),
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
//         return response.blob(); // Change to response.blob() to get the file content as a blob
//       })
//       .then((blob) => {
//         // Create a URL for the blob and use it to open the file in a new tab
//         const fileUrl = URL.createObjectURL(blob);
//         window.open(fileUrl);
//       })
//       .catch((error) => {
//         console.error('Error:', error);
//       });
//   }
// };
  
  


//   const columnDefs = [
//     { headerName: 'Partition', field: 'Partition' },
//     { headerName: 'Dst', field: 'Dst' },
//     {
//       headerName: 'Timing',
//       children: [
//         {
//           headerName: 'typ_0p85v_85c_typ_max:IO',
//           children: [
//             { headerName: 'WNS', field: 'Timing.typ_0p85v_85c_typ_max:IO.WNS.value',cellRendererFramework: FileViewerRenderer,},
//             { headerName: 'TNS', field: 'Timing.typ_0p85v_85c_typ_max:IO.TNS.value' },
//             { headerName: 'Viols', field: 'Timing.typ_0p85v_85c_typ_max:IO.Viols.value' },
//           ],
//         },
//         {
//           headerName: 'typ_0p85v_85c_typ_max:R2R',
//           children: [
//             { headerName: 'WNS', field: 'Timing.typ_0p85v_85c_typ_max:R2R.WNS.value' },
//             { headerName: 'TNS', field: 'Timing.typ_0p85v_85c_typ_max:R2R.TNS.value' },
//             { headerName: 'Viols', field: 'Timing.typ_0p85v_85c_typ_max:R2R.Viols.value' },
//           ],
//         },
//       ],
//     },
//     {
//       headerName: 'Route',
//       children: [
//         {
//           headerName: 'Routing',
//           children: [
//             { headerName: 'Net Length', field: 'Route.Routing.Net Length.value' },
//             { headerName: 'Net Count', field: 'Route.Routing.Net Count.value' },
//             // Add more subcolumns as needed
//           ],
//         },
//         {
//           headerName: 'Congestion',
//           children: [
//             { headerName: 'Both %', field: 'Route.Congestion.Both %.value' },
//             { headerName: 'Horz %', field: 'Route.Congestion.Horz %.value' },
//             { headerName: 'Vert %', field: 'Route.Congestion.Vert %.value' },
//             // Add more subcolumns as needed
//           ],
//         },
//       ],
//     },
//   ];

//   const rowData = jsonData; // Use the imported JSON data

//   const gridOptions = {
//     // Other grid options...
//     frameworkComponents: {
//       FileViewerRenderer: FileViewerRenderer, // Include FileViewerRenderer as a framework component
//     },
//   };
//   return (
//     <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
//     <AgGridReact
//       columnDefs={columnDefs}
//       rowData={rowData}
//       gridOptions={gridOptions}
//       onCellDoubleClicked={handleCellClicked} // Change to onCellDoubleClicked
//     />
//     {showFileViewer && (
//       <FileViewer filePath={selectedFilePath} lineNumber={selectedLineNum} content={fileContent} />
//     )}
//   </div>
//   );
// };

// export default DetailDashboard;




import React, { useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import FileViewer from './FileViewer'; // Import the FileViewer component
import jsonData from './LNL.json'; // Import JSON data from the file

const DetailDashboard = () => {
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedFilePath, setSelectedFilePath] = useState('');
  const [selectedLineNum, setSelectedLineNum] = useState('');
  const [fileContent, setFileContent] = useState('');

const handleCellClicked = (params) => {
    const colId = params.column.getColId();
    const data = params.data;
  
    if (colId.includes('WNS')) {
      const timing = data.Timing;
  
      const timingKeys = Object.keys(timing);
  
      // Find the specific WNS data for the clicked column
      const wnsData = timingKeys
        .map((timingKey) => timing[timingKey]['WNS'])
        .find((wns) => wns);
  
      if (wnsData) {
        const wnsValue = wnsData['value'];
        const wnsLineNum = wnsData['LineNum'];
        const filePath = wnsData['path'];
  
        const postData = {
          value: wnsValue,
          LineNum: wnsLineNum,
          path: filePath,
        };
  
        fetch('http://localhost:4001/backend-endpoint', {
          method: 'POST',
          body: JSON.stringify(postData),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text();
          })
          .then((text) => {
            setShowFileViewer(true);
            setSelectedFilePath(filePath);
            setSelectedLineNum(wnsLineNum);
            setFileContent(text);
          })
          .catch((error) => {
            console.error('Error:', error);
          });
      }
    }
  };
 


//   const handleCellClicked = (params) => {
//     const colId = params.column.getColId();
//     const data = params.data;

//     if (colId.includes('WNS')) {
//       const wnsValue = data.Timing['typ_0p85v_85c_typ_max:IO']['WNS']['value'];
//       const wnsLineNum = data.Timing['typ_0p85v_85c_typ_max:IO']['WNS']['LineNum'];
//       const filePath = data.Timing['typ_0p85v_85c_typ_max:IO']['WNS']['path'];

//       const postData = {
//         value: wnsValue,
//         LineNum: wnsLineNum,
//         path: filePath,
//       };

//       fetch('http://localhost:4001/backend-endpoint', {
//         method: 'POST',
//         body: JSON.stringify(postData),
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error('Network response was not ok');
//           }
//           return response.text(); // Change to response.text() to get the file content as text
//         })
//         .then((text) => {
//           // Open the FileViewer component with the filePath, lineNumber, and content
//           setShowFileViewer(true);
//           setSelectedFilePath(filePath);
//           setSelectedLineNum(wnsLineNum);
//           setFileContent(text); // Set the file content
//         })
//         .catch((error) => {
//           console.error('Error:', error);
//         });
//     }
//   };
  
  const columnDefs = [
    { headerName: 'Partition', field: 'Partition' },
    { headerName: 'Dst', field: 'Dst' },
    {
      headerName: 'Timing',
      children: [
        {
          headerName: 'typ_0p85v_85c_typ_max:IO',
          children: [
            { headerName: 'WNS', field: 'Timing.typ_0p85v_85c_typ_max:IO.WNS.value'},
            { headerName: 'TNS', field: 'Timing.typ_0p85v_85c_typ_max:IO.TNS.value' },
            { headerName: 'Viols', field: 'Timing.typ_0p85v_85c_typ_max:IO.Viols.value' },
          ],
        },
        {
          headerName: 'typ_0p85v_85c_typ_max:R2R',
          children: [
            { headerName: 'WNS', field: 'Timing.typ_0p85v_85c_typ_max:R2R.WNS.value' },
            { headerName: 'TNS', field: 'Timing.typ_0p85v_85c_typ_max:R2R.TNS.value' },
            { headerName: 'Viols', field: 'Timing.typ_0p85v_85c_typ_max:R2R.Viols.value' },
          ],
        },
      ],
    },
    {
      headerName: 'Route',
      children: [
        {
          headerName: 'Routing',
          children: [
            { headerName: 'Net Length', field: 'Route.Routing.Net Length.value' },
            { headerName: 'Net Count', field: 'Route.Routing.Net Count.value' },
            // Add more subcolumns as needed
          ],
        },
        {
          headerName: 'Congestion',
          children: [
            { headerName: 'Both %', field: 'Route.Congestion.Both %.value' },
            { headerName: 'Horz %', field: 'Route.Congestion.Horz %.value' },
            { headerName: 'Vert %', field: 'Route.Congestion.Vert %.value' },
            // Add more subcolumns as needed
          ],
        },
      ],
    },
  ];

  const rowData = jsonData; // Use the imported JSON data


  return (
    <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        onCellDoubleClicked={handleCellClicked}
      />
      {showFileViewer && (
        <FileViewer filePath={selectedFilePath} lineNumber={selectedLineNum} content={fileContent} />
      )}
    </div>
  );
};

export default DetailDashboard;
