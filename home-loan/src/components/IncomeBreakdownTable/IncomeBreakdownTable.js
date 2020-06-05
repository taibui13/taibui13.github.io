import React from "react";

import "./IncomeBreakdownTable.css";

import IncomeBreakdownTableMobile from "./IncomeBreakdownTableMobile/IncomeBreakdownTableMobile";
// import IncomeBreakdownTableDesktop from "./IncomeBreakdownTableDesktop/IncomeBreakdownTableDesktop";

const IncomeBreakdownTable = props => {
    return (
        <div>
            {/*<div className='real-income-breakdown-desktop'><IncomeBreakdownTableDesktop {...props} /></div>*/}
            <div className='real-income-breakdown-mobile'><IncomeBreakdownTableMobile {...props} /></div>
        </div>
    );
};

export default IncomeBreakdownTable;
