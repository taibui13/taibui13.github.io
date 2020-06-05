import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropdown from './../components/Dropdown/Dropdown';
import TextInput from './../components/TextInput/TextInput';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';
import CpfTable from './../components/CpfTable/CpfTable';
import IncomeBreakdownTable from './../components/IncomeBreakdownTable/IncomeBreakdownTable';
import ToggleInput from './../components/ToggleInput/ToggleInput';

import {
  workSelectDropdownItem,
  workDropdownFocus,
  changeSearchInputValue,
  handleTextInputChange,
  setExpandedTableRow,
  handleIstoggled,
  setWorkDetailsWorkingSg,
  clearOptionalField
} from './../actions/workDetailsAction';

import { mapValueToDescription, mapValueToDescriptionDuplicate } from './../common/utils';


class WorkDetailsPage extends Component {

  componentWillMount() {
    const { commonReducer: {appData} } = this.props;
     this.industryList = (appData.inputValues && appData.inputValues.industry) || [] ;
     this.industryList = this.industryList.filter(e => e.value !== "LANDLORD")
  }

  componentDidMount() {
    const {dispatch, personalDetailsReducer, applicationReducer} = this.props;
    if(!applicationReducer.isPreviousApplication && personalDetailsReducer.countryOfResidence.value === 'SG') {
      dispatch(setWorkDetailsWorkingSg(true));
    } else if (!applicationReducer.isPreviousApplication && personalDetailsReducer.countryOfResidence.value !== 'SG') {
      dispatch(setWorkDetailsWorkingSg(false));
    }
  }

  handleToUploadOrConfirm(){
    this.props.onContinue();
  }

  handleOnClick(field, isToggled){
    const { dispatch } = this.props;
    dispatch(handleIstoggled(field , isToggled));
  }

  handleDropdownBlur(field) {
    const { dispatch } = this.props;
    dispatch(workDropdownFocus(field, false));
  }

  handleDropdownFocus(field) {
    const { dispatch } = this.props;
    dispatch(workDropdownFocus(field, true));
  }

  handleDropdownClick(data, field) {
    const { dispatch, workDetailsReducer } = this.props;
    if (workDetailsReducer[field].value === data.value) {
      return;
    }
    dispatch(workSelectDropdownItem(data.value, data.description, field, data.key));
  }

  handleOnSearchChange(e, field) {
    const { dispatch } = this.props;
    const value = e.target.value;
    dispatch(changeSearchInputValue(value, field));
  }

  handleOnChange(data , field){
    const { dispatch } = this.props;
    dispatch(handleTextInputChange(data, field));
  }

  handleTableRowExpand(i, status, field) {
    const { dispatch } = this.props;
    dispatch(setExpandedTableRow(i, status, field));
  }

  handleSetFieldOptional(field){
    const {dispatch} = this.props;
    if(field === 'lengthOfEmploymentYears' || field === 'lengthOfEmploymentMonths'){
      dispatch(clearOptionalField())
    }
  }

  render() {
    const { workDetailsReducer, commonReducer, applicationReducer, uploadDocumentsReducer } = this.props;
    const {
      natureOfEmployment,
      jobTitle,
      nameOfEmployer,
      industry,
      lengthOfEmploymentYears,
      lengthOfEmploymentMonths,
      cpfcontributions,
      nameOfPreviousCompany,
      lengthOfPreviousEmploymentYears,
      lengthOfPreviousEmploymentMonths,
      previousJobTitle,
      previousIndustry,
      monthlyFixedIncome,
      monthlyRentalIncome,
      monthlyTradeIncome,
      monthlyVariableIncome,
      anotherJob,
      previousCompany,
      workInSG,
      declareIncome,
      eligibleFinancialAssets,
      yearlyIncome,
      assessableIncome,
      assessYear,
      givesAll,
      onlyNOA,
      noData,
      displayOnlyNOA,
      isThereRental,
      isThereCatergory,
      isThereTaxClearance
    }  = workDetailsReducer;

    const workDetailsValue = commonReducer.appData.workDetails;
    const labels = workDetailsValue.labels;
    const inputValues = commonReducer.appData.inputValues ? commonReducer.appData.inputValues : '';
    const natureOfEmploymentList = inputValues.natureOfEmployment;
    const occupationList = inputValues.occupation;

    const isSelfOrSalary = (natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'BUSSV' || natureOfEmployment.value === 'SELFE' ) ? true : false;

    const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2'
     ? true : false;

    const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE') ? true : false;

    const showPreviousEmploy = (lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) < 3) ? true : false;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
      && lengthOfEmploymentMonths.value !== ''
      && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    const errorMsgList = commonReducer.appData.errorMsgs;

