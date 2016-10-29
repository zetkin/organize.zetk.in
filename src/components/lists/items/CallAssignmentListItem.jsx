import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from '../../misc/LoadingIndicator';
import ParticipantList from './elements/ParticipantList'

import {
    retrieveCallAssignmentStats,
    retrieveCallAssignmentCallers,
} from '../../../actions/callAssignment';


@connect(() => ({}))
export default class CallAssignmentListItem extends React.Component {
    static propTypes = {
        onSelect: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    componentDidMount() {
        let assignment = this.props.data
        this.props.dispatch(retrieveCallAssignmentStats(assignment.id));
        this.props.dispatch(retrieveCallAssignmentCallers(assignment.id));
    }

    render() {
        let assignment = this.props.data;
        let targetStats = null;
        let goalStats = null;
        let participantList = null;

        if (!assignment.statsItem || assignment.statsItem.isPending) {
            targetStats = <LoadingIndicator/>;
            goalStats = <LoadingIndicator/>;
        } else {
            let stats = assignment.statsItem.data;
            targetStats = (
                <h1 key="targetStatsHeader">
                    { stats.num_target_matches }
                </h1>
            );
            goalStats = (
                <h1 key="goalStatsHeader">
                    { stats.num_remaining_targets }
                </h1>
            );
        }

        if (!assignment.callerList || assignment.callerList.isPending) {
            participantList = <LoadingIndicator/>
        } else {
            let participants = assignment.callerList.items.map(p => p.data);
            participantList = <ParticipantList
                maxVisible={ 4 }
                participants={ participants }/>
        }

        return (
            <div className="CallAssignmentListItem"
                onClick={ () => {this.props.onSelect(assignment)} }>
                <div className="CallAssignmentListItem-info">
                    <h1>{ assignment.title }</h1>
                        { participantList }
                </div>
                <div className="CallAssignmentListItem-stats">
                    <div className="CallAssignmentListItem-targetStats">{ targetStats }</div>
                    <div className="CallAssignmentListItem-goalStats">{ goalStats }</div>
                </div>
            </div>
        );
    }
}
