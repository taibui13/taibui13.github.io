import React, { Component } from 'react';
import { connect } from 'react-redux';
import TextInput from './../components/TextInput/TextInput';
import Dropdown from './../components/Dropdown/Dropdown';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';
import GenderSelection from './../components/GenderSelection/GenderSelection';
import { mapValueToDescription } from './../common/utils';
import ToggleInput from './../components/ToggleInput/ToggleInput';
import { setToggleOption } from './../actions/personalDetailsAction';
import { CLEAR_ADDITIONAL_ID } from '../actions/actionTypes'
import * as CONSTANT from '../common/contant';
import {
  setDropdownFocusStatus,
  selectDropdownItem,
  changeSearchInputValue,
  handleTextInputChange,
  changeGenderOption
} from './../actions/personalDetailsAction'

import { dispatchResetUploadStatus } from './../actions/uploadDocumentsAction';

class PersonalDetailsPage extends Component {
    handleToResidentialDetails(){
      this.props.onContinue();
    }

    handleOnChange(data, field) {
      const { dispatch } = this.props;
      dispatch(handleTextInputChange(data, field));
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
      const { dispatch, personalDetailsReducer } = this.props;
      if (personalDetailsReducer[field].value === data.value) {
        return;
      }
      dispatch(selectDropdownItem(data.value, data.description, field));
    }

    handleOnSearchChange(e, field) {
      const { dispatch } = this.props;
      const value = e.target.value;
      dispatch(changeSearchInputValue(value, field));
    }

    handleGenderSelection(value) {
      const { dispatch } = this.props;
      dispatch(changeGenderOption(value));
    }

    handleOnClick(isToggled , field) {
      const { dispatch } = this.props;
      dispatch(setToggleOption(isToggled , field));
      if(field === 'hasDualNationality' && isToggled) {
        dispatch({type: CLEAR_ADDITIONAL_ID});
        dispatch(dispatchResetUploadStatus('additionalPassport'));
      };
    }

    render(){
      const { personalDetailsReducer, commonReducer } = this.props;
      const {
        dateOfBirth,
        maritalStatus,
        countryOfResidence,
        countryOfBirth,
        nationality,
        race,
        gender,
        educationLevel,
        hasDualNationality,
        additionalLegalIdCountry,
        additionalLegalId,
        additionalLegalIdExpiryDate,
        additionalLegalIdIssueCountry,
      } = personalDetailsReducer;
      const personalDetailsValue = commonReducer.appData.personalDetails;
      const labels = personalDetailsValue.labels;
      const inputValues = commonReducer.appData.inputValues ? commonReducer.appData.inputValues : '';
      const countriesNamesMap = inputValues.countriesNamesMap;

      const countriesMapForDualNationality = Object.assign({}, countriesNamesMap);
      delete countriesMapForDualNationality[nationality.value];
      delete countriesMapForDualNationality["SG"];

      const maritalStatusList = inputValues.maritalStatus;
      const raceList = inputValues.race;
      const educationLevelList = inputValues.educationLevel;
      const errorMsgList = commonReducer.appData.errorMsgs;
      const enableCAS = commonReducer.appData.configuration && commonReducer.appData.configuration.personalDetails && commonReducer.appData.configuration.personalDetails.enableDualNationality;
      const readOnlyFields = commonReducer.appData.myInfoReadonlyFields;
      const isReadOnlyField = (field) => {
        const isReadField = readOnlyFields[field] ? readOnlyFields[field] : false;
        return isReadField;
      }

      return(
        <div className='uob-content'  id='personalDetails-section'>
          <h1>{personalDetailsValue.title}</h1>
          <div className='uob-form-separator'/>
          <p className='uob-headline'>{personalDetailsValue.subtitle}</p>
          <div className='uob-input-separator'/>
            <TextInput
              inputID='dateOfBirth'
              isReadOnly={isReadOnlyField('dateOfBirth')}
              label = {labels.dateOfBirth}
              value= {dateOfBirth.value}
              errorMsg={dateOfBirth.errorMsg}
              onChange={(data) => this.handleOnChange(data,'dateOfBirth')}
              isValid={dateOfBirth.isValid}
              isDateFormat
              validator={["required", "isDateOfBirth", "minAge|21"]}
              errorMsgList={errorMsgList}
              exampleLabels={labels.dateOfBirthEg}
            />

          <div className='uob-input-separator'/>
            <GenderSelection
              inputID={"gender"}
              isReadOnly={isReadOnlyField('gender')}
              isValid={gender.isValid}
              errorMsg={gender.errorMsg}
              gender={gender.value}
              onClick={(value) => this.handleGenderSelection(value)}
              exampleLabels={labels.genderEg}
            />

          <div className='uob-input-separator'/>
            <Dropdown
              inputID='maritalStatus'
              isReadOnly={isReadOnlyField('maritalStatus')}
              isFocus={maritalStatus.isFocus}
              focusOutItem={true}
              label={labels.maritalStatus}
              value={maritalStatus.value}
              isValid={maritalStatus.isValid}
              errorMsg={maritalStatus.errorMsg}
              dropdownItems={mapValueToDescription(maritalStatusList)}
              onBlur={this.handleDropdownBlur.bind(this, 'maritalStatus')}
              onFocus={this.handleDropdownFocus.bind(this, 'maritalStatus')}
              onClick={(data) => this.handleDropdownClick(data, 'maritalStatus')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'maritalStatus')}
              exampleLabels={labels.maritalStatusEg}
            />

          <div className='uob-input-separator'/>
            <Dropdown
              inputID='educationLevel'
              isFocus={educationLevel.isFocus}
              isReadOnly={isReadOnlyField('highestQualification')}
              focusOutItem={true}
              label={labels.highestQualification}
              value={educationLevel.value}
              isValid={educationLevel.isValid}
              errorMsg={educationLevel.errorMsg}
              searchValue={educationLevel.searchValue}
              dropdownItems={mapValueToDescription(educationLevelList)}
              onBlur={this.handleDropdownBlur.bind(this, 'educationLevel')}
              onFocus={this.handleDropdownFocus.bind(this, 'educationLevel')}
              onClick={(data) => this.handleDropdownClick(data, 'educationLevel')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'educationLevel')}
              exampleLabels={labels.educationLevelEg}
            />

