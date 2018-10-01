import React from './react'


function NavBarPage(props) {
  return (
    <div>
      <NavBar>
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
      </NavBar>
    </div>
  );
};

export default NavBarPage;