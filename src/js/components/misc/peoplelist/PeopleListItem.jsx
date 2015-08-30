import React from 'react/addons';

import Avatar from '../Avatar';


export default class PeopleListItem extends React.Component {
    render() {
        const person = this.props.person;

        var mailLink = null;
        if (person.email) {
            const mailto = 'mailto:' + person.email;
            mailLink = <a href={ mailto }>{ person.email }</a>;
        }

        return (
            <li key={ person.id } className="peoplelistitem"
                onClick={ this.props.onSelect }>

                <Avatar person={ person }/>
                <span className="first_name">{ person.first_name }</span>
                <span className="last_name">{ person.last_name }</span>
                <span className="email">{ mailLink }</span>
                <span className="phone">{ person.phone }</span>
            </li>
        );
    }
}

PeopleListItem.propTypes = {
    onSelect: React.PropTypes.func,
    person: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        first_name: React.PropTypes.string.isRequired,
        last_name: React.PropTypes.string.isRequired,
        email: React.PropTypes.string,
        phone: React.PropTypes.string
    }).isRequired
};
