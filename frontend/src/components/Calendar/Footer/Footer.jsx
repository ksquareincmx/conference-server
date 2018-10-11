import React from 'react';
import './Footer.css';

const FooterView = props => {
  return (
    <div className="footer-container">
      <div className="time-buttons-container">
        <button className="previous-button" onClick={props.onClickButton('previous')}>
          Previus
        </button>
        <button className="next-button" onClick={props.onClickButton('next')}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FooterView;
