import React from "react";

function Time(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        marginBottom: 10
      }}
    >
      <p style={{ marginLeft: 10 }}>
        <span style={{ fontWeight: "bold" }}>{"From "}</span>
        <span>{props.from}</span>
        <span style={{ fontWeight: "bold" }}>{" To "}</span>
        <span>{props.to}</span>
      </p>
    </div>
  );
}

export default Time;
