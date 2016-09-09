import React from 'react';


export default class Avatar extends React.Component {
    render() {
        const person = this.props.person;
        const avatarDomain = '//avatars.' + process.env.ZETKIN_DOMAIN;
        const src = avatarDomain + '/avatar/' + person.id;
        const alt = (person.first_name && person.last_name)?
            person.first_name + ' ' + person.last_name :
            person.name? person.name : '';

        return (
            <img className="Avatar" src={ src } alt={ alt } title={ alt }/>
        );
    }
}

Avatar.propTypes = {
    person: React.PropTypes.shape({
        id: React.PropTypes.any, // TODO: Use string
        first_name: React.PropTypes.string,
        last_name: React.PropTypes.string
    })
};
