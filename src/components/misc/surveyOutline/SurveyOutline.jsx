import React from 'react';

import SurveyOutlineElement from './SurveyOutlineElement';


export default class SurveyOutline extends React.Component {
    static propTypes = {
        survey: React.PropTypes.object.isRequired,
        elements: React.PropTypes.array.isRequired,
        onElementSelect: React.PropTypes.func,
    };

    render() {
        let elements = this.props.elements.map(elem => {
            return (
                <SurveyOutlineElement key={ elem.id }
                    element={ elem }
                    onSelect={ this.onElementSelect.bind(this, elem) }
                    />
            );
        });

        return (
            <div className="SurveyOutline">
                { elements }
            </div>
        );
    }

    onElementSelect(elem) {
        if (this.props.onElementSelect) {
            this.props.onElementSelect(elem);
        }
    }
}
