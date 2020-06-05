import React, { Component } from 'react';
import { connect } from 'react-redux';
import WrapContainer from './WrapContainer';
import queryString from 'query-string';
import ErrorMessagePage from './../pages/ErrorMessagePage';
import { setErrorWithValue } from './../actions/applicationAction';
import { sendDataToSparkline } from './../common/utils';

class ErrorContainer extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    const params = queryString.parse(this.props.location.search);
    const code = params.code ? params.code : '';
    if(code !== '') {
      dispatch(setErrorWithValue(code));
    }
  }

  componentDidUpdate(prevState) {
    const {commonReducer} = this.props;
    if(prevState.commonReducer.appData !== commonReducer.appData){
        const dataElement = commonReducer.appData.dataElement;
        sendDataToSparkline(dataElement, '');
      }
  }

  render() {
    const { applicationReducer } = this.props;
    const { errorCode } = applicationReducer;
    return (
      <WrapContainer {...this.props}>
        <ErrorMessagePage {...this.props} errorCode={errorCode}/>
      </WrapContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { applicationReducer, commonReducer } = state;
  return { applicationReducer, commonReducer };
}

export default connect(mapStateToProps)(ErrorContainer);
