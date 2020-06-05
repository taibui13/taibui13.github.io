import React from 'react';
import './ConfirmDetails.css';
import edit_blue_icon from './../../assets/images/edit_blue_icon.svg';
import pdfUrl from './../../assets/images/pdf-file.svg';
const ConfirmDetails = props => {
  const {title, hasEdit, onClick, items, others, gotTitle} = props;
  const noTableTitle = gotTitle ? '--no-title' : '--title';
  const hasEditButton = hasEdit ? '--have-button' : '--no-button';
  const otherNames = () => {
    const tmpArray = [];
    others.map((item, index) => {
      if(item !== '') tmpArray.push(<div key={index} style={{fontSize: 15}}>{item}</div>);
      return tmpArray;
    });
    return tmpArray;
  }
  const isFileStep = (items || []).filter(e => (e.object && e.object.content));
  const showItems = () => {
    const tmpArray = [];
    items && items.map((item, index) => {
      if (item.value !== '') {
        tmpArray.push(
          <div className={item.object && item.object.content ? 'confirmDetails-label-container-image' :'confirmDetails-label-container'} key={index}>
            <div className= 'confirmDetails-labelValue'>
              <div> 
                {
                  item.object && item.object.content &&
                  <div> <img className={item.object.fileType.includes("pdf") ? "pdf" : "image"} src={item.object.fileType.includes("pdf") ? pdfUrl : item.object.content }  
                   alt="#"/> </div>
                }
              </div>  
              <div>
              <div className ='confirmDetails-LabelCSS'>{item.label}</div>
              <div className = 'confirmDetails-ValueCSS' >{item.value} {others && index === 0 && otherNames()}</div>
              </div>
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
      <div className = 'confirmDetails-flexContainer-title'>
        <div className= {`confirmDetails-TableTitle ${noTableTitle}` } >{title ? title : null}</div>
        <div className= {`confirmDetails-editButton ${hasEditButton}`}>
        {hasEdit ?
          <div onClick={() => onClick ? onClick() : null}>
            <div className={`confirmDetails-editButton ${hasEditButton}`} >Edit
            <img
              className='confirmDetails-editImg'
              src={edit_blue_icon}
              alt='icon'
            />
            </div>
          </div>
      : null}
        </div>
      </div>
      <div className={isFileStep.length > 0 ? 'confirmDetails-flexContainer-image' : 'confirmDetails-flexContainer'}>
          {showItems()}
      </div>
    </div>)
}

export default ConfirmDetails;
