import React, { Component } from 'react';
import { connect } from 'react-redux';
import WrapContainer from './WrapContainer';
import VerifyPage from './../pages/VerifyPage';

class VerifyContainer extends Component {
  render() {
    return (
      <WrapContainer {...this.props}>
        <VerifyPage {...this.props} />
      </WrapContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return { commonReducer };
}

export default connect(mapStateToProps)(VerifyContainer);
