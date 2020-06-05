import React, { Component } from 'react';
import { connect } from 'react-redux';
import queryString from 'query-string';
import { handleEmailValidation, handleSetDefaultError, setVerifyCode, appendParameter } from './../actions/verifyAction';
import { retrieveMyInfoURL } from './../actions/applyAction';
import MessageBox from './../components/MessageBox/MessageBox';
import loadingImg from './../assets/images/loading_icon.svg';
import errorImg from './../assets/images/errorImg.svg';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';

class VerifyPage extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    const params = queryString.parse(this.props.location.search);
    const paramString = this.props.location.search;
    const paraArray = paramString.split('&');
    const parameter = paraArray.splice(1).join('&');
    dispatch(appendParameter(parameter));
    dispatch(retrieveMyInfoURL(parameter));
    const code = params.code ? params.code : '';
    if (code === '') {
      dispatch(handleSetDefaultError('linkExpired'));
    } else {
      dispatch(setVerifyCode(code));
    }
  }

  redirectOnSuccess() {
    const {verifyReducer} = this.props;
    this.props.history.push({
        pathname : "apply",
        search : verifyReducer.parameter
    })
  }

  renderErrorMessage(message) {
    return (
      <div className ='uob-content'>
        <MessageBox
          img={errorImg}
          title={message.title}
          subtitle={message.subtitle}
          description={message.description}
        />
      </div>
    );
  }

  handleToVerify(){
    const {dispatch, verifyReducer } = this.props;
    dispatch(handleEmailValidation(verifyReducer.verifyCode, () => this.redirectOnSuccess()));
  }
  createMarkup(text) {
    return {__html: text};
  }

  render() {
    const { verifyReducer, commonReducer: {appData} } = this.props;
    const { isVerifying , errorCode, verifyingBox, receivingError } = verifyReducer;
    const verifyValues = appData.verify;
    const errorMessageBox = appData.errorMessageBox;
    const labels = appData.security || {};
    const iconInfo = labels.iconUrl;
    return (
      <div>
      {
        isVerifying &&
          <div className='verfiying-container'>
            <img
              className='icon-verifying--spinner'
              src={loadingImg}
              alt='icon'
            />
            <div>{verifyValues.verifying}</div>
          </div>
      }
      { receivingError && this.renderErrorMessage(errorMessageBox[errorCode])}
      { verifyingBox &&
        <div className='uob-content' id='verify-container'>
          <h1>{verifyValues.title}</h1>
          <div className='uob-form-separator'/>
          <p className='uob-headline'>{verifyValues.subtitle}</p>
          <div className='security-container'>
          <div className="security-content">
              <div className="security-body"> 
                <div className="tip">
                  <div className="tip-title">{iconInfo && <img alt="#" src={iconInfo}/>} <span> {labels.tip} </span> </div>
                  </div>
                <div className="info">
                
                  <div className="info-tip"> <span>{labels.info}</span></div>
                </div>
                <div className="items">
                <div className="item" dangerouslySetInnerHTML={this.createMarkup(labels.line_one)} />
                <div className="item" dangerouslySetInnerHTML={this.createMarkup(labels.line_two)} />
                <div className="item" dangerouslySetInnerHTML={this.createMarkup(labels.line_three)} />
                </div>
              </div>
            </div>  
            </div>

          <div className='uob-space-separator'/>
          <div className='verify-primary-button'>
            <PrimaryButton label={verifyValues.labels.continueButton} onClick={this.handleToVerify.bind(this)} />
          </div>
        </div>
      }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { commonReducer, verifyReducer } = state;
  return { commonReducer, verifyReducer };
}

export default connect(mapStateToProps)(VerifyPage);
