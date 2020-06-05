import React from 'react';
import PropTypes from 'prop-types';

import './MultipleButtonOption.css';

const uniqueId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

const getDescriptionByCode = (code, list) => {
  for (var i=0; i<list.length; i++) {
    if (list[i] === code) return true;
  }

  return false;
}

const MultipleButtonOption = props => {
  const { isReadOnly, isValid, errorMsg, label, options, value, onClick, onClickDelete, inputID, lessThanThreecolumn, exampleLabels} = props;

  const showErrorLabel = isValid || value.length > 0 ? "" : "multiple-buttonOptionLabel--error";
  const errorContainerStyle =  isValid || value.length > 0  ? "" : "multiple-buttonOptionLabel-container--error";
  const isLessThanThreecolumn = lessThanThreecolumn ? "multiple-buttonOptionLabel-two-column" : ""
  return (
    <div>
      <div id={inputID ? inputID : uniqueId()} className={`multiple-option-button-container ${errorContainerStyle}`}>
        <div  className={`multiple-option-button-label ${showErrorLabel}`}>
          {`${label}${isValid ? "" : ` ${errorMsg}`}`}
        </div>
        <div className='multiple-option-button-row'>
          {
            options.map((option, index) => {
              const selected = getDescriptionByCode(option.value, value) ? 'multiple-option-button-item--selected' : '';
              return (
                <div key={index + option.value}
                  onClick={() =>
                      {
                      if(!getDescriptionByCode(option.value, value)){
                        !isReadOnly && onClick && onClick(option)
                      } else {
                        !isReadOnly && onClickDelete && onClickDelete(option)
                      }
                    }
                  }
                  className={`multiple-option-button-item ${selected} ${isLessThanThreecolumn}`}>
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

MultipleButtonOption.propTypes = {
  isReadOnly: PropTypes.bool,
  isValid: PropTypes.bool,
  errorMsg: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired
};

MultipleButtonOption.defaultProps = {
  isReadOnly: false,
  isValid: true,
  lessThanThreecolumn: false
};

export default MultipleButtonOption;
