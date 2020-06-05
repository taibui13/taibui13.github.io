import { isValidNumber, AsYouType } from 'libphonenumber-js';
import moment from 'moment';

const sumOfICWithWeightFactor = icNoArray => {
    const weight = [2, 7, 6, 5, 4, 3, 2];
    return icNoArray.map((x, i) => x * weight[i]).reduce((s, v) => s + v, 0);
};

const getICLastLetter = icArray => {
    const mapLetter = ["J", "A", "B", "C", "D", "E", "F", "G", "H", "I", "Z", "J"];
    const icNoArray = icArray.slice(1, -1);
    const total = icArray[0] === "S" ? sumOfICWithWeightFactor(icNoArray) : sumOfICWithWeightFactor(icNoArray) + 4;
    const checkDigit = 11 - total % 11;
    return mapLetter[checkDigit];
};

export const validateMalaysianIC = value => {
  const regex1 = /^\d{2}(0[1-9]|1[012])(0[1-9]|[12][0-9]|3[01])\d{6}$/;
  const regex2 = /^\d{7}$/;
  const regex3 = /^[A-Z]\d{6}$/;
  const regex4 = /^[A-Z]\d{7}$/;
  const regex5 = /^[A-Z]\d{9}$/;
  const testRegexp = value.length === 0 || regex1.test(value) || regex2.test(value) || regex3.test(value) || regex4.test(value) || regex5.test(value);

  return testRegexp;
};

export const validateNRIC = ic => {
    const icArray = ic.split("");
    const icLastLetter = getICLastLetter(icArray);
    const icRegExp = new RegExp(`[S|T][0-9]{7}[${icLastLetter}]`, "g");
    return icRegExp.test(ic);
};

const isNRIC = ic => ic.split("")[0] === "S" || ic.split("")[0] === "T";

const validateTNRIC = ic => {
  const icArray = ic.split("");
  const icLastLetter = getICLastLetter(icArray);
  const icRegExp = new RegExp(`[T][0-9]{7}[${icLastLetter}]`, "g");
  return icRegExp.test(ic);
};

export const validateNRICAndPassport = value => {
  const status = isNRIC(value) ? validateNRIC(value) : true;
  const errorMsg = status ? "" : "invalidNRIC";
  return {status, errorMsg};
};

export const checkNRICOrMalaysianIC = value => {
  const status = validateNRIC(value) || validateMalaysianIC(value);
  const errorMsg = status ? "" : "invalidNRIC";
  return {status, errorMsg};
};

export const validateOnlyNRIC = ic => {
  const status = validateNRIC(ic);
  const errorMsg = status ? "" : "invalidNRIC";
  return {status, errorMsg};
};

export const validateOnlYTNRIC = value => {
  const status = validateTNRIC(value);
  const errorMsg = status ? "" : "invalidNRIC";
  return {status, errorMsg};
};

export const validatePhoneNumber = (value, countryCode) => {
  const code = value.replace("+", "").substring(0, 2);
  const status = isValidNumber(value);
  if (countryCode) {
    const isSG = /^\+65(8|9)\d{7}$/.test(value.split(" ").join(""));
    const formatter = new AsYouType('').input(value);
    if (code !== countryCode.replace("+", "") || !isSG) {
      return {status: false, errorMsg: "invalidPhone", countryCode : formatter ? "+" + code : "+65"};
    }
  }
  
  const errorMsg = status ? "" : "invalidPhone";
  return {status, errorMsg, countryCode : "+" + code};
};


export const validateFilledInput = value => {
  const status = value.trim().length > 0;
  const errorMsg = status ? "" : "fieldEmpty";
  return {status, errorMsg};
};

export const checkFullName = value => {
    const regex = /^([a-z0-9A-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð\s()[\]/\-&.,@#'"+:;<>])+$/;
    const testRegexp = regex.test(value);
    const errorMsg = testRegexp ? "" : "invalidName";

    return {status: testRegexp, errorMsg};
};

export const checkNumbers = value => {
    const regex = /^([0-9])+$/;
    const testRegexp = value.length === 0 || regex.test(value);
    const errorMsg = testRegexp ? "" : "numbersOnly";

    return {status: testRegexp, errorMsg};
};

export const checkAddress = value => {
    const regex = /^([0-9 a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-])+$/;
    const testRegexp = regex.test(value);
    const errorMsg = testRegexp ? "" : "invalidAddress";

    return {status: testRegexp, errorMsg};
};

export const checkEmail = value => {
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const testRegexp = regex.test(value);
    const errorMsg = testRegexp ? "" : "invalidEmail";

    return {status: testRegexp, errorMsg};
};

export const checkDateOfBirthFormat = value => {
    const regex = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)\d{2})$/;
    const testRegexp = regex.test(value);
    const errorMsg = testRegexp ? "" : "invalidDate";

    return {status: testRegexp, errorMsg};
};

