import React, { Component } from 'react';
import { connect } from 'react-redux';
import WrapContainer from './WrapContainer';
import PendingPage from './../pages/PendingPage';

class HomeContainer extends Component {
  render() {
    return (
      <WrapContainer {...this.props}>
        < PendingPage {...this.props} />
      </WrapContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return { commonReducer };
}

export default connect(mapStateToProps)(HomeContainer);
