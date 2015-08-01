import React from 'react/addons';


export default class Person extends React.Component {
    render() {
        var person = this.props.person;
        var fullName = person.first_name + ' ' + person.last_name;

        return (
            <span className="person">
                { fullName }
            </span>
        );
    }
}

Person.propTypes = {
    person: React.PropTypes.object.isRequired
};
