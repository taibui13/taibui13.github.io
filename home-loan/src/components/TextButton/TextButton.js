import React from 'react';

import './TextButton.css';


const TextButton = props => {
  const { label, icon, style, onClick } = props;

  return (
    <div onClick={() => onClick ? onClick() : null} className='uob-text-button-container'>
      <label className='uob-text-button-label' style={style ? style : null} >{label}</label>
      {icon && <img src={icon} alt='icon' className='uob-text-button-icon'/>}
    </div>
  );
}

export default TextButton;
