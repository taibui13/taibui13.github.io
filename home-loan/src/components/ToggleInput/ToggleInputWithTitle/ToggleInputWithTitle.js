import React from 'react';
import PropTypes from 'prop-types';
import ToggleButton from './../ToggleButton/ToggleButton';

import './ToggleInputWithTitle.css';

const ToggleInputWithTitle = props => {
  const { isValid, errorMsg, description, title, isToggled, descriptionPosition, onClick, inputID, exampleLabels } = props;
  const errorContainerStyle =  isValid ? "" : "toggle-input-container--error";

  return (
    <div>
      <div id={inputID} className={`toggle-input-with-title--container  ${errorContainerStyle}`}>
        {descriptionPosition === 'above' &&
          <div className='toggle-input-with-title--description' style={{width: '100%'}} dangerouslySetInnerHTML={{__html: description}} />
        }
        <div className='toggle-input-with-title-wrapper'>
          <div className='toggle-input-with-title--text-container' >
            <div className='toggle-input-with-title--title'>
              <div className='toggle-input-with-title--title' dangerouslySetInnerHTML={{__html: title}}  />
               {!isValid && <span className='toggle-input--error'>{`${errorMsg}`}</span>}
            </div>
            {descriptionPosition === 'below' &&
              <div className='toggle-input-with-title--description' dangerouslySetInnerHTML={{__html: description}} />
            }
          </div>
          <div className='toggle-input-with-title--button-container'>
            <ToggleButton
              onClick={onClick ? onClick : null}
              isToggled={isToggled}
            />
          </div>
        </div>
      </div>
      {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info--focused`}>{exampleLabels}</div>}
    </div>
  );
};

ToggleInputWithTitle.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  isToggled: PropTypes.bool.isRequired,
  onClick: PropTypes.func
};

ToggleInputWithTitle.defaultProps = {
  title: '',
  description: '',
  descriptionPosition: 'below'
};

export default ToggleInputWithTitle;
