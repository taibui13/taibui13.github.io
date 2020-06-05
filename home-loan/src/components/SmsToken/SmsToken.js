import React from 'react';
import PropTypes from 'prop-types';
import OTP from './OTP/OTP';
import MobileToken from './MobileToken/MobileToken';

const SmsToken = props => {
  return props.isMobileHide ? <OTP {...props} /> : <MobileToken {...props} />;
};

SmsToken.propTypes = {
  isMobileHide: PropTypes.bool.isRequired
};

SmsToken.defaultProps = {
  isMobileHide: false
};

export default SmsToken;
