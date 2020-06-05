import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setErrorMessage } from './../actions/commonAction';
import {
  dispatchUpdateUploadProgress,
  dispatchUploadFile,
  dispatchErrorMsg,
  dispatchResetUploadStatus
} from './../actions/uploadDocumentsAction';

import FileUpload from './../components/FileUpload/FileUpload';
import PrimaryButton from './../components/PrimaryButton/PrimaryButton';

class UploadDocumentsPage extends Component {

  updateUploadProgress(id, progress) {
    const { dispatch } = this.props;
    dispatch(dispatchUpdateUploadProgress(id, progress));
  }


  handleUploadFile(id, name, size, type, content) {
    const { dispatch } = this.props;
    dispatch(dispatchUploadFile(id, name, size, type, content));
  }

  handleErrorMsg(id, error) {
    const { dispatch } = this.props;
    dispatch(dispatchErrorMsg(id, error));
  }

  handleUploadErrorMsg(id, error) {
    const { dispatch } = this.props;
    dispatch(setErrorMessage(error));
    dispatch(dispatchResetUploadStatus(id));
  }

  handleToConfirmDetails() {
    this.props.onContinue();
  }

  render() {
    const { commonReducer, workDetailsReducer, uploadDocumentsReducer, applicationReducer, personalDetailsReducer } = this.props;
    const { hasDualNationality } = personalDetailsReducer
    const { bankStatement, paySlip, tenancyAgreement, additionalPassport } = uploadDocumentsReducer;
    const { monthlyFixedIncome, monthlyVariableIncome, monthlyRentalIncome, eligibleFinancialAssets, declareIncome, onlyNOA, givesAll, noData, natureOfEmployment, lengthOfEmploymentYears, lengthOfEmploymentMonths, isThereTaxClearance} = workDetailsReducer;
    const uploadDocumentsValue = commonReducer.appData.uploadDocuments;
    const labels = uploadDocumentsValue.labels;
    const descriptions = uploadDocumentsValue.descriptions;
    const errorMsgs = { error: commonReducer.appData.errorMsgs, globalErrors : commonReducer.appData.globalErrors} ;
    const isMonthlyFixed = parseFloat(monthlyFixedIncome.value) > 0;
    const isMonthlyVariable = parseFloat(monthlyVariableIncome.value) > 0;
    const isMonthlyRental = parseFloat(monthlyRentalIncome.value) > 0;
    const isEFA = parseFloat(eligibleFinancialAssets.value) > 0 ;
    const isSalary = natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE2'
     ? true : false;

    const isSelf = (natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === "BUSSV" || natureOfEmployment.value === 'SELFE' ) ? true : false;

    const isSelfOrSalary = (natureOfEmployment.value === 'SALARIED' || natureOfEmployment.value === 'SELFE4' || natureOfEmployment.value === 'SELFE1' || natureOfEmployment.value === 'SELFE2' || natureOfEmployment.value === 'BUSSV' || natureOfEmployment.value === 'SELFE' ) ? true : false;

    const less16 = ((lengthOfEmploymentYears.isValid
      && lengthOfEmploymentYears.value !== ''
      && parseInt(lengthOfEmploymentYears.value, 10) <= 1)
      && (lengthOfEmploymentMonths.isValid
      && lengthOfEmploymentMonths.value !== ''
      && parseInt(lengthOfEmploymentMonths.value, 10) < 4)) ? true : false;

    let mustDeclare = true;
    // let showDeclare = true;
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


    return (
      <div className='uob-content'  id='uploadDocuments-section'>
        <h1>{uploadDocumentsValue.title}</h1>
        <div className='uob-form-separator'/>
        <p className='uob-headline'>{uploadDocumentsValue.subtitle}</p>

        {((((onlyNOA && isSelf) || isSalary) && isMonthlyVariable) || (isSalary && isMonthlyFixed)) && (mustDeclare || declareIncome.isToggled) &&
          <div className='uob-input-separator'>
            <FileUpload
              inputID={'paySlip'}
              file={paySlip}
              title={labels.uploadPayslipDoc}
              identifier={applicationReducer.applicationID}
              docType={'incomedocument1'}
              description={descriptions.uploadPayslipDoc}
              progressValue={paySlip.progress}
              updateUploadProgress={(id, progress) => this.updateUploadProgress(id, progress)}
              handleUploadFile={this.handleUploadFile.bind(this)}
              handleShowErrorMsg={(id, error) => this.handleErrorMsg(id, error)}
              handleShowUploadErrorMsg={(id, error) => this.handleUploadErrorMsg(id, error)}
              errorMsgs={errorMsgs}
              isPreviewFile={true}
            />
          </div>
        }

        {isMonthlyRental && (mustDeclare || declareIncome.isToggled) &&
          <div className='uob-input-separator'>
            <FileUpload
              inputID={'tenancyAgreement'}
              file={tenancyAgreement}
              title={labels.uploadTenancyAgreement}
              identifier={applicationReducer.applicationID}
              docType={'incomedocument2'}
              description={descriptions.uploadTenancyAgreement}
              progressValue={tenancyAgreement.progress}
              updateUploadProgress={(id, progress) => this.updateUploadProgress(id, progress)}
              handleUploadFile={this.handleUploadFile.bind(this)}
              handleShowErrorMsg={(id, error) => this.handleErrorMsg(id, error)}
              handleShowUploadErrorMsg={(id, error) => this.handleUploadErrorMsg(id, error)}
              errorMsgs={errorMsgs}
              isPreviewFile={true}
            />
          </div>
        }

        {isEFA &&
          <div className='uob-input-separator'>
            <FileUpload
              inputID={'bankStatement'}
              file={bankStatement}
              title={labels.uploadBankStatement}
              identifier={applicationReducer.applicationID}
              docType={'incomedocument3'}
              description={descriptions.uploadBankStatement}
              progressValue={bankStatement.progress}
              updateUploadProgress={(id, progress) => this.updateUploadProgress(id, progress)}
              handleUploadFile={this.handleUploadFile.bind(this)}
              handleShowErrorMsg={(id, error) => this.handleErrorMsg(id, error)}
              handleShowUploadErrorMsg={(id, error) => this.handleUploadErrorMsg(id, error)}
              errorMsgs={errorMsgs}
              isPreviewFile={true}
            />
          </div>
        }

        {hasDualNationality.isToggled &&
          <div className='uob-input-separator'>
            <FileUpload
              inputID={'additionalPassport'}
              file={additionalPassport}
              title={labels.uploadAdditionalPassport}
              identifier={applicationReducer.applicationID}
              docType={'additionalpassport'}
              description={descriptions.uploadAdditionalPassport}
              progressValue={additionalPassport.progress}
              updateUploadProgress={(id, progress) => this.updateUploadProgress(id, progress)}
              handleUploadFile={this.handleUploadFile.bind(this)}
              handleShowErrorMsg={(id, error) => this.handleErrorMsg(id, error)}
              handleShowUploadErrorMsg={(id, error) => this.handleUploadErrorMsg(id, error)}
              errorMsgs={errorMsgs}
              isPreviewFile={true}
            />
          </div>
        }

        <div className='uob-input-separator'/>
        { uploadDocumentsValue.terms !== '' &&
          <div className="uob-terms" dangerouslySetInnerHTML={{__html: uploadDocumentsValue.terms}}/>
        }

        { commonReducer.currentSection === 'uploadDocuments' &&
            <div className='uob-input-separator' >
              <PrimaryButton label={labels.continueButton} onClick={this.handleToConfirmDetails.bind(this)} />
            </div>
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { uploadDocumentsReducer, basicDetailsReducer, personalDetailsReducer, applicationReducer, workDetailsReducer, commonReducer} = state;
  return { uploadDocumentsReducer, basicDetailsReducer, personalDetailsReducer, applicationReducer, workDetailsReducer, commonReducer };
}

export default connect(mapStateToProps)(UploadDocumentsPage);
