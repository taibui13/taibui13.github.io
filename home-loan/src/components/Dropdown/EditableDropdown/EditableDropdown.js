import React from 'react';
import PropTypes from 'prop-types';
import ScrollLock from "react-scroll-lock-component";
import 'babel-polyfill';

import './EditableDropdown.css';

import arrowDownImg from './../../../assets/images/icon-arrow-solid-down.svg';
import crossImg from './../../../assets/images/cross-grey.svg';
import searchImg from './../../../assets/images/search_icon.svg';


const uniqueId = () => {
  return 'id-' + Math.random().toString(36).substr(2, 16);
};

const EditableDropdown = props => {
  const {
    inputID,
    isFocus,
    isValid,
    isDisabled,
    errorMsg,
    label,
    value,
    searchValue,
    dropdownItems,
    onBlur,
    onFocus,
    onClick,
    onSearchChange,
    withFlagImg,
    excludes,
    focusOutItem,
    exampleLabels,
    duplicateValue
  } = props;

  const renderDropdownItems = myFunc => (item, i) => {
    let flagImg = `./images/countriesFlags/${item.value.toLowerCase()}.svg`;
    return (
      <div
        key={i}
        onClick={
            myFunc
                ? () => {
                    myFunc(item);
                    onBlur();
                }
                : () => {
                    onBlur();
                }
        }
        className='dropdown-selection-item'
      >
      {withFlagImg ? <img src={flagImg} className='countryFlag' onError={(e) => {e.target.style.display='none'}}  alt='icon'/> : null }
        {item.description}
      </div>
    );
  };

  const onDropListBlur = (e) => {
      focusOutItem && !focusInCurrentTarget(e) && onBlur();
  }

  const focusInCurrentTarget = ({ relatedTarget, currentTarget }) => {
    if (relatedTarget === null) return false;
    let node = relatedTarget.parentNode;
    while (node !== null) {
      if (node === currentTarget) return true;
      node = node.parentNode;
    }
    return false;
  }

  const mapValueToLabel = (arrayOfItems, value) => {
    const item = arrayOfItems.find((x) => x.value === value);
    return item ? item.description : value;
  };

  const mapValueToLabelDuplicate = (arrayOfItems, value) => {
    const item = arrayOfItems.find((x) => x.value.substr(0, value.length) === value);
    return item ? item.description : value;
  };

  const focus = isFocus || value || !isValid ? "--focused" : "";
  const showErrorLabel = isValid ? "" : "dropdownLabel--error";
  const containerErrorStyle = isValid ? "" : "dropdown--content--error";
  const searchFocus = isFocus ? "--focused" : "";
  const renderItems = renderDropdownItems(onClick);

  let newDropdownItems = dropdownItems;
  if (excludes && excludes.length > 0) {
    newDropdownItems = dropdownItems.filter(item => !excludes.includes(item.value));
  }

  let searchRef;
  let flagImg = `./images/countriesFlags/${value.toLowerCase()}.svg`;
  return (
    <div>
      <div className='dropdown' tabIndex='0' id={inputID ? inputID : uniqueId()} onBlur={(e) => onDropListBlur(e)} >
        <div className='dropdown--vertical-container' >
          <div
            className={"dropdown-container" + focus}
            onClick={() => {
              if(isDisabled) {
                return null;
              }
              const searchInput = searchRef;
              if (newDropdownItems.length > 5) {
                  setTimeout(() => searchInput.focus(), 0);
              }
              return isFocus ?  onBlur() : onFocus();
            }}
          >
            <div className={`dropdown--content ${containerErrorStyle}`}>
                <div className='dropdown--content-left'>
                    <div className={"dropdown--inputLabel" + focus + " " + showErrorLabel}>
                        {`${label}${isValid ? "" : ` ${errorMsg}`}`}
                    </div>
                    <div className='dropdown--value-text'>
                        {withFlagImg ? <img src={flagImg} className='countryFlag' onError={(e) => {e.target.style.display='none'}}  alt='icon'/> : null}
                        {duplicateValue ? mapValueToLabelDuplicate(newDropdownItems, value) : mapValueToLabel(newDropdownItems,value)}
                    </div>
                </div>
                <img
                    className='dropdown--inputArrow'
                    src={arrowDownImg}
                    alt='dropdown-arrow'
                />
            </div>
          </div>

          <div className={"dropdown--search-and-selection-flex-container" + searchFocus}>
            {newDropdownItems.length > 5 &&
              <div className={"dropdown--input-container" + searchFocus}>
                <img
                  src={crossImg}
                  onClick={onBlur ? onBlur : null}
                  className='dropdown--input-searchInput--crossIcon'
                  alt='crossIcon'
                />
                <input
                  onChange={onSearchChange ? onSearchChange : null}
                  onFocus={onFocus ? onFocus : null}
                  className={"dropdown--searchValue" + searchFocus}
                  value={searchValue}
                  placeholder='Search'
                  ref={search => (searchRef = search)}
                />
                <img
                  src={searchImg}
                  className='dropdown--input-searchInput--icon'
                  alt='searchIcon'
                />
              </div>
            }
            <ScrollLock>
              <div className={"dropdown-selection" + searchFocus}>
                {newDropdownItems
                  .filter(item => item.description.toLowerCase().includes(searchValue.toLowerCase()))
                  .map(renderItems)}
                <div className='iphone-fix' />
              </div>
            </ScrollLock>
          </div>
        </div>
      </div>
        {exampleLabels !== '' &&  exampleLabels && <div className={`uob-other-info${focus}`}>{exampleLabels}</div>}
      </div>
  );
};

EditableDropdown.propTypes = {
  label: PropTypes.string.isRequired,
  dropdownItems: PropTypes.array.isRequired,
  isFocus: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func
};

EditableDropdown.defaultProps = {
  isFocus: false,
  isValid: true,
  dropdownItems: [],
  errorMsg: '',
  label: 'Label',
  value: '',
  searchValue: '',
  isDisabled: false,
  focusOutItem: true,
  duplicateValue: false
};

export default EditableDropdown;
