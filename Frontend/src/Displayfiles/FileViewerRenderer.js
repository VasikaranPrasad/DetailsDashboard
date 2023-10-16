import React from 'react';

const FileViewerRenderer = ({ value, data, node }) => {
    const handleCellClicked = () => {
        if (node.column.getColId() === 'WNS') {
          // Assuming 'data.path' and 'data.Timing.typ_0p85v_85c_typ_max:IO.WNS.LineNum' are correctly structured
          const filePath = data.path;
          const lineNumber = data.Timing['typ_0p85v_85c_typ_max:IO']['WNS']['LineNum']; // Use bracket notation to access nested properties
          
          // Open the FileViewer component with the filePath and lineNumber
          // Implement the logic to open the FileViewer here
        }
      };
      

  return (
    <div onClick={handleCellClicked}>{value}</div>
  );
};

export default FileViewerRenderer;
