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
        gridVisible: true,
    });

    const {gridVisible} = state;

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
                gridVisible={gridVisible}
                drawGrid={(value) => setState({...state, gridVisible: value})}
            />
            <Canvas
                gridVisible={gridVisible}
            />
        </div>
    );
}

