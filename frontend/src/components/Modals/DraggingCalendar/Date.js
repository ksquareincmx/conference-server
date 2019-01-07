import React from "react";

function Date(props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginLeft: 10,
          marginRight: 10
        }}
      >
        <div style={{ fontWeight: "bold" }}>{"Day"}</div>
        <div style={{ fontWeight: "bold" }}>{"Month"}</div>
        <div style={{ fontWeight: "bold" }}>{"Year"}</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
          marginLeft: 10,
          marginRight: 10
        }}
      >
        <div>{"10"}</div>
        <div>{"01"}</div>
        <div>{"1996"}</div>
      </div>
    </div>
  );
}

export default Date;
