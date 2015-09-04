import React from 'react/addons';

import PeopleListItem from './PeopleListItem';


export default class PeopleList extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        return (nextProps.people !== this.props.people);
    }

    render() {
        const people = this.props.people;


        return (
            <div className="peoplelist">
                <ul className="peoplelist-columns">
                    <li>First name / last name</li>
                    <li>E-mail / phone</li>
                </ul>
                <ul className="peoplelist-items">
                    {people.map(function(person) {
                        return <PeopleListItem person={ person }
                            onSelect={ this.onSelect.bind(this, person) }/>;
                    }, this)}
                </ul>
            </div>
        );
    }

    onSelect(person) {
        if (this.props.onSelect) {
            this.props.onSelect(person);
        }
    }
}

PeopleList.propTypes = {
    people: React.PropTypes.array.isRequired
}
