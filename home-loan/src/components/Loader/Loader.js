import React from "react";
import "./Loader.css";
const Loader = () => {
    return (
        <div>
            <div id='fader' className='fade in' style={{display: "block"}} />
            <div className='loader fade in' style={{display: "block"}}><div /><div /><div /><div /></div>
            <div className='loader-backdrop-sm fade in' style={{display: "block"}} />
            <div className='loader-backdrop fade in' style={{display: "block"}} />
            <div className='loader-text fade in' style={{display: "block"}} />
        </div>
    );
};
export default Loader;
