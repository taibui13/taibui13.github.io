import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessageBox from './../components/MessageBox/MessageBox';
import {detectPathName, renderDomHTML, stringInject} from './../common/utils';

class ErrorMessagePage extends Component {

  componentWillMount() {
    const { applicationReducer, commonReducer } = this.props;
    const code = applicationReducer.errorCode;
    const errorValue = commonReducer.appData.errorMessageBox;
    const paramString = this.props.location.search;
    this.state = this.props.location.state || {};
    const paraArray = paramString.split('&');
    const parameter = paraArray.splice(1).join('&');
    if(code === 'MYRJTD'){
      const url = detectPathName() + errorValue["MYRJTD"].url + "?" + parameter;
      window.open(url, '_parent');
    }
  }

  getError = () => {
    const { commonReducer: {appData}, errorCode } = this.props;
    let defaultError = appData.errorMessageBox[errorCode];
    if (this.state && this.state.subError) {
      if (appData.errorMessageBox && appData.errorMessageBox[errorCode]) {
        const domHtmls = [renderDomHTML("ul" , "li", this.state.subError)];
        let obj = appData.errorMessageBox[errorCode];
        obj.subtitle = stringInject(appData.errorMessageBox[errorCode].subtitle, domHtmls)
        return obj;
      }
    }
    return defaultError;
  }


  render() {
    const { commonReducer, errorCode } = this.props;
    const errorValue = commonReducer.appData.errorMessageBox;
    const code = errorValue[errorCode] ? errorCode : 'serviceDown';
    const errorImg = errorValue[code].errorImg && errorValue[code].errorImg !== "" ? errorValue[code].errorImg : "./images/errorImg.svg";
    this.getError();
    return(
      <div className ='uob-content'>
        <MessageBox
          img={errorImg}
          title={errorValue[code].title}
          subtitle={errorValue[code].subtitle}
          description={errorValue[code].description}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return { commonReducer };
}

export default connect(mapStateToProps)(ErrorMessagePage);
