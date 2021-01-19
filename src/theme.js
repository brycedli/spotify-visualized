import { createMuiTheme }  from '@material-ui/core/styles'
import {grey, lightGreen,purple} from "@material-ui/core/colors";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    //primary: { 500: '#8bc34a' },
    primary: lightGreen,
    secondary: purple
  },
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  },
})
export default theme
