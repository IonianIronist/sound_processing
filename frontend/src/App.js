import {
    Box, Button, Typography, CssBaseline, ThemeProvider, createTheme,
    Stack
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
    margin: '2em'
});


function Visualizer(props){

    const canvasRef = React.useRef(null);
    
    const draw = (ctx) => {
        ctx.fillStyle = '#2E3440'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#E5E9F0';

        const sliceWidth = ctx.canvas.width * 2.0 / 1024;
        let x = 0;

        ctx.beginPath();
        for(var i = 0; i < 1024; i++) {
            const v = props.data[i]/128.0;
            const y = v * ctx.canvas.height/2;

            if(i === 0)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);

            x += sliceWidth;
        }

        ctx.lineTo(ctx.canvas.width, ctx.canvas.height/2);
        ctx.stroke();
        };
    
    React.useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        draw(context);
    }, [draw])

    return(
        <canvas ref={canvasRef}></canvas>
    )
}


class Recorder extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            recording : false,
            button_value : {0: 'record', 1 : 'stop recording'},
            chunks : [],
            binary_audio : [],
            data_array: []
        };
        this.handleRecord = this.handleRecord.bind(this);
        this.addChunk = this.addChunk.bind(this);
        this.finishRecording = this.finishRecording.bind(this);
        this.displayAudio = this.displayAudio.bind(this);
    }
    
    componentDidUpdate(_, prevState){
        if(prevState.recording !== this.state.recording){
            if(this.state.recording){
                if(navigator.mediaDevices){
                    navigator.mediaDevices.getUserMedia({audio: true})
                    .then(stream => {
                        this.recorder = new MediaRecorder(stream);
                        this.audioCtx = new AudioContext();
                        this.analyzer = this.audioCtx.createAnalyser();
                        this.src = this.audioCtx.createMediaStreamSource(stream);
                        this.src.connect(this.analyzer);
                        this.analyzer.fftSize = 2048;
                        this.buffer_length = this.analyzer.frequencyBinCount;
                        this.displayAudio();
                        this.recorder.ondataavailable = (e) => this.addChunk(e);
                        this.recorder.onstop = (e) => this.finishRecording(e);
                        this.recorder.start();
                    });
                
                }
                else{
                    alert("Audio Recording Source Required.");
                }
            }
            else{
                this.recorder.stop();
            }
        }
    }
    
    displayAudio(){
        let data_array = new Uint8Array(this.buffer_length);
        this.analyzer.getByteTimeDomainData(data_array);
        this.setState({data_array: data_array})
        if(this.state.recording){
            setTimeout(this.displayAudio, 100);
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
        this.setState(oldState => ({recording: !oldState.recording}))
    }


    render(){
        return(
            <Box display='flex' flexDirection='column'>
                <Button 
                    variant="outlined"
                    onClick={this.handleRecord}
                >
                    {(this.state.recording)? 'stop recording' : 'record'}
                </Button>
                {
                    this.state.recording &&
                    <Visualizer data={this.state.data_array}/>
                }
            </Box>
        )
    }
}


class App extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            src: ''
        }

        this.token = document.getElementsByName("csrfmiddlewaretoken")[0]?.value;

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
                <Stack>
                    <audio controls src={this.state.src}/>
                    <Button variant="outlined" onClick={this.onProcessRequest}>Submit</Button>
                </Stack>
                </Box>
            </ThemeProvider>
        );
    }
}

export default App;
