import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../../misc/LoadingIndicator';
import ProgressBar from '../../misc/ProgressBar';


@connect(() => ({}))
export default class HouseholdVisitListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        let visit = this.props.data;
        if (!visit) return null;

        let timestamp = Date.create(visit.allocation_time);
        let stateClass = "HouseholdVisitListItem-state";
        let stateLabel = null;
        let actionStatus = null;

        switch (visit.state) {
            case 0:
                stateLabel = "lists.householdVisitList.item.status.allocated";
                stateClass += "allocated";
                break;
            case 1:
                stateLabel = "lists.householdVisitList.item.status.reached";
                stateClass += "success";
                break;
            default:
                stateLabel = "lists.householdVisitList.item.status.notReached";
                stateClass += "failed";
        }

        if (visit.organizer_action_taken) {
            actionStatus = "taken";
        }
        else if (visit.organizer_action_needed) {
            actionStatus = "needed";
        }

        let actionClassNames = cx('HouseholdVisitListItem-action', actionStatus);

        let visitorInfo = null;
        if (visit.visitor) {
            <span className="HouseholdVisitListItem-visitor">
                { visit.visitor.name }</span>
        }

        return (
            <div className="HouseholdVisitListItem"
                onClick={ this.props.onItemClick.bind(this, visit) }>
                <div className="ListItem-date">
                    <span className="date">
                        { timestamp.format('{d}/{M}, {yyyy}') }</span>
                    <span className="time">
                        { timestamp.format('{HH}:{mm}') }</span>
                </div>
                <div className="HouseholdVisitListItem-content">
                    <div className="HouseholdVisitListItem-target">
                        <span className="HouseholdVisitListItem-address">
                            { visit.address.address }</span>
                    </div>
                    <div className="HouseholdVisitListItem-visitInfo">
                        <span className={ "HouseholdVisitListItem-visitStatus "
                            + stateClass }>
                            <Msg id={ stateLabel.toString() }/>
                        </span>
                        { visitorInfo }
                    </div>
                    <div className="HouseholdVisitListItem-visitStatuses"/>
                    <div className="HouseholdVisitListItem-organizerStatuses"/>
                </div>
                <div className={ actionClassNames }></div>
            </div>
        );
    }
}
