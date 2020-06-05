import React, {Component} from "react";
import "./Modal.css";


class Modal extends Component {
    render() {
        const { show } = this.props;
        return (
            <div className='modal-back-container'>
                <div className='modal-containter'>
                    <div className='modal-content-container'>
                        <a onClick={show}> × </a>
                        <div className='modal-content'>
                            {this.props.children}
                        </div>
                   
                    </div>
                </div>
            </div>
        );
    }
}

export default Modal;
