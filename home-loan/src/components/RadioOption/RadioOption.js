import React from 'react';
import PropTypes from 'prop-types';
import {eliminateDuplicates} from './../../common/utils'
import houseIcon from './../../assets/images/homeloan/blue-home-icon.png';
import './RadioOption.css';

export const getFullObjByCode = (code, list) => {
  const index = parseInt(code, 10);
  const item = list.find(x => x.index === index);
  return item ? item : null;
}

const generateTableRows = (tableContent, label) => {
    const sortArray = tableContent.sort((a, b) => a.index > b.index);
    const index0 = getFullObjByCode("0", sortArray) ? getFullObjByCode("0", sortArray) : {};
    let reorderArray = sortArray.filter(x => x.index !== 0);
    reorderArray.push(index0);
    const length = reorderArray.length;
    const previousIndex = length > 1 ? length - 2 : 0;
    const previousIndexTenure = reorderArray[previousIndex].tenure ? parseInt(reorderArray[previousIndex].tenure/12, 10) + 1: 1;
    let tmpArray = [];
    let afterAdding = [];
    for ( let i = 0 ; i < reorderArray.length ; i++){
      tmpArray.push(reorderArray[i].tenure);
    }
    tmpArray.reduce((a,b,i) => {
      return afterAdding[i] = a+b;
    }, 0)

    return reorderArray.map((row, i) => {
      const rateDetails = row.rateDetails && row.rateDetails[0] && row.rateDetails[0].jrDesc ? `${row.rateDetails[0].jrDesc}` : "";
      let loanTenure = "";
      let interestRate = "";
      if ( row.index === 0 && reorderArray.length > 1 ) {
        loanTenure = label.labelForIndex0Muti
      } else if ( row.index === 0 && reorderArray.length === 1  ) {
        loanTenure = label.labelForIndex0Single.replace("{years}", previousIndexTenure)
      } else {
        loanTenure = parseInt((afterAdding[i] / 12) , 10)
      }

      if(label.fixedintBaseRateCode.indexOf(row.intBaseRateCode) === 0){
        interestRate = `${row.standardRate} ${label.fixedInterestRate}`
      } else {
        if(parseFloat(row.standardRate) > 0 ) {
          interestRate = ` ${rateDetails} ${label.addSign} ${row.standardRate}`
        } else {
            interestRate = ` ${rateDetails} ${row.standardRate}`
        }
      }
      const checkEmptyRow = Object.keys(row).length === 0;
        return (
          <div key={i}>
            {
              !checkEmptyRow &&
              <div className="radio-option--row-flex">
                  <div className='radio-option--row-item'>{loanTenure}</div>
                  <div className='radio-option--row-item'>{interestRate}</div>
              </div>
            }
          </div>
        )
    });
};

const generateDescriptionHeader = (tableContent, label) => {
  const sortArray = tableContent.sort((a, b) => a.index > b.index);
  const index0 = getFullObjByCode("0", sortArray) ? getFullObjByCode("0", sortArray) : [];
  let reorderArray = sortArray.filter(x => x.index !== 0);
  reorderArray.push(index0);
  let tmpArray = [];
  let noDescptionNeeded = [];
  noDescptionNeeded.push(...label.fixedintBaseRateCode, ...label.siborintBaseRateCode)
  for(let i = 0 ; i < reorderArray.length ; i++) {
      if(noDescptionNeeded.indexOf(reorderArray[i].intBaseRateCode) === -1) {
        const rateDetailsPercentage = reorderArray[i].rateDetails && reorderArray[i].rateDetails[0] && reorderArray[i].rateDetails[0].jrCurRt ? `${reorderArray[i].rateDetails[0].jrCurRt}` : "";
        const rateDetailsDescription = reorderArray[i].rateDetails && reorderArray[i].rateDetails[0] && reorderArray[i].rateDetails[0].jrDesc ? `${reorderArray[i].rateDetails[0].jrDesc} = ` : "";
        const ratedetailsInPercent = rateDetailsPercentage !== "" ?( (parseFloat((parseFloat(rateDetailsPercentage) * 100))).toFixed(2)).toString() : "" ;
        const isPercentDescEmpty = ratedetailsInPercent !== "" && rateDetailsDescription !== "" ? `${label.percentage}` : "";
        const percentAndDescription = `${rateDetailsDescription} ${ratedetailsInPercent}${isPercentDescEmpty}`
        tmpArray.push(percentAndDescription)
      }
  }
  const removeDuplicates = eliminateDuplicates(tmpArray) ;
  return removeDuplicates.map((row, i) => {
      return (
        <div key={i}>
          <label className='radio-button-title'> {`${row}`} </label>
        </div>
      )
  });
}

const RadioOption = props => {
  const { isReadOnly, isSelected, option, onClick, label, colTitles, tableContent, inputID, lengthOfItem } = props;
  const selectedClass = isSelected ? 'radio-option-item--selected' : '';
  const packageLessThan2 = lengthOfItem < 2 ? 'radio-option-one-item' : ''
  return (
    <div id={inputID} className={`radio-option-container ${packageLessThan2}`}>
      <div className='radio-option-row'>
          <div onClick={() => !isReadOnly && onClick && onClick(option.loanPackageCode, option.loanPackageDescription)} className={`radio-option-item ${selectedClass}`}>
            <div className='radio-option-middle'>
              <div className='radio-option-middle-top'>
                  <img src={houseIcon} alt='home' className='radio-button-home-icon' />
                  <div className='radio-option-middle-title'>
                    <label className='radio-button-title'>{option.loanPackageDescription}</label>
                    {generateDescriptionHeader(tableContent, label)}
                  </div>
              </div>
              <div className='radio-option--titles-container-flex'>
                  {colTitles.map((title, i) => <div key={i} className='radio-option--title-flex'>{title}</div>)}
              </div>
              <div className='radio-option--rows-container-flex'>
                  {generateTableRows(tableContent, label)}
              </div>
            </div>
          </div>
      </div>
    </div>
  );

};

RadioOption.propTypes = {
  isReadOnly: PropTypes.bool,
  isSelected: PropTypes.bool,
  option: PropTypes.object.isRequired
};

RadioOption.defaultProps = {
  isReadOnly: false
};

export default RadioOption;
