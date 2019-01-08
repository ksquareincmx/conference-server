import React from "react";
import getButtonStyles from "./Styles";

function Button(props) {
  let styles = getButtonStyles(props.color);

  return (
    <div style={styles.buttonGrid}>
      <div style={styles.button}>{props.text}</div>
    </div>
  );
}

export default Button;
