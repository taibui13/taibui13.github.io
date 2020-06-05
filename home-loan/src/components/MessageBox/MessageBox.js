import React from 'react';
import './MessageBox.css';

const MessageBox = props => {
  const {img, title, subtitle, description} = props;
  return(
    <div className='messageBox-container'>
      {img &&
        <img
          className='messageBox-imageAlignment'
          src={img}
          alt='icon'
        />
      }
      <div className='messageBox-title'>{title}</div>
      <div className='messageBox-subtitle' dangerouslySetInnerHTML={{__html: subtitle}} />
      <div className='messageBox-information-container'>
        <div className='messageBox-description' dangerouslySetInnerHTML={{__html: description}} />
      </div>
    </div>
  );
}

export default MessageBox;
