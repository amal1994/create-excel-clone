// eslint-disable-next-line
import React from "react";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import SheetContext from "../../context/sheetContext";

import PropTypes from "prop-types";
import "./cell.css";

/**
 * Cell represents the atomic element of a table
 */
export default function Cell({ row, column, fieldValue }) {
  const [isEditable, setIsEditable] = React.useState(false);
  const sheetContext = React.useContext(SheetContext);
  const makeCellEditable = (e) => {
    setIsEditable(!isEditable);
  };

  const executeFormula = (e) => {
    const value = e.target.value;
    if (value.slice(0, 1) === "=") {
      sheetContext.tableDispatch({
        type: "EXECUTE_FORMULA",
        payload: { row: row, column: column, value: value.slice(1) },
      });
    }
    setIsEditable(!isEditable);
  };

  const setValue = (e) => {
    const value = e.target.value;
    sheetContext.tableDispatch({
      type: "UPDATE_VALUE",
      payload: { row: row, column: column, data: value },
    });

  };

  const sortColumn = (e, data) => {
    sheetContext.tableDispatch({
      type: "SORT_DATA",
      payload: { column: data.id, type: data.type },
    });
  };

  const addNewColumn = (e, data) => {
    sheetContext.tableDispatch({
      type: "ADD_COLUMN",
      payload: { direction: data.direction, column: data.id },
    });
  };

  const addNewRow = (e, data) => {
    sheetContext.tableDispatch({
      type: "ADD_ROW",
      payload: { direction: data.direction, row: data.id },
    });
  };

  if (column === 0) {
    if (row === 0) {
      return <span className="table-cell title">{row}</span>;
    } else {
      return (
        <>
          <ContextMenuTrigger id={`row-${row}`}>
            <span className="table-cell title">{row}</span>
          </ContextMenuTrigger>
          <ContextMenu id={`row-${row}`}>
            <MenuItem data={{ id: row, direction: "up" }} onClick={addNewRow}>
              Insert 1 up
            </MenuItem>
            <MenuItem
              data={{ id: row, direction: "bottom" }}
              onClick={addNewRow}
            >
              Insert 1 down
            </MenuItem>
          </ContextMenu>
        </>
      );
    }
  }
  if (row === 0) {
    return (
      <>
        <ContextMenuTrigger id={`column-${column}`}>
          <span className="table-cell title" role="presentation">
            {column}
          </span>
        </ContextMenuTrigger>
        <ContextMenu id={`column-${column}`}>
          <MenuItem
            data={{ id: column, direction: "left" }}
            onClick={addNewColumn}
          >
            Insert 1 left
          </MenuItem>
          <MenuItem
            data={{ id: column, direction: "right" }}
            onClick={addNewColumn}
          >
            Insert 1 right
          </MenuItem>
          <MenuItem data={{ id: column, type: "asc" }} onClick={sortColumn}>
            Sort (A-Z)
          </MenuItem>
          <MenuItem data={{ id: column, type: "desc" }} onClick={sortColumn}>
            Sort (Z-A)
          </MenuItem>
        </ContextMenu>
      </>
    );
  }

  // if (this.state.selected) {
  //   css.outlineColor = 'lightblue'
  //   css.outlineStyle = 'dotted'
  // }

  if (isEditable) {
    return (
      <input
        type="text"
        value={fieldValue}
        onBlur={executeFormula}
        onChange={setValue}
        autoFocus
        className="table-cell"
      />
    );
  }
  return (
    <span
      onDoubleClick={(e) => makeCellEditable(e)}
      className="table-cell"
      role="presentation"
    >
      {fieldValue}
    </span>
  );
}

Cell.propTypes = {
  /**
   * Function called when the cell changes its value
   */
  onChangedValue: PropTypes.func,

  /**
   * Function called when formula recalculation is needed
   */
  executeFormula: PropTypes.func,

  /**
   * Function called when a cell is refreshed and requires
   * an update of the others
   */
  updateCells: PropTypes.func,

  /**
   * The x coordinates of this cell
   */
  x: PropTypes.number,

  /**
   * The y coordinates of this cell
   */
  y: PropTypes.number,

  /**
   * The value of this cell
   */
  fieldValue: PropTypes.string || PropTypes.number,
};