          <div className='uob-input-separator'/>
            <Dropdown
              inputID='race'
              isReadOnly={isReadOnlyField('race')}
              isFocus={race.isFocus}
              focusOutItem={true}
              label={labels.race}
              value={race.value}
              isValid={race.isValid}
              errorMsg={race.errorMsg}
              dropdownItems={mapValueToDescription(raceList)}
              searchValue={race.searchValue}
              onBlur={this.handleDropdownBlur.bind(this, 'race')}
              onFocus={this.handleDropdownFocus.bind(this, 'race')}
              onClick={(data) => this.handleDropdownClick(data, 'race')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'race')}
              exampleLabels={labels.raceEg}
            />

          <div className='uob-input-separator'/>
            <Dropdown
              inputID='nationality'
              isReadOnly={isReadOnlyField('nationality')}
              isFocus={nationality.isFocus}
              focusOutItem={true}
              label={labels.nationality}
              value={nationality.value}
              isValid={nationality.isValid}
              errorMsg={nationality.errorMsg}
              dropdownItems={mapValueToDescription(countriesNamesMap)}
              searchValue={nationality.searchValue}
              onBlur={this.handleDropdownBlur.bind(this, 'nationality')}
              onFocus={this.handleDropdownFocus.bind(this, 'nationality')}
              onClick={(data) => this.handleDropdownClick(data, 'nationality')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'nationality')}
              exampleLabels={labels.nationalityEg}
            />
            {
            (nationality.value !== CONSTANT.SINGAPORIAN_ID) && enableCAS &&
            <div className="uob-input-separator">
              <ToggleInput
                inputID={"hasDualNationality"}
                isValid={hasDualNationality.isValid}
                errorMsg={hasDualNationality.errorMsg}
                isToggled={hasDualNationality.isToggled}
                onClick={() => this.handleOnClick(hasDualNationality.isToggled, 'hasDualNationality')}
                description={labels.hasDualNationality}
              />
            </div>
          }

          {hasDualNationality.isToggled && (
            <React.Fragment>
              <div className='uob-input-separator' />
              <Dropdown
                inputID='additionalLegalIdCountry'
                isReadOnly={isReadOnlyField('additionalLegalIdCountry')}
                isFocus={additionalLegalIdCountry.isFocus}
                focusOutItem={true}
                label={labels.additionalLegalIdCountry}
                value={additionalLegalIdCountry.value}
                isValid={additionalLegalIdCountry.isValid}
                errorMsg={additionalLegalIdCountry.errorMsg}
                dropdownItems={mapValueToDescription(countriesMapForDualNationality)}
                searchValue={additionalLegalIdCountry.searchValue}
                onBlur={this.handleDropdownBlur.bind(this, 'additionalLegalIdCountry')}
                onFocus={this.handleDropdownFocus.bind(this, 'additionalLegalIdCountry')}
                onClick={(data) => this.handleDropdownClick(data, 'additionalLegalIdCountry')}
                onSearchChange={(event) => this.handleOnSearchChange(event, 'additionalLegalIdCountry')}
              />

              <div className='uob-input-separator' />
              <TextInput
                inputID='additionalLegalId'
                isReadOnly={isReadOnlyField('additionalLegalId')}
                label={labels.additionalLegalId}
                value={additionalLegalId.value}
                errorMsg={additionalLegalId.errorMsg}
                onChange={(data) => this.handleOnChange(data,'additionalLegalId')}
                isValid={additionalLegalId.isValid}
                isUpperCase
                validator={["required", "onlyAlphanumeric", "maxSize|15"]}
                errorMsgList={errorMsgList}
              />
              
              <div className='uob-input-separator' />
              <TextInput
                inputID='additionalLegalIdExpiryDate'
                isReadOnly={isReadOnlyField('additionalLegalIdExpiryDate')}
                label = {labels.additionalLegalIdExpiryDate}
                value= {additionalLegalIdExpiryDate.value}
                errorMsg={additionalLegalIdExpiryDate.errorMsg}
                onChange={(data) => this.handleOnChange(data,'additionalLegalIdExpiryDate')}
                isValid={additionalLegalIdExpiryDate.isValid}
                isDateFormat
                validator={["required","isDateOfBirth","checkDateFormat","minMonth|6"]}
                errorMsgList={errorMsgList}
              />

              <div className='uob-input-separator' />
              <Dropdown
                inputID='additionalLegalIdIssueCountry'
                isReadOnly={isReadOnlyField('additionalLegalIdIssueCountry')}
                isFocus={additionalLegalIdIssueCountry.isFocus}
                focusOutItem={true}
                label={labels.additionalLegalIdIssueCountry}
                value={additionalLegalIdIssueCountry.value}
                isValid={additionalLegalIdIssueCountry.isValid}
                errorMsg={additionalLegalIdIssueCountry.errorMsg}
                dropdownItems={mapValueToDescription(countriesNamesMap)}
                searchValue={additionalLegalIdIssueCountry.searchValue}
                onBlur={this.handleDropdownBlur.bind(this, 'additionalLegalIdIssueCountry')}
                onFocus={this.handleDropdownFocus.bind(this, 'additionalLegalIdIssueCountry')}
                onClick={(data) => this.handleDropdownClick(data, 'additionalLegalIdIssueCountry')}
                onSearchChange={(event) => this.handleOnSearchChange(event, 'additionalLegalIdIssueCountry')}
              />

            </React.Fragment>
          )}

          <div className='uob-input-separator'/>
            <Dropdown
              inputID='countryOfBirth'
              isReadOnly={isReadOnlyField('countryOfBirth')}
              focusOutItem={true}
              isFocus={countryOfBirth.isFocus}
              label={labels.countryOfBirth}
              value={countryOfBirth.value}
              isValid={countryOfBirth.isValid}
              errorMsg={countryOfBirth.errorMsg}
              dropdownItems={mapValueToDescription(countriesNamesMap)}
              searchValue={countryOfBirth.searchValue}
              onBlur={this.handleDropdownBlur.bind(this, 'countryOfBirth')}
              onFocus={this.handleDropdownFocus.bind(this, 'countryOfBirth')}
              onClick={(data) => this.handleDropdownClick(data, 'countryOfBirth')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'countryOfBirth')}
              exampleLabels={labels.countryOfBirthEg}
            />

          <div className='uob-input-separator'/>
            <Dropdown
              inputID='countryOfResidence'
              isReadOnly={isReadOnlyField('countryOfResidence')}
              isFocus={countryOfResidence.isFocus}
              focusOutItem={true}
              label={labels.countryOfResidence}
              value={countryOfResidence.value}
              isValid={countryOfResidence.isValid}
              errorMsg={countryOfResidence.errorMsg}
              dropdownItems={mapValueToDescription(countriesNamesMap)}
              searchValue={countryOfResidence.searchValue}
              onBlur={this.handleDropdownBlur.bind(this, 'countryOfResidence')}
              onFocus={this.handleDropdownFocus.bind(this, 'countryOfResidence')}
              onClick={(data) => this.handleDropdownClick(data, 'countryOfResidence')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'countryOfResidence')}
              exampleLabels={labels.countryOfResidenceEg}
            />

          <div className='uob-input-separator'/>
          { personalDetailsValue.terms !== '' &&
            <div className="uob-terms" dangerouslySetInnerHTML={{__html: personalDetailsValue.terms}}/>
          }

          { commonReducer.currentSection === 'personalDetails' &&
              <div className='uob-input-separator'>
                <PrimaryButton label={labels.continueButton} onClick={this.handleToResidentialDetails.bind(this)}/>
              </div>
          }

          </div>

      ) // return
    } //render
} //component

const mapStateToProps = (state) => {
  const { personalDetailsReducer , commonReducer} = state;
  return { personalDetailsReducer, commonReducer };
} //const mapStateToProps

export default connect(mapStateToProps)(PersonalDetailsPage);
