import React from 'react';


export default class Avatar extends React.Component {
    render() {
        const person = this.props.person;
        const src = '//avatars.zetkin/avatar/' + person.id;
        const alt = (person.first_name && person.last_name)?
            person.first_name + ' ' + person.last_name :
            person.name? person.name : '';

        return (
            <img className="avatar" src={ src } alt={ alt } title={ alt }/>
        );
    }
}

Avatar.propTypes = {
    person: React.PropTypes.shape({
        id: React.PropTypes.string,
        first_name: React.PropTypes.string,
        last_name: React.PropTypes.string
    })
};
