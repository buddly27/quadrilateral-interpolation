import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Toolbar from "@material-ui/core/Toolbar";
import Canvas from "../Canvas/index.js";
import AppDrawer from "../AppDrawer/index.js";


const useStyles = makeStyles((theme) => ({
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
}));


export default function App() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        redWeight: 50,
        greenWeight: 50,
        blueWeight: 50,
    });

    const {redWeight, greenWeight, blueWeight} = state;

    return (
        <div className="App">
            <AppBar
                position="fixed"
                className={classes.appBar}
            >
                <Toolbar>
                    <Typography variant="h6" noWrap>
                        Color Interpolation
                    </Typography>
                </Toolbar>
            </AppBar>
            <AppDrawer
                redWeight={redWeight}
                greenWeight={greenWeight}
                blueWeight={blueWeight}
                updateRedWeight={
                    (value) => setState({...state, redWeight: value})
                }
                updateGreenWeight={
                    (value) => setState({...state, greenWeight: value})
                }
                updateBlueWeight={
                    (value) => setState({...state, blueWeight: value})
                }
            />
            <Canvas />
        </div>
    );
}

