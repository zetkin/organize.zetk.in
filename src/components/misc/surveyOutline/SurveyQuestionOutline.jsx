import React from 'react';

import SurveyQuestionOption from './SurveyQuestionOption';


export default class SurveyQuestionOutline extends React.Component {
    static propTypes = {
        options: React.PropTypes.array.isRequired,
        onOptionTextChange: React.PropTypes.func,
    };

    render() {
        let items = this.props.options.map(o => (
            <SurveyQuestionOption key={ o.id } option={ o }
                onTextChange={ this.onOptionTextChange.bind(this, o) }
                />
        ));

        return (
            <div className="SurveyQuestionOutline">
                <ul>
                    { items }
                </ul>
            </div>
        );
    }

    onOptionTextChange(option, text) {
        if (this.props.onOptionTextChange) {
            this.props.onOptionTextChange(option, text);
        }
    }
}
