import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './PassCode.css';

class PassCode extends Component {
  constructor(props) {
    super(props);
    this.hiddenInput = null;
    this.tmpArray = [];
    this.isSetDot = false;
    this.state = {
      focusing: false
    }
  }

  componentWillMount() {
    for (let i = 0; i < this.props.passwordLength; i++) {
      this.tmpArray.push(i);
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.removeFocusingState, true);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.removeFocusingState, true);
  }

  removeFocusingState = () => {
    this.setState({focusing: false});
  }

  handleOnChange(e) {
    const { onChangeCode } = this.props;
    onChangeCode(e.target.value);
    this.isSetDot = false;
    setTimeout(() => {
      this.isSetDot = true;
      this.setState({});
    }, 700);
  }

  focusInput(e) {
    e.preventDefault();
    e.stopPropagation();
    this.hiddenInput.focus();
    this.setState({focusing: true});
  }

  renderSymbol(index, value, isSetDot, maxlength) {
    if (value) {
      if (maxlength === index + 1) {
        return isSetDot ? "." : value;
      } else {
        return ".";
      }
    } else {
      return "";
    }
    
  }
  render() {
    const { passwordLength, prefix, passcodeTitle, value, inlineErrorMsg } = this.props;
   
    const focusClass = this.state.focusing ? "isfocus" : "";
    const errorStyle =  inlineErrorMsg ? "passcode--error" : "";

    return (
      <div id='passcode-container' onClick={this.focusInput.bind(this)} style={{position: 'relative'}}>
        {passcodeTitle ? <p>{passcodeTitle}</p> : null}
        <input
          className='passcode-input-hidden'
          type='text'
          value={value}
          onChange={this.handleOnChange.bind(this)}
          ref={(input) => this.hiddenInput = input}
          maxLength={passwordLength}
        />
        <div className={`passcode-container`}>
          {prefix ? <label className={`passcode-prefix ${errorStyle}`}>{prefix}</label> : null}
          <div className={`passcode-box-container ${focusClass}`}>
          <label className={`passcode-small-box-wrap ${errorStyle}`}>
            {
              this.tmpArray.map((item, index) => {
                let boxClass = (this.state.focusing && index === value.length) ? 'passcode-small-box passcode-small-box-active' : 'passcode-small-box';
                const fontBox = !this.isSetDot &&  (index === (value || []).length - 1)  ? ' passcode-medium' : ' passcode-large';
                boxClass += fontBox;
                return (
                  <div key={index} className={boxClass} >
                    <span>{this.renderSymbol(index, (value || [])[index], this.isSetDot, (value || []).length)}</span>
                  </div>
                );
              })
            }
          </label>
          </div>
        </div>
      </div>
    );
  }
}

PassCode.propTypes = {
  password: PropTypes.bool,
  passwordLength: PropTypes.number,
  prefix: PropTypes.string,
  passcodeTitle: PropTypes.string,
  onChangeCode: PropTypes.func.isRequired
};

PassCode.defaultProps = {
  showPassword: false,
  passwordLength: 6
};

export default PassCode;