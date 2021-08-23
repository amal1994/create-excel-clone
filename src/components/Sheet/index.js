// eslint-disable-next-line

import React from "react";
import PropTypes from "prop-types";
import Row from "../Row";
import { SheetContextProvider } from "../../context/sheetContext";
import { checkValidColumnData} from "../../utils/common"
import { Parser as FormulaParser } from 'hot-formula-parser'

const parser = new FormulaParser()
// populating rows
const renderRows = (cellsData) => {
  const rowsLength = cellsData.length;
  const columnLength = cellsData[0].length;
  const rows = [];
  //adding 1 extra row for header row
  for (let i = 0; i < rowsLength; i++) {
    rows.push(
      <Row row={i} key={i} rowData={cellsData[i]} column={columnLength} />
    );
  }
  return rows;
};

const initializeParser = (data)=>{

  // When a formula contains a range value, this event lets us
  // hook and return an error value if necessary
  parser.on('callRangeValue', function(startCellCoord, endCellCoord, done) {

    let fragment = [];
  
    for (let row = startCellCoord.row.index; row <= endCellCoord.row.index; row++) {
      let rowData = data[row];
      let colFragment = [];
  
      for (let col = startCellCoord.column.index; col <= endCellCoord.column.index; col++) {
        colFragment.push(rowData[col]);
      }
      fragment.push(colFragment);
    }
  
    if (fragment) {
      done(fragment);
    }
    })
}

const initializeSheetData = (rows, columns) => {
  let sheetData = new Array(rows + 1);
  for (let i = 0; i < rows + 1; i++) {
    sheetData[i] = new Array(columns + 1);
    for (let j = 0; j < columns + 1; j++) {
      sheetData[i][j] = "";
    }
  }
  return sheetData;
};


const addColumn = (cellsData, payload) => {
  const modifiedCellsData = [...cellsData];

  const { direction, column } = payload;
  const rowLength = modifiedCellsData.length;
  const columnLength = modifiedCellsData[0].length;

  if (direction === "right") {
    for (let j = columnLength; j > column + 1; j--) {
      for (let i = 0; i < rowLength; i++) {
        modifiedCellsData[i][j] = modifiedCellsData[i][j - 1];
      }
    }
    for (let i = 0; i < rowLength; i++) {
      modifiedCellsData[i][column + 1] = "";
    }
  } else {
    for (let i = 0; i < rowLength; i++) {
      modifiedCellsData[i].unshift("");
    }
    for (let j = 0; j <= column; j++) {
      for (let i = 0; i < rowLength; i++) {
        modifiedCellsData[i][j] = modifiedCellsData[i][j + 1];
      }
    }
    for (let i = 0; i < rowLength; i++) {
      modifiedCellsData[i][column] = "";
    }
  }
  return modifiedCellsData;
};

const addRow = (cellsData, payload) => {
  const modifiedCellsData = [...cellsData];

  const { direction, row } = payload;
  const columnLength = modifiedCellsData[0].length;

  if (direction === "bottom") {
    const newRow = [];
    for (let i = 0; i < columnLength; i++) {
      newRow.push("");
    }
    modifiedCellsData.push(newRow);
    const rowLength = modifiedCellsData.length;
    for (let i = rowLength - 1; i > row; i--) {
      for (let j = 0; j < columnLength; j++) {
        modifiedCellsData[i][j] = modifiedCellsData[i - 1][j];
      }
    }
    for (let j = 0; j < columnLength; j++) {
      modifiedCellsData[row + 1][j] = "";
    }
  } else {
    const newRow = [];
    for (let i = 0; i < columnLength; i++) {
      newRow.push("");
    }
    modifiedCellsData.unshift(newRow);
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < columnLength; j++) {
        modifiedCellsData[i][j] = modifiedCellsData[i+1][j];
      }
    }
    for (let j = 0; j < columnLength; j++) {
      modifiedCellsData[row][j] = "";
    }
  }

  return modifiedCellsData;
};