    let mustDeclare = true;
    let showDeclare = true;
    if (natureOfEmployment.value !== ''){
      if (onlyNOA){
        if(!isSelfOrSalary){
          mustDeclare = false;
        }
      } else if (givesAll) {
        if (!isSelfOrSalary || isSelf){
          mustDeclare = false;
        } else if (isSalary && !less16 && !isThereTaxClearance){
          mustDeclare = false;
        }
      } else if (noData) {
        if (!isSalary) {
          mustDeclare = false;
        }
      }
    }

    let showUploadDocuments = false;

    if(uploadDocumentsReducer.showUploadDocuments) {
      if(mustDeclare || declareIncome.isToggled) {
        showUploadDocuments = (isSalary && (monthlyFixedIncome.isValid && parseFloat(monthlyFixedIncome.value) > 0 ))
          || (((onlyNOA && isSelf) || isSalary) && (monthlyVariableIncome.isValid && parseFloat(monthlyVariableIncome.value) > 0))
          || (monthlyRentalIncome.isValid && parseFloat(monthlyRentalIncome.value) > 0 ) ;
      } else {
        showUploadDocuments = (eligibleFinancialAssets.isValid && parseFloat(eligibleFinancialAssets.value) > 0)
      }
    }

    const isShowButton = (commonReducer.currentSection === 'workDetails') || ((commonReducer.currentSection === 'uploadDocuments') && !showUploadDocuments);

    const readOnlyFields = commonReducer.appData.myInfoReadonlyFields;
    const isReadOnlyField = (field) => {
      const isReadField = readOnlyFields[field] ? readOnlyFields[field] : false;
      return isReadField;
    }

    // let colTitles = labels.incBreakColTile;
    // if(!isThereRental){
    //   colTitles = labels.incBreakColTile.slice(0,-1);
    // }

    return(
      <div className='uob-content' id='workDetails-section'>
        <h1>{workDetailsValue.title}</h1>
        <div className='uob-form-separator'/>
        <p className='uob-headline'>{workDetailsValue.subtitle}</p>
        <div className='uob-input-separator'/>
        <Dropdown
          inputID='natureOfEmployment'
          isFocus={natureOfEmployment.isFocus}
          label={labels.natureOfEmployment}
          value={natureOfEmployment.value}
          isValid={natureOfEmployment.isValid}
          errorMsg={natureOfEmployment.errorMsg}
          dropdownItems={mapValueToDescription(natureOfEmploymentList)}
          searchValue={natureOfEmployment.searchValue}
          onBlur={this.handleDropdownBlur.bind(this, 'natureOfEmployment')}
          onFocus={this.handleDropdownFocus.bind(this, 'natureOfEmployment')}
          onClick={(data) => this.handleDropdownClick(data, 'natureOfEmployment')}
          onSearchChange={(event) => this.handleOnSearchChange(event, 'natureOfEmployment')}
          exampleLabels={labels.natureOfEmploymentEg}
        />

        {(isSalary || natureOfEmployment.value === 'SELFE') &&
          <div className='uob-input-separator'>
            <Dropdown
              inputID='jobTitle'
              isFocus={jobTitle.isFocus}
              label={labels.jobTitle}
              value={jobTitle.value}
              isValid={jobTitle.isValid}
              errorMsg={jobTitle.errorMsg}
              dropdownItems={mapValueToDescription(occupationList)}
              searchValue={jobTitle.searchValue}
              onBlur={this.handleDropdownBlur.bind(this, 'jobTitle')}
              onFocus={this.handleDropdownFocus.bind(this, 'jobTitle')}
              onClick={(data) => this.handleDropdownClick(data, 'jobTitle')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'jobTitle')}
              exampleLabels={labels.jobTitleEg}
            />
          </div>
        }

