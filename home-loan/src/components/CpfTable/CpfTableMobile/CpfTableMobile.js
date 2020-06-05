import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import nonEditableImg from './../../../assets/images/non-editable-icon4.svg';

import "./CpfTableMobile.css";

import arrowImg from './../../../assets/images/arrow.svg';

const Row = props => {
    const {
        handleClick,
        arrowClass,
        data,
        contentClass,
        bodyTitle,
        isRowOpen
    } = props;
    const paidOn =  moment(data.date, "YYYY-MM-DD").format("DD MMM YYYY");
    const forMonth = moment(data.month, "YYYY-MM").format("MMM YYYY");
    const amount = <NumberFormat value={data.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} />;
    const employer = data.employer;
    return (
        <div className={"cpf-table-mobile-container-item"}>
            <div className='cpf-table-mobile-title-container' onClick={handleClick}>
                <img src={arrowImg} alt='tick' className={arrowClass} />
                <div className='cpf-table-mobile-title-checkbox-container'>
                    <div className='cpf-table-mobile-title'>{forMonth}</div>
                </div>
            </div>
            <div className={`cpf-table-mobile-content-container ${contentClass}`}>
                {isRowOpen &&
                  <div>
                    <div className='cpf-table-mobile-content-item-container'>
                        <div className='cpf-table-mobile-content-item-title'>{bodyTitle[0]}</div>
                        <div className='cpf-table-mobile-content-item-data'>
                            {paidOn}
                        </div>
                    </div>
                    <div className='cpf-table-mobile-content-item-container'>
                        <div className='cpf-table-mobile-content-item-title'>{bodyTitle[1]}</div>
                        <div className='cpf-table-mobile-content-item-data'>
                            {amount}
                        </div>
                    </div>
                    <div className='cpf-table-mobile-content-item-container'>
                        <div className='cpf-table-mobile-content-item-title'>{bodyTitle[2]}</div>
                        <div className='cpf-table-mobile-content-item-data'>
                            {employer}
                        </div>
                    </div>
                  </div>
                }
            </div>
        </div>
    );
};

const CpfTableMobile = props => {
    const { colTitles, tableContent, openRows, expandTableRow, collapseTableRow} = props;
    const bodyTitle = colTitles.filter((title, i) => i !== 0);

    return (
        <div className='cpf-table-mobile-container'>
            <div className='cpf-table-mobile-header'>
              <span> {props.label} </span>
              <img
                className={"verified-img"}
                src={nonEditableImg}
                alt='verified'
              />
            </div>
            {tableContent.map((data, i) => {
                const dataKeys = Object.keys(data);
                const header = dataKeys[0];
                const isRowOpen = openRows.includes(i) ? true : false;
                const restOfDataKeysExceptHeader = dataKeys.filter(x => x !== header);
                const arrowClass = isRowOpen ? "cpf-table-mobile-arrow--selected" : "cpf-table-mobile-arrow";
                const contentClass = isRowOpen ? "cpf-table-mobile-content-container--selected" : "";
                const handleClick = () =>
                    isRowOpen
                        ? collapseTableRow && collapseTableRow(i)
                        : expandTableRow && expandTableRow(i);
                return (
                    <Row
                        key={i}
                        restOfDataKeysExceptHeader={restOfDataKeysExceptHeader}
                        arrowClass={arrowClass}
                        contentClass={contentClass}
                        handleClick={handleClick}
                        bodyTitle={bodyTitle}
                        data={data}
                        header={header}
                        index={i}
                        isRowOpen={isRowOpen}
                        pid={props.pid}
                    />
                );
            })}
        </div>
    );
};

Row.propTypes = {
    handleClick: PropTypes.func.isRequired,
    arrowClass: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    contentClass: PropTypes.string.isRequired,
    bodyTitle: PropTypes.array.isRequired,
    restOfDataKeysExceptHeader: PropTypes.array.isRequired,
    isRowOpen: PropTypes.bool.isRequired
};


CpfTableMobile.propTypes = {
    colTitles: PropTypes.array.isRequired,
    tableContent: PropTypes.array.isRequired,
    pid: PropTypes.string
};

export default CpfTableMobile;
