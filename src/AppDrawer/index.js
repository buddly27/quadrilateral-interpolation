import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";


const drawerWidth = 320;


const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    label: {
        minWidth: 60
    },
    value: {
        minWidth: 30
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
    const {weights, updateWeight} = props;

    const priorities = {white: 0, red: 1, green: 2, blue: 3};
    const colors = Object.keys(weights).sort(
        (a, b) => priorities[a] || 99 - priorities[b] || 99
    );

    const minimum = 0.1;
    const maximum = 2;
    const step = 0.1;

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
                    {
                        colors.map((color, index) => {
                            const value = weights[color] || 0;
                            const onChange = (event, value) =>
                                updateWeight(color, value);

                            return (
                                <FormControlLabel
                                    classes={{label: classes.label}}
                                    control={
                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                        >
                                            <Grid item xs>
                                                <Slider
                                                    value={value}
                                                    min={minimum}
                                                    max={maximum}
                                                    step={step}
                                                    onChange={onChange}
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Typography
                                                    className={classes.value}
                                                >
                                                    {value}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    }
                                    label={color}
                                    labelPlacement="start"
                                    key={index}
                                />
                            )
                        })
                    }
                </FormGroup>
            </FormControl>
        </Drawer>
    );
}
