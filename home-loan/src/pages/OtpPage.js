import React, { Component } from 'react';
import { connect } from 'react-redux';
import SmsToken from './../components/SmsToken/SmsToken';
import { setCountDownStatus, sendOtp, verifyOtp, handleOtpChange } from './../actions/otpAction';
import { setInlineErrorMessage } from './../actions/commonAction';


class OtpPage extends Component {

  handleOnChangeCode(value) {
    const { dispatch, onContinue, basicDetailsReducer, otpReducer } = this.props;
    dispatch(handleOtpChange(value));
    if (value.length === 6) {
        let mobileNumber = basicDetailsReducer.mobileNumber.value && basicDetailsReducer.mobileNumber.value.replace(/ +/g, "");
        mobileNumber = mobileNumber.includes("+") ? mobileNumber.substr(3) : mobileNumber;
        const otpObj = {
          otp: value,
          mobileNumber : mobileNumber,
          requestIdentity: otpReducer.requestIdentity
        }
      dispatch(verifyOtp(otpObj , onContinue));
    }
  }

  handleSendToken() {
    const { dispatch, basicDetailsReducer } = this.props;
    const mobileNumber = basicDetailsReducer.mobileNumber;
    dispatch(setInlineErrorMessage(''));
    dispatch(sendOtp(mobileNumber, () => this.redirectToErrorPage()));
  }

  handleOnEndCountDown() {
    const { dispatch } = this.props;
    dispatch(setCountDownStatus(false));
  }

  redirectToErrorPage(){
    this.props.history.push({
        pathname : "error",
        search : ''
    })
  }

  render() {
    const { commonReducer, otpReducer } = this.props;
    const otp = commonReducer.appData.otp || {};
    const count = otpReducer.otpTriedCount;
    const inlineMessage = commonReducer.inlineMessage;
    const interval = count > 3 ? 120 : (count === 3 ? 60 : count * 15);
    return (
      <div className='uob-content' id='otpPage-section' style={{paddingBottom: 30}}>
        <h1>{otp.title}</h1>
        <div className='uob-form-separator' />
        <div className='uob-input-separator' />
        <p className='uob-headline'>{otp.subtitle}</p>
        <SmsToken
          interval={interval}
          isMobileHide={true}
          value={otpReducer.code}
          prefix={otpReducer.prefix}
          isCountingDown={otpReducer.isCountingDown}
          onGetToken={() => this.handleSendToken()}
          onEndCountDown={() => this.handleOnEndCountDown()}
          onChangeCode={(value) => this.handleOnChangeCode(value)}
          resendLabel={otp.resendOtp}
          isLoading={otpReducer.isLoading}
          inlineErrorMsg={inlineMessage}
        />
        <p className='terms'>{otp.terms}</p>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { otpReducer, commonReducer, basicDetailsReducer } = state;
  return { otpReducer, commonReducer, basicDetailsReducer };
}

export default connect(mapStateToProps)(OtpPage);
