import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './CountDown.css';

class CountDown extends Component {
  constructor(props) {
    super(props);
    this.timer = 0;
    this.state = {
      seconds: 0
    };
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  componentDidMount() {
    const { interval } = this.props;
    this.setState({
      seconds: interval
    }, () => {
      this.startTimer();
    });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  startTimer() {
    if (this.timer === 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    let seconds = this.state.seconds - 1;
    this.setState({
      seconds: seconds
    });

    if (seconds === 0) {
      clearInterval(this.timer);
      this.props.onEnd();
    }
  }

  render() {
    return (
      <div className='counddown-label-wrap'>
        <label className='counddown-label'>
          {`${this.state.seconds} ...`}
        </label>
      </div>
    );
  }
}

CountDown.propTypes = {
  interval: PropTypes.number.isRequired,
  onEnd: PropTypes.func.isRequired
};

export default CountDown;
