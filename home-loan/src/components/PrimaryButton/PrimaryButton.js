import React from 'react';
import PropTypes from 'prop-types';

import './PrimaryButton.css';

import loadingImg from './../../assets/images/loading_icon.svg';

const PrimaryButton = props => {
  const { isLoading, onClick, label, style, containerStyle, spinnerStyle, disabled } = props;
  const spinner = isLoading
    ? <img
          className='primary-button--spinner'
          style={spinnerStyle ? spinnerStyle : null}
          src={loadingImg}
          alt='primary-button'
      />
    : false;
  const isDisabled = disabled || isLoading ? true : false;
  return (
    <div style={containerStyle ? containerStyle : null}>
        <button className='primary-button' onClick={onClick} disabled={isDisabled} style={style ? style : null}>
            {spinner} {isLoading ? '' : label}
        </button>
    </div>
  );
};

PrimaryButton.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    style: PropTypes.object,
    containerStyle: PropTypes.object
};

PrimaryButton.defaultProps = {
  isLoading: false
};

export default PrimaryButton;
