import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { handleAddressInputChange, autoGetLocalAddress } from './../../../actions/localAddressInputAction';

import TextInput from './../../TextInput/TextInput';
import './LocalAddressInput.css';

class LocalAddressInput extends Component {

  handleOnChange(data, field) {
    const { dispatch, addressType } = this.props;
    dispatch(handleAddressInputChange(data, field));
    if (field === 'homePostalCode' || field === 'mailingPostalCode') {
      dispatch(autoGetLocalAddress(data.value, addressType, field));
    }
  }

  render() {
    const { localAddressInputReducer, propertyType, addressType, labels, errorMsgList, residentialDetailsReducer } = this.props;
    const street = localAddressInputReducer[`${addressType}Street`];
    const block = localAddressInputReducer[`${addressType}Block`];
    const postalCode = localAddressInputReducer[`${addressType}PostalCode`];
    const building = localAddressInputReducer[`${addressType}Building`];
    const level = localAddressInputReducer[`${addressType}Level`];
    const unit = localAddressInputReducer[`${addressType}Unit`];
    const propertyTypeS = (residentialDetailsReducer.mailingPropertyType.value === "BG"
      || residentialDetailsReducer.mailingPropertyType.value === "SM"
      || residentialDetailsReducer.mailingPropertyType.value === "TE") ? true : false;

    return (
      <div>
        <div className='uob-input-separator'>
          <TextInput
            isNumber
            type='Postal'
            inputID={`${addressType}PostalCode`}
            isValid={postalCode ? postalCode.isValid : true}
            errorMsg={postalCode ? postalCode.errorMsg: ''}
            label={labels[`${addressType}PostalCode`]}
            value={postalCode ? postalCode.value : ''}
            isLoading={postalCode ? postalCode.isLoading : false}
            onChange={(data) => this.handleOnChange(data,`${addressType}PostalCode`)}
            validator={["required"]}
            isReadOnly={postalCode.isReadOnly}
            errorMsgList={errorMsgList}
            exampleLabels={labels[`${addressType}PostalCodeEg`]}
          />
        </div>

        {
          (postalCode && (postalCode.autoFilled || postalCode.count >= 5 || localAddressInputReducer.prevData)) &&
          <div>
            <div className='uob-input-separator'>
              <TextInput
                inputID={`${addressType}Block`}
                isValid={block ? block.isValid : true}
                errorMsg={block ? block.errorMsg : ''}
                label={propertyType && propertyType === 'LANDED' ? labels[`${addressType}HouseNo`] : labels[`${addressType}Block`]}
                value={block ? block.value : ''}
                isReadOnly={block ? block.isReadOnly : false}
                onChange={(data) => this.handleOnChange(data,`${addressType}Block`)}
                validator={["required", "isAlphanumericSymbol", "maxSize|7"]}
                errorMsgList={errorMsgList}
                exampleLabels={labels[`${addressType}BlockEg`]}
              />
            </div>

            <div className='uob-input-separator'>
              <TextInput
                inputID={`${addressType}Street`}
                isValid={street ? street.isValid : true}
                errorMsg={street ? street.errorMsg : ''}
                label={labels[`${addressType}Street`]}
                value={street ? street.value : ''}
                isReadOnly={street ? street.isReadOnly : false}
                onChange={(data) => this.handleOnChange(data,`${addressType}Street`)}
                validator={["required", "isAlphanumericSymbol", "maxSize|30"]}
                errorMsgList={errorMsgList}
                exampleLabels={labels[`${addressType}StreetEg`]}
              />
            </div>
            {building && building.value !== '' &&
              <div className='uob-input-separator'>
                <TextInput
                  inputID={`${addressType}Building`}
                  label={labels[`${addressType}Building`]}
                  value={building.value}
                  isReadOnly
                  errorMsgList={errorMsgList}
                  validator={["isAlphanumericSymbol", "maxSize|30"]}
                  exampleLabels={labels[`${addressType}BuildingEg`]}
                />
              </div>
            }
          </div>
        }

        {addressType === "home" ?
        <div className='uob-input-separator-twocols'>
          <div className='uob-input-separator-half'>
            <TextInput
              isReadOnly={level.isReadOnly}
              label={labels[`${addressType}Level`]}
              value={level.value}
              errorMsg={level.errorMsg}
              onChange={(data) => this.handleOnChange(data,`${addressType}Level`)}
              isValid={level.isValid}
              validator={["required", "isAlphanumericSymbol", "maxSize|4"]}
              errorMsgList={errorMsgList}
              exampleLabels={labels[`${addressType}LevelEg`]}
              />
          </div>

          <div className='space' />
          <div className='uob-input-separator-half'>
            <TextInput
              isReadOnly={unit.isReadOnly}
              label = {labels[`${addressType}Unit`]}
              value = {unit.value}
              errorMsg={unit.errorMsg}
              onChange={(data) => this.handleOnChange(data,`${addressType}Unit`)}
              isValid={unit.isValid}
              validator={["required", "isAlphanumericSymbol", "maxSize|7"]}
              errorMsgList={errorMsgList}
              exampleLabels={labels[`${addressType}UnitEg`]}
            />
          </div>
        </div>: null}

        {!propertyTypeS && addressType === "mailing" ?
        <div className='uob-input-separator-twocols'>
          <div className='uob-input-separator-half'>
            <TextInput
              isReadOnly={level.isReadOnly}
              label={labels[`${addressType}Level`]}
              value={level.value}
              errorMsg={level.errorMsg}
              onChange={(data) => this.handleOnChange(data,`${addressType}Level`)}
              isValid={level.isValid}
              validator={["required", "isAlphanumericSymbol", "maxSize|4"]}
              errorMsgList={errorMsgList}
              exampleLabels={labels[`${addressType}LevelEg`]}
              />
          </div>

          <div className='space' />
          <div className='uob-input-separator-half'>
            <TextInput
              isReadOnly={unit.isReadOnly}
              label = {labels[`${addressType}Unit`]}
              value = {unit.value}
              errorMsg={unit.errorMsg}
              onChange={(data) => this.handleOnChange(data,`${addressType}Unit`)}
              isValid={unit.isValid}
              validator={["required", "isAlphanumericSymbol", "maxSize|7"]}
              errorMsgList={errorMsgList}
              exampleLabels={labels[`${addressType}UnitEg`]}
            />
          </div>
        </div>: null}
      </div>
    );
  }
}

LocalAddressInput.propTypes = {
  labels: PropTypes.object.isRequired,
  propertyType: PropTypes.string.isRequired,
  addressType: PropTypes.string.isRequired
}

LocalAddressInput.defaultProps = {
  propertyType: 'HDB'
};

const mapStateToProps = (state) => {
  const { localAddressInputReducer, residentialDetailsReducer } = state;
  return { localAddressInputReducer, residentialDetailsReducer };
}

export default connect(mapStateToProps)(LocalAddressInput);
