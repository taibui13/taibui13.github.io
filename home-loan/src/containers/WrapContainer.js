import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getInitialData, setErrorMessage, setHelpMessageExpanded} from './../actions/commonAction';
import GenericErrorMessage from './../components/GenericErrorMessage/GenericErrorMessage';
import Loader from './../components/Loader/Loader';

import './../assets/css/uob-form-loan.css';

class WrapContainer extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getInitialData());
  }

  handleOnClearMessage() {
    const { dispatch } = this.props;
    dispatch(setErrorMessage(''));
  }

  handleSetHelpMessage(expanded){
  const { dispatch } = this.props;
  dispatch(setHelpMessageExpanded(expanded));
}

  render() {
    const { commonReducer, applicationReducer } = this.props;
    let backgroundUrl = `./images/background/light-background.png`;
    let imgUrl = './images/logos/uob-logo-blue.svg';
    const helpMessage = commonReducer.appData !== null && commonReducer.appData.helpMessage;
    const isExpanded = commonReducer.isExpanded ? "--expanded" : "" ;
    const help = commonReducer.isExpanded ? `./images/help-empty.png` : `./images/help.png`;
    let pathname = window.location.pathname;
    const currentPath = pathname.substr(pathname.lastIndexOf('/') + 1);
    const currentSection = commonReducer.currentSection;
    const messageBox = applicationReducer.dataLoaded && currentSection !== 'thankyou' && currentPath !== 'error' ? '' : '--withBox';

    if(currentPath === 'verify' || currentPath === "apply"){
      backgroundUrl = `./images/background/dark-background.png`;
      imgUrl = './images/logos/uob-logo-white.svg';
    }

    return(
      <div className={`uob-form-loan${messageBox}`} style={{backgroundImage: `url(${backgroundUrl})`}}>
        {
          commonReducer.isLoading && <Loader />
        }
        {
          commonReducer.messageContent !== '' &&
            <GenericErrorMessage {...this.props} interval={commonReducer.errorTimeOut} messageContent={commonReducer.messageContent} onClearMessage={this.handleOnClearMessage.bind(this)} />
        }
        <div className='uob-form-loan-container'>
          <div className='uob-header-wrap'>
            <div className='uob-header'>
              <div><img src={imgUrl} alt='Logo' className='uob-logo' /></div>
            </div>
          </div>
          <div className='uob-body'>
            { commonReducer.appData !== null && this.props.children}
            { commonReducer.appData !== null && helpMessage.isDisplayed && currentPath !== "apply" ?
              <div className={'helpMessageContainer' + isExpanded} onClick={() => this.handleSetHelpMessage(commonReducer.isExpanded)} >
                <div className={'helpMessage' + isExpanded}>
                  <img src={ help } alt='help' />
                  <div className={'helpSubtitle' + isExpanded}>{helpMessage.subtitle}</div>
                  <div className={'helpNumber' + isExpanded} dangerouslySetInnerHTML={{__html: helpMessage.text}}/>
                </div>
              </div>
            : null}
            </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { commonReducer, applicationReducer } = state;
  return { commonReducer, applicationReducer};
}

export default connect(mapStateToProps)(WrapContainer);
