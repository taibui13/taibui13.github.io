import React, { Component } from 'react';
import PropTypes from 'prop-types';
import PrimaryButton from './../../PrimaryButton/PrimaryButton';
import PassCode from './../PassCode/PassCode';
import CountDown from './../CountDown/CountDown';

import './OTP.css';

class OTP extends Component {

  handleGetToken() {
    this.props.onGetToken();
  }

  endCountDown() {
    this.props.onEndCountDown();
  }

  onChangeCode(value) {
    this.props.onChangeCode(value);
  }

  render() {
    const { prefix, interval, isCountingDown, isLoading, resendLabel, value, inlineErrorMsg } = this.props;
    return (
      <div>
        <div className='uob-otp-container'>
          <PassCode
            prefix={prefix}
            value={value}
            onChangeCode={(value)=>this.onChangeCode(value)}
            {...this.props}
          />
          <div className='uob-otp-coundown'>
            {
              isCountingDown && !isLoading ?
                <CountDown
                  interval={interval}
                  onEnd={() => this.endCountDown()}
                />
              :
                <div>
                  <PrimaryButton
                    style={{width: 70, height: 45, margin: 0, fontSize:15}}
                    label={resendLabel}
                    isLoading={isLoading}
                    onClick={this.handleGetToken.bind(this)}
                    containerStyle={{ display: 'flex', alignItems: 'center'}}
                    spinnerStyle={{ margin: 0 }}
                  />
                </div>
              }
          </div>
        </div>
        { inlineErrorMsg && <div className='inline-error-message'>{inlineErrorMsg}</div>}
      </div>
    );
  }
}

OTP.propTypes = {
  resendLabel: PropTypes.string.isRequired,
  onChangeCode: PropTypes.func.isRequired,
  onGetToken: PropTypes.func.isRequired,
  onEndCountDown: PropTypes.func.isRequired,
  interval: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired
};

export default OTP;
