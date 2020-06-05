import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextInput from './../../TextInput/TextInput';
import PrimaryButton from './../../PrimaryButton/PrimaryButton';
import PassCode from './../PassCode/PassCode';
import CountDown from './../CountDown/CountDown';

import './MobileToken.css';

class MobileToken extends Component {
  handleGetToken(mobile) {
    this.props.onGetToken(mobile);
  }

  onChange(e, inputName) {
    this.props.onChange(e, inputName);
  }

  endCounDown() {
    this.props.onEndCounDown();
  }

  render() {
    const { mobile, label, prefix, isCountingDown, isLoading, hasError } = this.props;
    return (
      <div>
        <div className='uob-input-mobile-get-token'>
          <TextInput
            type='Phone'
            isValid={mobile.isValid}
            errorMsg={mobile.errorMsg}
            label={label}
            value={mobile.value}
            countryCode={'+65'}
            onChange={(e) => this.onChange(e,'mobile')}
            style={{
              borderRadius: '2px 0 0 2px'
            }}
          />
          {
            !isLoading && isCountingDown ?
              <CountDown interval={60} onEnd={() => this.endCounDown()} />
            :
              <div style={{
                borderTop: '1px solid transparent',
                borderBottom: '1px solid transparent'
              }}>
                <PrimaryButton
                  label={hasError ? 'Resend' : 'Verify'}
                  isLoading={isLoading}
                  onClick={this.handleGetToken.bind(this, mobile.value)}
                  containerStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  spinnerStyle={{ margin: 0 }}
                />
              </div>
          }
        </div>
        <div>
        {
          prefix && prefix.length > 0 ?
            <PassCode {...this.props} />
          :
            null
        }

        </div>
      </div>
    );
  }
}

MobileToken.propTypes = {
  mobile: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onGetToken: PropTypes.func.isRequired,
  onEndCounDown: PropTypes.func.isRequired
};

export default MobileToken;
