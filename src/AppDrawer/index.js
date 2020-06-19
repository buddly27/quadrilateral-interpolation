import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InputSlider from "./InputSlider.js";


const drawerWidth = 320;


const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    label: {
        minWidth: 60
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
        redWeight,
        greenWeight,
        blueWeight,
        updateRedWeight,
        updateGreenWeight,
        updateBlueWeight
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
                    Weight
                </FormLabel>

                <FormGroup className={classes.formGroup}>
                    <FormControlLabel
                        classes={{label: classes.label}}
                        control={
                            <InputSlider
                                value={redWeight}
                                onChange={(value) => updateRedWeight(value)}
                            />
                        }
                        label="Red"
                        labelPlacement="start"
                    />
                    <FormControlLabel
                        classes={{label: classes.label}}
                        control={
                            <InputSlider
                                value={greenWeight}
                                onChange={(value) => updateGreenWeight(value)}
                            />
                        }
                        label="Green"
                        labelPlacement="start"
                    />
                    <FormControlLabel
                        classes={{label: classes.label}}
                        control={
                            <InputSlider
                                value={blueWeight}
                                onChange={(value) => updateBlueWeight(value)}
                            />
                        }
                        label="Blue"
                        labelPlacement="start"
                    />
                </FormGroup>
            </FormControl>
        </Drawer>
    );
}

