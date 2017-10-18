import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Avatar from '../../misc/Avatar';


@connect(() => ({}))
export default class AssignedRouteListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        let ar = this.props.data;
        if (!ar) return null;

        let assigneeInfo = null;
        if (ar.canvasser) {
            assigneeInfo = [
                <Avatar key="avatar" person={ ar.canvasser }/>,
                <span key="name" className="AssignedRouteListItem-assigneeName">
                    { ar.canvasser.name }</span>,
            ];
        }
        else {
            assigneeInfo = <Msg id="lists.assignedRouteList.item.unassigned"/>;
        }

        return (
            <div className="AssignedRouteListItem"
                onClick={ this.props.onItemClick.bind(this, ar) }>
                <div className="AssignedRouteListItem-route">
                    <span className="AssignedRouteListItem-name">
                        { ar.route.id }</span>
                </div>
                <div className="AssignedRouteListItem-assignment">
                    <span className="AssignedRouteListItem-assignmentTitle">
                        { ar.assignment.title }</span>
                </div>
                <div className="AssignedRouteListItem-assignee">
                    { assigneeInfo }
                </div>
            </div>
        );
    }
}
