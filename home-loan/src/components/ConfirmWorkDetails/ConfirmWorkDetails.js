import React from 'react';
import './ConfirmWorkDetails.css';
import { setExpandedTableRow } from '../../actions/workDetailsAction';
import edit_blue_icon from './../../assets/images/edit_blue_icon.svg';
import NOATable from '../NOATable/NOATable';
import CpfTable from '../CpfTable/CpfTable';

const ConfirmWorkDetails = props => {
  const {title, hasEdit, onClick, items, others, gotTitle, workDetailsReducer: {NOAhistory, cpfcontributions}, commonReducer} = props;
  const noTableTitle = gotTitle ? '--no-title' : '--title';
  const hasEditButton = hasEdit ? '--have-button' : '--no-button';
  const labels = commonReducer.appData && commonReducer.appData.workDetails && commonReducer.appData.workDetails.labels ? commonReducer.appData.workDetails.labels : {};
  const isMyInfoFlow = commonReducer.isMyInfoFlow;
  
  const handleTableRowExpand = (i, status) => {
    const { dispatch } = props;
    dispatch(setExpandedTableRow(i, status));
  }
  const otherNames = () => {
    const tmpArray = [];
    others.map((item, index) => {
      if(item !== '') tmpArray.push(<div key={index} style={{fontSize: 15}}>{item}</div>);
      return tmpArray;
    });
    return tmpArray;
  }

  const showItems = () => {
    const tmpArray = [];
    items && items.map((item, index) => {
      if (item.value !== '') {
        tmpArray.push(
          <div className='confirmWorkDetails-label-container' key={index}>
            <div className= 'confirmWorkDetails-labelValue'>
              <div className ='confirmWorkDetails-LabelCSS'>{item.label}</div>
              <div className = 'confirmWorkDetails-ValueCSS'>{item.value} {others && index === 0 && otherNames()}</div>
            </div>
          </div>
        );
      }
      return tmpArray;
    })
    return tmpArray;
  }
  return(
    <div>
      <div className = 'confirmWorkDetails-flexContainer'>
        <div className= {`confirmWorkDetails-TableTitle ${noTableTitle}` } >{title ? title : null}</div>
        <div className= {`confirmWorkDetails-editButton ${hasEditButton}`}>
        {hasEdit ?
          <div onClick={() => onClick ? onClick() : null}>
            <div className={`confirmWorkDetails-editButton ${hasEditButton}`} >Edit
            <img
              className='confirmWorkDetails-editImg'
              src={edit_blue_icon}
              alt='icon'
            />
            </div>
          </div>
      : null}
        </div>
      </div>
      <div className='confirmWorkDetails-flexContainer'>
          {showItems()}
      </div>
      {
        isMyInfoFlow && NOAhistory.value.length > 0 &&
          <div>
            <NOATable
                isHideTitle={false}
                isHideTitleIcon={true}
                title={labels.NOAHeader}
                colTitles={labels.NOATableTitle}
                tableContent={NOAhistory.value}
            />
          </div>
      }
      {
        cpfcontributions.value.length > 0 &&
          <CpfTable
            label={labels.cpfContribution}
            colTitles={labels.cpfColTile}
            openRows={cpfcontributions.openRows}
            tableContent={cpfcontributions.value}
            expandTableRow={(i) => handleTableRowExpand(i, true)}
            collapseTableRow={(i) => handleTableRowExpand(i, false)}
            {...this.props}
          />
      }
    </div>)
}

export default ConfirmWorkDetails;
