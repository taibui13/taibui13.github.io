import React from 'react';
import PropTypes from 'prop-types';
import './ToggleButton.css';

import tickImg from './../../../assets/images/tick_white.svg';
import crossImg from './../../../assets/images/cross-white.svg';

const ToggleButton = props => {
  const { isToggled, onClick } = props;
  const toggleClass = !isToggled ? "" : "--toggle";

  return (
    <div
      className={`switch-bg${toggleClass}`}
      onClick={onClick ? onClick : null}
    >
      <img className='toggle-button--icon-tick' src={tickImg} alt='tick' />
      <img className='toggle-button--icon-cross' src={crossImg} alt='cross' />
      <div className={`switch${toggleClass}`} />
    </div>
  );
};

ToggleButton.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

export default ToggleButton;
