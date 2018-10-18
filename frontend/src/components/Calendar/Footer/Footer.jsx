import React from 'react';
import './Footer.css';

const FooterControlsContainer = props => {
  switch (props.type) {
    case 'day':
      return (
        <div className="time-buttons-container">
          <button className="previous-button" onClick={props.onClickButton('previous')}>
            Previus day
          </button>
          <button className="next-button" onClick={props.onClickButton('next')}>
            Next day
          </button>
        </div>
      );
    case 'work_week':
      return (
        <div className="time-buttons-container">
          <button className="previous-button" onClick={props.onClickButton('previous')}>
            Previus week
          </button>
          <button className="next-button" onClick={props.onClickButton('next')}>
            Next week
          </button>
        </div>
      );
    case 'month':
      return (
        <div className="time-buttons-container">
          <button className="previous-button" onClick={props.onClickButton('previous')}>
            Previus month
          </button>
          <button className="next-button" onClick={props.onClickButton('next')}>
            Next month
          </button>
        </div>
      );
    case 'year':
      return (
        <div className="time-buttons-container">
          <button className="previous-button" onClick={props.onClickButton('previous')}>
            Previus year
          </button>
          <button className="next-button" onClick={props.onClickButton('next')}>
            Next year
          </button>
        </div>
      );
    default:
      return (
        <div className="time-buttons-container">
          <p>KEY ERROR: BUTTONS NOT AVAILABLE</p>
        </div>
      );
  }
};

const FooterView = props => {
  return <div className="footer-container">{FooterControlsContainer(props)}</div>;
};

export default FooterView;