        {isSelfOrSalary &&
          <div className='uob-input-separator'>
            <TextInput
              inputID='nameOfEmployer'
              isReadOnly={nameOfEmployer.isReadOnly}
              isValid={nameOfEmployer.isValid}
              errorMsg={nameOfEmployer.errorMsg}
              label={natureOfEmployment.value === 'SALARIED' ? labels.nameOfEmployer : labels.companyName}
              value={nameOfEmployer.value}
              onChange={(data) => this.handleOnChange(data,'nameOfEmployer')}
              validator={["required", "maxSize|35", "isAlphanumericSymbol"]}
              errorMsgList={errorMsgList}
              exampleLabels={labels.nameOfEmployerEg}
            />
          </div>
        }

        {isSelfOrSalary &&
          <div className='uob-input-separator'>
            <Dropdown
              inputID='industry'
              isFocus={industry.isFocus}
              label={labels.industry}
              value={industry.value}
              isValid={industry.isValid}
              errorMsg={industry.errorMsg}
              dropdownItems={mapValueToDescriptionDuplicate(this.industryList)}
              searchValue={industry.searchValue}
              onBlur={this.handleDropdownBlur.bind(this, 'industry')}
              onFocus={this.handleDropdownFocus.bind(this, 'industry')}
              onClick={(data) => this.handleDropdownClick(data, 'industry')}
              onSearchChange={(event) => this.handleOnSearchChange(event, 'industry')}
              exampleLabels={labels.industryEg}
              duplicateValue={applicationReducer.withApplicationId && industry.isInitial}
            />
          </div>
        }

        {isSelfOrSalary &&
          <div className='uob-input-separator-twocols'>
            <div className='uob-input-separator-half'>
                <TextInput
                  isNumber
                  inputID='lengthOfEmploymentYears'
                  isValid={lengthOfEmploymentYears.isValid}
                  errorMsg={lengthOfEmploymentYears.errorMsg}
                  label={labels.lengthOfEmploymentYears}
                  value={lengthOfEmploymentYears.value}
                  onChange={(data) => this.handleOnChange(data,'lengthOfEmploymentYears')}
                  validator={["required", "maxSize|2"]}
                  errorMsgList={errorMsgList}
                  onBlur={() => this.handleSetFieldOptional('lengthOfEmploymentYears')}
                  exampleLabels={labels.lengthOfEmploymentYearsEg}
                />
            </div>

            <div className='uob-space-separator'/>

            <div className='uob-input-separator-half'>
              <TextInput
                isMonth
                inputID='lengthOfEmploymentMonths'
                isValid={lengthOfEmploymentMonths.isValid}
                errorMsg={lengthOfEmploymentMonths.errorMsg}
                label={labels.lengthOfEmploymentMonths}
                value={lengthOfEmploymentMonths.value}
                onChange={(data) => this.handleOnChange(data,'lengthOfEmploymentMonths')}
                validator={["required"]}
                errorMsgList={errorMsgList}
                onBlur={() => this.handleSetFieldOptional('lengthOfEmploymentMonths')}
                exampleLabels={labels.lengthOfEmploymentMonthsEg}
              />
            </div>
          </div>
        }

        {isSelfOrSalary && showPreviousEmploy &&
          <div>
           <div className='uob-line-separator'/>
           <ToggleInput
              inputID={"previousCompany"}
              description = {workDetailsValue.toggle.previousCompany}
              onClick={() => this.handleOnClick('previousCompany', previousCompany.isToggled )}
              isToggled = {previousCompany.isToggled}
              isValid={previousCompany.isValid}
              errorMsg={previousCompany.errorMsg}
              exampleLabels={labels.previousCompanyEg}
              />
          </div>
        }


