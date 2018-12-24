import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    marginBottom: 18
  }
});

const changedDateHandler = (event, setDate) => {
  setDate(event.target.value);
};

function DatePickers(props) {
  const { classes } = props;

  return (
    <form className={classes.container} noValidate>
      <TextField
        id="date"
        label="date"
        type="date"
        value={props.date}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        disabled={props.disabled}
        onChange={event => changedDateHandler(event, props.setDate)}
      />
    </form>
  );
}

DatePickers.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(DatePickers);
