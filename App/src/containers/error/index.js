/* global GLOBAL_CONFIG */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import './index.scss';

class Error extends Component {

  constructor(props) {
    super(props);
    this.errorID = "";
}

  componentWillMount() {
    const {location} = this.props;
    if(!(location.state && location.state.errorID)) {
      this.props.history.push({pathname : "/", search : ''})
    }
    this.errorID = (location.state && location.state.errorID) || "404";
    location.state = null;
  }

  componentWillUnmount() {
    const {location} = this.props;
    location.state = null;
  }

  createMarkup(text) {
    return {__html: text};
  }

  redirect = (link) => {
    window.location.href = link;
  }

  render() {
    const {commonReducer: {msg}} = this.props;
    const errorMsg = msg.error[this.errorID] || {};
   
    const labels = msg.complete || {};
    return(
      <div className="error">
        <div className="header" onClick={this.redirect.bind(this, labels.linkCard)}
         style={{background: `linear-gradient(rgba(131, 182, 240, 0.226), rgba(105, 119, 136, 0.45)),url(${GLOBAL_CONFIG.root}${labels.banner})`}}
        >
        </div>
        <div className="body">
            <div className="error-message">
              <div className="error-title">
                 {errorMsg.title}
                </div>
                <div className="error-text">
                 {errorMsg.text}
                </div>
            </div>
            
        </div>
      </div>
    );
  }
}

export default connect(state => state)(Error);