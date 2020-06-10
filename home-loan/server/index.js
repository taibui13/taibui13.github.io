var express = require("express");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
var clone = require("lodash/cloneDeep");
var merge = require("lodash/merge");
var busboy = require("connect-busboy");

app.use(busboy());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(req.body);
    next();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static("public"));
const ADDRESS_STORE = __dirname + "/data/" + "addressList.json";
const APPLICATION_STORE = __dirname + "/data/" + "applicationList.json";

const SUCCESS = "00000";
const ERROR = "00101";
var baseResponse = {status: "00000", errorDesc: null, errors: null, data: null};



app.post("/api/v1/property/loan/self-assist/access/verify/:id", function (req, res) {
    return res.status(200).end();
});

app.get("/api/v1/property/loan/self-assist/specifications", function (req, res) {
    // var mainApplicant = require("../../applicant/public/mainapplicantform.json");
    // var jointapplicantform = require("../../jointApplicant/public/jointapplicantform.json");
    return res.status(200).end(JSON.stringify({
        "jointApplicant" : {
          "verify" : {
            "verifying" : null,
            "title" : "Important information before you proceed.",
            "labels" : {
              "continueButton" : "I agree to proceed"
            }
          },
          "pendingPage" : {
            "title" : "Retrieve Application",
            "subtitle" : "We notice that there is an incomplete application that was previously started. You can retrieve the data filled up in the previous application.",
            "labels" : {
              "yesButton" : "Retrieve",
              "noButton" : "Restart"
            },
            "terms" : null
          },
          "maintenance" : false,
          "maintenaceURL" : "https://forms.uob.com.sg/property/error?code=OFFLINE",
          "bypassCode" : "123",
          "applyPage" : {
            "title" : "I am a joint applicant for </br>UOB Home Loan.",
            "subtitle" : null,
            "description" : "<span class='uob-media-title terms'>For Singaporean & PR only </span> <br/> You have been nominated as a joint applicant for a UOB Home Loan application. The applicant should have informed you with regards to this home loan. Retrieve your personal data with MyInfo to pre-fill.</br><span></br><strong>What you need to know?</strong></span></br><ul><li type='disc'> This home loan application is: </li><ul><li type='circle'>to finance the purchase of a residential property in Singapore;</li><li type='circle'>to finance the purchase of another residential property if you are selling your existing residential property with an outstanding loan;</li><li type='circle'>to refinance an existing home loan from another financial institution.</li></ul><li type='disc'>This home loan is not applicable if you have any other existing property loan (including equity term loans). </li></ul>",
            "retrieveButton" : "Retrieve with MyInfo",
            "footer" : "SingPass holders can use MyInfo to retrieve personal information from participating Government agencies. MyInfo is temporarily unavailable from 2 am to 8.30 am every Wednesday and Sunday and 5 am to 5.30 am every other day.  <br/> <a target='_blank' href='https://uniservices1.uobgroup.com/secure/forms/url_redirection.jsp?CC=SG&URL=https://goo.gl/wS6oL4'><div class='myInfo_footer_link'> Find out more. </div></a>",
            "data" : "dummyData",
            "terms" : null,
            "labels" : {
              "loanPurpose" : "Loan Purpose",
              "propertyType" : "Property Type",
              "propertyUsage" : "Property Usage",
              "purchasePrice" : "Property Price (SGD)",
              "propertyConstructionStatus" : "Property Construction Status",
              "dateOfTOP" : "TOP date (DD/MM/YYYY)",
              "eligibleFinanialAssets" : "Eligible Financial Assets (SGD)",
              "directPurchase" : "This property is bought directly from a developer.",
              "disbursementYear" : "Current Loan - First Disbursement Year",
              "homeLoanOutstanding" : "Current Loan - Outstanding Balance (SGD)",
              "builtArea" : "Built In Area (sq feet)",
              "loanAmount" : "Loan Amount (SGD)",
              "loanType" : "Loan Type"
            }
          },
          "basicDetails" : {
            "title" : "Basic Details",
            "subtitle" : "Get started by filling up your contact information.",
            "labels" : {
              "fullName" : "Full Name as per your NRIC",
              "nric" : "NRIC",
              "emailAddress" : "Email",
              "mobileNumber" : "Mobile Number",
              "mobileNumberEg" : "You must provide us with a mobile number for the purpose of UOB Personal Internet Banking and UOB Mobile Services, and to receive SMS-OTPs, alerts and notifications. If you are an existing customer with us, we will use your mobile number and email in our records. Sign in to UOB Personal Internet Banking to update your mobile number and email.",
              "continueButton" : "Continue",
              "relationship" : "Relationship with Applicant",
              "loanPurpose" : "Loan Purpose",
              "propertyType" : "Property Type",
              "propertyUsage" : "Property is for",
              "purchasePrice" : "Property Price (SGD)",
              "propertyConstructionStatus" : "Property Construction Status",
              "dateOfTOP" : "Date of TOP (DD/MM/YYYY)",
              "eligibleFinanialAssets" : "Eligible Financial Assets (SGD)",
              "directPurchase" : "This property is bought directly from a developer.",
              "disbursementYear" : "Current Loan - First Disbursement Year",
              "homeLoanOutstanding" : "Current Loan - Outstanding Balance (SGD)",
              "builtArea" : "Built In Area (sq feet)",
              "loanAmount" : "Loan Amount (SGD)",
              "residentialStatus" : "Residential Status",
              "loanType" : "Loan Type"
            },
            "terms" : "By proceeding, I agree that the Bank may use the contact information provided above to contact me regarding this application or to assist in completing this application if it is incomplete or not submitted."
          },
          "otp" : {
            "title" : "Verify Mobile Number",
            "subtitle" : "Enter the one-time password (OTP) you received within 180 seconds.",
            "resendOtp" : "Resend"
          },
          "loanDetails" : {
            "title" : "Loan Details",
            "subtitle" : "Provide details of your home loan.",
            "labels" : {
              "sourceOfFundsMLR" : "Source of Funds (Loan Repayment)",
              "sourceOfFundsDP" : "Source of Funds (Cash Downpayment)",
              "sourceOfWealth" : "Source Of Wealth",
              "continueButton" : "Continue"
            },
            "terms" : null
          },
          "personalDetails" : {
            "title" : "Personal Details",
            "subtitle" : "Tell us about yourself.",
            "labels" : {
              "dateOfBirth" : "Date of Birth (DD/MM/YYYY)",
              "gender" : "Gender",
              "highestQualification" : "Education Level",
              "maritalStatus" : "Marital Status",
              "race" : "Race",
              "nationality" : "Nationality",
              "countryOfBirth" : "Country of Birth",
              "countryOfResidence" : "Country of Residence",
              "hasDualNationality" : "I am holding dual nationality",
              "additionalLegalIdCountry" : "Additional Nationality",
              "additionalLegalId" : "Additional Passport Number",
              "additionalLegalIdNote" : "For Malaysians - Enter NRIC instead of Passport Number",
              "additionalLegalIdExpiryDate" : "Additional Passport Expiry (DD/MM/YYYY)",
              "additionalLegalIdIssueCountry" : "Additional Passport Issuing Country",
              "continueButton" : "Continue"
            },
            "terms" : "I authorise UOB to update my records accordingly with the relevant details as they appear on my NRIC or as provided by me in this application."
          },
          "residentialDetails" : {
            "title" : "Residential Address",
            "subtitle" : "Provide a residential address for us to send important mail.",
            "maillingSubtitle" : "Please provide a mailing address.",
            "labels" : {
              "homePostalCode" : "Postal Code",
              "homeBlock" : "Block/ House",
              "homeStreet" : "Street",
              "homeBuilding" : "Building/ Condo Name (Optional)",
              "homeUnit" : "Unit Number",
              "homeLevel" : "Level",
              "propertyType" : "Property Type",
              "mailingPostalCode" : "Postal Code",
              "mailingBlock" : "Block/ House",
              "mailingStreet" : "Street",
              "mailingUnit" : "Unit Number",
              "mailingLevel" : "Level",
              "mailingBuilding" : "Building/ Condo Name (Optional)",
              "continueButton" : "Continue",
              "country" : "Country",
              "postal_code" : "Postcode",
              "overseasAddress1" : "Address Line 1",
              "overseasAddress2" : "Address Line 2",
              "overseasAddress3" : "Address Line 3",
              "overseasAddress4" : "Address Line 4",
              "city" : "City"
            },
            "mailingToggle" : {
              "description" : "I have a different mailing address."
            },
            "terms" : "Residential address refers to the address listed on your NRIC. By proceeding, I confirm that my residential address shall be as stated above. If there is any change in my residential address, I undertake to inform the Bank immediately."
          },
          "workDetails" : {
            "title" : "Work Details",
            "subtitle" : "Tell us what you do for a living.",
            "labels" : {
              "optionalText" : "Optional",
              "natureOfEmployment" : "Nature of Employment",
              "jobTitle" : "Job Title",
              "nameOfEmployer" : "Name of Employer",
              "companyName" : "Company Name",
              "industry" : "Industry",
              "workingInSG" : "Working in Singapore?",
              "lengthOfEmploymentYears" : "Length of Employment (Years)",
              "lengthOfEmploymentMonths" : "Length of Employment (Months)",
              "assessYear" : "Year of Assessment for Income",
              "assessableIncome" : "Yearly Assessment Income (SGD)",
              "additionalIncome" : "Additional Declaration on Eligible Financial Assets",
              "employmentIncome" : "Employment Income (SGD)",
              "annualTradeIncome" : "Annual Trade Income (SGD)",
              "monthlyFixedIncome" : "Monthly Fixed Income (SGD)",
              "monthlyFixedIncomeEg" : "E.g. Salary",
              "monthlyTradeIncome" : "Monthly Trade Income (SGD)",
              "monthlyVariableIncome" : "Monthly Variable Income (SGD)",
              "monthlyVariableIncomeEg" : "E.g. Bonus, Allowances",
              "monthlyRentalIncome" : "Monthly Rental Income (SGD)",
              "monthlyRentalIncomeEg" : "Rental income declared must be supported by a stamped tenancy agreement in your sole name. Remaining lease must not be less than 6 months at the time of loan acceptance.",
              "eligibleFinancialAssets" : "Deposits (SGD) in Accounts",
              "efaEg" : "Deposits declared must be for your accounts in your sole name. It should be unpledged and exclude any cash downpayment placed for the purchase of this property (where applicable).",
              "declareIncomeExample" : null,
              "continueButton" : "Continue",
              "previousCompanyName" : "Previous Company Name",
              "previousJobTitle" : "Previous Job Title",
              "previousIndustry" : "Previous Industry",
              "lengthOfPreviousEmploymentYears" : "Length of Employment (Years)",
              "lengthOfPreviousEmploymentMonths" : "Length of Employment (Months)",
              "cpfContribution" : "CPF Contribution (Last 15 Months)",
              "cpfColTile" : [ "For Month", "Paid On", "Amount (SGD)", "Employer" ],
              "incBreakdown" : "Income Tax (Notice of Assessment)",
              "incBreakTerms" : null,
              "incBreakColTile" : [ "Year", "Assessable Income (SGD)", "Employment Income (SGD)", "Trade Income (SGD)", "Rental Income (SGD)", "Interest (SGD)" ]
            },
            "toggle" : {
              "anotherJob" : "I am holding more than one job.",
              "workInSG" : "I am currently working in Singapore.",
              "declareIncome" : "I want to declare my income details.",
              "declareIncomeEg" : "You might want to declare your latest income if you have a recent update in your income, supporting documentation is required.",
              "declareIncomeTaxClearance" : "I want to declare my income details.",
              "declareIncomeTaxClearanceEg" : "You are required to declare your income details as we notice Tax Clearance is required by IRAS in your latest Income Tax (Notice of Assessment).",
              "errorMsg" : "Field is required",
              "previousCompany" : "I am currently in my first job."
            },
            "terms" : null
          },
          "uploadDocuments" : {
            "title" : "Upload Documents",
            "subtitle" : "Submit these additional documents for us to validate your declared income.",
            "labels" : {
              "uploadPayslipDoc" : "Upload Payslip Documents",
              "uploadTenancyAgreement" : "Upload Tenancy Agreement",
              "uploadBankStatement" : "Upload Bank Statement",
              "uploadAdditionalPassport" : "Upload Passport for Dual Nationality",
              "continueButton" : "Continue"
            },
            "descriptions" : {
              "uploadTenancyAgreement" : null,
              "uploadBankStatement" : null,
              "uploadPayslipDoc" : "Note that multiple payslips should be combined into one document.",
              "uploadAdditionalPassport" : "Upload an image of your Passport for UOB to verify your personal information (Supports files: .jpg .png with a max filesize of 3MB)."
            },
            "showUploadDocuments" : true,
            "paySlipCheck" : false,
            "tenancyAgreementCheck" : false,
            "bankStatmentCheck" : false,
            "terms" : "One document per upload. The subsequent upload will overwrite your previous upload in the same category.<ul><li>Filetype supported: jpg, png, pdf and Maximum 3MB</li><li>Filename supported: Alphanumeric, Space, Fullstop & Underscore</li></ul>"
          },
          "confirmDetails" : {
            "title" : "Confirm Details",
            "subtitle" : "Take a final look at the details that you have provided to confirm everything is accurate.",
            "summary" : "Summary",
            "labels" : {
              "submitButton" : "Submit"
            },
            "confirmToggle" : "I confirm that I have read, understood and agree to be bound by the terms and conditions stated below:",
            "acknowledgementText" : "<p>Important: Please read before submitting <br></p><ol><li><p>I represent and warrant that all information and documents given to you in connection with this application are accurate, complete and not misleading. If any information given is or subsequently becomes inaccurate, incomplete, misleading or changes in any way, whether before this application is approved or while the credit facilities are existing, I will promptly notify you of any such change;</p></li><li><p>I confirm that I have read, understood and agree to be bound by the <a target='_blank' href='https://forms.uob.com.sg/property/apply/01497-17-UOB-form-CR133-4.pdf'>Bank's Standard Terms and Conditions Governing Credit Facilities (\"Standard Terms\")</a> and <a target='_blank' href='https://www.uob.com.sg/web-resources/personal/pdf/personal/save/tnc-cts.pdf'>Terms and Conditions Governing Accounts and Services (\"Account Terms\")</a> including any variation the Bank makes to such terms and conditions;  </p></li><li><p>I confirm that I have read and understood the <a target='_blank' href='http://www.uob.com.sg/assets/pdfs/UOB_privacy_individual.pdf'>Bank's Privacy Notice  (Individual)</a> which forms part of the terms and conditions governing my relationship with the Bank. I consent to the Bank collecting, using and disclosing my personal data for Basic Banking Purpose, Co-Branding Purpose, Research Purpose and Marketing Purpose as described in the Bank's Privacy Notice (Individual). I note that (a) I may withdraw consent for any or all of the purposes at any time; (b) if I withdraw consent for Basic Banking Purposes and/or Co-branding Purpose, the Bank may not be able to continue to provide the products and services to me; (c) if I withdraw consent for Research Purpose and Marketing Purpose, my personal data will not be used for these purposes unless I expressly and separately consent to the same again;</p></li><li><p>I irrevocably consent and authorise the Bank and its officers to disclose and/or verify any information pertaining to me, this application, or any of my accounts and/or facilities with the Bank, to any party the Bank may consider appropriate including any of the Bank's related companies, advisors, credit bureaus, insurance providers, HDB, governmental authorities or any other party set out in the Account Terms for the purposes described in the Bank's Privacy Notice;  </p></li><li><p>I confirm that I am not an undischarged bankrupt and there has not been any statutory demand served on me at the time of this application;</p></li><li><p>I authorise the Bank to communicate with me all information in connection with this application, my accounts and any other communications, in accordance with the Account Terms; </p></li><li><p>I acknowledge that the Bank may decline my application without giving any reason or notice, and I agree that the Bank may keep all documents given to the Bank in connection with this application notwithstanding that this application is declined;</p></li><li><p>Where the Bank agrees to grant me conditional approval for this application, I agree that such conditional approval may be communicated to me via an encrypted email to my email address indicated in this application. The encrypted email may only be read with the encryption key provided to me by the Bank. I agree that I am responsible for keeping the encryption key safe and confidential, and preventing unauthorized access to the encrypted email. I agree that the Bank is not responsible for what happens to any email communication after it is sent, whether such email communication is delayed, intercepted, lost, misdirected, erroneous,  incompletely transmitted or is disclosed to any one during transit or otherwise. I agree to indemnify the Bank against any consequences, claims, damages and losses which may arise out of or be incurred by the Bank in connection with any email communications; and</p></li><p/><li>I hereby confirm that my electronic signature is the legal equivalent of my manual signature on this application form and I have read, understood and agree to be bound by the prevailing <a target='_blank' href='https://www.uob.com.sg/assets/pdfs/uob-esignature-service-tnc-2017.pdf'>UOB Electronic Signature Service Terms</a>.</li></ol>",
            "terms" : null
          },
          "thankYouPage" : {
            "title" : "Thank you!",
            "subtitle" : "Your application has been submitted",
            "referenceNo" : "(Ref No. {referenceNo})",
            "description" : "If you wish to have a free credit report, you may obtain it within 30 calendar days from the date of approval or rejection of this application via the credit bureau website listed below. Alternatively, you may bring the approval or rejection letter and your NRIC to the following credit bureau's registered office to obtain a free credit report.</br></br>Credit Bureau (Singapore) Pte Ltd</br>www.creditbureau.com.sg</br>2 Shenton Way #20-02 SGX Centre 1 Singapore 068804</br>Tel:(65) 65656363"
          },
          "inputValues" : {
            "relationship" : {
              "SP" : "Spouse",
              "PR" : "Parent",
              "CH" : "Child",
              "SB" : "Sibling",
              "RO" : "Relative",
              "BA" : "Business Associate",
              "FO" : "Friend"
            },
            "residentialStatus" : {
              "A" : "Foreigner",
              "C" : "Singapore Citizen",
              "P" : "Permanent Resident",
              "U" : "Foreigner",
              "N" : "Foreigner"
            },
            "gender" : {
              "M" : "Male",
              "F" : "Female"
            },
            "maritalStatus" : {
              "S" : "Single",
              "M" : "Married",
              "D" : "Divorced",
              "W" : "Widowed"
            },
            "educationLevel" : {
              "X" : "No formal Education",
              "P" : "Primary",
              "N" : "GCE N Level Or Equivalent",
              "O" : "GCE O Level Or Equivalent",
              "A" : "GCE A Level Or Equivalent",
              "D" : "Diploma",
              "F" : "Professional Qualification",
              "V" : "Advanced Diploma",
              "B" : "Bachelor Degree",
              "G" : "Post Graduate School",
              "T" : "Doctorate Degree",
              "M" : "Masters Degree",
              "C" : "Certificate (NTC/LCCI/OTHERS)"
            },
            "propertyType" : {
              "HDB" : "HDB",
              "EC" : "Executive Condo",
              "PC" : "Private Residential"
            },
            "propertyTypeAddress" : {
              "H3" : "HDB - 3Rm/4Rm",
              "H5" : "HDB - 5Rm/Executive Apartment",
              "EC" : "Executive Condo/HUDC",
              "PC" : "Private Apartment/Condominium",
              "BG" : "Bungalow",
              "SM" : "Semi-Detached",
              "TE" : "Terrace"
            },
            "race" : {
              "CN" : "Chinese",
              "MY" : "Malay",
              "IN" : "Indian",
              "AB" : "Anglo Burmese",
              "AC" : "Anglo Chinese",
              "AD" : "Amerindian",
              "AF" : "African",
              "AG" : "Afghan",
              "AH" : "Anglo Thai",
              "AI" : "Anglo Indian",
              "AJ" : "Achehnese",
              "AL" : "Albanian",
              "AM" : "Armenian",
              "AN" : "Annamite",
              "AO" : "Ambonese",
              "AP" : "Anglo Filipino",
              "AR" : "Arab",
              "AS" : "Assami",
              "AT" : "Austrian",
              "AU" : "Australian",
              "AX" : "Anglo Saxon",
              "AY" : "Aryan",
              "AZ" : "Azeri",
              "BA" : "Batak",
              "BB" : "Bulgarian",
              "BC" : "Butonese",
              "BD" : "Bangladeshi",
              "BE" : "Belgian",
              "BF" : "Bajau",
              "BG" : "Bugis",
              "BH" : "Burgher",
              "BI" : "Bengali",
              "BJ" : "Banjarese",
              "BK" : "Bamar",
              "BL" : "Bangala",
              "BM" : "Balinese",
              "BN" : "Bhutanese",
              "BO" : "Banten",
              "BQ" : "Basque",
              "BR" : "Brahmin",
              "BS" : "Bisaya",
              "BT" : "British",
              "BU" : "Burmese",
              "BV" : "Bosniak",
              "BW" : "Betawi",
              "BY" : "Boyanese",
              "BZ" : "Brazilian",
              "CA" : "Caucasian",
              "CB" : "Canadian",
              "CC" : "Cape Coloured",
              "CD" : "Cambodian",
              "CE" : "Ceylonese",
              "CF" : "Cornish",
              "CG" : "Creole",
              "CH" : "Swiss",
              "CI" : "Croat",
              "CJ" : "Chamorro",
              "CM" : "Ceylon Moor",
              "CO" : "Cocos",
              "CR" : "Caribbean",
              "CS" : "Czechoslovak",
              "CZ" : "Czech",
              "DA" : "Dane",
              "DB" : "Dutch Burgher",
              "DH" : "Bidayuh",
              "DS" : "Dusun",
              "DU" : "Dutch",
              "DY" : "Dayak",
              "EL" : "English",
              "ER" : "European",
              "ES" : "Spanish",
              "ET" : "Ethiopian",
              "EU" : "Eurasian",
              "EY" : "Egyptian",
              "FI" : "Finn",
              "FJ" : "Fijian",
              "FM" : "Flemish",
              "FR" : "French",
              "GA" : "Goan",
              "GE" : "Gujarati",
              "GH" : "Ghanaian",
              "GK" : "Gurkha",
              "GM" : "German",
              "GO" : "Goanese",
              "GR" : "Greek",
              "HA" : "Haitian",
              "HI" : "Hispanic",
              "HO" : "Hollander",
              "HT" : "Hindustani",
              "HU" : "Hungarian",
              "HW" : "Hawaiian",
              "IA" : "Iranian",
              "IB" : "Iban",
              "ID" : "Indonesian",
              "IK" : "Isoko",
              "IL" : "Israeli",
              "IQ" : "Iraqi",
              "IR" : "Irish",
              "IS" : "Icelander",
              "IT" : "Italian",
              "IU" : "Inuit",
              "JA" : "Javanese",
              "JK" : "Jakun",
              "JM" : "Jamaican",
              "JO" : "Jordanian",
              "JP" : "Japanese",
              "JW" : "Jew",
              "KA" : "Kachin",
              "KB" : "Khasi",
              "KC" : "Kayah",
              "KD" : "Kayin",
              "KE" : "Kenyan",
              "KF" : "Kinh",
              "KG" : "Kyrgyz",
              "KH" : "Khmer",
              "KI" : "Kenyah",
              "KK" : "Kazakh",
              "KL" : "Kelabit",
              "KM" : "Kampuchean",
              "KN" : "Karen",
              "KR" : "Korean",
              "KY" : "Kayan",
              "KZ" : "Kadazan",
              "LA" : "Lao",
              "LB" : "Lebanese",
              "LI" : "Lithuanian",
              "LK" : "Sri Lankan",
              "LT" : "Latin",
              "LV" : "Latvian",
              "LX" : "Luxembourger",
              "LY" : "Libyan",
              "MA" : "Madurese",
              "MB" : "Malabari",
              "MC" : "Magyars",
              "MD" : "Moldavian",
              "ME" : "Minangkabau",
              "MF" : "Manx",
              "MG" : "Malagasy",
              "MH" : "Mahratta",
              "MI" : "Maori",
              "MJ" : "Murut",
              "MK" : "Makasarese",
              "ML" : "Maldivian",
              "MM" : "Malayalee",
              "MN" : "Melanesian",
              "MO" : "Mongolian",
              "MP" : "Manipuri",
              "MQ" : "Mestizo",
              "MR" : "Marathi",
              "MS" : "Metis",
              "MT" : "Maltese",
              "MU" : "Mauritian",
              "MV" : "Mon",
              "MW" : "Moroccan",
              "MX" : "Mexican",
              "MZ" : "Melanau",
              "NA" : "Naga",
              "NG" : "Negro",
              "NI" : "Nigerian",
              "NL" : "Netherlander",
              "NO" : "Norwegian",
              "NP" : "Nepalese",
              "NR" : "Nauruan",
              "NW" : "Newar",
              "NZ" : "New Zealander",
              "PA" : "Penan",
              "PB" : "Palestine",
              "PC" : "Polish",
              "PE" : "Persian",
              "PH" : "Filipino",
              "PJ" : "Punjabi",
              "PK" : "Pakistani",
              "PL" : "Pole",
              "PN" : "Pathan",
              "PO" : "Portuguese",
              "PR" : "Peruvian",
              "PS" : "Parsee",
              "PY" : "Polynesian",
              "RJ" : "Rajput",
              "RK" : "Rakhine",
              "RO" : "Romanian",
              "RU" : "Russian",
              "SA" : "Sino Kadazan",
              "SB" : "Sammarinese",
              "SC" : "Scot",
              "SD" : "Sindhi",
              "SE" : "Swede",
              "SF" : "Serbia/Montengerin",
              "SG" : "Samoan",
              "SH" : "Shan",
              "SI" : "Sinhalese",
              "SJ" : "Sino Japanese",
              "SK" : "Sikh",
              "SL" : "Slovak",
              "SM" : "Sumatran",
              "SN" : "Sino Indian",
              "SO" : "Somali",
              "SQ" : "Slavic",
              "SR" : "Serani",
              "SS" : "Sundanese",
              "SU" : "Sudanese",
              "SW" : "Swedish",
              "SY" : "Seychellois",
              "TE" : "Telugu",
              "TH" : "Thai",
              "TI" : "Tibetan",
              "TJ" : "Tajik",
              "TM" : "Tamil",
              "TN" : "Turkmen",
              "TO" : "Tongan",
              "TP" : "Timor",
              "TR" : "Turk",
              "UN" : "Unknown",
              "UR" : "Ukrainian",
              "US" : "American",
              "UY" : "Uyghur",
              "UZ" : "Uzbek",
              "VE" : "Venezuelan",
              "VN" : "Vietnamese",
              "WE" : "Welsh",
              "XD" : "Other Indonesian",
              "XE" : "Other Eurasian",
              "XI" : "Other Indian",
              "XX" : "Others",
              "YU" : "Yugoslav",
              "ZW" : "Zimbabwean"
            },
            "natureOfEmployment" : {
              "SALARIED" : "Salaried",
              "SELFE4" : "Sole Proprietor/ Partner",
              "SELFE" : "Self-Employed",
              "SELFE1" : "Business Owner (with shareholding >= 25%)",
              "SELFE2" : "Business Owner (with shareholding < 25%)",
              "BUSSV" : "Freelance",
              "STUDT" : "Student",
              "HWIFE" : "Housewife",
              "RETIREE" : "Retiree",
              "NOINC" : "Unemployed",
              "SELFE3" : "Landlord with Rental Income"
            },
            "occupation" : {
              "CW" : "Academic - Childcare",
              "LE" : "Academic - Lecturer",
              "HP" : "Academic - Principal",
              "PF" : "Academic - Professor",
              "EU" : "Academic - Teacher",
              "TT" : "Academic - Tutor",
              "AC" : "Accountant/ Financial Controller",
              "LB" : "Administrative - Librarian",
              "SE" : "Administrative - Secretary",
              "AD" : "Administrative Assistant",
              "AE" : "Administrative/ Accounts Executive",
              "AT" : "Architect",
              "TV" : "Artist/ Producer",
              "EA" : "Artiste/ Entertainer/ Model",
              "AU" : "Auditor",
              "WR" : "Author/ Blogger/ Writer ",
              "BX" : "Bank Officer",
              "FX" : "Bank Senior Executive/ Management",
              "BT" : "Bank Teller/ Clerk",
              "BA" : "Barber/ Hairstylist",
              "BU" : "Beautician",
              "BC" : "Bouncer",
              "BO" : "Broadcaster/ Journalist/ Reporter",
              "BK" : "Broker/ Dealer",
              "AN" : "Business/ Technology Analyst",
              "BR" : "Butcher/ Fishmonger",
              "SQ" : "Cabin Crew",
              "CE" : "Caterer",
              "C1" : "Chairman",
              "CF" : "Chef/ Bartender",
              "CT" : "Chemist",
              "CL" : "Cleaner",
              "CJ" : "Clinic/ Dental Assistant",
              "DM" : "Collector - Bills/ Repossesor",
              "EC" : "Construction Worker",
              "CN" : "Consultant/ Planner",
              "CC" : "Contractor",
              "CR" : "Coordinator",
              "CU" : "Counsellor",
              "HE" : "Crane / Heavy Equipment Operator",
              "CI" : "Croupier",
              "OP" : "Customer Support Operator",
              "DG" : "Designer",
              "DR" : "Director",
              "DF" : "Draftsman",
              "DV" : "Driver - Personal Chauffeur",
              "HD" : "Driver - Private Hire",
              "TX" : "Driver - Public Transport",
              "ET" : "Economist",
              "ED" : "Editor",
              "ES" : "Embassy Staff",
              "EN" : "Engineer",
              "EX" : "Executive",
              "IA" : "Financial Advisor/ Insurance Agent",
              "FM" : "Foreman",
              "EM" : "Funeral Director/ Attendant/ Embalmer",
              "GO" : "Government Civil Service Officer/ Staff",
              "MP" : "Government Minister/ Member of Parliament",
              "EL" : "Handyman",
              "HW" : "Hawker/ Stall Owner",
              "TL" : "Interpreter/ Translator",
              "IE" : "IT Professional/ Software Engineer",
              "JU" : "Judge",
              "LW" : "Lawyer/ Attorney",
              "LA" : "Legal Assistant/ Paralegal",
              "MG" : "Manager",
              "MN" : "Manicurists/ Pedicurists",
              "DI" : "Maritime - Diver",
              "SS" : "Maritime - Seaman/ Sailor",
              "SC" : "Maritime - Ship Captain",
              "MK" : "Marketing Executive/ Assistant",
              "MS" : "Masseuse",
              "MH" : "Mechanic",
              "DT" : "Medical Practitioner - Dentist/ Dental Technician",
              "DO" : "Medical Practitioner - Doctor",
              "SM" : "Medical Practitioner - Specialist",
              "TM" : "Medical Practitioner - Traditional Chinese Medicine",
              "MR" : "Merchandiser/ Purchaser",
              "NS" : "Mindef Full-time NSF",
              "MF" : "Mindef In-Service Personnel",
              "MC" : "Money Changer",
              "MY" : "Money Lender",
              "MU" : "Musician",
              "HC" : "Nurse/ Caregiver",
              "DN" : "Nutritionist/ Dietitian",
              "OA" : "Operation Executive/ Assistant",
              "ON" : "Optician",
              "PA" : "Pharmacist",
              "PY" : "Photographer",
              "PH" : "Physiotherapist",
              "PT" : "Pilot",
              "PO" : "Politician/ Diplomat",
              "PD" : "Private Investigator",
              "DS" : "Product Specialist",
              "PC" : "Project Manager",
              "PP" : "Property Agent",
              "PU" : "Prosecutor",
              "PR" : "Public Relation Officer",
              "RM" : "Relationship Manager",
              "MO" : "Religious Servant - Monk/ Nun/ Priest",
              "PS" : "Religious Servant - Pastor",
              "RG" : "Religious Service Provider",
              "RS" : "Remiser",
              "RA" : "Research Executive",
              "SR" : "Sales Executive/ Assistant",
              "FI" : "SCDF In-Service Personnel",
              "SN" : "Scientist",
              "SG" : "Security Officer",
              "CA" : "Service - Cashier",
              "PE" : "Service - Porter/ Housekeeper",
              "RP" : "Service - Receptionist",
              "RE" : "Service - Restaurant Captain",
              "WT" : "Service - Waiter/Waitress",
              "SI" : "Service Executive/ Assistant",
              "SW" : "Social Worker/ Volunteer",
              "ST" : "Specialist",
              "HT" : "SPF Police Officer",
              "AH" : "Sportsperson",
              "SV" : "Supervisor",
              "SY" : "Surveyor",
              "TA" : "Tailor/ Seamstress/ Couturier",
              "TE" : "Technician",
              "TP" : "Therapist",
              "TG" : "Tourist Guide/ Travel Advisor",
              "TR" : "Trainer/ Instructor",
              "TI" : "Trainer/ Instructor - Technology related",
              "VA" : "Valuer/ Auctioneer",
              "VE" : "Veterinarian"
            },
            "industry" : [ {
              "value" : "AGFFG",
              "description" : "Agriculture"
            }, {
              "value" : "ARTAN",
              "description" : "Antique & Arts Dealing"
            }, {
              "value" : "ENTRR",
              "description" : "Arts & Recreational"
            }, {
              "value" : "BUSSV",
              "description" : "Business Services"
            }, {
              "value" : "BUSSV1",
              "description" : "Business Services - Manpower"
            }, {
              "value" : "GAMBL",
              "description" : "Casino & Gambling"
            }, {
              "value" : "COMTP",
              "description" : "Commodities - Transportation"
            }, {
              "value" : "OCSPR",
              "description" : "Community & Social Services"
            }, {
              "value" : "CONST",
              "description" : "Construction"
            }, {
              "value" : "PROSV1",
              "description" : "Creative and Advertising"
            }, {
              "value" : "EDUCA",
              "description" : "Education"
            }, {
              "value" : "MFGRG1",
              "description" : "Electronics"
            }, {
              "value" : "EMHRC",
              "description" : "Embassy - Consulate & High Commission"
            }, {
              "value" : "EMBAS",
              "description" : "Embassy - Others"
            }, {
              "value" : "ENMEI",
              "description" : "Energy & Metal - Extraction"
            }, {
              "value" : "LOUNG",
              "description" : "Entertainment - Bars/ KTV/ Night Clubs"
            }, {
              "value" : "MFGRG2",
              "description" : "Fashion & Textile"
            }, {
              "value" : "FINAN",
              "description" : "Financial Services - Banking"
            }, {
              "value" : "INSUR",
              "description" : "Financial Services - Insurance"
            }, {
              "value" : "MOCHG",
              "description" : "Financial Services - Licensed Money Changing/ Remittance"
            }, {
              "value" : "MOLGA",
              "description" : "Financial Services - Licensed Money Lenders"
            }, {
              "value" : "PSPRO",
              "description" : "Financial Services - Payment Service Provider"
            }, {
              "value" : "PPPBA",
              "description" : "Financial Services - Pure Play Private Bank"
            }, {
              "value" : "INVEB",
              "description" : "Financial Services - Securities & Investment"
            }, {
              "value" : "CATER",
              "description" : "Food & Beverages"
            }, {
              "value" : "PUBSV",
              "description" : "Government & Public Services"
            }, {
              "value" : "MEDIC",
              "description" : "Healthcare/ Pharmaceutical"
            }, {
              "value" : "HOTEL",
              "description" : "Hospitality"
            }, {
              "value" : "DOMES",
              "description" : "Household Services"
            }, {
              "value" : "COMPU",
              "description" : "Information & Technology"
            }, {
              "value" : "LAWLL",
              "description" : "Legal & Accounts"
            }, {
              "value" : "LFACU",
              "description" : "Legal & Accounts - Unregulated"
            }, {
              "value" : "TRDIE",
              "description" : "Logistics & Supply Chain"
            }, {
              "value" : "MFGRG3",
              "description" : "Manufacturing - Aerospace"
            }, {
              "value" : "MFGRG4",
              "description" : "Manufacturing - Automobile"
            }, {
              "value" : "MFGRG5",
              "description" : "Manufacturing - Chemicals"
            }, {
              "value" : "PROSV2",
              "description" : "Maritime - Others"
            }, {
              "value" : "SHIPF",
              "description" : "Maritime - Shipping/ Sea/ Freight/ Vessel Leasing"
            }, {
              "value" : "MASSM",
              "description" : "Mass Media & Telecommunications"
            }, {
              "value" : "DEFEN",
              "description" : "Military Weapons & Arms"
            }, {
              "value" : "MNING",
              "description" : "Mining & Quarrying"
            }, {
              "value" : "CHARI",
              "description" : "Non-Profit Organisation"
            }, {
              "value" : "CHARC",
              "description" : "Non-Profit Organisation - Cross Border Donations"
            }, {
              "value" : "OGLNG",
              "description" : "Oil & Gas"
            }, {
              "value" : "PAWNS",
              "description" : "Pawn Shop"
            }, {
              "value" : "PRECI",
              "description" : "Precious Metals & Gems Dealing"
            }, {
              "value" : "MFGRG6",
              "description" : "Precision Engineering"
            }, {
              "value" : "PROSV3",
              "description" : "Professional Services - Consultancy"
            }, {
              "value" : "PROSV4",
              "description" : "Professional Services - Personal Care"
            }, {
              "value" : "PROSV5",
              "description" : "Professional Services - Real Estate "
            }, {
              "value" : "RTAIL",
              "description" : "Retail & Wholesale Trade"
            }, {
              "value" : "CHEMW",
              "description" : "Retail & Wholesale Trade - Chemical Substances Wholesalers"
            }, {
              "value" : "SPVNO",
              "description" : "Special Purpose Vehicle with no core operating business"
            }, {
              "value" : "TIMES",
              "description" : "Timeshare"
            }, {
              "value" : "TRSPT",
              "description" : "Transportation"
            }, {
              "value" : "TRAVL",
              "description" : "Travel & Tourism"
            }, {
              "value" : "UTILI",
              "description" : "Utilities"
            } ],
            "countriesNamesMap" : {
              "SG" : "Singapore",
              "AF" : "Afghanistan",
              "AL" : "Albania",
              "DZ" : "Algeria",
              "AS" : "American Samoa",
              "AD" : "Andorra",
              "AO" : "Angola",
              "AI" : "Anguilla",
              "AR" : "Argentina",
              "AM" : "Armenia",
              "AB" : "Aruba",
              "AU" : "Australia",
              "AT" : "Austria",
              "AZ" : "Azerbaijan",
              "BS" : "Bahamas",
              "BH" : "Bahrain",
              "BD" : "Bangladesh",
              "BB" : "Barbados",
              "BL" : "Belarus",
              "BE" : "Belgium",
              "BZ" : "Belize",
              "BJ" : "Benin",
              "BM" : "Bermuda",
              "BT" : "Bhutan",
              "BO" : "Bolivia",
              "BA" : "Bosnia-Herzegovina",
              "BW" : "Botswana",
              "BR" : "Brazil",
              "BQ" : "British Antarctic Territory",
              "IO" : "British Indian Ocean Territory",
              "VG" : "British Virgin Islands",
              "BN" : "Brunei",
              "BG" : "Bulgaria",
              "BF" : "Burkina Faso",
              "BI" : "Burundi",
              "KA" : "Cambodia",
              "CM" : "Cameroon",
              "CA" : "Canada",
              "CT" : "Canton & Enderbury Islands",
              "CV" : "Cape Verde",
              "KY" : "Cayman Islands",
              "CF" : "Central African Republic",
              "CD" : "Channel Islands",
              "TD" : "Chad",
              "CL" : "Chile",
              "CN" : "China",
              "CX" : "Christmas Island",
              "CC" : "Cocos Keeling Island",
              "CO" : "Colombia",
              "KM" : "Comoros",
              "CG" : "Congo",
              "CE" : "Congo, Democratic Republic",
              "CK" : "Cook Islands",
              "CR" : "Costa Rica",
              "CB" : "Croatia",
              "CU" : "Cuba",
              "CZ" : "Czech Republic",
              "DK" : "Denmark",
              "DJ" : "Djibouti",
              "DO" : "Dominican Republic",
              "TP" : "East Timor",
              "EC" : "Ecuador",
              "EG" : "Egypt",
              "SV" : "El Salvador",
              "GQ" : "Equatorial Guinea",
              "ER" : "Eritrea",
              "EN" : "Estonia",
              "ET" : "Ethiopia",
              "FK" : "Falkland Islands",
              "FO" : "Faroe Islands",
              "FJ" : "Fiji",
              "FI" : "Finland",
              "FR" : "France",
              "GF" : "French Guiana",
              "PF" : "French Polynesia",
              "FQ" : "French Southern Territories",
              "GA" : "Gabon",
              "GM" : "Gambia",
              "GZ" : "Gaza",
              "GO" : "Georgia",
              "DG" : "Germany",
              "GH" : "Ghana",
              "GI" : "Gibraltar",
              "GR" : "Greece",
              "GL" : "Greenland",
              "GP" : "Guadeloupe",
              "GU" : "Guam",
              "GT" : "Guatemala",
              "GK" : "Guernsey",
              "GN" : "Guinea",
              "GW" : "Guinea-Bissau",
              "GY" : "Guyana",
              "HT" : "Haiti",
              "HM" : "Heard and McDonald Islands",
              "HN" : "Honduras",
              "HS" : "Hong Kong SAR",
              "HK" : "Hong Kong",
              "HU" : "Hungary",
              "IS" : "Iceland",
              "IN" : "India",
              "ID" : "Indonesia",
              "IR" : "Iran",
              "IQ" : "Iraq",
              "IE" : "Ireland",
              "MM" : "Isle of Man",
              "IL" : "Israel",
              "IT" : "Italy",
              "CI" : "Ivory Coast",
              "JM" : "Jamaica",
              "JP" : "Japan",
              "JE" : "Jersey, C.I.",
              "JT" : "Johnston Island",
              "JO" : "Jordan",
              "KZ" : "Kazakhstan",
              "KE" : "Kenya",
              "KG" : "Kirghizia",
              "KI" : "Kiribati",
              "KV" : "Kosovo",
              "KW" : "Kuwait",
              "KS" : "Kyrgyzstan",
              "LA" : "Laos",
              "LV" : "Latvia",
              "LB" : "Lebanon",
              "LS" : "Lesotho",
              "LR" : "Liberia",
              "LY" : "Libya",
              "LI" : "Liechtenstein",
              "LH" : "Lithuania",
              "LU" : "Luxembourg",
              "MO" : "Macao",
              "MF" : "Macau SAR",
              "MB" : "Macedonia",
              "MG" : "Madagascar",
              "MW" : "Malawi",
              "MY" : "Malaysia",
              "MV" : "Maldives",
              "ML" : "Mali",
              "MT" : "Malta",
              "MH" : "Marshall Islands",
              "MQ" : "Martinique",
              "MR" : "Mauritania",
              "MU" : "Mauritius",
              "ME" : "Mayotte",
              "MX" : "Mexico",
              "FM" : "Micronesia",
              "MI" : "Midway Islands",
              "MD" : "Moldova",
              "MC" : "Monaco",
              "MN" : "Mongolia",
              "MJ" : "Montenegro",
              "MS" : "Montserrat",
              "MA" : "Morocco",
              "MZ" : "Mozambique",
              "BU" : "Myanmar",
              "NA" : "Namibia",
              "NR" : "Nauru",
              "NP" : "Nepal",
              "AN" : "Netherlands Antililles",
              "NL" : "Netherlands",
              "NT" : "Neutral Zone",
              "NC" : "New Caledonia",
              "NZ" : "New Zealand",
              "NI" : "Nicaragua",
              "NE" : "Niger",
              "NG" : "Nigeria",
              "NU" : "Niue Island",
              "NF" : "Norfolk Island",
              "KP" : "North Korea  ",
              "MP" : "Northern Mariana Is",
              "NO" : "Norway",
              "OM" : "Oman",
              "PC" : "Pacific Island Trust Territory",
              "PK" : "Pakistan",
              "PW" : "Palau",
              "PB" : "Palestine",
              "PZ" : "Panama Canal Zone",
              "PA" : "Panama",
              "PG" : "Papua New Guinea",
              "PY" : "Paraguay",
              "PE" : "Peru",
              "PH" : "Philippines",
              "PN" : "Pitcairn Island",
              "PL" : "Poland",
              "PT" : "Portugal",
              "PR" : "Puerto Rico",
              "QA" : "Qatar",
              "RE" : "Reunion",
              "RO" : "Romania",
              "RF" : "Russia",
              "RW" : "Rwanda",
              "SH" : "Saint Helena",
              "PM" : "Saint Pierre and Miquelon",
              "VC" : "Saint Vincent and the Grenadines",
              "WM" : "Samoa",
              "SM" : "San Marino",
              "ST" : "Sao Tome and Principe",
              "SA" : "Saudi Arabia",
              "SN" : "Senegal",
              "RS" : "Serbia",
              "SF" : "Serbia/Montenergo",
              "SC" : "Seychelles",
              "SL" : "Sierra Leone",
              "SX" : "Sint Maarten",
              "SK" : "Slovak Republic",
              "SI" : "Slovenia",
              "SB" : "Solomon Islands",
              "SO" : "Somalia",
              "ZA" : "South Africa",
              "KR" : "South Korea",
              "ES" : "Spain",
              "LK" : "Sri Lanka",
              "GS" : "South Georgia & South Sandwich Islands",
              "SD" : "Sudan",
              "SR" : "Suriname",
              "SJ" : "Svalbard & Jan Mayen",
              "SZ" : "Swaziland",
              "SE" : "Sweden",
              "CH" : "Switzerland",
              "SY" : "Syria",
              "TW" : "Taiwan",
              "TI" : "Tajikistan",
              "TZ" : "Tanzania",
              "TH" : "Thailand",
              "TE" : "Timor",
              "TL" : "Timor-Leste",
              "TG" : "Togo",
              "TK" : "Tokelau Islands",
              "TO" : "Tonga",
              "TT" : "Trinidad and Tobago",
              "TN" : "Tunisia",
              "TR" : "Turkey",
              "TM" : "Turkmenistan",
              "TC" : "Turks and Caicos Islands",
              "TV" : "Tuvalu",
              "VI" : "U.S. Virgin Islands",
              "UG" : "Uganda",
              "UR" : "Ukraine",
              "AE" : "United Arab Emirates",
              "GB" : "United Kingdom",
              "US" : "United States of America",
              "UN" : "Unknown",
              "HV" : "Upper Volta",
              "UY" : "Uruguay",
              "UM" : "US Minor Outlying Islands",
              "UZ" : "Uzbekistan",
              "VA" : "Vatican City State",
              "VE" : "Venezuela",
              "VN" : "Vietnam",
              "WK" : "Wake Island",
              "WF" : "Wallis and Futuna",
              "EH" : "Western Sahara",
              "YM" : "Yemen",
              "YU" : "Yugoslavia",
              "ZR" : "Zaire",
              "ZM" : "Zambia",
              "ZW" : "Zimbabwe"
            },
            "taxHavenCountryCode" : [ "AG", "CY", "DM", "GD", "KN", "LC", "VU" ]
          },
          "optionInput" : {
            "loanPurpose" : [ {
              "value" : "N",
              "description" : "New Purchase"
            }, {
              "value" : "R",
              "description" : "Refinancing"
            } ],
            "propertyUsage" : [ {
              "value" : "0",
              "description" : "Own Stay"
            }, {
              "value" : "1",
              "description" : "Investment"
            } ],
            "propertyConstructionStatus" : [ {
              "value" : "0",
              "description" : "Completed"
            }, {
              "value" : "1",
              "description" : "Under Construction"
            } ],
            "sourceOfFundsDP" : {
              "1" : "Personal Savings",
              "2" : "Salary",
              "3" : "Commission",
              "4" : "Return On Investments",
              "5" : "Own Business",
              "6" : "Rental Receipt",
              "7" : "Dividend Receipt",
              "8" : "Inheritance/Gift"
            },
            "sourceOfFundsMLR" : {
              "1" : "Personal Savings",
              "2" : "Salary",
              "3" : "Commission",
              "4" : "Return On Investments",
              "5" : "Own Business",
              "6" : "Rental Receipt",
              "7" : "Dividend Receipt",
              "8" : "Inheritance/Gift"
            },
            "sourceOfWealth" : {
              "1" : "Business Ownership",
              "2" : "Income From Employment",
              "3" : "Inheritance/Gift",
              "4" : "Investments"
            }
          },
          "myInfoReadonlyFields" : {
            "fullName" : true,
            "nric" : true,
            "email" : false,
            "mobileNumber" : true,
            "dateOfBirth" : true,
            "gender" : true,
            "maritalStatus" : false,
            "educationLevel" : false,
            "race" : true,
            "countryOfBirth" : true,
            "nationality" : true,
            "unit" : true,
            "street" : true,
            "block" : true,
            "postCode" : true,
            "floor" : true,
            "propertyType" : true,
            "homePostalCode" : true,
            "homeBlock" : true,
            "homeStreet" : true,
            "homeAddressFormat" : true,
            "homeLevel" : true,
            "assessableIncome" : true,
            "nameOfEmployer" : false,
            "employmentIncome" : true,
            "tradeIncome" : true,
            "annualTradeIncome" : true
          },
          "globalErrors" : {
            "apiException" : "The service is currently unavailable. You can try again later.",
            "invalidOTP" : "OTP is invalid or has expired. You can request for a new SMS OTP to try again.",
            "badRequest" : "The service is currently unavailable. You can try again later.",
            "sameResidentialAndMailingAddress" : "Mailing address should not be identical to residential address.",
            "sameApplicantAndJointApplicant" : "NRIC and Mobile Number for the applicant and joint applicant should not be identical.",
            "addressServiceDown" : "Searching by postal code is currently unavailable. You can fill up the address manually.",
            "invalidAssessableIncome" : "Total sum of trade and variable income cannot be more than Yearly Assessable Income.",
            "uploadUnsuccessfulMsg" : "File upload fail. Please try again later."
          },
          "errorMessageBox" : {
            "linkExpired" : {
              "title" : "Sorry. We cannot find what you are looking for.",
              "subtitle" : "The link has either expired or you do not have permission to access this page. You can try again.",
              "description" : null
            },
            "serviceDown" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "The service is currently unavailable. You can try again later.",
              "description" : null
            },
            "badRequest" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "The session has expired. You can try again.",
              "description" : null
            },
            "unauthorized" : {
              "title" : "Sorry. We cannot find what you are looking for.",
              "subtitle" : "The link has either expired or you do not have permission to access this page. You can try again.",
              "description" : null
            },
            "NOREF" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "Please leave us with your <a target='_blank' href='https://forms.uob.com.sg/personal/services/property/contact-us.html?i_cid=pfs:sg:owned:int:pweb:na:tx:jnoref:hdb-home-loan:011219-evergreen:hlphlconus:na&vid=none'><div class='error_msg_link'>details</div></a> so we can contact and assist you.",
              "description" : null
            },
            "MYINFO" : {
              "title" : "Something went wrong.",
              "subtitle" : "We are having difficulty retrieving data from MyInfo. Your data might be missing or MyInfo service might be temporarily unavailable. You can try again later or if you have any questions on MyInfo, contact support@myinfo.gov.sg or +65 6643 0567.",
              "description" : null
            },
            "MYRJTD" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "The service is currently unavailable. You can try again later.",
              "description" : null,
              "url" : "apply"
            },
            "MYAGE" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "You'll need to be at least 21 years old to apply for a UOB Home Loan.",
              "description" : null
            },
            "MYRESST" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "Please leave us with your <a target='_blank' href='https://forms.uob.com.sg/personal/services/property/contact-us.html?i_cid=pfs:sg:owned:int:pweb:na:tx:jmyresst:hdb-home-loan:011219-evergreen:hlphlconus:na&vid=none'><div class='error_msg_link'>details</div></a> so we can contact and assist you.",
              "description" : null
            },
            "JID" : {
              "title" : "Are you sure you are the right person?",
              "subtitle" : "NRIC that we have retrieved from MyInfo is different from the one the main applicant has filled in. You can inform the applicant to initiate a new loan application with the correct information.",
              "description" : null
            },
            "ERR_TAX_HAVEN_COUNTRY" : {
              "title" : "Thank you for your interest",
              "subtitle" : "We are unable to let you proceed with this application.",
              "description" : null
            },
            "MYINFO_INCOMPLETE_REQ" : {
              "title" : "Something went wrong!",
              "subtitle" : "We are having difficulty retrieving data from MyInfo.{1}Your data might be missing or MyInfo service might be temporarily unavailable. You can try again later or if you have any questions on MyInfo, contact support@myinfo.gov.sg or +65 6643 0567.",
              "description" : null
            }
          },
          "errorMsgs" : {
            "invalidNRIC" : "is invalid.",
            "invalidPhone" : "is invalid.",
            "invalidName" : "is invalid.",
            "invalidAddress" : "is invalid.",
            "invalidEmail" : "is invalid.",
            "invalidDate" : "is invalid.",
            "invalidMaxSize" : "cannot be more than {number} characters.",
            "invalidMinSize" : "must be at least {number} character(s).",
            "invalidSymbol" : "is invalid.",
            "exactSize" : "must be {number} character(s).",
            "invalidRange" : "must be between {number} to {secondnumber} characters.",
            "numbersOnly" : "can only contains numbers.",
            "minAge" : ". You must be minimally {number} years old.",
            "maxAge" : ". You must not be above {number} years old.",
            "fieldEmpty" : "is required.",
            "invalidCharacters" : "can only contain letters.",
            "onlyAlphanumeric" : "can only contain letters and numbers.",
            "noSpaceAllowed" : "should not have space at the start and end.",
            "termsRequired" : "Terms and Conditions is required.",
            "expiredYear" : "is expired.",
            "yearExceeded" : "cannot be more than current year.",
            "minimumYear" : "can only be between {number} to current year.",
            "minMonth" : "should have {number} months validity.",
            "invalidPrice" : "can contain {number} digits or {secondnumber} digits with two decimal points.",
            "minAmountMsg" : "cannot be less than {number}.",
            "maxAmountMsg" : "cannot be more than {number}.",
            "minOne" : "is invalid",
            "uploadUnsuccessfulMsgSize" : "file size cannot exceed 3MB",
            "uploadUnsuccessfulMsgExtension" : "can only be either jpg, png or pdf",
            "uploadUnsuccessfulMsgFileName" : "file name is invalid."
          },
          "helpMessage" : {
            "title" : "Need help?",
            "subtitle" : "Feel free to contact our team for support",
            "text" : "<div class='helpMessage-text'><div>Singapore</div><div><a  class='helpMessage-mobile' href='tel:1800 388 2121'>1800 388 2121 (8am-8pm)</a></div></div><div class='helpMessage-text'><div>Overseas</div><div ><a class='helpMessage-mobile' href='tel:+65 6388 2121'>+65 6388 2121 (8am-8pm)</a></div></div>",
            "isDisplayed" : true
          },
          "dataElement" : {
            "productId" : "HLPHL",
            "productName" : "UOB Home Loan",
            "userType" : "NTB",
            "productCategory" : "Secured Loans",
            "myInfoForm" : "form_myinfo",
            "manualForm" : "form_manual",
            "eventNameStart" : "form_start",
            "eventNameSubmit" : "form_submit",
            "eventNameStep" : "form_complete_step{step}",
            "eventNameLanding" : "myinfo_start",
            "eventNameFormFail" : "form_fail",
            "eventNameRetrieve" : "form_retrieve",
            "loanTypeMapping" : {
              "0" : "NC",
              "1" : "NU",
              "2" : "RC",
              "3" : "RU"
            }
          },
          "employmentMapping" : {
            "HWIFE" : {
              "occupation" : "HF",
              "industry" : "NOINC"
            },
            "RETIREE" : {
              "occupation" : "RT",
              "industry" : "NOINC"
            },
            "NOINC" : {
              "occupation" : "UE",
              "industry" : "NOINC"
            },
            "STUDT" : {
              "occupation" : "SU",
              "industry" : "NOINC"
            },
            "SELFE4" : {
              "occupation" : "SP"
            },
            "SELFE1" : {
              "occupation" : "SD"
            },
            "BUSSV" : {
              "occupation" : "FL"
            },
            "SELFE3" : {
              "occupation" : "LL",
              "industry" : "BUSSV"
            }
          },
          "security" : {
            "tip" : "Security Tips from UOB",
            "iconUrl" : "./images/shield.png",
            "info" : "There has been a recent spate of phishing scams targeting government and banks' customers. It is important to remain vigilant and be suspicious of all unsolicited emails you receive.",
            "line_one" : "<span>1.</span><span>Be alert. </span>Verify that you are on an official UOB website by clicking on the 'padlock icon' in the address bar and checking that the certificate is issued to forms.uob.com.sg.",
            "line_two" : "<span>2.</span><span>Be extra careful of unsolicited email. </span> Do not click on any links from unknown and suspicious email.",
            "line_three" : "<span>3.</span><span>Protect your device. </span> Always use a device that you trust. Ensure that it is always updated with the latest security and bug fixes."
          },
          "configuration" : {
            "personalDetails" : {
              "enableDualNationality" : false
            }
          }
        },
        "mainApplicant" : {
          "verify" : {
            "verifying" : null,
            "title" : "Important information before you proceed.",
            "labels" : {
              "continueButton" : "I agree to proceed"
            },
            "applyPageUrl" : "./apply"
          },
          "pendingPage" : {
            "title" : "Retrieve Application",
            "subtitle" : "We notice that there is an incomplete application that was previously started. You can retrieve the data filled up in the previous application. Data retrieved from your last MyInfo login will be used to overwrite the information filled up previously.",
            "labels" : {
              "yesButton" : "Retrieve",
              "noButton" : "Restart"
            },
            "terms" : null
          },
          "maintenance" : false,
          "maintenaceURL" : "https://forms.uob.com.sg/property/error?code=OFFLINE",
          "bypassCode" : "123",
          "applyPageSelf" : {
            "title" : "I am applying for a </br>UOB Home Loan.",
            "subtitle" : null,
            "description" : "<span><span class='uob-media-title terms'>For Singaporean & PR only </span> <br/> Apply for a new UOB Home Loan with forms pre-filled by retrieving your personal information with MyInfo. Applications submitted between 8.30am to 9pm daily will be processed instantly. Applications received outside these times will be processed the next working day. </br><span></br><strong>What you need to know?</strong></span></br><ul><li type='disc'> This home loan application is: </li><ul><li type='circle'>to finance the purchase of a residential property in Singapore</li><li type='circle'>to finance the purchase of another residential property if you are selling your existing residential property with an outstanding loan.</li><li type='circle'>to refinance an existing home loan from another financial institution.</li></ul><li type='disc'>This home loan is not applicable if you have any other existing property loan (including equity term loans). </li><li type='disc'>You can add 1 joint applicant in the application.</li>",
            "footer" : "SingPass holders can use MyInfo to retrieve personal information from participating Government agencies. MyInfo is temporarily unavailable from 2 am to 8.30 am every Wednesday and Sunday and 5 am to 5.30 am every other day. <br/><a href='https://uniservices1.uobgroup.com/secure/forms/url_redirection.jsp?CC=SG&URL=https://goo.gl/wS6oL4'>Find out more</a>.",
            "retrieveButton" : "Retrieve with MyInfo"
          },
          "applyPageAgent" : {
            "title" : "I am applying for a </br>UOB Home Loan.",
            "subtitle" : null,
            "description" : "<span><span class='uob-media-title terms'>For Singaporean & PR only </span> <br/> Apply for a new UOB Home Loan with forms pre-filled by retrieving your personal information with MyInfo. Applications submitted between 8.30am to 9pm daily will be processed instantly. Applications received outside these times will be processed the next working day. </br><span></br><strong>What you need to know?</strong></span></br><ul><li type='disc'> This home loan application is: </li><ul><li type='circle'>to finance the purchase of a residential property in Singapore</li><li type='circle'>to finance the purchase of another residential property if you are selling your existing residential property with an outstanding loan.</li><li type='circle'>to refinance an existing home loan from another financial institution.</li></ul><li type='disc'>This home loan is not applicable if you have any other existing property loan (including equity term loans). </li><li type='disc'>You can add 1 joint applicant in the application.</li>",
            "footer" : "SingPass holders can use MyInfo to retrieve personal information from participating Government agencies. MyInfo is temporarily unavailable from 2 am to 8.30 am every Wednesday and Sunday and 5 am to 5.30 am every other day. <br/><a href='https://uniservices1.uobgroup.com/secure/forms/url_redirection.jsp?CC=SG&URL=https://goo.gl/wS6oL4'>Find out more</a>.",
            "retrieveButton" : "Retrieve with MyInfo"
          },
          "basicDetails" : {
            "title" : "Basic Details",
            "subtitle" : "Get started by filling up your contact information.",
            "labels" : {
              "fullName" : "Full Name as per your NRIC",
              "nric" : "NRIC",
              "emailAddress" : "Email",
              "mobileNumber" : "Mobile Number",
              "mobileNumberEg" : "You must provide us with a mobile number for the purpose of UOB Personal Internet Banking and UOB Mobile Services, and to receive SMS-OTPs, alerts and notifications. If you are an existing customer with us, we will use your mobile number and email in our records. Sign in to UOB Personal Internet Banking to update your mobile number and email.",
              "continueButton" : "Continue"
            },
            "terms" : "By proceeding, I agree that the Bank may use the contact information provided above to contact me regarding this application or to assist in completing this application if it is incomplete or not submitted."
          },
          "otp" : {
            "title" : "Verify Mobile Number",
            "subtitle" : "Enter the one-time password (OTP) you received within 180 seconds.",
            "resendOtp" : "Resend"
          },
          "loanDetails" : {
            "title" : "Loan Details",
            "subtitle" : "Provide details of your home loan.",
            "labels" : {
              "loanPurpose" : "Loan Purpose",
              "loanType" : "Loan Type",
              "propertyType" : "Property Type",
              "propertyUsage" : "Property is for",
              "purchasePrice" : "Property Price (SGD)",
              "propertyConstructionStatus" : "Property Construction Status",
              "dateOfTOP" : "TOP date (DD/MM/YYYY)",
              "eligibleFinanialAssets" : "Eligible Financial Assets (SGD)",
              "directPurchase" : "This property is bought directly from a developer.",
              "disbursementYear" : "Current Loan - First Disbursement Year",
              "homeLoanOutstanding" : "Current Loan - Outstanding Balance (SGD)",
              "homeLoanOutstandingEg" : "Your outstanding home loan balances include any undisbursed amount with any existing financier/ financial institutions.",
              "builtArea" : "Built In Area (sq feet)",
              "loanAmount" : "Loan Amount (SGD)",
              "jointBorrower" : "I am taking this loan with another applicant.",
              "jointBorrowerSubtitle" : "Provide details of your joint applicant",
              "fullName" : "Joint Applicant's Name",
              "nric" : "Joint Applicant's NRIC",
              "emailAddress" : "Joint Applicant's Email",
              "mobileNumber" : "Joint Applicant's Mobile Number",
              "condoMinPurchasePrice" : "133333.34",
              "hdbMinPurchasePrice" : "106666.67",
              "hdbMinLoanAmount" : "80000",
              "condoMinLoanAmount" : "100000",
              "loanRate" : "0.75",
              "sourceOfFundsMLR" : "Source of Funds (Loan Repayment)",
              "sourceOfFundsDP" : "Source of Funds (Cash Downpayment)",
              "sourceOfWealth" : "Source Of Wealth",
              "loanPackageConfirmDetails" : "Loan Package",
              "continueButton" : "Continue"
            },
            "loanPackage" : {
              "title" : "Select your preferred package",
              "colTitles" : [ "Years", "Interest Rate (%)" ],
              "loanPackageTerms" : "The above rates are estimated.  Actual rate will be based on the time of loan disbursement.",
              "onOffLoanPackage" : false,
              "labelForIndex0Muti" : "Thereafter",
              "labelForIndex0Single" : "{years} and above",
              "loanPackageRequired" : "* Loan package is required",
              "fixedintBaseRateCode" : [ "000" ],
              "siborintBaseRateCode" : [ "792", "793" ],
              "fixedInterestRate" : "Fixed",
              "percentage" : "%",
              "addSign" : "+"
            },
            "jointTerms" : "By proceeding, I confirm that I have obtained the consent of the joint applicant for UOB to collect, use and disclose his/her personal data above for the purpose of contacting him/her regarding this home loan application;",
            "terms" : null
          },
          "personalDetails" : {
            "title" : "Personal Details",
            "subtitle" : "Tell us about yourself.",
            "labels" : {
              "dateOfBirth" : "Date of Birth (DD/MM/YYYY)",
              "gender" : "Gender",
              "highestQualification" : "Education Level",
              "maritalStatus" : "Marital Status",
              "race" : "Race",
              "nationality" : "Nationality",
              "countryOfBirth" : "Country of Birth",
              "countryOfResidence" : "Country of Residence",
              "hasDualNationality" : "I am holding dual nationality",
              "additionalLegalIdCountry" : "Additional Nationality",
              "additionalLegalId" : "Additional Passport Number",
              "additionalLegalIdNote" : "For Malaysians - Enter NRIC instead of Passport Number",
              "additionalLegalIdExpiryDate" : "Additional Passport Expiry (DD/MM/YYYY)",
              "additionalLegalIdIssueCountry" : "Additional Passport Issuing Country",
              "continueButton" : "Continue"
            },
            "terms" : "I authorise UOB to update my records accordingly with the relevant details as they appear on my NRIC or as provided by me in this application."
          },
          "residentialDetails" : {
            "title" : "Residential Address",
            "subtitle" : "Provide a residential address for us to send important mail.",
            "maillingSubtitle" : "Please provide a mailing address.",
            "labels" : {
              "homePostalCode" : "Postal Code",
              "homeBlock" : "Block/ House",
              "homeStreet" : "Street",
              "homeBuilding" : "Building/ Condo Name (Optional)",
              "homeUnit" : "Unit Number",
              "homeLevel" : "Level",
              "propertyType" : "Property Type",
              "mailingPostalCode" : "Postal Code",
              "mailingBlock" : "Block/ House",
              "mailingStreet" : "Street",
              "mailingUnit" : "Unit Number",
              "mailingLevel" : "Level",
              "mailingBuilding" : "Building/ Condo Name (Optional)",
              "continueButton" : "Continue",
              "country" : "Country",
              "postal_code" : "Postcode",
              "overseasAddress1" : "Address Line 1",
              "overseasAddress2" : "Address Line 2",
              "overseasAddress3" : "Address Line 3",
              "overseasAddress4" : "Address Line 4",
              "city" : "City"
            },
            "mailingToggle" : {
              "description" : "I have a different mailing address."
            },
            "terms" : "Residential address refers to the address listed on your NRIC. By proceeding, I confirm that my residential address shall be as stated above. If there is any change in my residential address, I undertake to inform the Bank immediately."
          },
          "workDetails" : {
            "title" : "Work Details",
            "subtitle" : "Tell us what you do for a living.",
            "labels" : {
              "optionalText" : "Optional",
              "natureOfEmployment" : "Nature of Employment",
              "jobTitle" : "Job Title",
              "nameOfEmployer" : "Name of Employer",
              "companyName" : "Company Name",
              "industry" : "Industry",
              "workingInSG" : "Working in Singapore?",
              "lengthOfEmploymentYears" : "Length of Employment (Years)",
              "lengthOfEmploymentMonths" : "Length of Employment (Months)",
              "anotherJob" : "I am holding more than one job.",
              "assessYear" : "Year of Assessment for Income",
              "assessableIncome" : "Yearly Assessment Income (SGD)",
              "additionalIncome" : "Additional Declaration on Eligible Financial Assets",
              "employmentIncome" : "Employment Income (SGD)",
              "annualTradeIncome" : "Trade Income (SGD)",
              "monthlyFixedIncome" : "Monthly Fixed Income (SGD)",
              "monthlyFixedIncomeEg" : "E.g. Salary",
              "monthlyTradeIncome" : "Monthly Trade Income (SGD)",
              "monthlyVariableIncome" : "Monthly Variable Income (SGD)",
              "monthlyVariableIncomeEg" : "E.g. Bonus, Allowances",
              "monthlyRentalIncome" : "Monthly Rental Income (SGD)",
              "monthlyRentalIncomeEg" : "Rental income declared must be supported by a stamped tenancy agreement in your sole name. Remaining lease must not be less than 6 months at the time of loan acceptance.",
              "eligibleFinancialAssets" : "Deposits (SGD) in Accounts",
              "efaEg" : "Deposits declared must be for your accounts in your sole name. It should be unpledged and exclude any cash downpayment placed for the purchase of this property (where applicable).",
              "declareIncomeExample" : null,
              "continueButton" : "Continue",
              "previousCompanyName" : "Previous Company Name",
              "previousJobTitle" : "Previous Job Title",
              "previousIndustry" : "Previous Industry",
              "lengthOfPreviousEmploymentYears" : "Length of Employment (Years)",
              "lengthOfPreviousEmploymentMonths" : "Length of Employment (Months)",
              "cpfContribution" : "CPF Contribution (Last 15 Months)",
              "cpfColTile" : [ "For Month", "Paid On", "Amount (SGD)", "Employer" ],
              "incBreakdown" : "Income Tax (Notice of Assessment)",
              "incBreakTerms" : null,
              "incBreakColTile" : [ "Year", "Assessable Income (SGD)", "Employment Income (SGD)", "Trade Income (SGD)", "Rental Income (SGD)", "Interest (SGD)" ]
            },
            "toggle" : {
              "anotherJob" : "I am holding more than one job.",
              "workInSG" : "I am currently working in Singapore.",
              "declareIncome" : "I want to declare my income details.",
              "declareIncomeEg" : "You might want to declare your latest income if you have a recent update in your income, supporting documentation is required.",
              "declareIncomeTaxClearance" : "I want to declare my income details.",
              "declareIncomeTaxClearanceEg" : "You are required to declare your income details as we notice Tax Clearance is required by IRAS in your latest Income Tax (Notice of Assessment).",
              "updateDeclareIncome" : "I want to update my income details",
              "errorMsg" : "Field is required",
              "previousCompany" : "I am currently in my first job."
            },
            "terms" : null
          },
          "uploadDocuments" : {
            "title" : "Upload Documents",
            "subtitle" : "Submit these additional documents for us to validate your declared income.",
            "labels" : {
              "uploadPayslipDoc" : "Upload Payslip Document",
              "uploadTenancyAgreement" : "Upload Tenancy Agreement",
              "uploadBankStatement" : "Upload Bank Statement",
              "uploadAdditionalPassport" : "Upload Passport for Dual Nationality",
              "continueButton" : "Continue",
              "uploaded" : "{incomeType} document uploaded",
              "incomeType1" : "PaySlip",
              "incomeType2" : "Tenancy Agreement",
              "incomeType3" : "Bank Statement"
            },
            "descriptions" : {
              "uploadTenancyAgreement" : null,
              "uploadBankStatement" : null,
              "uploadPayslipDoc" : "Note that multiple payslips should be combined into one document.",
              "uploadAdditionalPassport" : "Upload an image of your Passport for UOB to verify your personal information (Supports files: .jpg .png with a max filesize of 3MB)."
            },
            "showUploadDocuments" : true,
            "paySlipCheck" : false,
            "tenancyAgreementCheck" : false,
            "bankStatmentCheck" : false,
            "terms" : "One document per upload. The subsequent upload will overwrite your previous upload in the same category.<ul><li>Filetype supported: jpg, png, pdf and Maximum 3MB</li><li>Filename supported: Alphanumeric, Space, Fullstop & Underscore</li></ul>"
          },
          "confirmDetails" : {
            "title" : "Confirm Details",
            "subtitle" : "Take a final look at the details that you have provided to confirm everything is accurate.",
            "summary" : "Summary",
            "labels" : {
              "submitButton" : "Submit"
            },
            "confirmToggle" : "I confirm that I have read, understood and agree to be bound by the terms and conditions stated below:",
            "acknowledgementText" : "<p>Important: Please read before submitting <br></p><ol><li><p>I represent and warrant that all information and documents given to you in connection with this application are accurate, complete and not misleading. If any information given is or subsequently becomes inaccurate, incomplete, misleading or changes in any way, whether before this application is approved or while the credit facilities are existing, I will promptly notify you of any such change;</p></li><li><p>I confirm that I have read, understood and agree to be bound by the <a target='_blank' href='https://forms.uob.com.sg/property/apply/01497-17-UOB-form-CR133-4.pdf'>Bank's Standard Terms and Conditions Governing Credit Facilities (\"Standard Terms\")</a> and <a target='_blank' href='https://www.uob.com.sg/web-resources/personal/pdf/personal/save/tnc-cts.pdf'>Terms and Conditions Governing Accounts and Services (\"Account Terms\")</a> including any variation the Bank makes to such terms and conditions;  </p></li><li><p>I confirm that I have read and understood the <a target='_blank' href='http://www.uob.com.sg/assets/pdfs/UOB_privacy_individual.pdf'>Bank's Privacy Notice  (Individual)</a> which forms part of the terms and conditions governing my relationship with the Bank. I consent to the Bank collecting, using and disclosing my personal data for Basic Banking Purpose, Co-Branding Purpose, Research Purpose and Marketing Purpose as described in the Bank's Privacy Notice (Individual). I note that (a) I may withdraw consent for any or all of the purposes at any time; (b) if I withdraw consent for Basic Banking Purposes and/or Co-branding Purpose, the Bank may not be able to continue to provide the products and services to me; (c) if I withdraw consent for Research Purpose and Marketing Purpose, my personal data will not be used for these purposes unless I expressly and separately consent to the same again;</p></li><li><p>I irrevocably consent and authorise the Bank and its officers to disclose and/or verify any information pertaining to me, this application, or any of my accounts and/or facilities with the Bank, to any party the Bank may consider appropriate including any of the Bank's related companies, advisors, credit bureaus, insurance providers, HDB, governmental authorities or any other party set out in the Account Terms for the purposes described in the Bank's Privacy Notice;  </p></li><li><p>I confirm that I am not an undischarged bankrupt and there has not been any statutory demand served on me at the time of this application;</p></li><li><p>I authorise the Bank to communicate with me all information in connection with this application, my accounts and any other communications, in accordance with the Account Terms; </p></li><li><p>I acknowledge that the Bank may decline my application without giving any reason or notice, and I agree that the Bank may keep all documents given to the Bank in connection with this application notwithstanding that this application is declined;</p></li><li><p>Where the Bank agrees to grant me conditional approval for this application, I agree that such conditional approval may be communicated to me via an encrypted email to my email address indicated in this application. The encrypted email may only be read with the encryption key provided to me by the Bank. I agree that I am responsible for keeping the encryption key safe and confidential, and preventing unauthorized access to the encrypted email. I agree that the Bank is not responsible for what happens to any email communication after it is sent, whether such email communication is delayed, intercepted, lost, misdirected, erroneous,  incompletely transmitted or is disclosed to any one during transit or otherwise. I agree to indemnify the Bank against any consequences, claims, damages and losses which may arise out of or be incurred by the Bank in connection with any email communications; and</p></li><p/><li>I hereby confirm that my electronic signature is the legal equivalent of my manual signature on this application form and I have read, understood and agree to be bound by the prevailing <a target='_blank' href='https://www.uob.com.sg/assets/pdfs/uob-esignature-service-tnc-2017.pdf'>UOB Electronic Signature Service Terms</a>.</li></ol>",
            "terms" : null
          },
          "thankYouPage" : {
            "title" : "Thank you!",
            "subtitle" : "Your application has been submitted",
            "referenceNo" : "(Ref No. {referenceNo})",
            "description" : "Application with a joint applicant will only be processed once your joint applicant has submitted his/ her information. We will send an email to inform him/her about this application. Separately, remind your joint applicant to complete the application within the next 7 days.</br></br>If you wish to have a free credit report, you may obtain it within 30 calendar days from the date of approval or rejection of this application via the credit bureau website listed below. Alternatively, you may bring the approval or rejection letter and your NRIC to the following credit bureau's registered office to obtain a free credit report.</br></br>Credit Bureau (Singapore) Pte Ltd</br>www.creditbureau.com.sg</br>2 Shenton Way #20-02 SGX Centre 1 Singapore 068804</br>Tel:(65) 65656363"
          },
          "inputValues" : {
            "loanType" : {
              "0" : "New Purchase - Completed Property",
              "1" : "New Purchase - Property Under Construction",
              "2" : "Refinancing - Completed Property",
              "3" : "Refinancing - Property Under Construction"
            },
            "residentialStatus" : {
              "A" : "Foreigner",
              "C" : "Singapore Citizen",
              "P" : "Permanent Resident",
              "U" : "Foreigner",
              "N" : "Foreigner"
            },
            "gender" : {
              "M" : "Male",
              "F" : "Female"
            },
            "maritalStatus" : {
              "S" : "Single",
              "M" : "Married",
              "D" : "Divorced",
              "W" : "Widowed"
            },
            "educationLevel" : {
              "X" : "No formal Education",
              "P" : "Primary",
              "N" : "GCE N Level Or Equivalent",
              "O" : "GCE O Level Or Equivalent",
              "A" : "GCE A Level Or Equivalent",
              "D" : "Diploma",
              "F" : "Professional Qualification",
              "V" : "Advanced Diploma",
              "B" : "Bachelor Degree",
              "G" : "Post Graduate School",
              "T" : "Doctorate Degree",
              "M" : "Masters Degree",
              "C" : "Certificate (NTC/LCCI/OTHERS)"
            },
            "propertyType" : {
              "HDB" : "HDB",
              "EC" : "Executive Condo",
              "PC" : "Private Residential"
            },
            "propertyTypeAddress" : {
              "H3" : "HDB - 3Rm/4Rm",
              "H5" : "HDB - 5Rm/Executive Apartment",
              "EC" : "Executive Condo/HUDC",
              "PC" : "Private Apartment/Condominium",
              "BG" : "Bungalow",
              "SM" : "Semi-Detached",
              "TE" : "Terrace"
            },
            "race" : {
              "CN" : "Chinese",
              "MY" : "Malay",
              "IN" : "Indian",
              "AB" : "Anglo Burmese",
              "AC" : "Anglo Chinese",
              "AD" : "Amerindian",
              "AF" : "African",
              "AG" : "Afghan",
              "AH" : "Anglo Thai",
              "AI" : "Anglo Indian",
              "AJ" : "Achehnese",
              "AL" : "Albanian",
              "AM" : "Armenian",
              "AN" : "Annamite",
              "AO" : "Ambonese",
              "AP" : "Anglo Filipino",
              "AR" : "Arab",
              "AS" : "Assami",
              "AT" : "Austrian",
              "AU" : "Australian",
              "AX" : "Anglo Saxon",
              "AY" : "Aryan",
              "AZ" : "Azeri",
              "BA" : "Batak",
              "BB" : "Bulgarian",
              "BC" : "Butonese",
              "BD" : "Bangladeshi",
              "BE" : "Belgian",
              "BF" : "Bajau",
              "BG" : "Bugis",
              "BH" : "Burgher",
              "BI" : "Bengali",
              "BJ" : "Banjarese",
              "BK" : "Bamar",
              "BL" : "Bangala",
              "BM" : "Balinese",
              "BN" : "Bhutanese",
              "BO" : "Banten",
              "BQ" : "Basque",
              "BR" : "Brahmin",
              "BS" : "Bisaya",
              "BT" : "British",
              "BU" : "Burmese",
              "BV" : "Bosniak",
              "BW" : "Betawi",
              "BY" : "Boyanese",
              "BZ" : "Brazilian",
              "CA" : "Caucasian",
              "CB" : "Canadian",
              "CC" : "Cape Coloured",
              "CD" : "Cambodian",
              "CE" : "Ceylonese",
              "CF" : "Cornish",
              "CG" : "Creole",
              "CH" : "Swiss",
              "CI" : "Croat",
              "CJ" : "Chamorro",
              "CM" : "Ceylon Moor",
              "CO" : "Cocos",
              "CR" : "Caribbean",
              "CS" : "Czechoslovak",
              "CZ" : "Czech",
              "DA" : "Dane",
              "DB" : "Dutch Burgher",
              "DH" : "Bidayuh",
              "DS" : "Dusun",
              "DU" : "Dutch",
              "DY" : "Dayak",
              "EL" : "English",
              "ER" : "European",
              "ES" : "Spanish",
              "ET" : "Ethiopian",
              "EU" : "Eurasian",
              "EY" : "Egyptian",
              "FI" : "Finn",
              "FJ" : "Fijian",
              "FM" : "Flemish",
              "FR" : "French",
              "GA" : "Goan",
              "GE" : "Gujarati",
              "GH" : "Ghanaian",
              "GK" : "Gurkha",
              "GM" : "German",
              "GO" : "Goanese",
              "GR" : "Greek",
              "HA" : "Haitian",
              "HI" : "Hispanic",
              "HO" : "Hollander",
              "HT" : "Hindustani",
              "HU" : "Hungarian",
              "HW" : "Hawaiian",
              "IA" : "Iranian",
              "IB" : "Iban",
              "ID" : "Indonesian",
              "IK" : "Isoko",
              "IL" : "Israeli",
              "IQ" : "Iraqi",
              "IR" : "Irish",
              "IS" : "Icelander",
              "IT" : "Italian",
              "IU" : "Inuit",
              "JA" : "Javanese",
              "JK" : "Jakun",
              "JM" : "Jamaican",
              "JO" : "Jordanian",
              "JP" : "Japanese",
              "JW" : "Jew",
              "KA" : "Kachin",
              "KB" : "Khasi",
              "KC" : "Kayah",
              "KD" : "Kayin",
              "KE" : "Kenyan",
              "KF" : "Kinh",
              "KG" : "Kyrgyz",
              "KH" : "Khmer",
              "KI" : "Kenyah",
              "KK" : "Kazakh",
              "KL" : "Kelabit",
              "KM" : "Kampuchean",
              "KN" : "Karen",
              "KR" : "Korean",
              "KY" : "Kayan",
              "KZ" : "Kadazan",
              "LA" : "Lao",
              "LB" : "Lebanese",
              "LI" : "Lithuanian",
              "LK" : "Sri Lankan",
              "LT" : "Latin",
              "LV" : "Latvian",
              "LX" : "Luxembourger",
              "LY" : "Libyan",
              "MA" : "Madurese",
              "MB" : "Malabari",
              "MC" : "Magyars",
              "MD" : "Moldavian",
              "ME" : "Minangkabau",
              "MF" : "Manx",
              "MG" : "Malagasy",
              "MH" : "Mahratta",
              "MI" : "Maori",
              "MJ" : "Murut",
              "MK" : "Makasarese",
              "ML" : "Maldivian",
              "MM" : "Malayalee",
              "MN" : "Melanesian",
              "MO" : "Mongolian",
              "MP" : "Manipuri",
              "MQ" : "Mestizo",
              "MR" : "Marathi",
              "MS" : "Metis",
              "MT" : "Maltese",
              "MU" : "Mauritian",
              "MV" : "Mon",
              "MW" : "Moroccan",
              "MX" : "Mexican",
              "MZ" : "Melanau",
              "NA" : "Naga",
              "NG" : "Negro",
              "NI" : "Nigerian",
              "NL" : "Netherlander",
              "NO" : "Norwegian",
              "NP" : "Nepalese",
              "NR" : "Nauruan",
              "NW" : "Newar",
              "NZ" : "New Zealander",
              "PA" : "Penan",
              "PB" : "Palestine",
              "PC" : "Polish",
              "PE" : "Persian",
              "PH" : "Filipino",
              "PJ" : "Punjabi",
              "PK" : "Pakistani",
              "PL" : "Pole",
              "PN" : "Pathan",
              "PO" : "Portuguese",
              "PR" : "Peruvian",
              "PS" : "Parsee",
              "PY" : "Polynesian",
              "RJ" : "Rajput",
              "RK" : "Rakhine",
              "RO" : "Romanian",
              "RU" : "Russian",
              "SA" : "Sino Kadazan",
              "SB" : "Sammarinese",
              "SC" : "Scot",
              "SD" : "Sindhi",
              "SE" : "Swede",
              "SF" : "Serbia/Montengerin",
              "SG" : "Samoan",
              "SH" : "Shan",
              "SI" : "Sinhalese",
              "SJ" : "Sino Japanese",
              "SK" : "Sikh",
              "SL" : "Slovak",
              "SM" : "Sumatran",
              "SN" : "Sino Indian",
              "SO" : "Somali",
              "SQ" : "Slavic",
              "SR" : "Serani",
              "SS" : "Sundanese",
              "SU" : "Sudanese",
              "SW" : "Swedish",
              "SY" : "Seychellois",
              "TE" : "Telugu",
              "TH" : "Thai",
              "TI" : "Tibetan",
              "TJ" : "Tajik",
              "TM" : "Tamil",
              "TN" : "Turkmen",
              "TO" : "Tongan",
              "TP" : "Timor",
              "TR" : "Turk",
              "UN" : "Unknown",
              "UR" : "Ukrainian",
              "US" : "American",
              "UY" : "Uyghur",
              "UZ" : "Uzbek",
              "VE" : "Venezuelan",
              "VN" : "Vietnamese",
              "WE" : "Welsh",
              "XD" : "Other Indonesian",
              "XE" : "Other Eurasian",
              "XI" : "Other Indian",
              "XX" : "Others",
              "YU" : "Yugoslav",
              "ZW" : "Zimbabwean"
            },
            "natureOfEmployment" : {
              "SALARIED" : "Salaried",
              "SELFE4" : "Sole Proprietor/ Partner",
              "SELFE" : "Self-Employed",
              "SELFE1" : "Business Owner (with shareholding >= 25%)",
              "SELFE2" : "Business Owner (with shareholding < 25%)",
              "BUSSV" : "Freelance",
              "STUDT" : "Student",
              "HWIFE" : "Housewife",
              "RETIREE" : "Retiree",
              "NOINC" : "Unemployed",
              "SELFE3" : "Landlord with Rental Income"
            },
            "occupation" : {
              "CW" : "Academic - Childcare",
              "LE" : "Academic - Lecturer",
              "HP" : "Academic - Principal",
              "PF" : "Academic - Professor",
              "EU" : "Academic - Teacher",
              "TT" : "Academic - Tutor",
              "AC" : "Accountant/ Financial Controller",
              "LB" : "Administrative - Librarian",
              "SE" : "Administrative - Secretary",
              "AD" : "Administrative Assistant",
              "AE" : "Administrative/ Accounts Executive",
              "AT" : "Architect",
              "TV" : "Artist/ Producer",
              "EA" : "Artiste/ Entertainer/ Model",
              "AU" : "Auditor",
              "WR" : "Author/ Blogger/ Writer ",
              "BX" : "Bank Officer",
              "FX" : "Bank Senior Executive/ Management",
              "BT" : "Bank Teller/ Clerk",
              "BA" : "Barber/ Hairstylist",
              "BU" : "Beautician",
              "BC" : "Bouncer",
              "BO" : "Broadcaster/ Journalist/ Reporter",
              "BK" : "Broker/ Dealer",
              "AN" : "Business/ Technology Analyst",
              "BR" : "Butcher/ Fishmonger",
              "SQ" : "Cabin Crew",
              "CE" : "Caterer",
              "C1" : "Chairman",
              "CF" : "Chef/ Bartender",
              "CT" : "Chemist",
              "CL" : "Cleaner",
              "CJ" : "Clinic/ Dental Assistant",
              "DM" : "Collector - Bills/ Repossesor",
              "EC" : "Construction Worker",
              "CN" : "Consultant/ Planner",
              "CC" : "Contractor",
              "CR" : "Coordinator",
              "CU" : "Counsellor",
              "HE" : "Crane / Heavy Equipment Operator",
              "CI" : "Croupier",
              "OP" : "Customer Support Operator",
              "DG" : "Designer",
              "DR" : "Director",
              "DF" : "Draftsman",
              "DV" : "Driver - Personal Chauffeur",
              "HD" : "Driver - Private Hire",
              "TX" : "Driver - Public Transport",
              "ET" : "Economist",
              "ED" : "Editor",
              "ES" : "Embassy Staff",
              "EN" : "Engineer",
              "EX" : "Executive",
              "IA" : "Financial Advisor/ Insurance Agent",
              "FM" : "Foreman",
              "EM" : "Funeral Director/ Attendant/ Embalmer",
              "GO" : "Government Civil Service Officer/ Staff",
              "MP" : "Government Minister/ Member of Parliament",
              "EL" : "Handyman",
              "HW" : "Hawker/ Stall Owner",
              "TL" : "Interpreter/ Translator",
              "IE" : "IT Professional/ Software Engineer",
              "JU" : "Judge",
              "LW" : "Lawyer/ Attorney",
              "LA" : "Legal Assistant/ Paralegal",
              "MG" : "Manager",
              "MN" : "Manicurists/ Pedicurists",
              "DI" : "Maritime - Diver",
              "SS" : "Maritime - Seaman/ Sailor",
              "SC" : "Maritime - Ship Captain",
              "MK" : "Marketing Executive/ Assistant",
              "MS" : "Masseuse",
              "MH" : "Mechanic",
              "DT" : "Medical Practitioner - Dentist/ Dental Technician",
              "DO" : "Medical Practitioner - Doctor",
              "SM" : "Medical Practitioner - Specialist",
              "TM" : "Medical Practitioner - Traditional Chinese Medicine",
              "MR" : "Merchandiser/ Purchaser",
              "NS" : "Mindef Full-time NSF",
              "MF" : "Mindef In-Service Personnel",
              "MC" : "Money Changer",
              "MY" : "Money Lender",
              "MU" : "Musician",
              "HC" : "Nurse/ Caregiver",
              "DN" : "Nutritionist/ Dietitian",
              "OA" : "Operation Executive/ Assistant",
              "ON" : "Optician",
              "PA" : "Pharmacist",
              "PY" : "Photographer",
              "PH" : "Physiotherapist",
              "PT" : "Pilot",
              "PO" : "Politician/ Diplomat",
              "PD" : "Private Investigator",
              "DS" : "Product Specialist",
              "PC" : "Project Manager",
              "PP" : "Property Agent",
              "PU" : "Prosecutor",
              "PR" : "Public Relation Officer",
              "RM" : "Relationship Manager",
              "MO" : "Religious Servant - Monk/ Nun/ Priest",
              "PS" : "Religious Servant - Pastor",
              "RG" : "Religious Service Provider",
              "RS" : "Remiser",
              "RA" : "Research Executive",
              "SR" : "Sales Executive/ Assistant",
              "FI" : "SCDF In-Service Personnel",
              "SN" : "Scientist",
              "SG" : "Security Officer",
              "CA" : "Service - Cashier",
              "PE" : "Service - Porter/ Housekeeper",
              "RP" : "Service - Receptionist",
              "RE" : "Service - Restaurant Captain",
              "WT" : "Service - Waiter/Waitress",
              "SI" : "Service Executive/ Assistant",
              "SW" : "Social Worker/ Volunteer",
              "ST" : "Specialist",
              "HT" : "SPF Police Officer",
              "AH" : "Sportsperson",
              "SV" : "Supervisor",
              "SY" : "Surveyor",
              "TA" : "Tailor/ Seamstress/ Couturier",
              "TE" : "Technician",
              "TP" : "Therapist",
              "TG" : "Tourist Guide/ Travel Advisor",
              "TR" : "Trainer/ Instructor",
              "TI" : "Trainer/ Instructor - Technology related",
              "VA" : "Valuer/ Auctioneer",
              "VE" : "Veterinarian"
            },
            "industry" : [ {
              "value" : "AGFFG",
              "description" : "Agriculture"
            }, {
              "value" : "ARTAN",
              "description" : "Antique & Arts Dealing"
            }, {
              "value" : "ENTRR",
              "description" : "Arts & Recreational"
            }, {
              "value" : "BUSSV",
              "description" : "Business Services"
            }, {
              "value" : "BUSSV1",
              "description" : "Business Services - Manpower"
            }, {
              "value" : "GAMBL",
              "description" : "Casino & Gambling"
            }, {
              "value" : "COMTP",
              "description" : "Commodities - Transportation"
            }, {
              "value" : "OCSPR",
              "description" : "Community & Social Services"
            }, {
              "value" : "CONST",
              "description" : "Construction"
            }, {
              "value" : "PROSV1",
              "description" : "Creative and Advertising"
            }, {
              "value" : "EDUCA",
              "description" : "Education"
            }, {
              "value" : "MFGRG1",
              "description" : "Electronics"
            }, {
              "value" : "EMHRC",
              "description" : "Embassy - Consulate & High Commission"
            }, {
              "value" : "EMBAS",
              "description" : "Embassy - Others"
            }, {
              "value" : "ENMEI",
              "description" : "Energy & Metal - Extraction"
            }, {
              "value" : "LOUNG",
              "description" : "Entertainment - Bars/ KTV/ Night Clubs"
            }, {
              "value" : "MFGRG2",
              "description" : "Fashion & Textile"
            }, {
              "value" : "FINAN",
              "description" : "Financial Services - Banking"
            }, {
              "value" : "INSUR",
              "description" : "Financial Services - Insurance"
            }, {
              "value" : "MOCHG",
              "description" : "Financial Services - Licensed Money Changing/ Remittance"
            }, {
              "value" : "MOLGA",
              "description" : "Financial Services - Licensed Money Lenders"
            }, {
              "value" : "PSPRO",
              "description" : "Financial Services - Payment Service Provider"
            }, {
              "value" : "PPPBA",
              "description" : "Financial Services - Pure Play Private Bank"
            }, {
              "value" : "INVEB",
              "description" : "Financial Services - Securities & Investment"
            }, {
              "value" : "CATER",
              "description" : "Food & Beverages"
            }, {
              "value" : "PUBSV",
              "description" : "Government & Public Services"
            }, {
              "value" : "MEDIC",
              "description" : "Healthcare/ Pharmaceutical"
            }, {
              "value" : "HOTEL",
              "description" : "Hospitality"
            }, {
              "value" : "DOMES",
              "description" : "Household Services"
            }, {
              "value" : "COMPU",
              "description" : "Information & Technology"
            }, {
              "value" : "LAWLL",
              "description" : "Legal & Accounts"
            }, {
              "value" : "LFACU",
              "description" : "Legal & Accounts - Unregulated"
            }, {
              "value" : "TRDIE",
              "description" : "Logistics & Supply Chain"
            }, {
              "value" : "MFGRG3",
              "description" : "Manufacturing - Aerospace"
            }, {
              "value" : "MFGRG4",
              "description" : "Manufacturing - Automobile"
            }, {
              "value" : "MFGRG5",
              "description" : "Manufacturing - Chemicals"
            }, {
              "value" : "PROSV2",
              "description" : "Maritime - Others"
            }, {
              "value" : "SHIPF",
              "description" : "Maritime - Shipping/ Sea/ Freight/ Vessel Leasing"
            }, {
              "value" : "MASSM",
              "description" : "Mass Media & Telecommunications"
            }, {
              "value" : "DEFEN",
              "description" : "Military Weapons & Arms"
            }, {
              "value" : "MNING",
              "description" : "Mining & Quarrying"
            }, {
              "value" : "CHARI",
              "description" : "Non-Profit Organisation"
            }, {
              "value" : "CHARC",
              "description" : "Non-Profit Organisation - Cross Border Donations"
            }, {
              "value" : "OGLNG",
              "description" : "Oil & Gas"
            }, {
              "value" : "PAWNS",
              "description" : "Pawn Shop"
            }, {
              "value" : "PRECI",
              "description" : "Precious Metals & Gems Dealing"
            }, {
              "value" : "MFGRG6",
              "description" : "Precision Engineering"
            }, {
              "value" : "PROSV3",
              "description" : "Professional Services - Consultancy"
            }, {
              "value" : "PROSV4",
              "description" : "Professional Services - Personal Care"
            }, {
              "value" : "PROSV5",
              "description" : "Professional Services - Real Estate "
            }, {
              "value" : "RTAIL",
              "description" : "Retail & Wholesale Trade"
            }, {
              "value" : "CHEMW",
              "description" : "Retail & Wholesale Trade - Chemical Substances Wholesalers"
            }, {
              "value" : "SPVNO",
              "description" : "Special Purpose Vehicle with no core operating business"
            }, {
              "value" : "TIMES",
              "description" : "Timeshare"
            }, {
              "value" : "TRSPT",
              "description" : "Transportation"
            }, {
              "value" : "TRAVL",
              "description" : "Travel & Tourism"
            }, {
              "value" : "UTILI",
              "description" : "Utilities"
            } ],
            "countriesNamesMap" : {
              "SG" : "Singapore",
              "AF" : "Afghanistan",
              "AL" : "Albania",
              "DZ" : "Algeria",
              "AS" : "American Samoa",
              "AD" : "Andorra",
              "AO" : "Angola",
              "AI" : "Anguilla",
              "AR" : "Argentina",
              "AM" : "Armenia",
              "AB" : "Aruba",
              "AU" : "Australia",
              "AT" : "Austria",
              "AZ" : "Azerbaijan",
              "BS" : "Bahamas",
              "BH" : "Bahrain",
              "BD" : "Bangladesh",
              "BB" : "Barbados",
              "BL" : "Belarus",
              "BE" : "Belgium",
              "BZ" : "Belize",
              "BJ" : "Benin",
              "BM" : "Bermuda",
              "BT" : "Bhutan",
              "BO" : "Bolivia",
              "BA" : "Bosnia-Herzegovina",
              "BW" : "Botswana",
              "BR" : "Brazil",
              "BQ" : "British Antarctic Territory",
              "IO" : "British Indian Ocean Territory",
              "VG" : "British Virgin Islands",
              "BN" : "Brunei",
              "BG" : "Bulgaria",
              "BF" : "Burkina Faso",
              "BI" : "Burundi",
              "KA" : "Cambodia",
              "CM" : "Cameroon",
              "CA" : "Canada",
              "CT" : "Canton & Enderbury Islands",
              "CV" : "Cape Verde",
              "KY" : "Cayman Islands",
              "CF" : "Central African Republic",
              "CD" : "Channel Islands",
              "TD" : "Chad",
              "CL" : "Chile",
              "CN" : "China",
              "CX" : "Christmas Island",
              "CC" : "Cocos Keeling Island",
              "CO" : "Colombia",
              "KM" : "Comoros",
              "CG" : "Congo",
              "CE" : "Congo, Democratic Republic",
              "CK" : "Cook Islands",
              "CR" : "Costa Rica",
              "CB" : "Croatia",
              "CU" : "Cuba",
              "CZ" : "Czech Republic",
              "DK" : "Denmark",
              "DJ" : "Djibouti",
              "DO" : "Dominican Republic",
              "TP" : "East Timor",
              "EC" : "Ecuador",
              "EG" : "Egypt",
              "SV" : "El Salvador",
              "GQ" : "Equatorial Guinea",
              "ER" : "Eritrea",
              "EN" : "Estonia",
              "ET" : "Ethiopia",
              "FK" : "Falkland Islands",
              "FO" : "Faroe Islands",
              "FJ" : "Fiji",
              "FI" : "Finland",
              "FR" : "France",
              "GF" : "French Guiana",
              "PF" : "French Polynesia",
              "FQ" : "French Southern Territories",
              "GA" : "Gabon",
              "GM" : "Gambia",
              "GZ" : "Gaza",
              "GO" : "Georgia",
              "DG" : "Germany",
              "GH" : "Ghana",
              "GI" : "Gibraltar",
              "GR" : "Greece",
              "GL" : "Greenland",
              "GP" : "Guadeloupe",
              "GU" : "Guam",
              "GT" : "Guatemala",
              "GK" : "Guernsey",
              "GN" : "Guinea",
              "GW" : "Guinea-Bissau",
              "GY" : "Guyana",
              "HT" : "Haiti",
              "HM" : "Heard and McDonald Islands",
              "HN" : "Honduras",
              "HS" : "Hong Kong SAR",
              "HK" : "Hong Kong",
              "HU" : "Hungary",
              "IS" : "Iceland",
              "IN" : "India",
              "ID" : "Indonesia",
              "IR" : "Iran",
              "IQ" : "Iraq",
              "IE" : "Ireland",
              "MM" : "Isle of Man",
              "IL" : "Israel",
              "IT" : "Italy",
              "CI" : "Ivory Coast",
              "JM" : "Jamaica",
              "JP" : "Japan",
              "JE" : "Jersey, C.I.",
              "JT" : "Johnston Island",
              "JO" : "Jordan",
              "KZ" : "Kazakhstan",
              "KE" : "Kenya",
              "KG" : "Kirghizia",
              "KI" : "Kiribati",
              "KV" : "Kosovo",
              "KW" : "Kuwait",
              "KS" : "Kyrgyzstan",
              "LA" : "Laos",
              "LV" : "Latvia",
              "LB" : "Lebanon",
              "LS" : "Lesotho",
              "LR" : "Liberia",
              "LY" : "Libya",
              "LI" : "Liechtenstein",
              "LH" : "Lithuania",
              "LU" : "Luxembourg",
              "MO" : "Macao",
              "MF" : "Macau SAR",
              "MB" : "Macedonia",
              "MG" : "Madagascar",
              "MW" : "Malawi",
              "MY" : "Malaysia",
              "MV" : "Maldives",
              "ML" : "Mali",
              "MT" : "Malta",
              "MH" : "Marshall Islands",
              "MQ" : "Martinique",
              "MR" : "Mauritania",
              "MU" : "Mauritius",
              "ME" : "Mayotte",
              "MX" : "Mexico",
              "FM" : "Micronesia",
              "MI" : "Midway Islands",
              "MD" : "Moldova",
              "MC" : "Monaco",
              "MN" : "Mongolia",
              "MJ" : "Montenegro",
              "MS" : "Montserrat",
              "MA" : "Morocco",
              "MZ" : "Mozambique",
              "BU" : "Myanmar",
              "NA" : "Namibia",
              "NR" : "Nauru",
              "NP" : "Nepal",
              "AN" : "Netherlands Antililles",
              "NL" : "Netherlands",
              "NT" : "Neutral Zone",
              "NC" : "New Caledonia",
              "NZ" : "New Zealand",
              "NI" : "Nicaragua",
              "NE" : "Niger",
              "NG" : "Nigeria",
              "NU" : "Niue Island",
              "NF" : "Norfolk Island",
              "KP" : "North Korea  ",
              "MP" : "Northern Mariana Is",
              "NO" : "Norway",
              "OM" : "Oman",
              "PC" : "Pacific Island Trust Territory",
              "PK" : "Pakistan",
              "PW" : "Palau",
              "PB" : "Palestine",
              "PZ" : "Panama Canal Zone",
              "PA" : "Panama",
              "PG" : "Papua New Guinea",
              "PY" : "Paraguay",
              "PE" : "Peru",
              "PH" : "Philippines",
              "PN" : "Pitcairn Island",
              "PL" : "Poland",
              "PT" : "Portugal",
              "PR" : "Puerto Rico",
              "QA" : "Qatar",
              "RE" : "Reunion",
              "RO" : "Romania",
              "RF" : "Russia",
              "RW" : "Rwanda",
              "SH" : "Saint Helena",
              "PM" : "Saint Pierre and Miquelon",
              "VC" : "Saint Vincent and the Grenadines",
              "WM" : "Samoa",
              "SM" : "San Marino",
              "ST" : "Sao Tome and Principe",
              "SA" : "Saudi Arabia",
              "SN" : "Senegal",
              "RS" : "Serbia",
              "SF" : "Serbia/Montenergo",
              "SC" : "Seychelles",
              "SL" : "Sierra Leone",
              "SX" : "Sint Maarten",
              "SK" : "Slovak Republic",
              "SI" : "Slovenia",
              "SB" : "Solomon Islands",
              "SO" : "Somalia",
              "ZA" : "South Africa",
              "KR" : "South Korea",
              "ES" : "Spain",
              "LK" : "Sri Lanka",
              "GS" : "South Georgia & South Sandwich Islands",
              "SD" : "Sudan",
              "SR" : "Suriname",
              "SJ" : "Svalbard & Jan Mayen",
              "SZ" : "Swaziland",
              "SE" : "Sweden",
              "CH" : "Switzerland",
              "SY" : "Syria",
              "TW" : "Taiwan",
              "TI" : "Tajikistan",
              "TZ" : "Tanzania",
              "TH" : "Thailand",
              "TE" : "Timor",
              "TL" : "Timor-Leste",
              "TG" : "Togo",
              "TK" : "Tokelau Islands",
              "TO" : "Tonga",
              "TT" : "Trinidad and Tobago",
              "TN" : "Tunisia",
              "TR" : "Turkey",
              "TM" : "Turkmenistan",
              "TC" : "Turks and Caicos Islands",
              "TV" : "Tuvalu",
              "VI" : "U.S. Virgin Islands",
              "UG" : "Uganda",
              "UR" : "Ukraine",
              "AE" : "United Arab Emirates",
              "GB" : "United Kingdom",
              "US" : "United States of America",
              "UN" : "Unknown",
              "HV" : "Upper Volta",
              "UY" : "Uruguay",
              "UM" : "US Minor Outlying Islands",
              "UZ" : "Uzbekistan",
              "VA" : "Vatican City State",
              "VE" : "Venezuela",
              "VN" : "Vietnam",
              "WK" : "Wake Island",
              "WF" : "Wallis and Futuna",
              "EH" : "Western Sahara",
              "YM" : "Yemen",
              "YU" : "Yugoslavia",
              "ZR" : "Zaire",
              "ZM" : "Zambia",
              "ZW" : "Zimbabwe"
            },
            "taxHavenCountryCode" : [ "AG", "CY", "DM", "GD", "KN", "LC", "VU" ]
          },
          "optionInput" : {
            "loanPurpose" : [ {
              "value" : "N",
              "description" : "New Purchase"
            }, {
              "value" : "R",
              "description" : "Refinancing"
            } ],
            "propertyUsage" : [ {
              "value" : "0",
              "description" : "Own Stay"
            }, {
              "value" : "1",
              "description" : "Investment"
            } ],
            "propertyConstructionStatus" : [ {
              "value" : "0",
              "description" : "Completed"
            }, {
              "value" : "1",
              "description" : "Under Construction"
            } ],
            "sourceOfFundsDP" : {
              "1" : "Personal Savings",
              "2" : "Salary",
              "3" : "Commission",
              "4" : "Return On Investments",
              "5" : "Own Business",
              "6" : "Rental Receipt",
              "7" : "Dividend Receipt",
              "8" : "Inheritance/Gift"
            },
            "sourceOfFundsMLR" : {
              "1" : "Personal Savings",
              "2" : "Salary",
              "3" : "Commission",
              "4" : "Return On Investments",
              "5" : "Own Business",
              "6" : "Rental Receipt",
              "7" : "Dividend Receipt",
              "8" : "Inheritance/Gift"
            },
            "sourceOfWealth" : {
              "1" : "Business Ownership",
              "2" : "Income From Employment",
              "3" : "Inheritance/Gift",
              "4" : "Investments"
            }
          },
          "myInfoReadonlyFields" : {
            "fullName" : true,
            "nric" : true,
            "email" : false,
            "mobileNumber" : true,
            "dateOfBirth" : true,
            "gender" : true,
            "maritalStatus" : false,
            "educationLevel" : false,
            "race" : true,
            "countryOfBirth" : true,
            "nationality" : true,
            "unit" : true,
            "street" : true,
            "block" : true,
            "postCode" : true,
            "floor" : true,
            "propertyType" : true,
            "homePostalCode" : true,
            "homeBlock" : true,
            "homeStreet" : true,
            "homeAddressFormat" : true,
            "homeLevel" : true,
            "assessableIncome" : true,
            "nameOfEmployer" : false,
            "employmentIncome" : true,
            "tradeIncome" : true,
            "annualTradeIncome" : true
          },
          "globalErrors" : {
            "apiException" : "The service is currently unavailable. You can try again later.",
            "invalidOTP" : "OTP is invalid or has expired. You can request for a new SMS OTP to try again.",
            "badRequest" : "The service is currently unavailable. You can try again later.",
            "sameResidentialAndMailingAddress" : "Mailing address should not be identical to residential address.",
            "sameApplicantAndJointApplicant" : "NRIC and Mobile Number for the applicant and joint applicant should not be identical.",
            "addressServiceDown" : "Searching by postal code is currently unavailable. You can fill up the address manually.",
            "invalidAssessableIncome" : "Total sum of trade and variable income cannot be more than Yearly Assessable Income ",
            "uploadUnsuccessfulMsg" : "File upload fail. Please try again later."
          },
          "errorMessageBox" : {
            "linkExpired" : {
              "title" : "Sorry. We cannot find what you are looking for.",
              "subtitle" : "The link has either expired or you do not have permission to access this page. You can try again.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "serviceDown" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "The service is currently unavailable. You can try again later.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "badRequest" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "The session has expired. You can try again.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "NOREF" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "Please leave us with your <a target='_blank' href='https://forms.uob.com.sg/personal/services/property/contact-us.html?i_cid=pfs:sg:owned:int:pweb:na:tx:mnoref:hdb-home-loan:011219-evergreen:hlphlconus:na&vid=none'><div class='error_msg_link'>details</div></a> so we can contact and assist you.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "unauthorized" : {
              "title" : "Sorry. We cannot find what you are looking for.",
              "subtitle" : "The link has either expired or you do not have permission to access this page. You can try again.",
              "description" : null
            },
            "MYINFO" : {
              "title" : "Something went wrong.",
              "subtitle" : "We are having difficulty retrieving data from MyInfo. Your data might be missing or MyInfo service might be temporarily unavailable. You can try again later or if you have any questions on MyInfo, contact support@myinfo.gov.sg or +65 6643 0567.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "MYRJTD" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "The service is currently unavailable. You can try again later.",
              "description" : null,
              "url" : "apply"
            },
            "MYAGE" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "You'll need to be at least 21 years old to apply for a UOB Home Loan.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "MYRESST" : {
              "title" : "Thank you for your interest.",
              "subtitle" : "Please leave us with your <a target='_blank' href='https://forms.uob.com.sg/personal/services/property/contact-us.html?i_cid=pfs:sg:owned:int:pweb:na:tx:mmyresst:hdb-home-loan:011219-evergreen:hlphlconus:na&vid=none'><div class='error_msg_link'>details</div></a> so we can contact and assist you.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "JID" : {
              "title" : "Are you sure you are the right person?",
              "subtitle" : "NRIC that we have retrieved from MyInfo is different from the one the main applicant has filled in. You can inform the applicant to initiate a new loan application with the correct information.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "MID" : {
              "title" : "Are you sure you are the right person?",
              "subtitle" : "</br>NRIC that we have retrieved from MyInfo is different from the record given by the agency. You can inform the agency to initiate a new loan application with the correct information.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "OFFLINE" : {
              "title" : "We will be back shortly.",
              "subtitle" : "</br>UOB Forms will be under maintenance on 31 January 2020 10pm to 1 February 2020 12am. Thank you for your patience and we look forward to receive your application when we are back online.",
              "description" : null,
              "errorImg" : "./apply/static/media/errorImg.svg"
            },
            "ERR_TAX_HAVEN_COUNTRY" : {
              "title" : "Thank you for your interest",
              "subtitle" : "We are unable to let you proceed with this application.",
              "description" : null
            },
            "MYINFO_INCOMPLETE_REQ" : {
              "title" : "Something went wrong!",
              "subtitle" : "We are having difficulty retrieving data from MyInfo.{1}Your data might be missing or MyInfo service might be temporarily unavailable. You can try again later or if you have any questions on MyInfo, contact support@myinfo.gov.sg or +65 6643 0567.",
              "description" : null
            }
          },
          "errorMsgs" : {
            "invalidNRIC" : "is invalid.",
            "invalidPhone" : "is invalid.",
            "invalidName" : "is invalid.",
            "invalidAddress" : "is invalid.",
            "invalidEmail" : "is invalid.",
            "invalidDate" : "is invalid.",
            "invalidMaxSize" : "cannot be more than {number} characters.",
            "invalidMinSize" : "must be at least {number} character(s).",
            "invalidSymbol" : "is invalid.",
            "exactSize" : "must be {number} character(s).",
            "invalidRange" : "must be between {number} to {secondnumber} characters.",
            "numbersOnly" : "can only contains numbers.",
            "minAge" : ". You must be minimally {number} years old.",
            "maxAge" : ". You must not be above {number} years old.",
            "fieldEmpty" : "is required.",
            "invalidCharacters" : "can only contain letters.",
            "onlyAlphanumeric" : "can only contain letters and numbers.",
            "noSpaceAllowed" : "should not have space at the start and end.",
            "termsRequired" : "Terms and Conditions is required.",
            "expiredYear" : "is expired.",
            "yearExceeded" : "cannot be more than current year.",
            "minimumYear" : "can only be between {number} to current year.",
            "minMonth" : "should have {number} months validity.",
            "invalidPrice" : "can contain {number} digits or {secondnumber} digits with two decimal points.",
            "minAmountMsg" : "cannot be less than {number}.",
            "maxAmountMsg" : "cannot be more than {number}.",
            "minOne" : "is invalid",
            "uploadUnsuccessfulMsgSize" : "file size cannot exceed 3MB",
            "uploadUnsuccessfulMsgExtension" : "can only be either jpg, png or pdf",
            "uploadUnsuccessfulMsgFileName" : "file name is invalid."
          },
          "helpMessage" : {
            "title" : "Need help?",
            "subtitle" : "Feel free to contact our team for support",
            "text" : "<div class='helpMessage-text'><div>Singapore</div><div><a  class='helpMessage-mobile' href='tel:1800 388 2121'>1800 388 2121 (8am-8pm)</a></div></div><div class='helpMessage-text'><div>Overseas</div><div ><a class='helpMessage-mobile' href='tel:+65 6388 2121'>+65 6388 2121 (8am-8pm)</a></div></div>",
            "isDisplayed" : true
          },
          "dataElement" : {
            "productId" : "HLPHL",
            "productName" : "UOB Home Loan",
            "userType" : "NTB",
            "productCategory" : "Secured Loans",
            "myInfoForm" : "form_myinfo",
            "manualForm" : "form_manual",
            "eventNameStart" : "form_start",
            "eventNameSubmit" : "form_submit",
            "eventNameStep" : "form_complete_step{step}",
            "eventNameFormFail" : "form_fail",
            "eventNameRetrieve" : "form_retrieve",
            "eventNameLanding" : "myinfo_start",
            "loanTypeMapping" : {
              "0" : "NC",
              "1" : "NU",
              "2" : "RC",
              "3" : "RU"
            }
          },
          "employmentMapping" : {
            "HWIFE" : {
              "occupation" : "HF",
              "industry" : "NOINC"
            },
            "RETIREE" : {
              "occupation" : "RT",
              "industry" : "NOINC"
            },
            "NOINC" : {
              "occupation" : "UE",
              "industry" : "NOINC"
            },
            "STUDT" : {
              "occupation" : "SU",
              "industry" : "NOINC"
            },
            "SELFE4" : {
              "occupation" : "SP"
            },
            "SELFE1" : {
              "occupation" : "SD"
            },
            "BUSSV" : {
              "occupation" : "FL"
            },
            "SELFE3" : {
              "occupation" : "LL",
              "industry" : "BUSSV"
            }
          },
          "loanTypeMapping" : {
            "0" : {
              "requestType" : "N",
              "completionStatus" : "0"
            },
            "1" : {
              "requestType" : "N",
              "completionStatus" : "1"
            },
            "2" : {
              "requestType" : "R",
              "completionStatus" : "0"
            },
            "3" : {
              "requestType" : "R",
              "completionStatus" : "1"
            }
          },
          "security" : {
            "tip" : "Security Tips from UOB",
            "iconUrl" : "./images/shield.png",
            "info" : "There has been a recent spate of phishing scams targeting government and banks' customers. It is important to remain vigilant and be suspicious of all unsolicited emails you receive.",
            "line_one" : "<span>1.</span><span>Be alert. </span>Verify that you are on an official UOB website by clicking on the 'padlock icon' in the address bar and checking that the certificate is issued to forms.uob.com.sg.",
            "line_two" : "<span>2.</span><span>Be extra careful of unsolicited email. </span>Do not click on any links from unknown and suspicious email.",
            "line_three" : "<span>3.</span><span>Protect your device. </span>Always use a device that you trust. Ensure that it is always updated with the latest security and bug fixes."
          },
          "configuration" : {
            "personalDetails" : {
              "enableDualNationality" : false
            }
          }
        }
      }));
});

