/* global GLOBAL_CONFIG */
import {setErrorWithValue} from "../actions/applicationAction";
const uploadUrl = `${GLOBAL_CONFIG.API_PATH}/user/application/uploaddocument/{referenceNumber} `;
export const detectPathName = () => {
    const router = ["application", "pending", "error", "verify", "apply"];
    let pn = window.location.pathname;
    return pn.replace(router.filter(a => pn.indexOf(a) !== -1)[0], "");
};

export const mapValueToLabel = (arrayOfItems, value) => {
  const item = arrayOfItems.find(x => x.value === value);
  return item ? item.description : value;
};

export const imageExists = (url, callback) => {
  var img = new Image();
  img.onload = function() { callback(true); };
  img.onerror = function() { callback(false); };
  img.src = url;
};

export const mapValueToDescription = (obj) => {
  const objects = Object.keys(obj);
  const tmpArray = [];
  objects.map((key) => {
    tmpArray.push({
      value: key,
      description: obj[key]
    });
    return tmpArray;
  })
  return tmpArray
};

export const mapValueToDescriptionDuplicate = (obj) => {
  const objects = Object.keys(obj);
  const tmpArray = [];
  objects.map((key) => {
    const keys = objects.indexOf(key);
    tmpArray.push({
      key: obj[key].value,
      value: obj[key].value + keys,
      description: obj[key].description
    });
    return tmpArray;
  })
  return tmpArray
};

export const groupByCode = (json, groupBy) => {
  return json.reduce((returnObj, obj) => {
    (returnObj[obj[groupBy]] = returnObj[obj[groupBy]] || []).push(obj);
    return returnObj;
  },{});
};

export const getValueByCode = (code, list) => {
  const item = list.find(x => x.incomeType === code);
  return item ? item.value  : null;
}

export const fileUploadHelper = (file, inputId, identifier, docType, {successDispatch, errorDispatch, progressDispatch}) => {
    const xhr = new window.XMLHttpRequest();
    const formData = new window.FormData();
    const url = uploadUrl.replace("{referenceNumber}", identifier);
    //const url = 'http://localhost:9090/Apply/api/fileUpload';
    if (docType) {
      formData.append(docType, file);
    } else {
      formData.append("file", file);
    }

    xhr.upload.addEventListener(
        "progress",
        e => {
            const percentage = e.loaded / e.total * 100;
            progressDispatch(Math.round(percentage));
        },
        false
    );
    xhr.onloadend = e =>
        e.target.status === 200 ? successDispatch(e.target.response) : errorDispatch(e.target.response);
    xhr.open("POST", `${url}`);
    xhr.send(formData);
};

export const eliminateDuplicates = (arr) => {
  let i,
    len = arr.length,
    out = [],
    obj = {};

  for (i = 0; i < len; i++) {
    obj[arr[i]] = 0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}

export const bytesToSize = bytes => {
    var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    if (bytes === 0) {
        return "0 Byte";
    }
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
};

export const sendDataToSparkline = (dataElementJson, stepNo, isMyInfo, referenceNo = '', isStart = false, isSubmit = false, propertyType = '', loanType = '',  isLanding = false , isAgent = false, source = '', agency = '', ceaid = '' ) => {
    if (window._satellite) {
        if (window.dataElement) {
            window.dataElement = {};
        }

        const dataElement = window.dataElement || {};
        if (isStart) {
          dataElement.event_name = dataElementJson.eventNameStart ;
        } else if (isSubmit) {
          dataElement.event_name = dataElementJson.eventNameSubmit;
          dataElement.property_type = `${propertyType}_${dataElementJson.loanTypeMapping[loanType]}`;
        } else if (isLanding) {
          dataElement.event_name = dataElementJson.eventNameLanding ;
        } else if (stepNo > 0) {
          dataElement.event_name = dataElementJson.eventNameStep.replace("{step}", stepNo);
        } else {
          dataElement.event_name = dataElementJson.eventNameFormFail;
        }

        dataElement.product_id = dataElementJson.productId;
        dataElement.product_name = dataElementJson.productName;
        dataElement.user_type = dataElementJson.userType;
        dataElement.product_category = dataElementJson.productCategory;
        if(isMyInfo){
          dataElement.myInfo = dataElementJson.myInfoForm;
        }

        if (isSubmit) {
          dataElement.transaction_id = referenceNo;
        }

        if(isAgent) {
          dataElement.external_source = source
          dataElement.vendor_name = agency;
          dataElement.salesman_id = ceaid;

          if(isLanding){
            window._satellite.track("virtual_page_view")
          }
        }

        if(!isLanding) {
          window.dtmCustomEventName = dataElement.event_name.replace(/[0-9]+$/, "");
          window._satellite.track(window.dtmCustomEventName);
        }
    }
  }

export const getDescriptionByIds = (ids, description) => {
  let str = "";
  (ids || []).forEach(e => {
    str += ", " + description[e];
  });
  if (str.length > 2) {
    str = str.substring(2);
  }
  return str;
}

export const currencyFormat = (num) => {
  return Number(num).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
};

export const getURLParameter = (name) => {
  // eslint-disable-next-line
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(window.location.search) || [null, ''])[1].replace(/\+/g, '%20')) || "";
};

export const validateInfor = (props) => {
  const { personalDetailsReducer: {nationality}, commonReducer: {isMyInfoFlow, appData} } = props;
  if (isMyInfoFlow) {
    const taxHavenCountryCode = (appData && appData.inputValues && appData.inputValues.taxHavenCountryCode) || [];
    if (taxHavenCountryCode.includes(nationality.value)) {
      return {isValid : false, errorCode : "ERR_TAX_HAVEN_COUNTRY"}
    }
  }
  return {isValid : true, errorCode : ""};
}

export const gotoPage = (props, errorCode) => {
  let pageName = "";
  if (errorCode) {
    pageName = "error";
    props.dispatch(setErrorWithValue(errorCode, true));
  }
  props.history.push({pathname : pageName, search : ''});
}

export const stringInject = (str, data) => {
  if (typeof str === "string" && (data instanceof Array)) {
      return str.replace(/({\d})/g, (i) => {
          return data[parseInt(i.replace(/{/, "").replace(/}/, ""), 10) - 1];
      });
  } else if (typeof str === "string" && (data instanceof Object)) {
      // eslint-disable-next-line
      for (let key in data) {
          return str.replace(/({([^}]+)})/g, (i) => {
              key = i.replace(/{/, "").replace(/}/, "");
              if (!data[key]) {
                  return i;
              }
              return data[key];
          });
      }
  }
  return "";
};

export const renderDomHTML = (parent, child, arr) => {
  if (!arr || (arr && arr.length === 0)) {
      return "";
  }
  let html = "<" + parent + ">";
  (Array.isArray(arr) && arr).forEach(e => {
      html += "<" + child + ">" + e.replace(/^\s+|\s+$/g, "") + "</" + child + ">";
  });
  html += "</" + parent + ">";
  return html;
}; 

