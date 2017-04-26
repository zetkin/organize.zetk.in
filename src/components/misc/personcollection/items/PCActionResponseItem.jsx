import React from 'react';


export default class PCActionResponseItem extends React.Component {
    render() {
        let item = this.props.item;
        let name = item.person.name;
        let responseTime = Date.create(item.response_date);
        let responseTimeLabel = responseTime.setUTC(true)
                .format('{yyyy}-{MM}-{dd} {HH}:{mm}');

        return (
            <div className="PCActionResponseItem">
                <span className="PCActionResponseItem-name">
                    { name }</span>
                <span className="PCActionResponseItem-time">
                    { responseTimeLabel }</span>
            </div>
        );
    }
}