app.get("/api/v1/property/loan/self-assist/myinfo/redirecturl", function (req, res) {
    var data = require("./data/redirecturl.json");
    return res.status(200).end(JSON.stringify(data));
});

app.get("/api/v1/property/loan/self-assist/application/loanpackage", function (req, res) {
    var data = require("./data/LoanPackages.json");
    return res.status(200).end(JSON.stringify(data));
});

app.post("/api/v1/property/loan/self-assist/applications/:id/save", function (req, res) {
    var data = { "applicationId" : "62b4d913-e7df-4ba1-a6f0-0ed05a3f087a"};
    return res.status(200).end(JSON.stringify(data));
});

app.get("/api/v1/property/loan/self-assist/applications/application", function (req, res) {
    var data = require("./data/application.json");
    //data = {errorCode:"MYINFO_INCOMPLETE_REQ", errorMessage: "[name, postal code]"};
    return res.status(200).end(JSON.stringify(data));
});

app.post("/api/v1/property/loan/self-assist/applications/application", function (req, res) {
    var data = { "applicationId" : "62b4d913-e7df-4ba1-a6f0-0ed05a3f087a"};
    return res.status(200).end(JSON.stringify(data));
});

app.post("/api/v1/property/loan/self-assist/applications/:id/submit", function (req, res) {
    var data = {"referenceNumber" : "20190909524595820"};
    return res.status(200).end(JSON.stringify(data));
});