        {isSelfOrSalary && showPreviousEmploy && !previousCompany.isToggled &&
          <div>
            <div className='uob-input-separator'>
              <TextInput
                inputID='nameOfPreviousCompany'
                isValid={nameOfPreviousCompany.isValid}
                errorMsg={nameOfPreviousCompany.errorMsg}
                label={labels.previousCompanyName}
                value={nameOfPreviousCompany.value}
                onChange={(data) => this.handleOnChange(data,'nameOfPreviousCompany')}
                validator={["required", "maxSize|35", "isAlphanumericSymbol"]}
                errorMsgList={errorMsgList}
                exampleLabels={labels.nameOfPreviousCompanyEg}
              />
            </div>
            <div className='uob-input-separator-twocols'>
                <div className='uob-input-separator-half'>
                    <TextInput
                      isNumber
                      inputID='lengthOfPreviousEmploymentYears'
                      isValid={lengthOfPreviousEmploymentYears.isValid}
                      errorMsg={lengthOfPreviousEmploymentYears.errorMsg}
                      label={labels.lengthOfPreviousEmploymentYears}
                      value={lengthOfPreviousEmploymentYears.value}
                      onChange={(data) => this.handleOnChange(data,'lengthOfPreviousEmploymentYears')}
                      validator={["required", "maxSize|2"]}
                      errorMsgList={errorMsgList}
                      exampleLabels={labels.lengthOfPreviousEmploymentYearsEg}
                    />
                </div>

                <div className='uob-space-separator'/>

                <div className='uob-input-separator-half'>
                  <TextInput
                    isMonth
                    inputID='lengthOfPreviousEmploymentMonths'
                    isValid={lengthOfPreviousEmploymentMonths.isValid}
                    errorMsg={lengthOfPreviousEmploymentMonths.errorMsg}
                    label={labels.lengthOfPreviousEmploymentMonths}
                    value={lengthOfPreviousEmploymentMonths.value}
                    onChange={(data) => this.handleOnChange(data,'lengthOfPreviousEmploymentMonths')}
                    validator={["required"]}
                    errorMsgList={errorMsgList}
                    exampleLabels={labels.lengthOfPreviousEmploymentMonthsEg}
                  />
                </div>
            </div>
            <div className='uob-input-separator'>
              <Dropdown
                inputID='previousJobTitle'
                isFocus={previousJobTitle.isFocus}
                label={labels.previousJobTitle}
                value={previousJobTitle.value}
                isValid={previousJobTitle.isValid}
                errorMsg={previousJobTitle.errorMsg}
                dropdownItems={mapValueToDescription(occupationList)}
                searchValue={previousJobTitle.searchValue}
                onBlur={this.handleDropdownBlur.bind(this, 'previousJobTitle')}
                onFocus={this.handleDropdownFocus.bind(this, 'previousJobTitle')}
                onClick={(data) => this.handleDropdownClick(data, 'previousJobTitle')}
                onSearchChange={(event) => this.handleOnSearchChange(event, 'previousJobTitle')}
                exampleLabels={labels.previousJobTitleEg}
              />
            </div>
            <div className='uob-input-separator'>
              <Dropdown
                inputID='previousIndustry'
                isFocus={previousIndustry.isFocus}
                label={labels.previousIndustry}
                value={previousIndustry.value}
                isValid={previousIndustry.isValid}
                errorMsg={previousIndustry.errorMsg}
                dropdownItems={mapValueToDescriptionDuplicate(this.industryList)}
                searchValue={previousIndustry.searchValue}
                onBlur={this.handleDropdownBlur.bind(this, 'previousIndustry')}
                onFocus={this.handleDropdownFocus.bind(this, 'previousIndustry')}
                onClick={(data) => this.handleDropdownClick(data, 'previousIndustry')}
                onSearchChange={(event) => this.handleOnSearchChange(event, 'previousIndustry')}
                exampleLabels={labels.previousIndustryEg}
                duplicateValue={applicationReducer.withApplicationId && previousIndustry.isInitial}
              />
            </div>
          </div>
        }

        {isSelfOrSalary &&
          <div className='uob-input-separator'>
           <ToggleInput
              inputID={"anotherJob"}
              description = {workDetailsValue.toggle.anotherJob}
              onClick={() => this.handleOnClick('anotherJob', anotherJob.isToggled )}
              isToggled = {anotherJob.isToggled}
              isValid={anotherJob.isValid}
              errorMsg={anotherJob.errorMsg}
              exampleLabels={labels.anotherJobEg}
              />
          </div>
        }

