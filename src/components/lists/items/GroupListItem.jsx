import React from 'react';

import DraggableAvatar from '../../misc/DraggableAvatar';


export default class GroupListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            title: React.PropTypes.string.isRequired,
        })
    }

    render() {
        let group = this.props.data;

        return (
            <div className="GroupListItem"
                onClick={ this.props.onItemClick }>

                <div className="GroupListItem-col">
                    <span className="GroupListItem-title">
                        { group.title }</span>
                </div>
                <div className="GroupListItem-col">
                    <span className="GroupListItem-size">
                        { group.size }</span>
                </div>
            </div>
        );
    }
}

