import React from 'react'
import NavLeftSide from './LeftSide'
import NavRightSide from './RightSide'
import NavBarContainer from './NavBarContainer';
import MenuIcon from '@material-ui/icons/Menu';
import { Typography, IconButton, Button } from '@material-ui/core/';
import AccountCircle from '@material-ui/icons/AccountCircle';


function NavBar(props) {
  return (
    <NavBarContainer>
      <NavLeftSide>
        <Button variant="fab" style={{ backgroundColor: "#7CCE22" }} aria-label="Edit" mini >
          <MenuIcon style={{ fontSize: 40, color: '#467611' }} />
        </Button>
      </NavLeftSide>

      <NavRightSide>
        <Typography style={{ color: 'black', fontFamily: 'roboto', fontSize: 20 }}>Roberto Cervera</Typography>
        <IconButton color="secondary" aria-label="Menu"  >
          <AccountCircle style={{ fontSize: 40, color: '#736D6D' }} />
        </IconButton>
      </NavRightSide>
    </NavBarContainer>
  );
};

export default NavBar;