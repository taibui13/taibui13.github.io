import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from './../components/TextInput/TextInput';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';
import Dropdown from './../components/Dropdown/Dropdown';
import { handleTextInputChange, handleIstoggled, setDropdownFocusStatus, changeSearchInputValue, selectDropdownItem } from './../actions/residentialDetailsAction';
import { setToNotRequired } from './../actions/localAddressInputAction';
import { mapValueToDescription } from './../common/utils';
import ToggleInput from './../components/ToggleInput/ToggleInput';
import LocalAddressInput from './../components/Uob/LocalAddressInput/LocalAddressInput';
import { countriesLabelValue } from './../constants/countriesMaps';

class ResidentialDetailsPage extends Component {

  handleToWorkDetails() {
    this.props.onContinue();
  }

  handleOnClick() {
    const { dispatch, residentialDetailsReducer } = this.props;
    dispatch(handleIstoggled(residentialDetailsReducer.mailingAddress.isToggled));
  }

  handleOnSearchChange(e, field) {
    const { dispatch } = this.props;
    const value = e.target.value;
    dispatch(changeSearchInputValue(value, field))
  }


  handleOnChange(data, field) {
    const { dispatch } = this.props;
    dispatch(handleTextInputChange(data, field));
  }

  _getCountryValueLabel = (countryvalue) => {
    const tmpArray = [];
    countryvalue.map((item) => {
      tmpArray.push({
        value: item.value,
        description: item.label
      });
      return tmpArray;
    });
    return tmpArray;
  }

  handleDropdownBlur(field) {
    const { dispatch } = this.props;
    dispatch(setDropdownFocusStatus(false, field));
  }

  handleDropdownFocus(field) {
    const { dispatch } = this.props;
    dispatch(setDropdownFocusStatus(true, field));
  }

  handleDropdownClick(data, field) {
    const { dispatch, residentialDetailsReducer } = this.props;
    if (data.value === "BG" || data.value === "SM" || data.value === "TE") {
      if (field === "propertyType") {
        dispatch(setToNotRequired("homeLevel"));
        dispatch(setToNotRequired("homeUnit"));
      }

      if (field === "mailingPropertyType") {
        dispatch(setToNotRequired("mailingLevel"));
        dispatch(setToNotRequired("mailingUnit"));
      }
    }

    if (residentialDetailsReducer[field].value === data.value) {
      return;
    }

    dispatch(selectDropdownItem(data.value, field, data.description));
  }

