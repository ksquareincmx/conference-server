import React from "react";
import NavRightSide from "./RightSide";
import NavBarContainer from "./NavBarContainer";
import { Typography, IconButton, Avatar } from "@material-ui/core/";
import AccountCircle from "@material-ui/icons/AccountCircle";
import NavBarMenu from "./NavBarMenu";
import {startCase, toLower} from "lodash/fp"

const styles = {
  navLeftSideButton: {
    backgroundColor: "#7CCE22"
  },
  menuIcon: {
    fontSize: 40,
    color: "#467611"
  },
  typography: {
    color: "white",
    fontFamily: "Verdana, Geneva, sans-serif",
    fontSize: 20
  },
  accountCircle: {
    fontSize: 50
  },
  avatar: {
    color: "#c4c6c6",
    backgroundColor: "#969696"
  }
};

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null
    }
  }

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render(){

    const name = startCase(toLower(this.props.userName));
    const menuProps = {
        anchorEl: this.state.anchorEl,
        open: Boolean(this.state.anchorEl),
    };

    return (
      <NavBarContainer>
        <NavRightSide>
          <Typography style={styles.typography}>{name}</Typography>
          <IconButton 
            aria-label="Menu"
            aria-owns={menuProps.open ? 'menu-appbar' : undefined}
            aria-haspopup="true"
            onClick={this.handleMenu}
          >
            <Avatar style={styles.avatar}>
              <AccountCircle style={styles.accountCircle} />
            </Avatar>
          </IconButton>
          <NavBarMenu  {...menuProps} handleClose={this.handleClose}/>
        </NavRightSide>
      </NavBarContainer>
    );
  }

}

export default NavBar;
