import React from "react";
import NavLeftSide from "components/NavBar/LeftSide";
import NavRightSide from "components/NavBar/RightSide";
import NavBarContainer from "components/NavBar/NavBarContainer";
import MenuIcon from "@material-ui/icons/Menu";
import { Typography, IconButton, Button } from "@material-ui/core/";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

function NavBar(props) {
  return (
    <NavBarContainer>
      <NavLeftSide>
        <Button
          variant="fab"
          style={{ backgroundColor: "#7CCE22" }}
          aria-label="Edit"
          mini
          component={Link}
          to="/dashboard"
        >
          <MenuIcon style={{ fontSize: 40, color: "#467611" }} />
        </Button>
      </NavLeftSide>

      <NavRightSide>
        <Typography
          style={{ color: "black", fontFamily: "roboto", fontSize: 20 }}
        >
          {props.userName}
        </Typography>

        <IconButton color="secondary" aria-label="Menu">
          <AccountCircle style={{ fontSize: 40, color: "#736D6D" }} />
        </IconButton>
      </NavRightSide>
    </NavBarContainer>
  );
}

export default NavBar;
