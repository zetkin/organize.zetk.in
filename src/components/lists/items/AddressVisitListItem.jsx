import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import ProgressBar from '../../misc/ProgressBar';


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
        let progress = visit.households_visited / visit.households_allocated;

        return (
            <div className="AddressVisitListItem"
                onClick={ this.props.onItemClick.bind(this, visit) }>
                <div className="AddressVisitListItem-address">
                    { visit.address }
                </div>
                <div className="AddressVisitListItem-progress">
                    <Msg id="lists.addressVisitList.item.householdsVisited"
                        values={{
                            allocated: visit.households_allocated,
                            visited: visit.households_visited,
                        }}
                        />
                    <ProgressBar progress={ progress }/>
                </div>
            </div>
        );
    }
}
