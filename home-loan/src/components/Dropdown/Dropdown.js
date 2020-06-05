import React from 'react';
import PropTypes from 'prop-types';

import EditableDropdown from './EditableDropdown/EditableDropdown';
import ReadOnlyDropdown from './ReadOnlyDropdown/ReadOnlyDropdown';

const Dropdown = props => {
  return props.isReadOnly ? <ReadOnlyDropdown {...props} /> : <EditableDropdown {...props} />;
};

Dropdown.propTypes = {
  isReadOnly: PropTypes.bool
};

Dropdown.defaultProps = {
  isReadOnly: false
};

export default Dropdown;