app.post("/api/v1/applications/:id/notification", function (req, res) {
    return res.status(200).end(JSON.stringify({}));
});

app.post("/api/v1/applications/:id/upload", function (req, res) {
    console.log("fileUpload Called");
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, filename) {
        console.log(filename);
        file.on("data", function (data) {
            console.log(data.length);
        });
        var fstream = fs.createWriteStream("./tempFiles/" + filename);
        file.pipe(fstream);
        fstream.on("close", function () {
            var response = clone(baseResponse);
            response.status = SUCCESS;
            return res.status(200).send();
        });
    });
});

app.post("/api/v1/property/loan/self-assist/user/application/uploaddocument/:id", function (req, res) {
    console.log("fileUpload Called");
    req.pipe(req.busboy);
    req.busboy.on("file", function (fieldname, file, filename) {
        console.log(filename);
        file.on("data", function (data) {
            console.log(data.length);
        });
        var fstream = fs.createWriteStream("./tempFiles/" + filename);
        file.pipe(fstream);
        fstream.on("close", function () {
            var response = clone(baseResponse);
            response.status = SUCCESS;
            return res.status(200).send();
        });
    });
});


app.post("/api/v1/property/loan/self-assist/access/sendotp", function (req, res) {
    var body = req.body || {};
    var response = {prefix: "1To6", requestIdentity: "wdhuiednhi37r3rufejorj30neh"};

    if (body.mobile_number === "+6588888400") {
        return res.status(400).end();
    } else if (body.mobile_number === "+6588888500") {
        res.status(500).end();
    }
    return res.status(200).end(JSON.stringify(response));
});

app.post("/api/v1/property/loan/self-assist/access/verifyotp", function (req, res) {
    var body = req.body || {};
    if (body.otp === "123456") {
        return res.status(200).end();
    } else if (body.otp === "500000") {
        return res.status(500).end();
    }
    return res.status(400).end();
  
});

var server = app.listen(9090, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Mock REST API listening at http://%s:%s", host, port);
});