  render() {
    const { residentialDetailsReducer, commonReducer } = this.props;
    const {
      propertyType,
      mailingAddress,
      country,
      overseasAddress1,
      overseasAddress2,
      overseasAddress3,
      overseasAddress4,
      city,
      mailingPropertyType
    } = residentialDetailsReducer;
    const residentialDetailsValue = commonReducer.appData.residentialDetails;
    const labels = residentialDetailsValue.labels;
    const inputValues = commonReducer.appData.inputValues ? commonReducer.appData.inputValues : '';
    const propertyTypeAddressList = inputValues.propertyTypeAddress;
    const errorMsgList = commonReducer.appData.errorMsgs;

    const readOnlyFields = commonReducer.appData.myInfoReadonlyFields;
    const isReadOnlyField = (field) => {
      const isReadField = readOnlyFields[field] ? readOnlyFields[field] : false;
      return isReadField;
    }

    return (
      <div className='uob-content' id='residentialDetails-section'>
        <h1>{residentialDetailsValue.title}</h1>
        <div className='uob-form-separator' />
        <p className='uob-headline'>{residentialDetailsValue.subtitle}</p>
        <div className='uob-input-separator'>
          <LocalAddressInput labels={labels} errorMsgList={errorMsgList} addressType='home' isReadOnly={isReadOnlyField} />
        </div>

        <div className='uob-input-separator'>
          <Dropdown
            inputID='propertyType'
            isFocus={propertyType.isFocus}
            label={labels.propertyType}
            isValid={propertyType.isValid}
            errorMsg={propertyType.errorMsg}
            searchValue={propertyType.searchValue}
            value={propertyTypeAddressList[propertyType.value]}
            dropdownItems={mapValueToDescription(propertyTypeAddressList)}
            onBlur={this.handleDropdownBlur.bind(this, 'propertyType')}
            onFocus={this.handleDropdownFocus.bind(this, 'propertyType')}
            onClick={(data) => this.handleDropdownClick(data, 'propertyType')}
            onSearchChange={(event) => this.handleOnSearchChange(event, 'propertyType')}
            isReadOnly={isReadOnlyField('propertyType')}
            exampleLabels={labels.propertyTypeEg}
          />
        </div>

        <div className='uob-input-separator'>
          <ToggleInput
            inputID={"mailingAddress"}
            description={residentialDetailsValue.mailingToggle.description}
            onClick={this.handleOnClick.bind(this)}
            isToggled={mailingAddress.isToggled}
            exampleLabels={labels.mailingAddressEg}
          />
        </div>
        {mailingAddress.isToggled ?
          <div id='mailingDetails-section'>
            <p className='uob-headline'>{residentialDetailsValue.maillingSubtitle}</p>
            <div className='uob-input-separator' />
            <Dropdown
              inputID={"country"}
              isDisabled={false}
              isFocus={country.isFocus}
              label={labels.country}
              value={country.value}
              isValid={country.isValid}
              errorMsg={country.errorMsg}
              dropdownItems={this._getCountryValueLabel(countriesLabelValue)}
              searchValue={country.searchValue}
              onBlur={this.handleDropdownBlur.bind(this, 'country')}
              onFocus={this.handleDropdownFocus.bind(this, 'country')}
              onClick={(data) => this.handleDropdownClick(data, 'country')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'country')}
              exampleLabels={labels.countryEg}
            />
            {country.value !== 'SG' ?
              <div>
                <div className='uob-input-separator' />
                <TextInput
                  inputID='overseasAddress1'
                  label={labels.overseasAddress1}
                  value={overseasAddress1.value}
                  errorMsg={overseasAddress1.errorMsg}
                  onChange={(data) => this.handleOnChange(data, 'overseasAddress1')}
                  isValid={overseasAddress1.isValid}
                  validator={["required", "isAlphanumericSymbol", "maxSize|30"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.overseasAddress1Eg}
                />

                <div className='uob-input-separator' />
                <TextInput
                  inputID='overseasAddress2'
                  label={labels.overseasAddress2}
                  value={overseasAddress2.value}
                  errorMsg={overseasAddress2.errorMsg}
                  onChange={(data) => this.handleOnChange(data, 'overseasAddress2')}
                  isValid={overseasAddress2.isValid}
                  validator={[ "isAlphanumericSymbol", "maxSize|30"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.overseasAddress2Eg}
                />
                <div className='uob-input-separator' />
                <TextInput
                  inputID='overseasAddress3'
                  label={labels.overseasAddress3}
                  value={overseasAddress3.value}
                  errorMsg={overseasAddress3.errorMsg}
                  onChange={(data) => this.handleOnChange(data, 'overseasAddress3')}
                  isValid={overseasAddress3.isValid}
                  validator={["isAlphanumericSymbol", "maxSize|30"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.overseasAddress3Eg}
                />

                <div className='uob-input-separator' />
                <TextInput
                  inputID='overseasAddress4'
                  label={labels.overseasAddress4}
                  value={overseasAddress4.value}
                  errorMsg={overseasAddress4.errorMsg}
                  onChange={(data) => this.handleOnChange(data, 'overseasAddress4')}
                  isValid={overseasAddress4.isValid}
                  validator={["isAlphanumericSymbol", "maxSize|30"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.overseasAddress4Eg}
                />

                <div className='uob-input-separator' />
                <TextInput
                  inputID='city'
                  label={labels.city}
                  value={city.value}
                  errorMsg={city.errorMsg}
                  onChange={(data) => this.handleOnChange(data, 'city')}
                  isValid={city.isValid}
                  validator={["required", "maxSize|20"]}
                  errorMsgList={errorMsgList}
                  exampleLabels={labels.cityEg}
                />

              </div>
              : <div>
                <div className='uob-input-separator' />
                <Dropdown
                  inputID='mailingPropertyType'
                  isFocus={mailingPropertyType.isFocus}
                  label={labels.propertyType}
                  isValid={mailingPropertyType.isValid}
                  errorMsg={mailingPropertyType.errorMsg}
                  searchValue={mailingPropertyType.searchValue}
                  value={propertyTypeAddressList[mailingPropertyType.value]}
                  dropdownItems={mapValueToDescription(propertyTypeAddressList)}
                  onBlur={this.handleDropdownBlur.bind(this, 'mailingPropertyType')}
                  onFocus={this.handleDropdownFocus.bind(this, 'mailingPropertyType')}
                  onClick={(data) => this.handleDropdownClick(data, 'mailingPropertyType')}
                  onSearchChange={(event) => this.handleOnSearchChange(event, 'mailingPropertyType')}
                  exampleLabels={labels.mailingPropertyTypeEg}
                />
                <LocalAddressInput labels={labels} errorMsgList={errorMsgList} addressType='mailing' />
              </div>
            }
          </div>
          : null}
        <div className='uob-input-separator' />
          { residentialDetailsValue.terms !== '' &&
            <div className="uob-terms" dangerouslySetInnerHTML={{__html: residentialDetailsValue.terms}}/>
          }

        {
          commonReducer.currentSection === 'residentialDetails' &&
          <div className='uob-button-separator'>
            <PrimaryButton label={labels.continueButton}
              onClick={this.handleToWorkDetails.bind(this)}
            />
          </div>
        }

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { residentialDetailsReducer, commonReducer, localAddressInputReducer } = state;
  return { residentialDetailsReducer, commonReducer, localAddressInputReducer };
}

export default connect(mapStateToProps)(ResidentialDetailsPage);
