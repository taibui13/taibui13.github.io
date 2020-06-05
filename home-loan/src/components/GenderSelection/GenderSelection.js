import React from 'react';
import PropTypes from 'prop-types';

import './GenderSelection.css';

import nonEditableImg from './../../assets/images/non-editable-icon4.svg';
import iconMale from './../../assets/images/icon-male.svg';
import iconFemale from './../../assets/images/icon-female.svg';

const GenderSelection = props => {
  const { gender, isValid, errorMsg, isReadOnly, onClick, inputID, exampleLabels } = props;
    const readOnlyClass = isReadOnly ? "single-selection-input--readonly" : "";
    const errorContainerStyle =  isValid ? "" : "single-selection-input--error";
    const showErrorLabel = isValid ? "" : "GenderSelectionLabel--error";
    return (
      <div>
          <div id={inputID} className={`single-selection-input--focused ${readOnlyClass} ${errorContainerStyle}`}>
              <div className='single-selection-input-title-container'>
                  <div className={"single-selection-input-title " + showErrorLabel}>
                      {`Gender${isValid ? "" : ` ${errorMsg}`}`}
                  </div>
                  {isReadOnly &&
                      <img
                          className='read-only-single-selection-input--verified-icon'
                          src={nonEditableImg}
                          alt='verified-icon'
                      />}
              </div>

              <div className='single-selection-input-container'>
                  <div
                      className={
                          gender === "M" ? "single-selection-input-button--selected" : "single-selection-input-button"
                      }
                      onClick={() => {
                          onClick("M");
                      }}
                  >
                      <div className='single-selection-input-button-content'>
                          <img
                              src={iconMale}
                              className='single-selection-input-button-icon'
                              alt='gender-male'
                          />
                          Male
                      </div>
                  </div>
                  <div
                      className={
                          gender === "F" ? "single-selection-input-button--selected" : "single-selection-input-button"
                      }
                      onClick={() => {
                          onClick("F");
                      }}
                  >
                      <img
                          src={iconFemale}
                          className='single-selection-input-button-icon'
                          alt='gender-female'
                      />
                      Female
                  </div>
              </div>
          </div>
          {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info--focused`}>{exampleLabels}</div>}
        </div>
    );
};

GenderSelection.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default GenderSelection;
