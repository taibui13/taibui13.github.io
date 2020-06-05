import React, { Component } from 'react';
import { connect } from 'react-redux';
// import greenTick from './../assets/images/green-tick-successful.svg';
import Loader from './../components/Loader/Loader';
import queryString from 'query-string';
import {callCallbackURL} from './../actions/retrievingAction';

class RetrievingPage extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    const params = queryString.parse(this.props.location.search);
    const code = params.code ? params.code : '';
    const state = params.state ? params.state : '';
    const scope = params.scope ? params.scope : '';
    const parameter = `code=${code}&state=${state}&scope=${scope}`
    if ( scope !== "" || true ) { // remove scope condition
      dispatch((callCallbackURL(() => this.redirectToErrorPage(), (path) => this.redirectToSuccessfulPage(path), parameter)))
    } else {
      this.redirectToErrorPage();
    }
  }


  redirectToErrorPage(){
    // const { commonReducer, applicationReducer } = this.props;
    this.props.history.push({
        pathname : "/property/error"
    })
  }

  redirectToSuccessfulPage(path){
    // const {commonReducer} = this.props
    const url = `${window.location.origin}${path}`
    window.open(url, '_parent');
  }

  render() {
    return(
      <div className = 'uob-content'>
        <Loader />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { commonReducer } = state;
  return { commonReducer };
}

export default connect(mapStateToProps)(RetrievingPage);
