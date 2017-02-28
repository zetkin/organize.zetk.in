import React from 'react';


export default class SurveyOutlineQuestion extends React.Component {
    static propTypes = {
        question: React.PropTypes.object.isRequired,
    };

    render() {
        return (
            <div className="SurveyOutlineQuestion">
                { this.props.question.question }
            </div>
        );
    }
}
