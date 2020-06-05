import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PDFViewer from '../PDFViewer';
import Modal from '../Modal/Modal'
import './PreviewFile.css';

class PreviewFile extends Component {
    render() {
        const {content, type, show, name } = this.props;
        return (
            <Modal {...this.props}>
            <div className="popoup-preview-name">{name}</div>
            <div className="popoup-preview-file">
                <div className="preview-file">
                    {
                    content && type.includes('image') && 
                    <div className="preview-file-image">
                        <img src={content} alt="#"/>
                    </div>
                    }
                    {
                    content && type.includes('pdf') && 
                    <div className="preview-file-pdf">
                        <PDFViewer content={content} show={show} name={name} />
                    </div>
                    }
                </div>
            </div>
            </Modal> 
        );
    }

}

PreviewFile.propTypes = {
    type:PropTypes.string.isRequired,
};

export default PreviewFile;
