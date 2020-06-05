import React from 'react';
import PropTypes from 'prop-types';
import ToggleInputWithTitle from './ToggleInputWithTitle/ToggleInputWithTitle';
import ToggleInputWithoutTitle from './ToggleInputWithoutTitle/ToggleInputWithoutTitle';

import './ToggleInput.css';

const ToggleInput = props => {
  return props.isWithTitle ? <ToggleInputWithTitle {...props} /> : <ToggleInputWithoutTitle {...props} />;
};

ToggleInput.propTypes = {
  isWithTitle: PropTypes.bool
}

ToggleInput.defaultProps = {
  isWithTitle: false
};

export default ToggleInput;
