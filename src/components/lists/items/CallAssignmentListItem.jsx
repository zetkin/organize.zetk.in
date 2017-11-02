import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../../misc/LoadingIndicator';
import ProgressBar from '../../misc/ProgressBar';
import ParticipantList from './elements/ParticipantList'

import {
    retrieveCallAssignmentStats,
    retrieveCallAssignmentCallers,
} from '../../../actions/callAssignment';


@connect(() => ({}))
export default class CallAssignmentListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    componentDidMount() {
        let assignment = this.props.data;
        if (assignment.title && !assignment.statsItem) {
            this.props.dispatch(retrieveCallAssignmentStats(assignment.id));
        }

        if (assignment.title && !assignment.callerList) {
            this.props.dispatch(retrieveCallAssignmentCallers(assignment.id));
        }
    }

    componentWillUpdate(nextProps, nextState) {
        let assignment = nextProps.data;
        if (assignment.title && !assignment.statsItem) {
            this.props.dispatch(retrieveCallAssignmentStats(assignment.id));
        }

        if (assignment.title && !assignment.callerList) {
            this.props.dispatch(retrieveCallAssignmentCallers(assignment.id));
        }
    }

    render() {
        let assignment = this.props.data;
        let progress = 0;
        let callsStats = null;
        let reachedStats = null;
        let targetStats = null;
        let goalStats = null;
        let participantIndicator = null;
        const assignmentDateStart = new Date(assignment.start_date);
        const assignmentDateEnd = new Date(assignment.end_date);
        const inPast = (assignmentDateEnd < (new Date()) ? true : false);

        const classNames = cx({
            'CallAssignmentListItem': true,
            'past': inPast
        });

        let assignmentDateSpan = (
            <div className="ListItem-date">
                <div className="dateStart">
                    { assignmentDateStart.format('{d}/{M}, {yyyy}') }
                </div>
                <div className="dateEnd">
                    { assignmentDateEnd.format('{d}/{M}, {yyyy}') }
                </div>
            </div>
        );

        if (assignment.statsItem && assignment.statsItem.isPending) {
            callsStats = <LoadingIndicator/>;
            reachedStats = <LoadingIndicator/>;
            targetStats = <LoadingIndicator/>;
            goalStats = <LoadingIndicator/>;
        }
        else if (assignment.statsItem && assignment.statsItem.data) {
            let stats = assignment.statsItem.data;

            progress =
                (1 - stats.num_remaining_targets / stats.num_target_matches);

            let successRate = (stats.num_calls_reached > 0)
                ? ((Math.round(100 *
                    stats.num_calls_reached / stats.num_calls_made)) + "%")
                : 0;

            callsStats = (
                <div className="CallAssignmentListItem-statsCalls">
                    { stats.num_calls_made }
                    <Msg id="lists.callAssignmentList.item.stats.calls"/>
                </div>
            );
            reachedStats = (
                <div className="CallAssignmentListItem-statsReached">
                    { successRate }
                    <Msg id="lists.callAssignmentList.item.stats.reached"/>
                </div>
            );
            targetStats = (
                <div className="CallAssignmentListItem-statsTarget">
                    { stats.num_target_matches }
                    <Msg id="lists.callAssignmentList.item.stats.target"/>
                </div>
            );
            goalStats = (
                <div className="CallAssignmentListItem-statsGoal">
                    { stats.num_remaining_targets }
                    <Msg id="lists.callAssignmentList.item.stats.goal"/>
                </div>
            );
        }

        if (assignment.callerList && assignment.callerList.isPending) {
            participantIndicator = <LoadingIndicator/>
        }
        else if (assignment.callerList) {
            let participants = assignment.callerList.items.map(p => p.data);
            const count = (participants.length)? participants.length : "0";
            participantIndicator =  (
                <span className="CallAssignmentListItem-infoCallers">
                    <i className="fa fa-user"></i>
                    <Msg id="lists.callAssignmentList.item.info.callers"
                        values={{ count }}/>
                </span>
            );
        }

        return (
            <div className={ classNames }
                onClick={ this.props.onItemClick }>
                    { assignmentDateSpan }
                <div className="CallAssignmentListItem-info">
                    <h3 className="CallAssignmentListItem-infoTitle">
                        { assignment.title }</h3>
                    { participantIndicator }
                </div>
                <div className="CallAssignmentListItem-stats">
                    <ProgressBar progress={ progress }/>
                    { callsStats }
                    { reachedStats }
                    { targetStats }
                    { goalStats }
                </div>
            </div>
        );
    }
}
