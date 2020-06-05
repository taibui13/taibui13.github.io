import React from 'react';
import moment from 'moment';
import NumberFormat from 'react-number-format';
import nonEditableImg from './../../../assets/images/non-editable-icon4.svg';

import './CpfTableDesktop.css';

const generateTableRows = tableContent => {
    return tableContent.map((row, i) => {
        const paidOn =  moment(row.date, "YYYY-MM-DD").format("DD MMM YYYY");
        const forMonth = moment(row.month, "YYYY-MM").format("MMM YYYY");
        const amount = <NumberFormat value={row.amount} displayType={'text'} thousandSeparator={true} prefix={'$'} />;
        const employer = row.employer;
        return (
            <div key={i}>
                <div className='cpf-table--separator' />
                <div className={"cpf-table--row-flex"}>
                    <div className='cpf-table--row-item'>{forMonth}</div>
                    <div className='cpf-table--row-item'>{paidOn}</div>
                    <div className='cpf-table--row-item'>{amount}</div>
                    <div className='cpf-table--row-item'>{employer}</div>
                </div>
            </div>
        );
    });
};

const CpfTableDesktop = props => {
    return (
        <div className='cpf-table--main-container-flex'>
            <div className='cpf-table-header'>
              <span> {props.label} </span>
              <img
                className={"verified-img"}
                src={nonEditableImg}
                alt='verified'
              />
            </div>
            <div className='cpf-table--titles-container-flex'>
                {props.colTitles.map((title, i) => <div key={i} className='cpf-table--title-flex'>{title}</div>)}
            </div>
            <div className='cpf-table--rows-container-flex'>
                {generateTableRows(props.tableContent, props)}
            </div>
        </div>
    );
};



export default CpfTableDesktop;
