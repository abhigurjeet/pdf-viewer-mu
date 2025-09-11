import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from "./application";
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00008B',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
export const EmbedPdf=()=>{
    return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    );
}