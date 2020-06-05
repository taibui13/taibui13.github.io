import React, { Component } from 'react';
import { connect } from 'react-redux';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';
import { sendDataToSparkline } from './../common/utils';
import { retrieveMyInfoURL } from './../actions/applyAction';
import { appendParameter } from './../actions/verifyAction';
import { setErrorMessage } from './../actions/commonAction';
import countDownImg from './../assets/images/myInfo/3-5min.png';
import myInfoImg from './../assets/images/myInfo/myinfo.png';
import queryString from 'query-string';
import './../assets/css/landing.css';

export class ApplyPage extends Component {
    componentWillMount() {
      const { dispatch, verifyReducer, commonReducer } = this.props;
      const params = queryString.parse(this.props.location.search);
      const bypass = params.bypass ? params.bypass : "";
      const bpcode = params.bpcode ? params.bpcode : "";
      const agency = verifyReducer.agency;
      const ceaid = verifyReducer.ceaid;
      const source = verifyReducer.source;
      if ( commonReducer.appData ) {
        if ( bypass !== "" && bypass ) {
          if ( bpcode === commonReducer.appData.bypassCode ) {
            const parameter = this.props.location.search;
            const dataElement = commonReducer.appData.dataElement;
            !verifyReducer.isAgentFlow && dispatch(appendParameter(parameter));
            !verifyReducer.isAgentFlow && dispatch(retrieveMyInfoURL(parameter));
            sendDataToSparkline(dataElement, 0, false, "",  false, false, "", "", true, verifyReducer.isAgentFlow, source, agency, ceaid);
          } else {
            const url = commonReducer.appData.maintenaceURL
            window.open(url, '_parent');
          }
        } else {
          if ( commonReducer.appData.maintenance ) {
            const url = commonReducer.appData.maintenaceURL
            window.open(url, '_parent');
          } else {
            const parameter = this.props.location.search;
            const dataElement = commonReducer.appData.dataElement;
            !verifyReducer.isAgentFlow && dispatch(appendParameter(parameter));
            !verifyReducer.isAgentFlow && dispatch(retrieveMyInfoURL(parameter));
            sendDataToSparkline(dataElement, 0, false, "",  false, false, "", "", true, verifyReducer.isAgentFlow, source, agency, ceaid);
          }
        }
      }
    }

    handleToMyInfo(){
      const {dispatch, applyReducer, commonReducer } = this.props;;
      const globalErrorsMsg = commonReducer.appData.globalErrors.apiException;
      const url = applyReducer.link;
      if(url === "" || url === null || url === undefined){
        dispatch(setErrorMessage(globalErrorsMsg))
      } else {
        window.open(url, '_parent');
      }
    }
    render() {
      const { commonReducer, verifyReducer } = this.props;
      const applyValue = verifyReducer.isAgentFlow ? commonReducer.appData.applyPageAgent : commonReducer.appData.applyPageSelf;
      return (
        <div className='uob-content'>
          <div className="apply-page-container">
            <h1 className="apply-page-h1" dangerouslySetInnerHTML={{__html: applyValue.title}}/>
            <div className='applyPage-wrapper'>
              <div>
                <img src={countDownImg} alt='countdown' />
              </div>
              <p className='applyPage-description' dangerouslySetInnerHTML={{ __html: applyValue.description }} />
            </div>
            <div className='retrieve-myInfo'>
              <PrimaryButton
                label={applyValue.retrieveButton}
                onClick={this.handleToMyInfo.bind(this)}
                //isLoading={isProcessing}
              />
            </div>
          </div>
          <div className='applyPage-myInfo-container'>
            <img src={myInfoImg} alt='myinfo' />
            <div className='applyPage-footer' dangerouslySetInnerHTML={{ __html: applyValue.footer }} />
          </div>
        </div>
        );

    }

}

const mapStateToProps = (state) => {
    const { commonReducer, verifyReducer, applyReducer } = state;
    return { commonReducer, verifyReducer, applyReducer };
}

export default connect(mapStateToProps)(ApplyPage);
