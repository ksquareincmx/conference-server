import React from "react";
import "components/Calendar/Header/Header.css";

const HeaderView = props => {
  return (
    <div className="header-container">
      <div className="header-view-selector">
        <div className="veiew-buttons-container">
          <button
            className="view-selector-button"
            onClick={props.onClickViewButton("day")}
            style={{ borderRadius: "20px 0px 0px 20px" }}
          >
            Day
          </button>
          <button
            className="view-selector-button"
            onClick={props.onClickViewButton("work_week")}
          >
            Week
          </button>
          <button
            className="view-selector-button"
            onClick={props.onClickViewButton("month")}
          >
            Month
          </button>
          <button
            className="view-selector-button"
            onClick={props.onClickViewButton("year")}
            style={{ borderRadius: "0px 20px 20px 0px" }}
          >
            Year
          </button>
        </div>
      </div>
      <div className="header-bottom-side">
        {props.headerDateContainer}
        <div className="header-bottom-side-separator"> </div>
        <div className="header-create-meeting">
          <button className="create-meating-button">CREATE MEETING</button>
        </div>
      </div>
    </div>
  );
};

export default HeaderView;
