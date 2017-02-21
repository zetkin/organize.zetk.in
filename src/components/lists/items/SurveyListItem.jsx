import React from 'react';

import DraggableAvatar from '../../misc/DraggableAvatar';


export default class SurveyListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.object,
    }

    render() {
        let survey = this.props.data;

        return (
            <div className="SurveyListItem"
                onClick={ this.props.onItemClick }>
                <span className="SurveyListItem-title">
                    { survey.title }</span>
            </div>
        );
    }
}