// sort Data
const sortData = (cellsData, payload)=>{
  const {column, type} = payload
  let modifiedCellsData = [...cellsData]
  const columnData = []
  const emptyRows=[]
  const removedHeaderRow = modifiedCellsData.shift();
  const rowLength=modifiedCellsData.length
  for(let i=0;i<rowLength;i++){
    columnData.push(modifiedCellsData[i][column])
  }
  if(checkValidColumnData(columnData)){
    if(type==='asc'){
      modifiedCellsData = modifiedCellsData.filter(value=>{
        if(value[column]===""){
          emptyRows.push(value)
        }
        return value[column]!==""
      })
      modifiedCellsData.sort((a, b) => a[column].localeCompare(b[column]))
    }else{
      modifiedCellsData.sort((a, b) => b[column].localeCompare(a[column]))
    }
  }
  modifiedCellsData.unshift(removedHeaderRow)
  if(type==='asc'){
    emptyRows.forEach(er=>modifiedCellsData.push(er))
  }
  return modifiedCellsData
}

const executeSum = (data, value)=>{
  const range = value.split(":")
  const firstRange = range[0]
  const endRange = range[1]
  const firstRow = Number(firstRange[firstRange.length-1])
  const firstColumn = Number(firstRange[firstRange.length-2])
  const lastRow = Number(endRange[1])
  const lastColumn = Number(endRange[0])
  let sum=0
  if(firstColumn===lastColumn){
    for(let i=firstRow;i<=lastRow;i++){
      if(!isNaN(data[i][firstColumn]) && data[i][firstColumn]!==""){
        sum+=Number(data[i][firstColumn])
      }
    }
  }
  return sum
}
/**
   * Executes the formula on the `value` usign the FormulaParser object
   */
 const executeFormula = (cellsData, payload) => {
  const {row,column, value} = payload
  const modifiedCellsData = [...cellsData]
  // let res = parser.parse(value)
  // console.log("execute formula", res,value)
  // if (res.error != null) {
  //   modifiedCellsData[row][column] = "" // tip: returning `res.error` shows more details
  // }
  // modifiedCellsData[row][column] = res.result
  modifiedCellsData[row][column] =  executeSum(modifiedCellsData, value) || ''
  return modifiedCellsData
}

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_COLUMN":
      return addColumn(state, action.payload);
    case "ADD_ROW":
      return addRow(state, action.payload);
    case "UPDATE_VALUE":
      return setValue(state, action.payload);
    case "SORT_DATA":
      return sortData(state, action.payload)
    case "EXECUTE_FORMULA":
      return executeFormula(state, action.payload)
    default:
      return state;
  }
};

const setValue = (cellsData, payload) => {
  const { row, column, data } = payload;
  const modifiedCellsData = [...cellsData];
  modifiedCellsData[row][column] = data;
  return modifiedCellsData;
};

/**
 * Sheet creates a table with x rows and y columns
 */
export default function Sheet({ row = 20, column = 20 }) {
  const initialData = initializeSheetData(row, column);
  const [cellsData, dispatch] = React.useReducer(reducer, initialData);
  React.useEffect(() => {
    initializeParser(cellsData)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SheetContextProvider value={{ table: cellsData, tableDispatch: dispatch }}>
      <div>{renderRows(cellsData)}</div>
    </SheetContextProvider>
  );
}

Sheet.propTypes = {
  /**
   * The number of columns of the table
   */
  column: PropTypes.number.isRequired,

  /**
   * The number of rows of the table
   */
  row: PropTypes.number.isRequired,

  /**
   * If enabled, saves the table state to the localStorage
   * Otherwise the table is refreshed on every save
   */
  saveToLocalStorage: PropTypes.bool,
};

Sheet.defaultProps = {
  saveToLocalStorage: true,
  id: "default",
};
