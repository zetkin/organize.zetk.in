import React from 'react';
import cx from 'classnames';

import Avatar from '../../misc/Avatar';
import DraggableAvatar from '../../misc/DraggableAvatar';
import { FormattedMessage as Msg } from 'react-intl';

export default class JoinSubmissionListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.object,
    }

    render() {
        let sub = this.props.data;
        if (!sub) return null;

        let timestamp = Date.create(sub.submitted);

        let respondentAvatar = null;
        let respondentName = null;
        let actionStatus = null;

        let formTitle = null;
        if (sub.form) {
            formTitle = sub.form.title;
        }

        let actionClassNames  = cx('JoinSubmissionListItem-action', actionStatus);

        return (
            <div className="JoinSubmissionListItem"
                onClick={ this.props.onItemClick }>
                <div className="ListItem-date">
                    <span className="date">
                        { timestamp.format('{d}/{M}, {yyyy}') }</span>
                    <span className="time">
                        { timestamp.format('{HH}:{mm}') }</span>
                </div>
                <div className="JoinSubmissionListItem-content">
                    <div className="JoinSubmissionListItem-form">
                        { formTitle }
                    </div>
                    <div className="JoinSubmissionListItem-person">
                        { `${sub.person_data.first_name} ${sub.person_data.last_name}` }
                    </div>
                    <div className="JoinSubmissionListItem-progress"/>
                </div>
                <div className={ actionClassNames }/>
            </div>
        );
    }
}

