import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import nonEditableImg from './../../../assets/images/non-editable-icon4.svg';
import "./IncomeBreakdownTableMobile.css";

import arrowImg from './../../../assets/images/arrow.svg';

const getValueByCode = (code, list) => {
  const item = list.find(x => x.incomeType === code);
  return item ? item.value  : null;
}

const Row = props => {
    const {
      tableContent,
      colTitles,
      openRows,
      collapseTableRow,
      expandTableRow
    } = props;

    const tmpArray = [];
    return tableContent.map((row, i) => {
        const objects = Object.keys(row);
        const objSort = objects.sort((a, b) =>{
          return b - a;
        })
        objSort.map((value , i) => {
          const isRowOpen = openRows.includes(i) ? true : false;
          const arrowClass = isRowOpen ? "income-table-mobile-arrow--selected" : "income-table-mobile-arrow";
          const contentClass = isRowOpen ? "income-table-mobile-content-container--selected" : "";
          const handleClick = () =>
              isRowOpen
                  ? collapseTableRow && collapseTableRow(i)
                  : expandTableRow && expandTableRow(i);

          const YearlyAssessableIncome = getValueByCode("YearlyAssessableIncome", row[value]) ? parseFloat(getValueByCode("YearlyAssessableIncome", row[value]), 10).toFixed(2) : '';
          const YearlyEmploymentIncome = getValueByCode("YearlyEmploymentIncome", row[value]) ? parseFloat(getValueByCode("YearlyEmploymentIncome", row[value]), 10).toFixed(2) : '';
          const YearlyTradeIncome = getValueByCode("YearlyTradeIncome", row[value]) ? parseFloat(getValueByCode("YearlyTradeIncome", row[value]), 10).toFixed(2) : '';
          const YearlyInterestIncome = getValueByCode("YearlyInterestIncome", row[value]) ? parseFloat(getValueByCode("YearlyInterestIncome", row[value]), 10).toFixed(2) : '';
          const YearlyRentIncome = getValueByCode("YearlyRentIncome", row[value]) ? parseFloat(getValueByCode("YearlyRentIncome", row[value]), 10).toFixed(2) : '';
          let YearlyCategory = getValueByCode("YearlyCategory", row[value]) ? getValueByCode("YearlyCategory", row[value]) : '';
          const YearlyTaxClearance = row[value] ? getValueByCode("YearlyTaxClearance", row[value]) : '';
          YearlyCategory = YearlyTaxClearance === "YES" ? YearlyCategory + " - CLEARANCE" : YearlyCategory;
          const year = value === null || value === '' || value === 'NA' || value === 'null' ? '' : value;

          const assessableIncome = YearlyAssessableIncome === null || YearlyAssessableIncome === '' || YearlyAssessableIncome === 'NA' || YearlyAssessableIncome === 'null';
          const employmentIncome = YearlyEmploymentIncome === null || YearlyEmploymentIncome === '' || YearlyEmploymentIncome === 'NA' || YearlyEmploymentIncome === 'null';
          const tradeIncome = YearlyTradeIncome === null || YearlyTradeIncome === '' || YearlyTradeIncome === 'NA' || YearlyTradeIncome === 'null';
          const interestIncome = YearlyInterestIncome === null || YearlyInterestIncome === '' || YearlyInterestIncome === 'NA' || YearlyInterestIncome === 'null';
          const catergory = YearlyCategory === null || YearlyCategory === '' || YearlyCategory === 'NA' || YearlyCategory === 'null';
          const rentalIncome = YearlyRentIncome === null || YearlyRentIncome === '' || YearlyRentIncome === 'NA' || YearlyRentIncome === 'null';

          const yearAndCatergory = !catergory ?  `${year} (${YearlyCategory})` : `${year}`

          if(!assessableIncome || !employmentIncome || !tradeIncome ||!rentalIncome ||!interestIncome) {
            tmpArray.push(
              <div key={i}>
              <div className={"income-table-mobile-container-item"}>
                  <div className='income-table-mobile-title-container' onClick={handleClick}>
                      <img src={arrowImg} alt='tick' className={arrowClass} />
                      <div className='income-table-mobile-title-checkbox-container'>
                          <div className='income-table-mobile-title'>{yearAndCatergory}</div>
                      </div>
                  </div>
                  <div className={`income-table-mobile-content-container ${contentClass}`}>
                      {isRowOpen &&
                        <div>
                          <div className='income-table-mobile-content-item-container'>
                              <div className='income-table-mobile-content-item-title'>{colTitles[1]}</div>
                              <div className='income-table-mobile-content-item-data'>
                              <NumberFormat
                                value={!assessableIncome ? YearlyAssessableIncome : '0.00'}
                                displayType={'text'}
                                thousandSeparator={true}
                                prefix={'$'}
                              />
                              </div>
                          </div>
                          <div className='income-table-mobile-content-item-container'>
                              <div className='income-table-mobile-content-item-title'>{colTitles[2]}</div>
                              <div className='income-table-mobile-content-item-data'>
                              <NumberFormat value={!employmentIncome? YearlyEmploymentIncome : '0.00'}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              />
                              </div>
                          </div>
                          <div className='income-table-mobile-content-item-container'>
                              <div className='income-table-mobile-content-item-title'>{colTitles[3]}</div>
                              <div className='income-table-mobile-content-item-data'>
                              <NumberFormat value={!tradeIncome? YearlyTradeIncome : '0.00'}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              />
                              </div>
                          </div>
                          <div className='income-table-mobile-content-item-container'>
                              <div className='income-table-mobile-content-item-title'>{colTitles[4]}</div>
                              <div className='income-table-mobile-content-item-data'>
                              <NumberFormat value={!rentalIncome ? YearlyRentIncome: '0.00'}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              />
                              </div>
                          </div>
                          <div className='income-table-mobile-content-item-container'>
                              <div className='income-table-mobile-content-item-title'>{colTitles[5]}</div>
                              <div className='income-table-mobile-content-item-data'>
                              <NumberFormat value={!interestIncome? YearlyInterestIncome: '0.00'}
                              displayType={'text'}
                              thousandSeparator={true}
                              prefix={'$'}
                              />
                              </div>
                          </div>
                        </div>
                      }
                  </div>
              </div>
              </div>
            );
          }
          return tmpArray;
        });
        return tmpArray;
    });
};

const IncomeBreakdownTableMobile = props => {
    return (
        <div className='income-table-mobile-container'>
          <div className='income-mobile-breakdown-table-header'>
            <span> {props.label} </span>
            <img
              className={"verified-img"}
              src={nonEditableImg}
              alt='verified'
            />
          </div>
          {Row(props)}
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


IncomeBreakdownTableMobile.propTypes = {
    colTitles: PropTypes.array.isRequired,
    tableContent: PropTypes.array.isRequired,
    pid: PropTypes.string
};

export default IncomeBreakdownTableMobile;
