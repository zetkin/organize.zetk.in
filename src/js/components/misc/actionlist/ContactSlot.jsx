import React from 'react/addons';

import Avatar from '../Avatar';


export default class ContactSlot extends React.Component {
    render() {
        const contact = this.props.contact;

        var figure = null;
        if (contact) {
            figure = (
                <figure>
                    <Avatar person={ contact }/>
                    <figcaption>{ contact.name }</figcaption>
                </figure>
            );
        }


        return (
            <div className="contact">
                { figure }
            </div>
        );
    }
}

ContactSlot.propTypes = {
    contact: React.PropTypes.shape({
        id: React.PropTypes.number.isRequired,
        name: React.PropTypes.string.isRequired
    })
};
