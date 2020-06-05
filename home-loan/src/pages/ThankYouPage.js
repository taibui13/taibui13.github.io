import React, { Component } from 'react';
import { connect } from 'react-redux';
import greenTick from './../assets/images/green-tick-successful.svg';
import MessageBox from './../components/MessageBox/MessageBox';

class ThankYouPage extends Component {

  render() {
    const { commonReducer } = this.props;
    const thankyouValues = commonReducer.appData.thankYouPage;
    const referenceNo = commonReducer.referenceNo;
    const referenceNoText = thankyouValues.referenceNo.replace("{referenceNo}", referenceNo);
    return(
      <div className = 'uob-content'>
        <MessageBox
          img={greenTick}
          title={thankyouValues.title}
          subtitle={`${thankyouValues.subtitle}</br>${referenceNoText}`}
          description={thankyouValues.description}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return { commonReducer };
}

export default connect(mapStateToProps)(ThankYouPage);
