import React from 'react';


export default class PersonCollectionParticipantItem extends React.Component {
    render() {
        let item = this.props.item;
        let name = item.first_name + ' ' + item.last_name;

        return (
            <div className="PersonCollectionParticipantItem">
                <span className="PersonCollectionParticipantItem-name">
                    { name }</span>
            </div>
        );
    }
}
