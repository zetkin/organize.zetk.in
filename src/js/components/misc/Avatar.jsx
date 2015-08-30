import React from 'react/addons';


export default class Avatar extends React.Component {
    render() {
        const person = this.props.person;
        const src = '//avatars.zetk.in/avatar/' + person.id;
        const alt = person.first_name + ' ' + person.last_name;

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
