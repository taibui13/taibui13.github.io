import React from 'react';
import PropTypes from 'prop-types';
import { AsYouType } from 'libphonenumber-js';

import "./ReadOnlyTextInput.css";
import nonEditableImg from './../../../assets/images/non-editable-icon4.svg';

const ReadOnlyTextInput = props => {
  const { label, value, hasIcon, isFlag } = props;
  const formatNumber = number => {
    const formatter = new AsYouType('');
    return formatter.input(number);
  };
  const country = number => {
    const formatter = new AsYouType();
    formatter.input(number);
    return formatter.country;
  };
  const contryName = country(value);
  const countryFlagPath = contryName ? require(`./../../../assets/images/countriesFlags/${contryName.toLowerCase()}.svg`) : null;
  return (
    <div className='read-only-text-input--container'>
        <div className='read-only-text-input--content'>
          <label className={`read-only-text-input--label--focused`}>{label}</label>
          <div className={`read-only-text-input--input--focused`}>
            {
              isFlag &&
              <img className={"read-only-phone-input-flag"} src={countryFlagPath} alt='flag' />
            }
          {isFlag ? formatNumber(value) : value}
          </div>
        </div>
        {hasIcon &&
          <img
            className={"read-only-text-input--tick--visible"}
            src={nonEditableImg}
            alt='tick'
          />
        }
    </div>
  );
};

ReadOnlyTextInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  hasIcon: PropTypes.bool
};

ReadOnlyTextInput.defaultProps = {
  label: 'Label',
  value: '',
  hasIcon: true
};

export default ReadOnlyTextInput;