        {isSelfOrSalary &&
          <div className='uob-input-separator'>
           <ToggleInput
              inputID={"workInSG"}
              description = {workDetailsValue.toggle.workInSG}
              onClick={() => this.handleOnClick('workInSG', workInSG.isToggled)}
              isToggled = {workInSG.isToggled}
              isValid={workInSG.isValid}
              errorMsg={workInSG.errorMsg}
              exampleLabels={labels.workInSGEg}
              />
          </div>
        }

        { displayOnlyNOA &&
          <div>
            <div className='uob-line-separator' />
            <div className='uob-input-separator'>
              <TextInput
                isDecimal
                inputID='assessableIncome'
                isReadOnly={isReadOnlyField('assessableIncome')}
                label={assessYear !== '' ? `${labels.assessableIncome} for ${assessYear}` : labels.assessableIncome}
                value={assessableIncome.value}
                errorMsg={assessableIncome.errorMsg}
                onChange={(data) => this.handleOnChange(data,'assessableIncome')}
                isValid={assessableIncome.isValid}
                validator={["required", "isDecimal|11"]}
                errorMsgList={errorMsgList}
                exampleLabels={labels.assessableIncomeEg}
              />
            </div>
          </div>
        }

        { !displayOnlyNOA && !noData && yearlyIncome.value.length > 0 &&
          <div>
            <div className='uob-line-separator' />
            <div className='uob-input-separator'>
              <IncomeBreakdownTable
                  label={labels.incBreakdown}
                  colTitles={labels.incBreakColTile}
                  isThereRental={isThereRental}
                  isThereCatergory={isThereCatergory}
                  year0 = {isThereCatergory ? "year{i}" : "" }
                  openRows={yearlyIncome.openRows}
                  tableContent={yearlyIncome.value}
                  expandTableRow={(i) => this.handleTableRowExpand(i, true, 'yearlyIncome')}
                  collapseTableRow={(i) => this.handleTableRowExpand(i, false, 'yearlyIncome')}
                  {...this.props}
              />
            </div>
            <div className='uob-input-separator'/>
            { labels.incBreakTerms !== '' &&
              <div className="uob-terms"> { labels.incBreakTerms } </div>
            }
          </div>
        }

        { natureOfEmployment.value !== '' && showDeclare &&
          <div>
            <div className='uob-input-separator'/>
              <ToggleInput
                inputID = "declareIncome"
                isDisabled = {mustDeclare}
                description = {isThereTaxClearance ? workDetailsValue.toggle.declareIncomeTaxClearance : workDetailsValue.toggle.declareIncome}
                isToggled = {mustDeclare ? true : declareIncome.isToggled}
                isValid={declareIncome.isValid}
                onClick = {!mustDeclare ? () => this.handleOnClick('declareIncome', declareIncome.isToggled ) : null}
                exampleLabels={ isThereTaxClearance ? workDetailsValue.toggle.declareIncomeTaxClearanceEg : workDetailsValue.toggle.declareIncomeEg}
              />
          </div>
        }

