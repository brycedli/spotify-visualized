import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import LoginPage from './pages/Login'
import VisualizePage from './pages/Visualize'

function App() {

  return (
    <div className="App">
      
      <Router>
        <Switch>
          <Route path="/">
            <LoginPage/>
            <VisualizePage/>

          </Route>
          <Route path="/visualize">
            <VisualizePage/>
          </Route>
        </Switch>
      </Router>
      <header className="App-header">
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
      </header>
    </div>
  );
}

export default App;
