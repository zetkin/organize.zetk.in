import React from 'react';

import Button from '../Button';


export default class SurveyQuestionOption extends React.Component {
    static propTypes = {
        option: React.PropTypes.object.isRequired,
        onTextChange: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            text: '',
            editing: !!props.editMode,
        };
    }

    render() {
        let option = this.props.option;

        let content = (
            <span>{ option.text }</span>
        );

        if (this.state.editing) {
            content = [
                <input key="input" type="text"
                    value={ this.state.text }
                    onChange={ this.onInputChange.bind(this) }
                    />,
                <Button key="cancelButton"
                    labelMsg="misc.surveyOutline.option.cancelButton"
                    onClick={ this.onCancelButtonClick.bind(this) }
                    />,
                <Button key="saveButton"
                    labelMsg="misc.surveyOutline.option.saveButton"
                    onClick={ this.onSaveButtonClick.bind(this) }
                    />,
            ];
        }

        return (
            <div className="SurveyQuestionOption"
                onClick={ this.onClick.bind(this) }>
                { content }
            </div>
        );
    }

    onClick(ev) {
        if (!this.state.editing) {
            this.setState({
                text: this.props.option.text,
                editing: true,
            });
        }
    }

    onInputChange(ev) {
        this.setState({
            text: ev.target.value,
        });
    }

    onCancelButtonClick(ev) {
        this.setState({
            editing: false,
        });
    }

    onSaveButtonClick(ev) {
        if (this.props.onTextChange) {
            this.props.onTextChange(this.state.text);
        }

        this.setState({
            editing: false,
        });
    }
}
