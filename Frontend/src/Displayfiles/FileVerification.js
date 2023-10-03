import React, { Component } from 'react';

class FileVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filePath: '',
      isPathValid: null,
      fileContent: '',
      lineNumber: '',
      highlightedLine: '', // Added state for highlighted line
    };
  }

  handleFilePathChange = (e) => {
    this.setState({ filePath: e.target.value });
  };

  handleLineNumberChange = (e) => {
    this.setState({ lineNumber: e.target.value });
  };

  verifyFilePath = () => {
    const { filePath } = this.state;

    // Make a GET request to the backend
    fetch(`http://localhost:4001/verifyFilePath?path=${encodeURIComponent(filePath)}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('File path validation failed');
        }
      })
      .then((data) => {
        const { isPathValid, fileContent } = data;
        this.setState({ isPathValid, fileContent });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isPathValid: false, fileContent: '' });
      });
  };

  openNewTabWithHighlight = () => {
    const { isPathValid, lineNumber, fileContent } = this.state;

    if (isPathValid && lineNumber >= 1) {
      // Split the file content into lines
      const lines = fileContent.split('\n');

      // Check if the entered line number is within the valid range
      if (lineNumber <= lines.length) {
        // Highlight the specified line by wrapping it in a <span> with a yellow background
        lines[lineNumber - 2] = `<span style="background-color: yellow;">${lines[lineNumber - 1]}</span>`;

        // Join the lines back into the file content
        const highlightedContent = lines.join('\n');

        // Update the state to store the highlighted line
        this.setState({ highlightedLine: highlightedContent });

        // Open a new tab with the highlighted content
        const newTab = window.open('', '_blank');
        newTab.document.write(highlightedContent);
      } else {
        alert('Line number is out of range.');
      }
    } else {
      alert('Invalid line number or file content not loaded.');
    }
  };

  render() {
    const { isPathValid, lineNumber, highlightedLine } = this.state;

    return (
      <div>
        <h1>File Verification</h1>
        <div>
          <label htmlFor="filePath">Enter File Path:</label>
          <input
            type="text"
            id="filePath"
            placeholder="Enter file path"
            value={this.state.filePath}
            onChange={this.handleFilePathChange}
          />
          <button onClick={this.verifyFilePath}>Verify Path</button>
        </div>
        {isPathValid && (
          <div>
            <h2>File Viewer</h2>
            <div>
              <label htmlFor="lineNumber">Enter Line Number:</label>
              <input
                type="number"
                id="lineNumber"
                placeholder="Enter line number"
                value={lineNumber}
                onChange={this.handleLineNumberChange}
              />
              <button onClick={this.openNewTabWithHighlight}>Show</button>
            </div>
          </div>
        )}
        {isPathValid !== null && (
          <div>
            {isPathValid ? (
              <div>
                <h2>File is Valid</h2>
                {/* Render the highlighted line content */}
                {/* <pre dangerouslySetInnerHTML={{ __html: highlightedLine }}></pre> */}
              </div>
            ) : (
              <h2>File is Invalid</h2>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default FileVerification;




// top line highlite

// import React, { Component } from 'react';

// class FileVerification extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       filePath: '',
//       isPathValid: null,
//       fileContent: '',
//       lineNumber: '',
//     };
//   }

//   handleFilePathChange = (e) => {
//     this.setState({ filePath: e.target.value });
//   };

//   handleLineNumberChange = (e) => {
//     this.setState({ lineNumber: e.target.value });
//   };

//   verifyFilePath = () => {
//     const { filePath } = this.state;

//     // Make a GET request to the backend
//     fetch(`http://localhost:4001/verifyFilePath?path=${encodeURIComponent(filePath)}`)
//       .then((response) => {
//         if (response.ok) {
//           return response.json();
//         } else {
//           throw new Error('File path validation failed');
//         }
//       })
//       .then((data) => {
//         const { isPathValid, fileContent } = data;
//         this.setState({ isPathValid, fileContent });
//       })
//       .catch((error) => {
//         console.error(error);
//         this.setState({ isPathValid: false, fileContent: '' });
//       });
//   };

//   openNewTabWithHighlight = () => {
//     const { isPathValid, lineNumber, fileContent } = this.state;

//     if (isPathValid && lineNumber >= 1) {
//       // Split the file content into lines
//       const lines = fileContent.split('\n');

//       // Check if the entered line number is within the valid range
//       if (lineNumber <= lines.length) {
//         // Highlight the specified line by wrapping it in a <span> with a yellow background
//         const highlightedLine = `<span style="background-color: yellow;">${lines[lineNumber - 1]}</span>`;
        
//         // Insert the highlighted line at the top of the content
//         const newContent = highlightedLine + '\n' + fileContent;

//         // Open a new tab with the modified content
//         const newTab = window.open('', '_blank');
//         newTab.document.write(newContent);
//       } else {
//         alert('Line number is out of range.');
//       }
//     } else {
//       alert('Invalid line number or file content not loaded.');
//     }
//   };

//   render() {
//     const { isPathValid, lineNumber } = this.state;

//     return (
//       <div>
//         <h1>File Verification</h1>
//         <div>
//           <label htmlFor="filePath">Enter File Path:</label>
//           <input
//             type="text"
//             id="filePath"
//             placeholder="Enter file path"
//             value={this.state.filePath}
//             onChange={this.handleFilePathChange}
//           />
//           <button onClick={this.verifyFilePath}>Verify Path</button>
//         </div>
//         {isPathValid && (
//           <div>
//             <h2>File Viewer</h2>
//             <div>
//               <label htmlFor="lineNumber">Enter Line Number:</label>
//               <input
//                 type="number"
//                 id="lineNumber"
//                 placeholder="Enter line number"
//                 value={lineNumber}
//                 onChange={this.handleLineNumberChange}
//               />
//               <button onClick={this.openNewTabWithHighlight}>Highlight Line</button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   }
// }

// export default FileVerification;
