import React, { Fragment } from "react";
import { AppBar, Toolbar, Grid } from "@material-ui/core/";

function NavBarContainer(props) {
  return (
    <Fragment>
      <AppBar position="static" style={{ boxShadow: "none" }}>
        <Toolbar style={{ backgroundColor: "#3049a1" }}>
          <Grid container direction="row" justify="flex-end">
            {props.children}
          </Grid>
        </Toolbar>
      </AppBar>
    </Fragment>
  );
}

export default NavBarContainer;
