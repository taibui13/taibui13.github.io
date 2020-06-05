import React from "react";

import "./CpfTable.css";

import CpfTableMobile from "./CpfTableMobile/CpfTableMobile";
import CpfTableDesktop from "./CpfTableDesktop/CpfTableDesktop";

const CpfTable = props => {
    return (
        <div>
            <div className='real-cpfTable-desktop'><CpfTableDesktop {...props} /></div>
            <div className='real-cpfTable-mobile'><CpfTableMobile {...props} /></div>
        </div>
    );
};

export default CpfTable;
