import React from "react";

export const WrappedChild = (WrappedComponent) => {
  class Wrapper extends React.Component {
   
    componentWillUnmount() {
      if(this.props.unAmount) {
        this.props.unAmount();
      }
    }

    render() {
      return (<WrappedComponent {...this.props} />);
    }
  }

  return Wrapper;
}