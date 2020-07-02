import React from 'react';
import './SearchBar.scss';
import PropTypes from "prop-types";
import closeIcon from '../../assets/images/icon/close.svg';
import searchIcon from '../../assets/images/icon/search-white.svg';
import Dropdown from '../Dropdown';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          textSearch: '',
          previousValue: ''
        };
    }

    handleChange = (event) => {
        const {value} = event.target;
        const {handleChange} = this.props;
        this.setState({textSearch: value});
        if(handleChange) handleChange(value)
    }

    handleSearch = () => {
        const {textSearch} = this.state;
        this.setState({previousValue: textSearch})
        this.props.handleSearch({isSearch: true});
    }

    handleKeyPress = (e) => {
        const {handleSearch} = this.props;
        if(e.key === 'Enter') {
          const {textSearch} = this.state;
          this.setState({previousValue: textSearch})
          handleSearch({isSearch: true});
        }
    }

    handleReset = () => {
        const {handleChange} = this.props;
        this.setState({textSearch: ''});
        handleChange("", true);
    }

    render() {
        const { textSearch } = this.state;
        const { placeholder, hideShadow, hideButton, searchList, searchObj, handleSelect } = this.props;
        const style = hideShadow ? 'search-bar input-group hide-shadow' : 'search-bar input-group';

        return (
            <div className="search-bar">
            <div className="search-bar__dropdown"> <Dropdown data={searchList}
                   defaultValue={searchObj.defaultValue}
                   value={searchObj.value} 
                   showLabelSelected={""}
                   handleSelect={handleSelect}
                 />
             </div>
            <div className={style}>
                <input value={textSearch} className="form-control search-bar__input" onKeyPress={this.handleKeyPress} placeholder={placeholder} onChange={this.handleChange}/>
                {
                    textSearch.length > 0 &&
                    <span className="search-bar__input--search-icon" onClick={this.handleReset}>
                        <img src={closeIcon} alt="#" />
                    </span>
                }
                {
                    !hideButton &&
                    <span className="search-bar__input--search-btn">
                        <button onClick={this.handleSearch}>
                            <img src={searchIcon} alt="#" />
                        </button>
                    </span>
                }
            </div>
            </div>
        );
    }
}

SearchBar.propTypes = {
    handleSelect: PropTypes.func.isRequired,
    searchObj: PropTypes.object.isRequired
};


export default SearchBar;
