import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Avatar from '../../misc/Avatar';
import LoadingIndicator from '../../misc/LoadingIndicator';
import ProgressBar from '../../misc/ProgressBar';
import Route from '../../misc/elements/Route';
import { retrieveAssignedRouteStats } from '../../../actions/route';


@connect(() => ({}))
export default class AssignedRouteListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    componentDidMount() {
        let ar = this.props.data;
        if (!ar.statsItem || !ar.statsItem.isPending) {
            this.props.dispatch(retrieveAssignedRouteStats(ar.id));
        }
    }

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

        let progressContent = null;

        if (ar.statsItem && ar.statsItem.isPending) {
            progressContent = (
                <LoadingIndicator/>
            );
        }
        else if (ar.statsItem && ar.statsItem.data) {
            let stats = {
                allocated: ar.statsItem.data.num_households_allocated,
                visited: ar.statsItem.data.num_households_visited,
            };

            let progress = stats.visited / stats.allocated;

            progressContent = [
                <ProgressBar key="bar"
                    progress={ progress }/>,
                <div className="AssignedRouteListItem-stats">
                    <div className="AssignedRouteListItem-allocated">
                        <span className="AssignedRouteListItem-statsNumber">
                            { stats.allocated }</span>
                        <Msg id="lists.assignedRouteList.item.stats.allocated"/>
                    </div>
                    <div className="AssignedRouteListItem-visited">
                        <span className="AssignedRouteListItem-statsNumber">
                            { stats.visited }</span>
                        <Msg id="lists.assignedRouteList.item.stats.visited"/>
                    </div>
                </div>
            ];
        }

        return (
            <div className="AssignedRouteListItem"
                onClick={ this.props.onItemClick.bind(this, ar) }>
                <div className="AssignedRouteListItem-info">
                    <Route route={ ar.route }/>
                    <span className="AssignedRouteListItem-assignment">
                        { ar.assignment.title }</span>
                    <div className="AssignedRouteListItem-assignee">
                        { assigneeInfo }
                    </div>
                </div>
                <div className="AssignedRouteListItem-progress">
                    { progressContent }
                </div>
            </div>
        );
    }
}
