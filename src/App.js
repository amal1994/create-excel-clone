import React from 'react'
import Sheet from './components/Sheet'
import './App.css'

const App = () =>
  (<div className='main-content'>
    <h1> Spreadsheet </h1>
    <Sheet row={4} column={4} />
  </div>)

export default App
