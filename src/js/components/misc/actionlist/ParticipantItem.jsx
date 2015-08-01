import React from 'react/addons';


export default class ParticipantItem extends React.Component {
    render() {
        var person = this.props.person;
        var name = person.first_name + ' ' + person.last_name;

        return (
            <li className="participant">
                <figure>
                    <figcaption>{ name }</figcaption>
                </figure>
            </li>
        );
    }
}

ParticipantItem.propTypes = {
    person: React.PropTypes.object.isRequired
}
