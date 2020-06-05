import React from 'react';
import PropTypes from 'prop-types';

import './ButtonOption.css';

const uniqueId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

const ButtonOption = props => {
  const { isReadOnly, isValid, errorMsg, label, options, value, onClick, exampleLabels, inputID } = props;

  const showErrorLabel = isValid ? "" : "buttonOptionLabel--error";
  const errorContainerStyle =  isValid ? "" : "buttonOptionLabel-container--error";

  return (
    <div>
      <div id={inputID ? inputID : uniqueId()} className={`option-button-container ${errorContainerStyle}`}>
        <div  className={`option-button-label ${showErrorLabel}`}>
          {`${label}${isValid ? "" : ` ${errorMsg}`}`}
        </div>
        <div className='option-button-row'>
          {
            options.map((option, index) => {
              const selected = option.value === value ? 'option-button-item--selected' : '';
              return (
                <div key={index + option.description} onClick={() => !isReadOnly && onClick && onClick(option)} className={`option-button-item ${selected}`}>
                  {option.description}
                </div>
              )
            })
          }
        </div>
      </div>
      {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info--focused`}>{exampleLabels}</div>}
    </div>
  );
};

ButtonOption.propTypes = {
  isReadOnly: PropTypes.bool,
  isValid: PropTypes.bool,
  errorMsg: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
};

ButtonOption.defaultProps = {
  isReadOnly: false,
  isValid: true
};

export default ButtonOption;
