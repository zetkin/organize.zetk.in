import React from 'react';
import cx from 'classnames';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Avatar from '../misc/Avatar';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import { getListItemById } from '../../utils/store';
import { retrieveCallAssignmentTargets } from '../../actions/callAssignment';


const mapStateToProps = (state, props) => ({
    targetList: state.callAssignments.targetsByAssignment[props.paneData.params[0]],
    callAssignmentItem: getListItemById(state.callAssignments.assignmentList, props.paneData.params[0]),
});

@injectIntl
@connect(mapStateToProps)
export default class CallAssignmentTargetsPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveCallAssignmentTargets(this.getParam(0)));
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.callAssignmentTargets.title' });
    }

    getPaneSubTitle(data) {
        return (this.props.callAssignmentItem && this.props.callAssignmentItem.data)?
            this.props.callAssignmentItem.data.title : '';
    }

    renderPaneContent(data) {
        if (!this.props.targetList || this.props.targetList.isPending) {
            return <LoadingIndicator/>;
        }
        else {
            let targets = this.props.targetList.items.map(i => i.data);

            targets.sort((t0, t1) => (t0.first_name+t0.last_name)
                .localeCompare(t1.first_name+t1.last_name));

            let pending = targets.filter(t => (!t.status.blocked && !t.status.goal_fulfilled));
            let blocked = targets.filter(t => (t.status.blocked && !t.status.goal_fulfilled));
            let fulfilled = targets.filter(t => t.status.goal_fulfilled);

            return [
                <div key="pending" className="CallAssignmentTargetsPane-pending">
                    <Msg tagName="h3" id="panes.callAssignmentTargets.pending.h"
                        values={{ count: pending.length, max: targets.length }}/>
                    <TargetList targets={ pending }
                        onItemClick={ target => this.openPane('person', target.id) }/>
                </div>,
                <div key="blocked" className="CallAssignmentTargetsPane-blocked">
                    <Msg tagName="h3" id="panes.callAssignmentTargets.blocked.h"
                        values={{ count: blocked.length, max: targets.length }}/>
                    <TargetList targets={ blocked }
                        onItemClick={ target => this.openPane('person', target.id) }/>
                </div>,
                <div key="fulfilled" className="CallAssignmentTargetsPane-fulfilled">
                    <Msg tagName="h3" id="panes.callAssignmentTargets.fulfilled.h"
                        values={{ count: fulfilled.length, max: targets.length }}/>
                    <TargetList targets={ fulfilled }
                        onItemClick={ target => this.openPane('person', target.id) }/>
                </div>,
            ];
        }
    }
}

const TargetList = props => {
    let items = props.targets.map(target => {
        let classes = cx('CallAssignmentTargetsPane-targetItem', {
            fulfilled: target.status.goal_fulfilled,
            blocked: target.status.blocked,
        });

        let reasonList = null;
        if (target.status.blocked && !target.status.goal_fulfilled) {
            let reasonItems = target.status.block_reasons.map(reason => (
                <li className={ reason }>
                    <Msg id={ 'panes.callAssignmentTargets.blocked.reasons.' + reason }/>
                </li>
            ));

            reasonList = (
                <ul className="CallAssignmentTargetsPane-reasonList">
                    { reasonItems }
                </ul>
            );
        }

        return (
            <div key={ target.id } className={ classes }
                onClick={ props.onItemClick.bind(this, target) }>

                <Avatar person={ target }/>
                <span className="CallAssignmentTargetsPane-targetName">
                    { target.first_name + ' ' + target.last_name }
                </span>
                { reasonList }
            </div>
        );
    });

    return (
        <div className="CallAssignmentsTargetPane-list">
            { items }
        </div>
    );
};

// Used for sorting targets
const scoreTarget = target => {
    if (target.goal_fulfilled) return 2;
    if (target.blocked) return 1;
    return 0;
};
