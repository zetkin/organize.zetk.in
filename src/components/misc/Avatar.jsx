import React from 'react';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
    orgId: state.org.activeId,
});


@connect(mapStateToProps)
export default class Avatar extends React.Component {
    render() {
        const person = this.props.person;
        const avatarDomain = '//api.' + process.env.ZETKIN_DOMAIN;
        const src = avatarDomain + '/v1/orgs/'
            + this.props.orgId + '/people/' + person.id + '/avatar';

        const alt = (person.first_name && person.last_name)?
            person.first_name + ' ' + person.last_name :
            person.name? person.name : '';

        return (
            <img className="Avatar"
                src={ src } alt={ alt } title={ alt }
                onClick={ this.props.onClick }
                />
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
