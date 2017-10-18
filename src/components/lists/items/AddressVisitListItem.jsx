import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../../misc/LoadingIndicator';


@connect(() => ({}))
export default class AddressVisitListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        let visit = this.props.data;
        if (!visit) return null;

        let timestamp = Date.create(visit.allocation_time);
        let stateClass = "AddressVisitListItem-state";
        let stateLabel = null;
        let actionStatus = null;

        return (
            <div className="AddressVisitListItem"
                onClick={ this.props.onItemClick.bind(this, visit) }>
                <div className="AddressVisitListItem-target">
                    <span className="AddressVisitListItem-address">
                        { visit.address }</span>
                </div>
                <div className="AddressVisitListItem-visitInfo">
                    <Msg id="lists.addressVisitList.item.householdsVisited"
                        values={{
                            allocated: visit.households_allocated,
                            visited: visit.households_visited,
                        }}
                        />
                </div>
                <div className="AddressVisitListItem-visitStatuses"/>
                <div className="AddressVisitListItem-organizerStatuses"/>
            </div>
        );
    }
}
