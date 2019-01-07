import React from "react";

function Button(props) {
  let styles = getStyles();

  styles.button.backgroundColor =
    props.color === "green" ? "#7ED321" : "#4A90E2";

  return (
    <div style={styles.buttonGrid}>
      <div style={styles.button}>{props.text}</div>
    </div>
  );
}

let getStyles = () => {
  return {
    button: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
      height: 30,
      width: 160,
      backgroundColor: "#7ED321",
      textAlign: "center",
      color: "white"
    },

    buttonGrid: {
      display: "flex",
      justifyContent: "center"
    }
  };
};

export default Button;
