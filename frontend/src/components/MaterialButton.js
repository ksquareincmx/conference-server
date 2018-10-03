import React from 'react';
import Button from '@material-ui/core/Button';

function MaterialButton(props) {

  const styles = {
    button: {
      color: 'white',
      fontSize: 13,
      fontFamily: 'roboto',
      backgroundColor: props.colorButton,
      marginRight: 20,
      marginBottom: 20,
    }
  };


  return (
    <Button
      style={styles.button}
      variant="contained" >

      {props.textButton}
    </Button>)
};


export default (MaterialButton);