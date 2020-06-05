import React from 'react';
import PropTypes from 'prop-types';
import { validators } from './../../../common/validations';

import './PrependTextInput.css';
import tickImg from './../../../assets/images/Tick.svg';
import crossImg from './../../../assets/images/cross.svg';

const Icon = props => {
  const visibility = props.isValid ? "" : "--invisible";
  const tick = (
    <img className={`prependTextInputTick${visibility}`} src={tickImg} alt='tick' />
  );
  const cross = <img className={"prependTextInputTick"} src={crossImg} alt='tick' />;

  return props.isValid ? tick : cross;
};

const PrependText = props => {
  const { inputID, onFocus, onBlur, onChange, isFocus, isValid, value, label, prefix, errorMsg, validator, isUpperCase, exampleLabels } = props;
  const focus = isFocus ? "--focused" : "";
  const prependVisibility = focus === "--focused" ? "" : "--invisible";
  const showErrorLabel = isValid ? "" : "prependTextInput--error";
  const errorContainerStyle = isValid ? "" : "PrependTextInputContainer--error";
  const handleOnChange = e => {
    const inputValue = isUpperCase ? e.target.value.toUpperCase() : e.target.value;
    let isValid = true;
    let errorMsg = '';

    if (validator && validator.length > 0) {
      let result = validators(validator, inputValue);
      isValid = result.status;
      errorMsg = result.errorMsg;
    }

    const data = {
      value: inputValue,
      isValid,
      errorMsg,
      isInitial: false
    };
    onChange(data);
  };
    return (
      <div>
        <div className={`PrependTextInputContainer ${errorContainerStyle}`} id={inputID}>
            <label className={`prependTextInputLabel${focus} ${showErrorLabel}`}>
                {`${label}${isValid ? "" : ` ${errorMsg}`}`}
            </label>
            <div className={`prependTextInputText${prependVisibility}`}>
                {prefix} -{" "}
            </div>
            <input
                onFocus={onFocus ? onFocus : null}
                onBlur={onBlur ? onBlur : null}
                value={value}
                onChange={handleOnChange}
                type='text'
                className={`prependTextInput${focus}`}
            />
            <Icon isValid={isValid} />
        </div>
        {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info${focus}`}>{exampleLabels}</div>}
      </div>
    );
};

PrependText.propTypes = {
  isFocus: PropTypes.bool,
  isValid: PropTypes.bool,
  errorMsg: PropTypes.string,
  prefix: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

PrependText.defaultProps = {
  isFocus: false,
  isValid: true,
  errorMsg: '',
  prefix: '',
  label: 'Label',
  value: '',
  isUpperCase: false
};

export default PrependText;
