import React, {Component} from 'react';
import './User.scss';
import PropTypes from "prop-types";
export default class User extends Component {

    render() {
        const {data} = this.props;
        const {address, company, email, id, name, phone, username, website} = data;
       
        return (
            <div className="user">
               <div className="detail">
                  <div className="detail-icon">
                   <span> {name.substring(0, 1)} </span>
                  </div>
                  <div className="detail-id">
                   ID:  {id}
                  </div>
                   <div className="detail-name">
                    Name: {name}
                   </div>
                   <div className="detail-name">
                    Email: {email}
                   </div>
                   <div className="detail-name">
                    Phone: {phone}
                   </div>
                   <div className="detail-name">
                    User name:  {username}
                   </div>
                   <div className="detail-name">
                    Website: {website}
                   </div>
               </div>
                <div className="detail-company">
                    <div className="company-name">
                         Name: {company.name}
                    </div>
                    <div className="company-bs">
                       BS: {company.bs}
                    </div>
                    <div className="company-street">
                     Catch Phrase: {company.catchPhrase}
                    </div>
                </div>
                <div className="detail-address">
                    <div className="address-street">
                         Street: {address.street + " " + address.suite}, {address.city} 

                    </div>
                    <div className="company-bs">
                        Zip code: {address.zipcode}
                    </div>
                </div>
            </div>
        );
    }
}

User.propTypes = {
    data:  PropTypes.object.isRequired
};
