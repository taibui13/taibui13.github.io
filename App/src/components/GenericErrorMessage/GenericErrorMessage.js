import React, { Component } from 'react';

import "./GenericErrorMessage.css";
import PropTypes from "prop-types";
import errorImg from './../../assets/images/icon/error-message-icon.svg';
import crossImg from './../../assets/images/icon/cross-white.svg';

class GenericErrorMessage extends Component {
  constructor(props) {
    super(props);
    this.timer = 0;
    this.fadeTimer = 0;
    this.state = {
      fadeSeconds: 0,
      seconds: 0,
      opacity: 1,
    };
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    const { interval } = this.props;
    this.setState({
      seconds: interval,
      fadeSeconds: interval
    }, () => {
      this.startTimer();
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearInterval(this.fadeTimer);
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }

    if (this.fadeTimer === 0) {
      this.fadeTimer = setInterval(()=>{
        let fadeSeconds = this.state.fadeSeconds - 0.1;
        this.setState({
          fadeSeconds: fadeSeconds,
          opacity: fadeSeconds / this.props.interval
        });
        if (this.state.fadeSeconds === 0) {
          clearInterval(this.fadeTimer);
        }
      }, 100);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds,
    });

    if (seconds === 0) {
      clearInterval(this.timer);
      this.props.onClearMessage();
    }
  }

  render() {
    const { messageContent, onClearMessage } = this.props;
    const visibility = messageContent === "" ? "--hidden" : "";

    return (
        <div className={`generic-error-message--wrapper-flex${visibility}`} style={{ opacity: this.state.opacity }}>
            <div className='generic-error-message--icon-wrapper'>
                <img
                    className='generic-error-message--icon-signal'
                    src={errorImg}
                    alt='errorIcon'
                />
            </div>
            <div className='generic-error-message--message-text'>{messageContent}</div>
            <div
                className='generic-error-message--icon-wrapper'
                onClick={() => {
                    onClearMessage && onClearMessage();
                }}
            >
                <img
                    className='generic-error-message--icon-cross'
                    src={crossImg}
                    alt='removeIcon'
                />
            </div>
        </div>
    );
  }
}
SearchBar.propTypes = {
  onClearMessage: PropTypes.object.isRequired
};

export default GenericErrorMessage;
