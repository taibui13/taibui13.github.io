import React from 'react';
import PropTypes from 'prop-types';
import EditableTextInput from './EditableTextInput/EditableTextInput';
import ReadOnlyTextInput from './ReadOnlyTextInput/ReadOnlyTextInput';
import PostalCodeInput from './PostalCodeInput/PostalCodeInput';
import PrependTextInput from './PrependTextInput/PrependTextInput';
import PhoneInput from './PhoneInput/PhoneInput';

const uniqueId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

const TextInput = props => {
  if (props.isReadOnly)
    return <ReadOnlyTextInput {...props} />;
  const textInputs = {
    Phone: <PhoneInput {...props} inputID={props.inputID ? props.inputID : uniqueId()} />,
    Postal: <PostalCodeInput {...props}  inputID={props.inputID ? props.inputID : uniqueId()}/>,
    Prepend: <PrependTextInput {...props}  inputID={props.inputID ? props.inputID : uniqueId()}/>
  };
  return props.type ? textInputs[props.type] : <EditableTextInput {...props} types={props.types} inputID={props.inputID ? props.inputID : uniqueId()}/>;
};

TextInput.propTypes = {
  type: PropTypes.string,
  inputID: PropTypes.string,
  isReadOnly: PropTypes.bool,
  isFocus: PropTypes.bool,
  isValid: PropTypes.bool,
  errorMsg: PropTypes.string,
  prefix: PropTypes.string,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
};

TextInput.defaultProps = {
  isFocus: false,
  isReadOnly: false,
  isValid: true,
  prefix: '',
  errorMsg: '',
  label: 'Label',
  value: ''
};

export default TextInput;
