import React from 'react';
import PropTypes from 'prop-types';
import { validators } from './../../../common/validations';
import './EditableTextInput.css';

import tickImg from './../../../assets/images/Tick.svg';
import crossImg from './../../../assets/images/cross.svg';

const Icon = props => {
  const visibility = props.isValid ? "--visible" : "--invisible";
  const tick = <img className={`textInputTick${visibility}`} src={tickImg} alt='tick' />;
  const cross = <img className={"textInputTick--visible"} src={crossImg} alt='tick' />;

  return props.isValid ? tick : cross;
};

const EditableTextInput = props => {
  const { types, inputID, isFocus, isValid, errorMsg, label, value, onFocus, onBlur, onChange, validator, isUpperCase, isDateFormat, isDisabled, isNumber, isDecimal, isMonth, errorMsgList, isOnlyYYYY, isMinOne, exampleLabels, isOptional, optionalText } = props;
  const focus = isFocus || value.length > 0 || !isValid ? "--focused" : "";
  const showErrorLabel = isValid ? "" : "textInputLabel--error";
  const errorContainerStyle =  isValid ? "" : "textInputLabel-container--error";
  let keyCode;

  const handleOnChange = e => {
    const regex = /(^\d{2}$)|(^\d{2}\/\d{2}$)/;
    const dateFormatRegex = /(^\d{1,2}$)|(^\d{2}\/$)|(^\d{2}\/\d{1,2}$)|(^\d{2}\/\d{2}\/$)|(^\d{2}\/\d{2}\/\d{1,4}$)/;
    const regexNumber = /^([0-9])+$/;
    const monthRangeRegex = /^([0-9]|10|11)$|^(0[1-9]|1[0-1])$/;
    const twoDecimalRegex= /^\d+(\.\d{0,2})?$/;
    const onlyYYYY= /^(\d{1,4})?$/;
    const checkForZero = /^(?:0)/;
    let val = (isDateFormat && regex.test(e.target.value) && keyCode !== 8 && keyCode !== 229 && keyCode !== 46)
      ? `${e.target.value}${"/"}`
      : e.target.value;

    if (isMinOne && e.target.value && checkForZero.test(e.target.value)) {
        val = value
    }

    if (isDateFormat && e.target.value && !dateFormatRegex.test(e.target.value)) {
        val = value;
    }

    if (isNumber && !regexNumber.test(e.target.value) && keyCode !== 8 && keyCode !== 229 && keyCode !== 46) {
        val = value;
    }

    if (isMonth && !monthRangeRegex.test(e.target.value) && keyCode !== 8 && keyCode !== 46){
        val = e.target.value.substr(0,e.target.value.length -1);
      }

    if (isDecimal && !twoDecimalRegex.test(e.target.value) && keyCode !== 8 && keyCode !== 46){
        val = e.target.value.substr(0,e.target.value.length -1);
    } 
    if(isOnlyYYYY && !onlyYYYY.test(e.target.value) && keyCode !== 8 && keyCode !== 46){
       val = e.target.value.substr(0,e.target.value.length -1);
    }

    const inputValue = isUpperCase ? val.toUpperCase() : val;
    let isValid = true;
    let errorMsg = '';
    if (validator && validator.length > 0) {
      let result = validators(validator, inputValue);
      isValid = result.status;
      errorMsg = result.errorMsg !== '' ? errorMsgList[result.errorMsg].replace("{number}", result.number).replace("{secondnumber}", result.secondnumber) : '';
    }

    const data = {
      value: inputValue,
      isValid,
      errorMsg,
      isInitial: false
    };
    onChange(data);
  }

  return (
    <div>
      <div
        id={inputID}
        className={`textInputContainer ${errorContainerStyle}`}
        onFocus={onFocus ? onFocus : null}
        onBlur={onBlur ? onBlur : null}
        onKeyDown={e => {
            keyCode = e.keyCode;
        }}
      >
        {isOptional && <div className={`optional-text${focus}`}> {optionalText} </div>}
        <div className='textInputContent'>
          <label className={`textInputLabel${focus} ${showErrorLabel}`}>
              {`${label}${isValid ? "" : ` ${errorMsg}`}`}
          </label>
          <input
            disabled={isDisabled}
            onWheel={(e) => e.preventDefault()}
            value={value}
            onKeyDown={e => {
                keyCode = e.keyCode;
            }}
            onChange={handleOnChange}
            type={types ? types : 'text'}
            className={`textInput${focus}`}
          />
          {value && <Icon isValid={isValid} />}
        </div>
      </div>
      {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info${focus}`}>{exampleLabels}</div>}
    </div>
  );
};

EditableTextInput.propTypes = {
  isFocus: PropTypes.bool,
  isValid: PropTypes.bool,
  isDisabled: PropTypes.bool,
  errorMsg: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

EditableTextInput.defaultProps = {
  isFocus: false,
  isValid: true,
  errorMsg: '',
  label: 'Label',
  value: '',
  isUpperCase: false,
  isDateFormat: false,
  isDisabled: false,
  isOptional: false
};

export default EditableTextInput;