export const checkMaxSize = (maxSize, value) => {
  const status = value.length <= parseInt(maxSize, 10);
  const errorMsg = status ? "" : "invalidMaxSize";

  return {status, errorMsg, number: maxSize};
};

export const checkMinSize = (minSize, value) => {
  const status = value.length >= parseInt(minSize, 10);
  const errorMsg = status ? "" : "invalidMinSize";

  return {status, errorMsg, number: minSize};
};

export const checkSize = (maxSize, value) => {
  const status = value.length === parseInt(maxSize, 10);
  const errorMsg = status ? "" : "exactSize";

  return {status, errorMsg, number: maxSize};
};

export const checkRange = (minSize, maxSize, value) => {
  const status = value.length >= parseInt(minSize, 10) && value.length <= parseInt(maxSize, 10);
  const errorMsg = status ? "" : "invalidRange"

  return {status, errorMsg, number: minSize, secondnumber: maxSize};
};

export const checkMinimumAge = (minAge, value) => {
  const dob = moment(value, "DD-MM-YYYY");
  const benchmarkDate = moment().subtract(minAge, "years");
  const status = dob.isSameOrBefore(benchmarkDate, "days");
  const errorMsg = status ? "" : "minAge"

  return {status, errorMsg, number: minAge};
};

export const checkDateNotOverTodayDate = value => {
  const dateEntered = moment(value, "DD-MM-YYYY").format("YYYY-MM-DD");
  const dateNow = moment().format("YYYY-MM-DD");
  const status = moment(dateEntered).isSameOrBefore(dateNow);
  const errorMsg = status ? "" : "yearExceeded";

  return {status, errorMsg};
};

export const checkDateIsOverTodayDate = value => {
    const dateEntered = moment(value, "DD-MM-YYYY").format("YYYY-MM-DD");
    const dateNow = moment().format("YYYY-MM-DD");
    const status = moment(dateEntered).isSameOrAfter(dateNow);
    const errorMsg = status ? "" : "expiredYear";

    return {status, errorMsg};
};

export const checkMinimumMonth = (minMonth, value) => {
  const dateNow = moment().format("YYYY-MM-DD");
  const benchmarkDate = moment(value, "DD-MM-YYYY").subtract(minMonth, "months").format("YYYY-MM-DD");
  const status = moment(dateNow).isSameOrBefore(benchmarkDate);
  const errorMsg = status ? "" : "minMonth";

  return {status, errorMsg, number: minMonth};
};

export const checkYearNotOverCurrentYear = value => {
  const status = moment(value, 'YYYY').isSameOrBefore(moment(), 'year') && value.length === 4;
  const errorMsg = status ? "" : "yearExceeded";

  return {status, errorMsg};
};

export const checkYearNotBefore = (year,value) => {
  const status = moment(value, 'YYYY').isSameOrAfter(moment(year, 'YYYY'), 'year') && value.length === 4;
  const errorMsg = status ? "" : "minimumYear";

  return {status, errorMsg, number: year};
};

export const checkMaximumAge = (maxAge, value) => {
  const dob = moment(value, "DD-MM-YYYY").add(maxAge, "years");
  const benchmarkDate = moment();
  const status = dob.isSameOrAfter(benchmarkDate);
  const errorMsg = status ? "" : "maxAge";

  return {status, errorMsg, number: maxAge};
};

export const noValidation = value => {
  const status = value.length === 0 || (value.length > 0 && value.trim().length === value.length);
  const errorMsg = status ? "" : "noSpaceAllowed";
  return {status, errorMsg};
};

export const onlyLettersAndSpace = value => {
  const regex = /^[a-zA-Z\s]*$/;
  const testRegexp = value.length === 0 || regex.test(value);
  const errorMsg = testRegexp ? "" : "invalidCharacters";

  return {status: testRegexp, errorMsg};
};

export const onlyAlphanumeric = value => {
  const regex = /^[a-z0-9\s]+$/i;
  const testRegexp = value.length === 0 || regex.test(value);
  const errorMsg = testRegexp ? "" : "onlyAlphanumeric";

  return {status: testRegexp, errorMsg};
};

