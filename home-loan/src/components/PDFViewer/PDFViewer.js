import React from "react";
import "./PDFViewer.css";
import pdfjsLib from "pdfjs-dist";

let thePdf = null;
let scaleView = 2.5;
const BLOCK_PAGE = 5;
class PDFViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNum: 1,
            pdfData: null
        };
        this.id = Math.floor(Math.random() * (9999999999 - 1000000000) + 1000000000);
        this.CANVAS_ID = this.id + "-pdf-page-canvas-";
        this.name = "";
        this.scrollHeight = 0;
        this.isScrollToPage = false;
        this.PDFPageNumber = 0;
    }

    componentWillMount() {
        const {content, scale, name} = this.props;
        this.name = name;
        this.readFile(content, scale);
    }

    componentDidMount() { 
        this.scrollHeight = (document.getElementById(this.id + "-wrapper-viewer") && document.getElementById(this.id + "-pdf-viewer").getBoundingClientRect().top) || 0;
    }

    componentWillReceiveProps(props) {
        const {content, scale, name} = props;
        if(this.name && this.name !== name) {
            this.readFile(content, scale);
        }
    }

    readFile(content, scale) {
        const arr = content.split(",");
        scaleView = scale || scaleView;
        const pdfData = window.atob(arr[1]);
        const _this = this;
        pdfjsLib.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.js");
        const loadingTask = pdfjsLib.getDocument({data: pdfData});
        loadingTask.promise.then(function(pdf) {
            thePdf = pdf;
            let viewer = document.getElementById(_this.id + "-pdf-viewer");
            while(viewer.firstChild){
                viewer.removeChild(viewer.firstChild);
            }
            _this.setState({pdfData: pdf});
            _this.renderBlock(1, 1 + BLOCK_PAGE, pdf, true);
        }, function () {
            // PDF loading error
        });
    }

    renderBlock(from , to, file, firstRenderPage) {
        if (this.PDFPageNumber === file.numPages && !firstRenderPage) {
            return;
        }
        let viewer = document.getElementById(this.id + "-pdf-viewer");
        const pageNumber = to > file.numPages ? file.numPages : to;
        this.PDFPageNumber = pageNumber;
        for(let page = from; page <= pageNumber; page++) {
            let canvas = document.createElement("canvas");    
            canvas.id = this.CANVAS_ID + page;        
            viewer.appendChild(canvas);           
            this.renderPage(page, canvas);
        }
    }

    onPrevPage = () => {
        let {pageNum} = this.state;
        if (pageNum <= 1) {
            return;
        }
        pageNum --;
        this.scrollToPageNumber(pageNum);
    }

    onNextPage = () => {
        let {pageNum, pdfData} = this.state;
        if (pageNum >= pdfData.numPages) {
            return;
        }
        pageNum ++;
        this.scrollToPageNumber(pageNum);
    }

    scrollToPageNumber(pageNumber) {
        this.isScrollToPage = true;
        const canvas = document.getElementById(this.CANVAS_ID + pageNumber);
        canvas.scrollIntoView({block: "end", behavior: "smooth", inline: "end"});
    }

    renderPage(pageNumber, canvas) {
        thePdf.getPage(pageNumber).then(function(page) {
            let viewport = page.getViewport(scaleView);
            canvas.height = viewport.height;
            canvas.width = viewport.width;          
            const renderTask = page.render({canvasContext: canvas.getContext("2d"), viewport: viewport});
            renderTask.promise.then(() => {
            });
        });
    }

    scrollPage() {
        const {pdfData, pageNumber} = this.state;
        for(let page = 1; page <= pdfData.numPages; page++) {
            const canvasID  = document.getElementById(this.CANVAS_ID + page);
            if (canvasID.getBoundingClientRect().bottom - this.scrollHeight > 0) {  
                if (pageNumber !== page) {
                    this.setState({pageNum: page});
                    if (this.PDFPageNumber - page === 1) {
                        this.renderBlock(this.PDFPageNumber, this.PDFPageNumber + BLOCK_PAGE, pdfData);
                    }
                }
                break;
            }
        }
    }
 
    openFullscreen(isFullScreen) {
        if (!isFullScreen) {
            if (document.exitFullscreen) {
                document.exitFullscreen(); 
            }
            if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen(); 
            } 
        }
        const elem = document.getElementById(this.id + "-wrapper-viewer");
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) { 
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) { 
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) { 
            elem.msRequestFullscreen();
        } else if (elem.webkitEnterFullScreen) {
            elem.webkitEnterFullScreen();
        }
    }

    render() {
        const {pageNum, pdfData} = this.state;
        const {show} = this.props;
        return (
            <div>
                <div className="PDF-viewer" tabIndex="0">
                    <div className="PDF-viewer--pagination">
                        <div>
                            <button  className="full-screen-button" onClick={this.openFullscreen.bind(this)}>Full Screen</button>
                            <button className={`${pageNum === 1 ? "disabled" : ""}`} onClick={this.onPrevPage}>Previous</button>
                            <button className={`${pageNum === (pdfData ? pdfData.numPages : 1) ? "disabled" : ""}`} onClick={this.onNextPage}>Next</button>
                        </div>
                        <div> 
                            <span>Page: <b>{pageNum}</b> / <b>{pdfData ? pdfData.numPages : 1}</b></span>
                            { show &&<button className="PDF-viewer-close"  onClick={show}>Close</button>} 
                        </div>
                    </div>
                    <div id={this.id + "-wrapper-viewer"} className="PDF-viewer-wrapper" onScroll={this.scrollPage.bind(this)}>
                        <div className="PDF-viewer--button-escape"  onClick={this.openFullscreen.bind(this, false)}> × </div>
                        <div className="PDF-viewer-content" id={this.id + "-pdf-viewer"} ></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PDFViewer;