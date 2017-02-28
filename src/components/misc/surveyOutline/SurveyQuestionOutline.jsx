import React from 'react';

import Button from '../Button';
import SurveyQuestionOption from './SurveyQuestionOption';


export default class SurveyQuestionOutline extends React.Component {
    static propTypes = {
        options: React.PropTypes.array.isRequired,
        onOptionTextChange: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            adding: false,
        }
    }

    render() {
        let items = this.props.options.map(o => (
            <li key={ o.id }>
                <SurveyQuestionOption option={ o }
                    onTextChange={ this.onOptionTextChange.bind(this, o) }
                    />
            </li>
        ));

        let addSection;

        if (this.state.adding) {
            addSection = (
                <SurveyQuestionOption
                    option={{ text: '' }} editMode={ true }
                    onTextChange={ this.onNewOptionTextChange.bind(this) }
                    onCancel={ this.onNewOptionCancel.bind(this) }
                    />
            );
        }
        else {
            addSection = (
                <Button labelMsg="misc.surveyOutline.option.addButton"
                    onClick={ this.onAddButtonClick.bind(this) }
                    />
            );
        }

        return (
            <div className="SurveyQuestionOutline">
                <ul>
                    { items }
                </ul>
                { addSection }
            </div>
        );
    }

    onOptionTextChange(option, text) {
        if (this.props.onOptionTextChange) {
            this.props.onOptionTextChange(option, text);
        }
    }

    onAddButtonClick() {
        this.setState({
            adding: true,
        });
    }

    onNewOptionTextChange(text) {
        if (this.props.onOptionCreate) {
            this.props.onOptionCreate(text);
        }

        this.setState({
            adding: false,
        });
    }

    onNewOptionCancel() {
        this.setState({
            adding: false,
        });
    }
}
