import React from 'react';
import PropTypes from 'prop-types';

import './ReadOnlyDropdown.css';

import nonEditableImg from './../../../assets/images/non-editable-icon4.svg';

const ReadOnlyDropdown = props => {
  const { label, value, dropdownItems, withFlagImg, inputID, exampleLabels } = props;
  const mapValueToLabel = (arrayOfItems, value) => {
    const item = arrayOfItems.find(x => x.value === value);
    return item ? item.description : value;
  };
  let flagImg = `./images/countriesFlags/${value.toLowerCase()}.svg`;
  return (
    <div>
      <div id={inputID} className='ready-only-dropdown'>
        <div className='dropdown--vertical-container' tabIndex='1'>
          <div className={"ready-only-dropdown-container--focused"}>
            <div className='dropdown--content'>
              <div className='dropdown--content-left'>
                <div className={"dropdown--inputLabel--focused"}>
                  {`${label}`}
                </div>
                <div className='dropdown--value-text'>
                  {withFlagImg ? <img src={flagImg} className='countryFlag' onError={(e) => {e.target.style.display='none'}}  alt='icon'/> : null}
                  {mapValueToLabel(dropdownItems, value)}
                </div>
              </div>
              <img
                className='read-only-dropdown--inputArrow'
                src={nonEditableImg}
                alt='dropdown-arrow'
              />
            </div>
          </div>
        </div>
      </div>
      {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info--focused`}>{exampleLabels}</div>}
    </div>
  );
};

ReadOnlyDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  dropdownItems: PropTypes.array.isRequired
};

ReadOnlyDropdown.defaultProps = {
  dropdownItems: [],
  label: 'Label',
  value: ''
};

export default ReadOnlyDropdown;
