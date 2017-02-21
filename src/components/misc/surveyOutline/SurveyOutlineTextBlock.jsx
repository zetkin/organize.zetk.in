import React from 'react';


export default class SurveyOutlineTextBlock extends React.Component {
    static propTypes = {
        textBlock: React.PropTypes.object.isRequired,
    };

    render() {
        return (
            <div className="SurveyOutlineTextBlock">
                { this.props.textBlock.header }
            </div>
        );
    }
}
