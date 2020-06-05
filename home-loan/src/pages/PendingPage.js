import React, { Component } from "react";
import { connect } from "react-redux";
import retrieveImg from "./../assets/images/retrieve.svg";
import MessageBox from "./../components/MessageBox/MessageBox";
import PrimaryButton from "./../components/PrimaryButton/PrimaryButton";
import { isTakePreviousApplication } from "./../actions/applicationAction";

class ServiceUnavailablePage extends Component {
  handleOnClick(status) {
    const { dispatch } = this.props;
    dispatch(isTakePreviousApplication(status));
  }

  render() {
    const { commonReducer } = this.props;
    const pendingPageValues = commonReducer.appData.pendingPage;
    const labels = commonReducer.appData.pendingPage.labels;
    return (
      <div className="uob-content">
        <div className="pendingPage">
          <MessageBox
            img={retrieveImg}
            title={pendingPageValues.title}
            subtitle={pendingPageValues.subtitle}
            description={pendingPageValues.description}
          />
          <div className="pendingPage-wrapper">
            <div className="pendingPage-button">
              <PrimaryButton
                id="pendingPage"
                label={labels.noButton}
                style={{ color: 'rgb(67, 84, 95)', backgroundColor:'rgb(212, 234, 255)' }}
                onClick={() => this.handleOnClick(false)}
                //isLoading={isProcessing}
              />
            </div>
            <div className="pendingPage-button-space"/>
            <div className="pendingPage-button">
              <PrimaryButton
                id="pendingPage"
                label={labels.yesButton}
                onClick={() => this.handleOnClick(true)}
                //isLoading={isProcessing}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { commonReducer } = state;
  return { commonReducer };
};

export default connect(mapStateToProps)(ServiceUnavailablePage);
