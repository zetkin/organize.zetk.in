import React from 'react';


export default class PCActionResponseItem extends React.Component {
    render() {
        let item = this.props.item;
        let name = item.person.name;

        return (
            <div className="PCActionResponseItem">
                <span className="PCActionResponseItem-name">
                    { name }</span>
            </div>
        );
    }
}
