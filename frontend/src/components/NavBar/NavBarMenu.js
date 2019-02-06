import React from "react";
import { Menu, MenuItem } from "@material-ui/core/";
import { Link } from "react-router-dom";

function NavBarMenu (props) {
    return(
        <Menu
        id="menu-appbar"
        anchorEl={props.anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={props.open}
        onClose={props.handleClose}
      >
        <MenuItem onClick={props.handleClose}>Profile</MenuItem>
        <MenuItem 
          onClick={props.handleClose} 
          component={Link}
          to="/dashboard"
        >
          Dashboard
        </MenuItem>
        <hr />
        <MenuItem onClick={props.handleClose}>Log Out</MenuItem>
      </Menu>
    );
}

export default NavBarMenu