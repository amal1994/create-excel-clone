// eslint-disable-next-line
import React from 'react'
import PropTypes from 'prop-types'
import Cell from '../Cell'
import './row.css'

const renderCells = (row, column, rowData)=>{
  const cells = []
  const y = row
  for (let x = 0; x < column; x += 1) {
    cells.push(
      <Cell
        key={`${x}-${y}`}
        row={y}
        column={x}
        fieldValue={rowData[x]}
      />
    )
  }
  return cells
}
/**
 * Row manages a single row of the table
 */
export default function Row ({row, column, rowData}) {
  
  return (
    <div className="table-row">
      {renderCells(row,column, rowData)}
    </div>
  )
}

Row.propTypes = {
  /**
   * Function called when a cell of the row changes
   * its value
   */
  handleChangedCell: PropTypes.func,

  /**
   * Function called when a cell of the row needs
   * a formula recalculation
   */
  executeFormula: PropTypes.func,

  /**
   * Function called when a cell is refreshed and requires
   * an update of the others
   */
  updateCells: PropTypes.func,

  /**
   * The number of columns of the table, used to know
   * how many cells to add
   */
  column: PropTypes.number.isRequired,

  /**
   * The identifier value of the row
   */
  row: PropTypes.number.isRequired,

  /**
   * The values of the cells in the row
   */
  rowData: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
}

