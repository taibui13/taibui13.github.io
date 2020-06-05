import React from 'react';
import PropTypes from 'prop-types';
import { validators } from './../../../common/validations';
import './PostalCodeInput.css';

import tickImg from './../../../assets/images/Tick.svg';
import crossImg from './../../../assets/images/cross.svg';
import loadingImg from './../../../assets/images/loading_icon_dark.svg';

const PostalCodeInput = props => {
  const { inputID, isFocus, isValid, isLoading, errorMsg, label, value, onFocus, onBlur, onChange, validator, isNumber, errorMsgList, exampleLabels } = props;
  const focus = isFocus || !isValid || value.length > 0 ? "--focused" : "";
  const visibility = value.length === 6 ? "--visible" : "--invisible";
  const showErrorLabel = isValid ? "" : "textInputLabel--error";
  const errorContainerStyle = isValid ? "" : "postal-code-input-container--error";
  const tick = <img className={`textInputTick${visibility}`} src={tickImg} alt='tick' />;
  const cross = <img className={"textInputTick--visible"} src={crossImg} alt='tick' />;
  const spinner = (
    <img
      className='postal-code--spinner'
      src={loadingImg}
      alt='primary-button'
    />
  );
  let keyCode;
  const handleOnChange = e => {
    let isValid = true;
    let errorMsg = '';
    let val = e.target.value;
    const regexNumber = /^([0-9])+$/;
    if (isNumber && !regexNumber.test(e.target.value) && keyCode !== 8 && keyCode !== 46 ) {
        val = value;
    }

    if (validator && validator.length > 0) {
      let result = validators(validator, val);
      isValid = result.status;
      errorMsg = result.errorMsg !== '' ? errorMsgList[result.errorMsg].replace("{number}", result.number).replace("{secondnumber}", result.secondnumber) : '';
    }

    const data = {
      value: val,
      isValid,
      errorMsg,
      isInitial: false
    };
    onChange(data);
  };

  return (
    <div>
      <div
          id={inputID}
          className={`postal-code-input--container ${errorContainerStyle}`}
          onFocus={onFocus ? onFocus : null}
          onBlur={onBlur ? onBlur : null}
          onKeyDown={e => {
              keyCode = e.keyCode;
          }}
      >
        <div className='postal-code-input--content'>
          <label className={`textInputLabel${focus} ${showErrorLabel}`}>
            {`${label}${isValid ? "" : ` ${errorMsg}`}`}
          </label>
          <input
            value={value}
            onWheel={(e) => e.preventDefault()}
            onChange={handleOnChange}
            type='text'
            maxLength='6'
            className={`postal-code-input--input${focus}`}
          />
        </div>
        {isLoading && spinner}
        {!isLoading && (isValid ? tick : cross)}
      </div>
        {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info${focus}`}>{exampleLabels}</div>}
    </div>
  );
};

PostalCodeInput.propTypes = {
  isFocus: PropTypes.bool,
  isValid: PropTypes.bool,
  isLoading: PropTypes.bool,
  errorMsg: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

PostalCodeInput.defaultProps = {
  isFocus: false,
  isValid: true,
  isLoading: false,
  errorMsg: '',
  label: 'Label',
  value: '',
  isUpperCase: false
};

export default PostalCodeInput;
