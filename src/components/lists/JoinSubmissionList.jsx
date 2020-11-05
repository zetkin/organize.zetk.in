import React from 'react';
import cx from 'classnames';

import List from './List';
import JoinSubmissionListItem from './items/JoinSubmissionListItem';


export default class JoinSubmissionList extends React.Component {
    static propTypes = {
        enablePagination: React.PropTypes.bool,
        onItemClick: React.PropTypes.func,
        onLoadPage: React.PropTypes.func,
        submissionList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        let columns = [
            {
                'submitted': 'lists.joinSubmissionList.header.time',
            },
            {
                'name': 'lists.joinSubmissionList.header.name',
                'form.title': 'lists.joinSubmissionList.header.form',
            },
            {
                'state': 'lists.joinSubmissionList.header.state'
            }
        ];

        return (
            <List className="JoinSubmissionList"
                enablePagination={ this.props.enablePagination }
                headerColumns={ columns }
                itemComponent={ JoinSubmissionListItem }
                list={ this.props.submissionList }
                onItemClick={ this.props.onItemClick }
                onLoadPage={ this.props.onLoadPage }
                />
        );
    }
}
