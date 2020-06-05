/* global GLOBAL_CONFIG */
import axios from 'axios';

const getAddressByPostalCodeURL = `${GLOBAL_CONFIG.COMMON_API_PATH}/referencedata/address`;
const commonAPIURL = `${GLOBAL_CONFIG.API_PATH}/applications`;
const getJsonFileURL = `${GLOBAL_CONFIG.API_PATH}/specifications`;
const loanPackageURL = `${GLOBAL_CONFIG.API_PATH}/application/loanpackage`;
const getMyInfoDataUrl = `${GLOBAL_CONFIG.API_PATH}/applications/application`;
const callBackURL = `${GLOBAL_CONFIG.API_PATH}/callback`;
const verifyEmailURL = `${GLOBAL_CONFIG.API_PATH}/access/verify`;
const redirectMyInfoURL = `${GLOBAL_CONFIG.API_PATH}/myinfo/redirecturl`;
const sendTokenURL = `${GLOBAL_CONFIG.API_PATH}/access/sendotp`;
const verifyTokenURL = `${GLOBAL_CONFIG.API_PATH}/access/verifyotp`;
const formURL = `${GLOBAL_CONFIG.FORM_PATH}/form.json`;

const allowFutureDate = GLOBAL_CONFIG.allowFutureDate
const timeout = GLOBAL_CONFIG.timeout;
const httpapi = axios.create();
httpapi.defaults.timeout = timeout;

const Customer = {
  sendOtp: (mobileNumber) => {
    return new Promise((resolve, reject) => {
      httpapi.post(sendTokenURL, { mobileNumber: mobileNumber }).then((response) => {
        resolve(response);
      }).catch((e) => reject(e));
    });
  },
  verifyOtp: (otpObj) => {
    return new Promise((resolve, reject) => {
      httpapi.post(verifyTokenURL, { otp: otpObj.otp, mobileNumber: otpObj.mobileNumber, requestIdentity: otpObj.requestIdentity }).then((response) => {
        resolve(response);
      }).catch((e) => reject(e));
    });
  }
}

const Config = {
  getInitialData: () => {
    return new Promise((resolve) => {
      httpapi.get(getJsonFileURL).then((response) => {
        resolve(response.data);
      });
    });
  },
  getFormData: () => {
    return new Promise((resolve) => {
      httpapi.get(formURL).then((response) => {
        resolve(response.data);
      });
    });
  },
  getMyInfoData: (loanIdentifier) => {
    return new Promise((resolve, reject) => {
      httpapi.get(getMyInfoDataUrl).then((response) => {
        resolve(response.data);
      }).catch((e) => reject(e));
    });
  },
  getApplicationId: (dataObj) => {
    return new Promise((resolve, reject) => {
      httpapi.post(`${commonAPIURL}/application`, dataObj).then((response) => {
        resolve(response.data);
      }).catch((e) => reject(e));
    });
  },
  getPackage: () => {
    return new Promise((resolve, reject) => {
      httpapi.get(loanPackageURL).then((response) => {
        resolve(response.data);
      }).catch((e) => reject(e));
    });
  },
  callCallbackURL: (parameter) => {
    return new Promise((resolve, reject) => {
      httpapi.get(`${callBackURL}?${parameter}`).then((response) => {
        resolve(response.data);
      }).catch((e) => reject(e));
    });
  },
  verifyEmail: (code) => {
    return new Promise((resolve, reject) => {
      httpapi.post(`${verifyEmailURL}/${code}`, {}, { headers: { 'Content-Type': 'application/json;charset=UTF-8' } }).then((response) => {
        resolve(response);
      }).catch((e) => reject(e));
    });
  },
  retrieveMyInfoRedirectURL: (parameter) => {
    return new Promise((resolve, reject) => {
      httpapi.get(`${redirectMyInfoURL}${parameter}`).then((response) => {
        resolve(response);
      }).catch((e) => reject(e));
    })
  }
}

const Address = {
  getAddressByCode: (postCode) => {
    return new Promise((resolve, reject) => {
      httpapi.get(`${getAddressByPostalCodeURL}?postalcode=${postCode}`).then((response) => {
        resolve(response);
      }).catch((e) => reject(e));
    })
  }
};

const Application = {
  submitPartialApplication: (dataObj, applicationId) => {
    return new Promise((resolve, reject) => {
      httpapi.post(`${commonAPIURL}/${applicationId}/save`, dataObj).then((response) => {
        resolve(response);
      }).catch((e) => reject(e));
    });
  },
  submitApplication: (dataObj, applicationId, parameter) => {
    return new Promise((resolve, reject) => {
      httpapi.post(`${commonAPIURL}/${applicationId}/submit${parameter}`, dataObj).then((response) => {
        resolve(response);
      }).catch((e) => reject(e));
    });
  }
}

export {
  Config,
  Address,
  Application,
  allowFutureDate,
  Customer
}
