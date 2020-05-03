import React from 'react'
import ReactDOM from 'react-dom'
/** routes */
import Routes from './routes/Routes'
/** reset css */
import { CssBaseline } from '@material-ui/core'

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <Routes />
  </React.StrictMode>,
  document.getElementById('root')
)