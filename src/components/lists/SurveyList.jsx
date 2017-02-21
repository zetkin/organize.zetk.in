
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
        return (
            <List className="SurveyList"
                itemComponent={ SurveyListItem }
                list={ this.props.surveyList }
                onItemClick={ this.props.onItemClick }
                />
        );
    }
}
