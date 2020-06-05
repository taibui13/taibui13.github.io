import React from 'react';
import './IncomeBreakdownTableDesktop.css';
import NumberFormat from 'react-number-format';
import nonEditableImg from './../../../assets/images/non-editable-icon4.svg';

const getValueByCode = (code, list) => {
  const item = list.find(x => x.incomeType === code);
  return item ? item.value  : null;
}

const generateTableRows = (tableContent, isThereRental, isThereCatergory) => {
    const tmpArray = [];
    return tableContent.map((row, i) => {
        const objects = Object.keys(row);
        const objSort = objects.sort((a, b) =>{
          return b - a;
        })
        objSort.map((value , i) => {
          const YearlyAssessableIncome = getValueByCode("YearlyAssessableIncome", row[value]) ? getValueByCode("YearlyAssessableIncome", row[value]) : '';
          const YearlyEmploymentIncome = getValueByCode("YearlyEmploymentIncome", row[value]) ? getValueByCode("YearlyEmploymentIncome", row[value]) : '';
          const YearlyTradeIncome = getValueByCode("YearlyTradeIncome", row[value]) ? getValueByCode("YearlyTradeIncome", row[value]) : '';
          const YearlyRentIncome = getValueByCode("YearlyRentIncome", row[value]) ? getValueByCode("YearlyRentIncome", row[value]) : '';
          const YearlyCategory = getValueByCode("YearlyCategory", row[value]) ? getValueByCode("YearlyCategory", row[value]) : '';

          const year = value === null || value === '' || value === 'NA' || value === 'null' ? '' : value;
          const catergory = YearlyCategory === null || YearlyCategory === '' || YearlyCategory === 'NA' || YearlyCategory === 'null';

          const assessableIncome = YearlyAssessableIncome === null || YearlyAssessableIncome === '' || YearlyAssessableIncome === 'NA' || YearlyAssessableIncome === 'null';
          const employmentIncome = YearlyEmploymentIncome === null || YearlyEmploymentIncome === '' || YearlyEmploymentIncome === 'NA' || YearlyEmploymentIncome === 'null';
          const tradeIncome = YearlyTradeIncome === null || YearlyTradeIncome === '' || YearlyTradeIncome === 'NA' || YearlyTradeIncome === 'null';
          const rentalIncome = YearlyTradeIncome === null || YearlyTradeIncome === '' || YearlyTradeIncome === 'NA' || YearlyTradeIncome === 'null';

          const yearAndCatergory = !catergory && isThereCatergory ?  `${year} (${YearlyCategory})` : `${year}`;
          const year0 = isThereCatergory ? "year0" : "";

          if(!assessableIncome || !employmentIncome || !tradeIncome || !rentalIncome ) {
            tmpArray.push(
              <div key={i}>
                  <div className='income-breakdown-table--separator' />
                  <div className={`income-breakdown-table--row-flex`}>
                      <div className={`income-breakdown-table--row-item ${year0}`}>{yearAndCatergory}</div>
                      <div className='income-breakdown-table--row-item'>
                        <NumberFormat value={YearlyAssessableIncome}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        />
                      </div>
                      <div className='income-breakdown-table--row-item'>
                        <NumberFormat value={YearlyTradeIncome}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        />
                      </div>
                      <div className='income-breakdown-table--row-item'>
                        <NumberFormat value={YearlyEmploymentIncome}
                        displayType={'text'}
                        thousandSeparator={true}
                        prefix={'$'}
                        />
                      </div>
                      { isThereRental &&
                        <div className='income-breakdown-table--row-item'>
                          <NumberFormat value={YearlyRentIncome}
                          displayType={'text'}
                          thousandSeparator={true}
                          prefix={'$'}
                          />
                        </div>
                      }
                  </div>
              </div>
            );
          }
          return tmpArray;
        });
        return tmpArray;
    });
};

const IncomeBreakdownTableDesktop = props => {
    return (
        <div className='income-breakdown-table--main-container-flex'>
            <div className='income-breakdown-table-header'>
              <span> {props.label} </span>
              <img
                className={"verified-img"}
                src={nonEditableImg}
                alt='verified'
              />
            </div>
            <div className='income-breakdown-table--titles-container-flex'>
                {props.colTitles.map((title, i) => <div key={i} className= {`income-breakdown-table--title-flex ${props.year0.replace("{i}", i)}`}>{title}</div>)}
            </div>
            <div className='income-breakdown-table--rows-container-flex'>
                {generateTableRows(props.tableContent,props.isThereRental, props.isThereCatergory, props)}
            </div>
        </div>
    );
};



export default IncomeBreakdownTableDesktop;
