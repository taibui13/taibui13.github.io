import React from 'react';

import "./InlineErrorMessage.css";

const InlineErrorMessage = props => {
    const { message } = props;
    return (
        <div className='inline-error-message--wrapper-flex'>
            <div className='inline-error-message--message-text'>{message}</div>
        </div>
    );
};

export default InlineErrorMessage;
