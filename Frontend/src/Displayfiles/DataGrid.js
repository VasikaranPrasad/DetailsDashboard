import React, { Component } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

class DataGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [],
      rowData: [], // Populate with your JSON data
    };
  }

  componentDidMount() {
    // Load your JSON data (replace 'jsonData' with your actual JSON data)
    const jsonData = require('./output.json');

    // Generate column definitions based on the JSON structure
    const columnDefs = this.generateColumnDefinitions(jsonData);

    this.setState({
      columnDefs,
      rowData: jsonData,
    });
  }

  // Function to generate column definitions based on the JSON structure
  generateColumnDefinitions(jsonData) {
    if (!jsonData) {
      return [];
    }

    // Get the field names from the JSON
    const fieldNames = this.getFieldNames(jsonData, '');

    // Create column definitions
    const columnDefs = fieldNames.map((fieldName) => {
      return { headerName: fieldName, field: fieldName };
    });

    return columnDefs;
  }

  // Recursively get all field names in the JSON structure
  getFieldNames(obj, prefix) {
    let fieldNames = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        fieldNames = fieldNames.concat(this.getFieldNames(obj[key], `${prefix}${key}.`));
      } else {
        fieldNames.push(`${prefix}${key}`);
      }
    }
    return fieldNames;
  }

  render() {
    return (
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={this.state.rowData}
        />
      </div>
    );
  }
}

export default DataGrid;
