import React from 'react/addons';


export default class Person extends React.Component {
    render() {
        var person = this.props.person;
        var fullName = person.first_name + ' ' + person.last_name;

        return (
            <span className="person" onClick={ this.props.onClick }>
                { fullName }
            </span>
        );
    }
}

Person.propTypes = {
    onClick: React.PropTypes.func,
    person: React.PropTypes.object.isRequired
};
