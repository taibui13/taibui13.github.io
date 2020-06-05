import React from 'react';
import PropTypes from 'prop-types';
import { AsYouType } from 'libphonenumber-js';
import { validators } from './../../../common/validations';
import './PhoneInput.css';

import tickImg from './../../../assets/images/Tick.svg';
import crossImg from './../../../assets/images/cross.svg';
import nonEditableImg from './../../../assets/images/non-editable-icon4.svg';
const getVisibility = isValid => (isValid ? "" : "--invisible");
const getReadOnlyClass = isReadOnly => (isReadOnly ? "PhoneInputContainer--readOnly" : "");
const getFocus = (isFocus, inputValue, isValid) => isFocus || inputValue.length > 0 || !isValid ? "--focused" : "";

const PhoneInput = props => {
  const {
    inputID,
    isFocus,
    isValid,
    isReadOnly,
    errorMsg,
    label,
    value,
    onFocus,
    onBlur,
    onChange,
    style,
    validator,
    isUpperCase,
    isDisabled,
    isSGPPhoneNumber,
    errorMsgList,
    countryCode
  } = props;
  const focus = getFocus(isFocus, value, isValid);
  const visibility = getVisibility(isValid);
  const showErrorLabel = isValid ? "" : "phoneInputLabel--error";
  const readOnlyClass = getReadOnlyClass(isReadOnly);
  const errorContainerStyle = isValid ? "" : "PhoneInputContainer--error";
  const tick = (
    value.length > 3 ?
    <img className={`phoneInputTick${visibility}`} src={tickImg} alt='tick' />
    :
    ""
  );
  const cross = <img className={"phoneInputTick"} src={crossImg} alt='tick' />;
  const validPic = isValid ? tick : cross;

  //const formatPhoneNo = no => new asYouType().input(no);

  const country = number => {
    const formatter = new AsYouType();
    formatter.input(number);
    return formatter.country;
  };

  const formatNumber = number => {
    const formatter = new AsYouType('');
    return formatter.input(number);
  };

  const SGformatNumber = number => {
    const formatter = new AsYouType('SG');
    return formatter.input(number);
  };

  const getFlagIcon = (countryCode) => {
    if (countryCode) {
      return require(`./../../../assets/images/countriesFlags/${countryName.toLowerCase()}.svg`);
    } else {
      return "";
    }
  }

  const countryName = country(countryCode);
  const countryFlagPath = countryName ? require(`./../../../assets/images/countriesFlags/${countryName.toLowerCase()}.svg`) : null;
  const flagIcon =  getFlagIcon(countryName);

  const handleOnChange = e => {
    const inputValue = isUpperCase ? e.target.value.toUpperCase() : e.target.value;
    let isValid = true;
    let errorMsg = '';

    if (validator && validator.length > 0) {
      let result = validators(validator, inputValue);
      isValid = result.status;
      errorMsg = result.errorMsg !== '' && errorMsgList && errorMsgList[result.errorMsg] ? errorMsgList[result.errorMsg].replace("{number}", result.number).replace("{secondnumber}", result.secondnumber) : '';
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
    <div className='PhoneInputWrap' id={inputID}>
      <div className={`PhoneInputContainer ${readOnlyClass} ${errorContainerStyle}`}>
        {!isSGPPhoneNumber && countryFlagPath && <img className={"phoneInputFlag"} src={countryFlagPath} alt='flag' />}
  {!isReadOnly && isSGPPhoneNumber && <div> {flagIcon && <img className={"phoneInputFlag"} src={flagIcon} alt='flag' />} <div className={"phoneInputFlag--number"} >{countryCode || "+65"}</div></div>}
        <label className={`phoneInputLabel${focus} ${showErrorLabel}`}>
          {`${label}${isValid ? "" : ` ${errorMsg}`}`}
        </label>
        <input
          onFocus={onFocus ? onFocus : null}
          onBlur={onBlur ? onBlur : null}
          disabled={isDisabled || isReadOnly}
          value={isSGPPhoneNumber ? SGformatNumber(value) : formatNumber(value)}
          onChange={handleOnChange}
          type='tel'
          className={`phoneInput${focus}`}
          style={style ? style : null}
        />
        {isReadOnly
          ? <img
              className='phoneInputTick--verified'
              src={nonEditableImg}
              alt='dropdown-arrow'
            />
          : validPic}
      </div>
    </div>
  );
};

PhoneInput.propTypes = {
  isFocus: PropTypes.bool,
  isValid: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  isDisabled: PropTypes.bool,
  errorMsg: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object
};

PhoneInput.defaultProps = {
  isFocus: false,
  isValid: true,
  isReadOnly: false,
  errorMsg: '',
  label: 'Label',
  value: '',
  isUpperCase: false,
  isDisabled: false,
  isSGPPhoneNumber: true
};

export default PhoneInput;
