import React, { Component } from 'react';
import { connect } from 'react-redux';
import WrapContainer from './WrapContainer';
import ApplyPage from './../pages/ApplyPage';

class VerifyContainer extends Component {
  render() {
    return (
      <WrapContainer {...this.props}>
        <ApplyPage {...this.props} />
      </WrapContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return { commonReducer };
}

export default connect(mapStateToProps)(VerifyContainer);