export const alphanumericAndSymbol = value => {
  const regex = /^[a-z0-9\s()[\]/\-&.,@#'"+:;<>]+$/i;
  const testRegexp = value.length === 0 || regex.test(value);
  const errorMsg = testRegexp ? "" : "invalidSymbol";

  return {status: testRegexp, errorMsg};
};

export const checkMaxMonths = value => {
  const status = value <= 11;
  const errorMsg = status ? "" : "maxMonths11";

  return {status, errorMsg};
};

export const checkDateFormat =(value) => {
    const regex = /(^\d{2}\/\d{2}\/\d{4}$)/;
    const testRegexp = regex.test(value);
    const errorMsg = testRegexp ? "" : "invalidDate";

    return {status: testRegexp, errorMsg};
};

export const validateMobileNumber = value => {
  const regex = /^([8-9]{1})([0-9]{7})$/;
  const mobileNumber = value.replace(/ +/g, "")
  const testRegexp = regex.test(mobileNumber);
  const errorMsg = testRegexp ? "" : "invalidPhone";
  return {status: testRegexp, errorMsg};
};

export const validateDecimal = (number, value) => {
  const regex1 = new RegExp(`^([0-9]{1,${number}}\\.[0-9]{1,2})$`);
  const regex2 = new RegExp(`^(^[0-9]{1,${number}})$`);
  const status = regex1.test(value) || regex2.test(value) ;
  const errorMsg = status ? "" : "invalidPrice";
  return {status, errorMsg, number, secondnumber: number}
};

export const validateMinimumOne = (value) => {
  const status = value > 0 && value.length > 0;
  const errorMsg = status ? "" : "minOne";
  return {status, errorMsg}
}

export const validateUploadFileName = (value) => {
  const regex = /^[a-zA-Z0-9\s._ ]+$/i;
  return regex.test(value);
}

export const validateDate = (value) => {
  const status = moment(value, 'DD/MM/YYYY').isValid();
  const errorMsg = status ? "" : "invalidDate";
  return {status, errorMsg}
}

export const checkMinimumValue = (minValue, value) => {
  console.log(minValue);
  
  // const status = value > minValue ;
  // const errorMsg = status ? "" : "invalidMinVal";
  return {status: true, errorMsg: "invalidMinVal" ,  number: minValue}
}

export const validators = (rules, value) => {
  let result = null;
  for (let i = 0; i < rules.length; i++) {
    const oneRule = rules[i];
    const ruleArray = oneRule.split("|");
    const rule = ruleArray[0];

    if (rule === 'required') {
      result = validateFilledInput(value);
    } else if (rule === 'isAlphanumeric') {
      result = onlyAlphanumeric(value);
    } else if (rule === 'isEmail') {
      result = checkEmail(value);
    } else if (rule === 'isNumber') {
      result = checkNumbers(value);
    } else if (rule === 'isNRIC') {
      result = validateOnlyNRIC(value);
    } else if (rule === 'isPhoneNumber') {
      result = validatePhoneNumber(value);
    }  else if (rule === 'exactSize') {
      result = checkSize(ruleArray[1],value);
    }  else if (rule === 'maxSize') {
      result = checkMaxSize(ruleArray[1],value);
    }  else if (rule === 'minSize') {
      result = checkMinSize(ruleArray[1],value);
    }  else if (rule === 'onlyLettersAndSpace') {
      result = onlyLettersAndSpace(value);
    }  else if (rule === 'isFullName') {
      result = checkFullName(value);
    }  else if (rule === 'isMobileNumber') {
      result = validateMobileNumber(value);
    }  else if (rule === 'maxMonths') {
      result = checkMaxMonths(value);
    }  else if (rule === 'yearNotOverCurrentYear') {
      result = checkYearNotOverCurrentYear(value);
    }  else if (rule === 'isDateOfBirth') {
      result = checkDateOfBirthFormat(value);
    }  else if (rule === 'minAge') {
      result = checkMinimumAge(ruleArray[1],value);
    }  else if (rule === 'isOverTodayDate') {
      result = checkDateIsOverTodayDate(value);
    }  else if (rule === 'minMonth') {
      result = checkMinimumMonth(ruleArray[1],value);
    }  else if (rule === 'dateNotOverTodayDate') {
      result = checkDateNotOverTodayDate(value);
    } else if (rule === 'isNRICOrMalaysianIC') {
      result = checkNRICOrMalaysianIC(value);
    } else if (rule === 'isAlphanumericSymbol'){
      result = alphanumericAndSymbol(value)
    } else if (rule === 'isDecimal'){
      result = validateDecimal(ruleArray[1], value)
    } else if (rule === 'yearNotBeforeYear'){
      result = checkYearNotBefore(ruleArray[1], value)
    } else if (rule === 'validateMinimumOne'){
      result = validateMinimumOne(value)
    } else if (rule === 'validateDate'){
      result = validateDate(value)
    } else if (rule === 'checkDateFormat') {
      result = checkDateFormat(value)
    }


    if (!result.status)
      break;
  }
  return result;
}
