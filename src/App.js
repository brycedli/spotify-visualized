
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

import Welcome from './pages/Welcome'
import VisualizePage from './pages/Visualize'
import About from './pages/About'
import Contact from './pages/Contact'

function App() {

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <div className="App" >
      <Router>
        <Switch>
          <Route exact path="/" component={Welcome}></Route>
          <Route path="/visualize" component={VisualizePage}></Route>
          <Route exact path="/contact" component={Contact}></Route>
          <Route path="/about" component={About}></Route>
        </Switch>
      </Router>
    </div>
  </ThemeProvider>
  );
}

export default App;
