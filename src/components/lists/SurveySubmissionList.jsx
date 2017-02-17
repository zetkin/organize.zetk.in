import React from 'react';
import cx from 'classnames';

import List from './List';
import SurveySubmissionListItem from './items/SurveySubmissionListItem';


export default class SurveySubmissionList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        submissionList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        return (
            <List className="SurveySubmissionList"
                itemComponent={ SurveySubmissionListItem }
                list={ this.props.submissionList }
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
