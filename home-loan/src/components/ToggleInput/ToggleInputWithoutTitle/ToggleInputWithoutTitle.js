import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from './../ToggleButton/ToggleButton';

import './ToggleInputWithoutTitle.css';

const ToggleInputWithoutTitle = props => {
  const { isValid, errorMsg, description, isToggled, onClick, isDisabled, exampleLabels, inputID} = props;
  const errorContainerStyle =  isValid ? "" : "toggle-input-container--error";

  return (
    <div>
      <div id={inputID} className={`toggle-input--container ${errorContainerStyle}`}>
        <div className='toggle-input--text-container'>
          <div className='toggle-input--description'>
            <div dangerouslySetInnerHTML={{__html: description}} />
            {!isValid && <span className='toggle-input--error'>{`${errorMsg}`}</span>}
          </div>
        </div>
        <div className='toggle-input--button-container'>
          <ToggleButton
            onClick={ () => {
                if(isDisabled){
                  return null;
                }
                return onClick && onClick();
              }
            }
            isToggled={isToggled}
          />
        </div>
      </div>
      {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info--focused`}>{exampleLabels}</div>}
    </div>
  );
}

ToggleInputWithoutTitle.propTypes = {
  isToggled: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

ToggleInputWithoutTitle.defaultProps = {
  isValid: true,
  errorMsg: '',
  isDisabled: false
};

export default ToggleInputWithoutTitle;
