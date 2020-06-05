import React, { Component } from 'react';
import { connect } from 'react-redux';
import WrapContainer from './WrapContainer';
import RetrievingPage from './../pages/RetrievingPage';

class RetrievingContainer extends Component {
  render() {
    return (
      <WrapContainer {...this.props}>
        <RetrievingPage {...this.props} />
      </WrapContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return { commonReducer };
}

export default connect(mapStateToProps)(RetrievingContainer);
