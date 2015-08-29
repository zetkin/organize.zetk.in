import React from 'react/addons';

import Avatar from '../Avatar';


export default class PeopleList extends React.Component {
    render() {
        const people = this.props.people;


        return (
            <div className="peoplelist">
                <ul className="peoplelist-items">
                    {people.map(function(person, index) {
                        return (
                            <li key={ person.id} className="peoplelist-item"
                                onClick={ this.onPersonClick.bind(this, person) }>

                                <Avatar person={ person }/>
                                <span className="name">
                                    { person.first_name } { person.last_name }
                                </span>
                                <span className="email">
                                    <td>{ person.email }</td>
                                </span>
                            </li>
                        );
                    }, this)}
                </ul>
            </div>
        );
    }

    onPersonClick(person) {
        if (this.props.onSelect) {
            this.props.onSelect(person);
        }
    }
}

PeopleList.propTypes = {
    people: React.PropTypes.array.isRequired
}
