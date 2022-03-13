import {Typography, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import React from 'react'

const theme = createTheme({
    palette: {
        background: {
            default: "#2E3440"
        },
        primary: {
            main: "#E5E9F0"
        },
    }
})


class App extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Typography variant='h1' color='primary'>This is the main page</Typography>
            </ThemeProvider>
        );
    }
}

export default App;
