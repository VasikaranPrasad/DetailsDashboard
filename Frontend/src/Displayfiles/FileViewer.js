// import React from 'react';

// const FileViewer = ({ highlightedContent }) => {
//   return (
//     <div>
//       <h1>File Viewer</h1>
//       <div className="file-content">
//         {/* Render the highlighted content */}
//         <pre dangerouslySetInnerHTML={{ __html: highlightedContent }}></pre>
//       </div>
//     </div>
//   );
// };

// export default FileViewer;





import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const FileViewer = ({ filePath, lineNumber, content }) => {
  const lines = content.split('\n');

  // Highlight the line specified by lineNumber
  const highlightedContent = lines.map((line, index) => {
    const lineNum = Number(lineNumber);
    const highlighted = index + 1 === lineNum;

    return (
      <div
        key={index}
        style={{ background: highlighted ? 'yellow' : 'transparent' }}
      >
        {line}
      </div>
    );
  });

  return (
    <div>
      <p>File Path: {filePath}</p>
      <div className="file-content">
        {highlightedContent}
      </div>
    </div>
  );
};

export default FileViewer;



