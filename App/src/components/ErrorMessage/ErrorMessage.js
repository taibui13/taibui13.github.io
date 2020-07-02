import React from 'react';

import "./ErrorMessage.scss";

const ErrorMessage = props => {
    const { msg } = props;
    return (
        <div className='error-message-wrapper'>
            <div className='error-message-text'>{msg}</div>
        </div>
    );
};

export default ErrorMessage;
