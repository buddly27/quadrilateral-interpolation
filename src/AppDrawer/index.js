import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Checkbox from "@material-ui/core/Checkbox";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";


const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    formControl: {
        margin: theme.spacing(2),
    },
    formGroup: {
        margin: theme.spacing(2),
    }
}));


export default function AppDrawer(props) {
    const classes = useStyles();
    const {
        gridVisible,
        drawGrid,
    } = props;

    return (
        <Drawer
            className={classes.drawer}
            classes={{paper: classes.drawerPaper}}
            variant="permanent"
            open
        >
            <Toolbar/>

            <FormControl
                component="fieldset"
                className={classes.formControl}
            >

                <FormLabel component="legend">
                    Settings
                </FormLabel>

                <FormGroup className={classes.formGroup}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={gridVisible}
                                color="primary"
                                onChange={
                                    (event) => drawGrid(event.target.checked)
                                }
                            />
                        }
                        label="Display Grid"
                    />
                </FormGroup>
            </FormControl>
        </Drawer>
    );
}

