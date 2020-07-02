import React from "react";
import {connect} from 'react-redux';
import './../assets/css/form.scss';
import { getInitialData, setErrorMessage } from '../actions/commonAction';
import {DEFAULT_TIME_OUT, PAGES} from '../common/constant';
import ErrorMessage from './../components/ErrorMessage/ErrorMessage';

export const wrapHOC = (WrappedComponent) => {
  
  class Wrapper extends React.Component {

    constructor(props) {
      super(props);
      this.state = {disabledForm: false};
    }
   
    componentWillMount() {
      const { dispatch, commonReducer } = this.props;
      if (!commonReducer.appData) {
        dispatch(getInitialData());
      }
    }

    componentDidMount() {
      this.addListener();
      this.setTimeoutFunc(DEFAULT_TIME_OUT);
    }

    handleOnClearMessage() {
      const { dispatch } = this.props;
      dispatch(setErrorMessage(''));
    }

    addListener() {
      const events = ['click', 'scroll', 'keypress', 'touchstart', 'touchmove'];
      for(const i in events) {
        window.addEventListener(events[i], this.resetTimeout);
      }
    }

    clearTimeoutFunc = () => {
      this.timeoutSession && window.clearTimeout(this.timeoutSession);
    };

    setTimeoutFunc = (timeOut) => {
      if(this.props.location.pathname === PAGES.REDEEM) {
        this.timeoutSession = window.setTimeout(this.blockForm, timeOut); 
      }
    };

    resetTimeout = () => {
        this.clearTimeoutFunc();
        this.setTimeoutFunc(DEFAULT_TIME_OUT);
    };

    blockForm = () => {
      this.setState({disabledForm: true});
    };

    render() {
      const { commonReducer } = this.props;
      const {disabledForm} = this.state;
      return (
        <div className='form'>
          <div className='form-container'>
            <div className='header-wrap'>
              <div className='header'>
              </div>
            </div>
            <div className='form-body'>
              {
                (commonReducer.appData && commonReducer.msg) && <WrappedComponent {...this.props}/>
              }
            
            </div>
          </div>
            {commonReducer.msg && disabledForm && <ErrorMessage id={403} msg={commonReducer.msg.error[403].text} />}
        </div>
      );
    }
  }

  return connect(state => state)(Wrapper);
}