        <div className='uob-input-separator'/>
        <div className='uob-input-white-board'>
        {(natureOfEmployment.value !== '' && mustDeclare ) || (natureOfEmployment.value !== '' && declareIncome.isToggled ) ?
          <div>
            {isSalary &&
              <div>
                <div className='uob-input-white-board-line-separator '/>
                  <TextInput
                    isNumber
                    inputID='monthlyFixedIncome'
                    isValid={monthlyFixedIncome.isValid}
                    errorMsg={monthlyFixedIncome.errorMsg}
                    label={labels.monthlyFixedIncome}
                    value={monthlyFixedIncome.value}
                    onChange={(data) => this.handleOnChange(data,'monthlyFixedIncome')}
                    validator={["isNumber", "maxSize|9"]}
                    errorMsgList={errorMsgList}
                    exampleLabels={labels.monthlyFixedIncomeEg}
                  />
              </div>
            }

            {((onlyNOA && isSelf) || isSalary) &&
              <div>
                <div className='uob-input-white-board-line-separator '/>
                  <TextInput
                    isNumber
                    isMinOne
                    isOptional
                    optionalText={labels.optionalText}
                    inputID='monthlyVariableIncome'
                    isValid={monthlyVariableIncome.isValid}
                    errorMsg={monthlyVariableIncome.errorMsg}
                    label={labels.monthlyVariableIncome}
                    value={monthlyVariableIncome.value}
                    onChange={(data) => this.handleOnChange(data,'monthlyVariableIncome')}
                    validator={["validateMinimumOne","isNumber", "maxSize|9"]}
                    errorMsgList={errorMsgList}
                    exampleLabels={labels.monthlyVariableIncomeEg}
                  />
              </div>
            }

            {onlyNOA && isSelf &&
              <div>
                <div className='uob-input-white-board-line-separator '/>
                  <TextInput
                    isNumber
                    inputID='monthlyTradeIncome'
                    isValid={monthlyTradeIncome.isValid}
                    errorMsg={monthlyTradeIncome.errorMsg}
                    label={labels.monthlyTradeIncome}
                    value={monthlyTradeIncome.value}
                    onChange={(data) => this.handleOnChange(data,'monthlyTradeIncome')}
                    validator={["isNumber", "maxSize|9"]}
                    errorMsgList={errorMsgList}
                    exampleLabels={labels.monthlyTradeIncomeEg}
                  />
              </div>
            }

            <div className='uob-input-white-board-line-separator '/>
              <TextInput
                isNumber
                isMinOne
                isOptional
                optionalText={labels.optionalText}
                inputID='monthlyRentalIncome'
                isValid={monthlyRentalIncome.isValid}
                errorMsg={monthlyRentalIncome.errorMsg}
                label={labels.monthlyRentalIncome}
                value={monthlyRentalIncome.value}
                onChange={(data) => this.handleOnChange(data,'monthlyRentalIncome')}
                validator={["validateMinimumOne","isNumber", "maxSize|9"]}
                errorMsgList={errorMsgList}
                exampleLabels={labels.monthlyRentalIncomeEg}
              />
          </div>
        : null }
        </div>

        <div className='uob-input-separator'/>
        { natureOfEmployment.value !== '' &&
        <div>
          <div className='self-declare-header'>{labels.additionalIncome}</div>
          <div className='uob-input-white-board'>
            <div className='uob-input-white-board-line-separator '/>
              <TextInput
                isNumber
                isMinOne
                isOptional
                optionalText={labels.optionalText}
                inputID='eligibleFinancialAssets'
                isValid={eligibleFinancialAssets.isValid}
                errorMsg={eligibleFinancialAssets.errorMsg}
                label={labels.eligibleFinancialAssets}
                value={eligibleFinancialAssets.value}
                onChange={(data) => this.handleOnChange(data,'eligibleFinancialAssets')}
                validator={["validateMinimumOne","isNumber", "maxSize|9"]}
                errorMsgList={errorMsgList}
                exampleLabels={labels.efaEg}
              />
          </div>
        </div>
        }

        {cpfcontributions.value.length > 0 ? (
            <div className='uob-input-separator'>
                <CpfTable
                    label={labels.cpfContribution}
                    colTitles={labels.cpfColTile}
                    openRows={cpfcontributions.openRows}
                    tableContent={cpfcontributions.value}
                    expandTableRow={(i) => this.handleTableRowExpand(i, true, 'cpfcontributions')}
                    collapseTableRow={(i) => this.handleTableRowExpand(i, false, 'cpfcontributions')}
                    {...this.props}
                />
            </div>
        ) : null}

        <div className='uob-input-separator'/>
        { workDetailsValue.terms !== '' &&
          <div className="uob-terms"> {workDetailsValue.terms} </div>
        }

        { isShowButton &&
          <div className='uob-input-separator' >
            <PrimaryButton label={labels.continueButton} onClick={this.handleToUploadOrConfirm.bind(this)} />
          </div>
        }
        </div>
    );
  }
}

  const mapStateToProps = (state) => {
    const { workDetailsReducer, basicDetailsReducer, commonReducer, applicationReducer, uploadDocumentsReducer } = state;
    return { workDetailsReducer, basicDetailsReducer, commonReducer, applicationReducer, uploadDocumentsReducer };
  }

  export default connect(mapStateToProps)(WorkDetailsPage);
