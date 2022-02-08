
import React from 'react';
import cx from 'classnames';

import List from './List';
import SurveyListItem from './items/SurveyListItem';


export default class SurveyList extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        surveyList: React.PropTypes.shape({
            error: React.PropTypes.object,
            isPending: React.PropTypes.bool,
            items: React.PropTypes.array,
        }).isRequired,
    }

    render() {
        let columns = [
            {
                'title':
                    'lists.surveyList.header.survey',
                'access':
                    'lists.surveyList.header.access',
            },
            {
                'allow_anonymous':
                    'lists.surveyList.header.allowAnonymous',
            },
            {
                'status':
                    'lists.surveyList.header.status',
            },
            {
                'callers_only':
                    'lists.surveyList.header.callersOnly',
            },
        ];

        return (
            <List className="SurveyList"
                headerColumns={ columns }
                itemComponent={ SurveyListItem }
                list={ this.props.surveyList }
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
