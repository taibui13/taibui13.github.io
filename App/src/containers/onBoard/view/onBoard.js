import React, { Component } from 'react';
import './index.scss';
import User from '../../../components/User/User';
import SearchBar from '../../../components/SearchBar';
import Loader from '../../../components/Loader/Loader';
import logo from '../../../assets/images/icon/logo-cartrack.png';
import {getURLParameter} from '../../../common/utils';

export default class OnBoard extends Component {

  componentWillMount() {
    this.props.getUser({id: getURLParameter("t")}, this.props.history.push);
  }

  handleSelect(data) {
    let {onBoardReducer: {searchObj}, selectData} = this.props;
    searchObj.value = data.name;
    selectData(searchObj);
  }

  handleSearch(data) {
    const {onBoardReducer: { users, searchObj, searchValue}, filterUsers} = this.props;
    filterUsers(users, searchObj.value || searchObj.defaultValue, searchValue);
  }

  handleChange(text, isReset) {
    const {onBoardReducer: { users, searchObj }, setData, filterUsers} = this.props;
    setData("searchValue", text);
    if (isReset) {
      filterUsers(users, searchObj.value || searchObj.defaultValue, text);
    }
  }

  render() {
    const {commonReducer: {msg}, onBoardReducer: {isLoading, users, searchObj, optionalSearchKeys}} = this.props;
    const labels = msg.security || {};
    return(
      <div className="security">
       {
         isLoading && <Loader />
       }
      
       <div className="security-header"> 
          <div className="security-title">
            <div className="logo">  
            <img alt="#" src={logo}/>
            </div>
            <div className="text">
            <label> {labels.title} </label> </div>
            </div>
        </div>
        <div className="security-content">
          <SearchBar searchList={optionalSearchKeys} searchObj={searchObj}
            handleSelect={this.handleSelect.bind(this)}
            handleSearch={this.handleSearch.bind(this)}
            handleChange={this.handleChange.bind(this)}
            />
        <div className="security-body"> 
        {
          (users || []).map((e, index) => {
            return <User key={index} data={e} />
          })
        }
        {
          users.length === 0 &&
          msg.error.dataNotFound
        }
        </div>
        </div>
      </div>
    );
  }
}
