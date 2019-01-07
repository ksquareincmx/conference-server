import React from "react";

function CardContainer(props) {
  console.log(props);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: 300,
        width: 230,
        backgroundColor: "#EAE8E8"
      }}
    >
      {props.children}
    </div>
  );
}

export default CardContainer;
