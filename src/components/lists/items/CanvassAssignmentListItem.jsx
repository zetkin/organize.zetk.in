import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../../misc/LoadingIndicator';
import ProgressBar from '../../misc/ProgressBar';


@connect(() => ({}))
export default class CanvassAssignmentListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func.isRequired,
        data: React.PropTypes.object,
    };

    render() {
        let assignment = this.props.data;
        const assignmentDateStart = new Date(assignment.start_date);
        const assignmentDateEnd = new Date(assignment.end_date);
        const inPast = (assignmentDateEnd < (new Date()) ? true : false);

        const classNames = cx('CanvassAssignmentListItem', {
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

        return (
            <div className={ classNames }
                onClick={ this.props.onItemClick }>
                    { assignmentDateSpan }
                <div className="CanvassAssignmentListItem-info">
                    <h3 className="CanvassAssignmentListItem-infoTitle">
                        { assignment.title }</h3>
                </div>
            </div>
        );
    }
}
