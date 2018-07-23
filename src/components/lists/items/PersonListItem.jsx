import React from 'react';

import DraggableAvatar from '../../misc/DraggableAvatar';


export default class PersonListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            first_name: React.PropTypes.string.isRequired,
            last_name: React.PropTypes.string.isRequired,
            email: React.PropTypes.string,
            phone: React.PropTypes.string,
        })
    }

    render() {
        let person = this.props.data;

        var mailLink = null;
        if (person.email) {
            const mailto = 'mailto:' + person.email;
            mailLink = <a href={ mailto }>{ person.email }</a>;
        }

        const phoneNumbers = [ person.phone, person.alt_phone ].filter(pn => !!pn);

        return (
            <div className="PersonListItem"
                onClick={ this.props.onItemClick }>

                <DraggableAvatar person={ person }/>
                <div className="PersonListItem-col">
                    <span className="PersonListItem-firstName">
                        { person.first_name }</span>
                    <span className="PersonListItem-lastName">
                        { person.last_name }</span>
                </div>
                <div className="PersonListItem-col">
                    <span className="PersonListItem-email">
                        { mailLink }</span>
                    <span className="PersonListItem-phone">
                        { phoneNumbers.join(', ') }</span>
                </div>
            </div>
        );
    }
}

