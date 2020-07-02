import React from 'react';
import './Dropdown.scss';
import PropTypes from "prop-types";
import warningIcon from '../../assets/images/icon/warning-small.svg';

const DropdownWrapper = ({index, data, handleSelect}) => {
    return (
        <div key={index} onClick={handleSelect.bind(this, data)} className='dropdown__item--option'>{data.name}</div>
    );
};

class Dropdown extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            errorMsg: null,
            isHidden: false
        };
    }

    handleSelect = (data) => {
        data.idx = this.props.idx;
        if(!data.type) data.type = this.props.name;
        data.otherName = this.props.otherName ? this.props.otherName : '';
        this.props.handleSelect(data);
        this.setState({isOpen: false});
    }

    handleBlur = () => {
        this.setState({isHidden: true});
        setTimeout(function(){
          this.setState({isOpen: false});
        }.bind(this), 500);
    }

    handleDropdown = () => {
        const {disabled} = this.props;
        if(!disabled) {
          this.setState({
              isHidden: false,
              isOpen: !this.state.isOpen
          });
        }
    }

    render() {
        const {errorMsg, isOpen, isHidden} = this.state;
        const {title, data, defaultValue, value, showLabelSelected, classesName, withoutSpan} = this.props;
        const styleDropDown = isHidden ? "dropdown__item hidden-drop-down" : "dropdown__item";
        const errorStyle = errorMsg ? "dropdown__box dropdown__box-error" : "dropdown__box";
        const content = (data || []).map((item, index) => <DropdownWrapper index={index} key={index} data={item} handleSelect={this.handleSelect}/>);
        return (
            <div className={'dropdown ' + classesName} tabIndex="0" onBlur={this.handleBlur}>
                {
                    value && !withoutSpan &&
                    <div className="dropdown__name">{title}</div>
                }
                {
                  value &&
                  <div className="dropdown__name">{showLabelSelected}</div>
                }
                <div className={errorStyle} onClick={this.handleDropdown}>
                    {
                      value &&
                      <span className="dropdown__box--value">{value}</span>
                    }
                    {
                      !value &&
                      <span className="dropdown__box--default-value">{defaultValue}</span>
                    }
                    {
                        !isOpen &&
                        <span className='dropdown__box--icon'> </span>
                    }
                    {
                        isOpen &&
                        <span className='dropdown__box--icon2'> </span>
                    }

                </div>
                {
                    errorMsg &&
                    <div className='dropdown__box--error'>
                        <span><img src={warningIcon} alt="#" /></span>
                        {errorMsg}
                    </div>
                }
                {
                  isOpen &&
                  <div className={styleDropDown}>
                    {content}
                  </div>
                }
            </div>
        );
    }
}

Dropdown.propTypes = {
    defaultValue: PropTypes.string.isRequired,
    handleSelect: PropTypes.func.isRequired
};
export default Dropdown;
