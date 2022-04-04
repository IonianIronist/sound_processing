import {
    Box, Button, Typography, CssBaseline, ThemeProvider, createTheme
}from "@mui/material";
import React from 'react'

const theme = createTheme({
    palette: {
        background: {
            default: "#2E3440"
        },
        primary: {
            main: "#E5E9F0"
        },
    },
});


class Recorder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            recording : 0,
            button_value : {0: 'record', 1 : 'stop recording'},
            chunks : [],
        };
        this.handleRecord = this.handleRecord.bind(this);
        this.addChunk = this.addChunk.bind(this);
        this.finishRecording = this.finishRecording.bind(this);
    }
    
    componentDidUpdate(_, prevState){
        if(prevState.recording !== this.state.recording){
            if(this.state.recording === 1){
                if(navigator.mediaDevices){
                    navigator.mediaDevices.getUserMedia({audio: true})
                    .then(stream => {
                        this.recorder = new MediaRecorder(stream);
                        this.recorder.ondataavailable = (e) => this.addChunk(e);
                        this.recorder.onstop = (e) => this.finishRecording(e);
                        this.recorder.start();
                    });
                
                }
                else{
                    alert("Audio Recording Source Required.");
                }
            }
            else if(this.state.recording === 0){
                this.recorder.stop();
            }
        }
    }

    addChunk(e){
        let new_chunks = [...this.state.chunks];
        new_chunks.push(e.data);
        this.setState({chunks: new_chunks});
    }
    
    finishRecording(e){
        let blob = new Blob(this.state.chunks, {'type': 'audio/ogg; codecs=opus'});
        this.setState({chunks : []});
        this.props.saveClip(blob);
    }

    handleRecord(){
        this.setState(oldState => ({recording: (oldState.recording) ? 0 : 1}))
    }


    render(){
        return(
            <Button 
                variant="outlined"
                onClick={this.handleRecord}
            >
                {this.state.button_value[this.state.recording]}
            </Button>
        )
    }
}


class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            src: ''
        }
        this.token = document.getElementsByName("csrfmiddlewaretoken")[0].value;

        this.onSaveClip = this.onSaveClip.bind(this);
        this.onProcessRequest = this.onProcessRequest.bind(this);
    }

    onSaveClip(blob){
        this.setState({
            clip: blob,
            src: URL.createObjectURL(blob),
        });
    }

    onProcessRequest(){
        const headers = new Headers({
            'X-CSRFToken': this.token
        });
        fetch('/api/', {
            method: 'POST',
            headers: headers,
            body: this.state.clip
        })
    } 

    render(){
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Box
                     display="flex"
                     justifyContent="center"
                     alignItems="center"
                     flexDirection="column"
                >
                <Typography variant='h3' color='primary'>This is the main page</Typography>
                <Box>
                    <Recorder saveClip={this.onSaveClip} />
                </Box>
                <Box flexDirection="column">
                    <audio controls src={this.state.src}/>
                    <Button variant="outlined" onClick={this.onProcessRequest}>Submit</Button>
                </Box>
                </Box>
            </ThemeProvider>
        );
    }
}

export default App;
