import React from 'react';
import cx from 'classnames';

import Button from '../Button';
import Link from '../Link';


export default class SurveyQuestionOption extends React.Component {
    static propTypes = {
        option: React.PropTypes.object.isRequired,
        onTextChange: React.PropTypes.func,
        onOpen: React.PropTypes.func,
        onCancel: React.PropTypes.func,
        onDelete: React.PropTypes.func,
        open: React.PropTypes.bool,
    };

    constructor(props) {
        super(props);

        this.state = {
            text: '',
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.open && nextProps.open) {
            this.setState({
                text: this.props.option.text,
            });
        }
    }

    render() {
        let option = this.props.option;
        let classes = cx('SurveyQuestionOption', {
            editable: !this.props.open,
        });

        let content = (
            <span>{ option.text }</span>
        );

        if (this.props.open) {
            content = [
                <input key="input" type="text"
                    value={ this.state.text }
                    onChange={ this.onInputChange.bind(this) }
                    />,
                <Button key="cancelButton"
                    labelMsg="misc.surveyOutline.option.cancelButton"
                    onClick={ this.onCancelButtonClick.bind(this) }
                    />,
                <Link key="deleteButton"
                    className="SurveyQuestionOption-deleteButton"
                    msgId="misc.surveyOutline.option.deleteButton"
                    onClick={ this.onDeleteButtonClick.bind(this) }
                    />,
                <Button key="saveButton"
                    labelMsg="misc.surveyOutline.option.saveButton"
                    onClick={ this.onSaveButtonClick.bind(this) }
                    />,
            ];
        }

        return (
            <div className={ classes }
                onClick={ this.onClick.bind(this) }>
                { content }
            </div>
        );
    }

    onClick(ev) {
        if (!this.props.open && this.props.onOpen) {
            this.props.onOpen();
        }
    }

    onInputChange(ev) {
        this.setState({
            text: ev.target.value,
        });
    }

    onCancelButtonClick(ev) {
        if (this.props.onCancel) {
            this.props.onCancel();
        }
    }

    onDeleteButtonClick(ev) {
        if (this.props.onDelete) {
            this.props.onDelete();
        }
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
