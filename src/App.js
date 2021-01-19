
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import theme from "./theme";

// import logo from './logo.svg';
// import './App.css';

import LoginPage from './pages/Login'
import VisualizePage from './pages/Visualize'

function App() {

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div className="App" >
      <Router>
        <Switch>
          <Route path="/">
            <LoginPage/>
          </Route>
          <Route path="/visualize">
            <VisualizePage/>
          </Route>
        </Switch>
      </Router>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  </ThemeProvider>
  );
}

export default App;
