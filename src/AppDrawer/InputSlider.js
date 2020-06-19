import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import Slider from "@material-ui/core/Slider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";


const useStyles = makeStyles(() => ({
    label: {
        minWidth: 30
    }
}));


export default function InputSlider(props) {
    const {value, onChange} = props;
    const classes = useStyles();

    const minimum = 0.1;
    const maximum = 100;
    const step = 1;

    return (
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
                    onChange={(event, value) => onChange(value)}
                />
            </Grid>
            <Grid item>
                <Typography className={classes.label}>
                    {value}
                </Typography>
            </Grid>
        </Grid>
    );
}

