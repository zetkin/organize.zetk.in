import React from 'react';

import SurveyOutlineElement from './SurveyOutlineElement';
import SelectInput from '../../forms/inputs/SelectInput';


export default class SurveyOutline extends React.Component {
    static propTypes = {
        survey: React.PropTypes.object.isRequired,
        elements: React.PropTypes.array.isRequired,
        onElementSelect: React.PropTypes.func,
        onElementCreate: React.PropTypes.func
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

        let typeOptions = {
            label: 'misc.surveyOutline.add.label',
            question: 'misc.surveyOutline.add.types.question',
            text: 'misc.surveyOutline.add.types.text',
        };


        return (
            <div className="SurveyOutline">
                { elements }
                <div key="addSection">
                    <SelectInput
                        value="label"
                        options={ typeOptions }
                        optionLabelsAreMessages={ true }
                        onValueChange={ this.onTypeSelectChange.bind(this) }
                        />
                </div>
            </div>
        );
    }

    onElementSelect(elem) {
        if (this.props.onElementSelect) {
            this.props.onElementSelect(elem);
        }
    }

    onTypeSelectChange(name, value) {
        if (this.props.onElementCreate) {
            this.props.onElementCreate(value);
        }
    }
}
