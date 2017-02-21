import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import SurveyOutlineQuestion from './SurveyOutlineQuestion';
import SurveyOutlineTextBlock from './SurveyOutlineTextBlock';


export default class SurveyOutlineElement extends React.Component {
    static propTypes = {
        element: React.PropTypes.object.isRequired,
        onSelect: React.PropTypes.func,
    };

    render() {
        let element = this.props.element;
        let typeMsg = 'misc.surveyOutline.element.types.' + element.type;
        let content;

        if (element.type == 'question') {
            content = (
                <SurveyOutlineQuestion
                    question={ element.question }
                    />
            );
        }
        else if (element.type == 'text') {
            content = (
                <SurveyOutlineTextBlock
                    textBlock={ element.text_block }
                    />
            );
        }

        return (
            <div className="SurveyOutlineElement"
                onClick={ this.props.onSelect }>
                <div className="SurveyOutlineElement-type">
                    <Msg id={ typeMsg }/>
                </div>
                <div className="SurveyOutlineElement-content">
                    { content }
                </div>
            </div>
        );
    }
}
