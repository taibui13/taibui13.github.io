import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './FileUpload.css';
import {bytesToSize, fileUploadHelper} from './../../common/utils';
import pdfUrl from '../../assets/images/pdf-file.svg';
import PreviewFile from '../PreviewFile/PreviewFile';

const FileUploadContainer = (props) => {
    const {
        inputStatus,
        isPreviewFile, 
        file: {progress},
        handleUploadFile,
        identifier,
        docType,
        updateUploadProgress,
        handleShowErrorMsg,
        handleShowUploadErrorMsg,
        errorMsgs: { globalErrors: { uploadUnsuccessfulMsg }, error: { uploadUnsuccessfulMsgSize, uploadUnsuccessfulMsgExtension } },
        handleError,
        showContent
      } = props;
    let fileInputRef = null;  
    const checkInputStatus = inputStatus ? inputStatus : 'none';
    const isFileSelected = checkInputStatus === "uploading" ? "--selected" : "";
    const inputProgressValue = progress ? progress : 0;
    const checkFileExtension = (file, allowedExtensions) => allowedExtensions.includes(file.split(".").pop());
    const handleOnChange = () => {
        const file = fileInputRef.files[0];
        const extensionIsAllowed = checkFileExtension(file.name, ["jpg", "png", "jpeg", "pdf", "JPG", "PNG", "PDF", "JPEG"]);
        const actions = {
            successDispatch: () => ({}),
            errorDispatch: () => {
                handleShowUploadErrorMsg(props.inputID, uploadUnsuccessfulMsg);
            },
            progressDispatch: progress => updateUploadProgress(props.inputID, progress)
        };
        if (extensionIsAllowed){
            if (file.size <= 4194304) {
                    fileUploadHelper(file, props.inputID, identifier, docType, actions);
                    let reader = new FileReader();
                    reader.onloadend = (e) => {
                        handleUploadFile(props.inputID, file.name, bytesToSize(file.size), file.type, isPreviewFile ? e.target.result : "");
                        showContent(true);
                    }
                    reader.readAsDataURL(fileInputRef.files[0])
            } else {
               handleShowErrorMsg(props.inputID, uploadUnsuccessfulMsgSize);
               handleError();
            }
        } else {
          handleShowErrorMsg(props.inputID, uploadUnsuccessfulMsgExtension);
        }

    };
    return (
        <div className={"file-upload-button" + isFileSelected}>
            <progress className='file-upload-progress' max='100' value={inputProgressValue} />
            <div className='file-upload-button--text'>
                {checkInputStatus === "none" ? "UPLOAD" : "EDIT"}
            </div>
            <input
                accept='.jpg,.JPG,.png,.pdf,.PDF,.PNG'
                ref={i => {
                    fileInputRef = i;
                }}
                type='file'
                className='file-upload-input'
                onClick={() => {
                    fileInputRef.value = null;
                    updateUploadProgress(props.inputID, 0);
                }}
                onChange={handleOnChange}
            />
        </div>
    );
};

class FileUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {isShow: false};
      }

    showContent(isShowDetail) {
      
        //const {isShow} = this.state;
        if(this.props.isPreviewFile) {
            this.setState({isShow: !isShowDetail});
        }
    }

    removeFile() {
        this.setState({file: '', imagePreviewUrl: '', isShow: false});
        this.props.handleUploadFile(this.props.inputID, "", 0, []);
        document.getElementById(`file_input_${this.props.inputID}`).value= null;
    }

    handleError() {
        this.setState({isValidFile: false});
    }

    getDescription() {
        const { file: {content, isValid} , description, isPreviewFile} = this.props;
        const {isShow} = this.state;
        if (content && isValid) {
            if (isShow) {
                return "Close";
            }
            return "Preview";
        }
        return description;
    }
   
    render() {
        const { file: {isValid, fileSize, errorMsg, inputValue, fileType, content} , description, inputID, title, isPreviewFile} = this.props;
        const {isShow} = this.state;
        const showErrorLabel = isValid ? "" : "file-upload--error";  
        const fileSizeString = fileSize ? " - " + fileSize : "";  
        const descriptionContent = inputValue ? inputValue.replace(/^.*[\\]/, "") + fileSizeString : description;
        const errorContainerStyle = isValid ? "" : "file-upload--container--error";
        return (
            <div className='file-upload'>
            <div id={inputID} className={`file-upload--container ${errorContainerStyle}`}>
                <div className='file-upload-image'>
                {
                    isPreviewFile && content && isValid && 
                    <div className="file-upload--icon">
                        {
                            fileType.includes('image') && content &&
                            <img className="image" onClick={this.showContent.bind(this)}  src={content}  alt="#"/>
                        }
                        {
                            fileType.includes("pdf") && content &&
                            <img className="pdf" onClick={this.showContent.bind(this)} src={pdfUrl}  alt="#" />
                        }
                    </div>
                }
                <div className='file-upload--text-container'>
                    <div className={"file-upload--title " + showErrorLabel}>
                        {`${title}${isValid ? "" : ` ${errorMsg}`}`}
                    </div>
                    <div className='file-upload--description' >
                       <span className={`${(isPreviewFile && content && isValid) ? "file-upload--link" : ""}`} onClick={this.showContent.bind(this, isShow)}> {this.getDescription()} </span>
                    </div>
                </div>
                </div>
                <div className='file-upload--button-container'>
                    <FileUploadContainer showContent={this.showContent.bind(this)} handleError={this.handleError.bind(this)} {...this.props} />
                </div>
            </div>
            {
                isPreviewFile &&
                <div>
                    {  isShow && content && isValid &&
                    <PreviewFile name={descriptionContent} content={content} type={fileType} show={this.showContent.bind(this)} />
                    }
                </div> 
            }
           
            </div>
        );
    }
   
};

FileUpload.propTypes = {
    inputID: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    dispatchUploadFile: PropTypes.func,
    dispatchShowErrorMsg: PropTypes.func,
    dispatchupdateUploadProgress: PropTypes.func
};


export default FileUpload;
