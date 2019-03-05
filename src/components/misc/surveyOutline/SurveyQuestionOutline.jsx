import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import Button from '../Button';
import Reorderable from '../reorderable/Reorderable';
import SurveyQuestionOption from './SurveyQuestionOption';


export default class SurveyQuestionOutline extends React.Component {
    static propTypes = {
        options: React.PropTypes.array.isRequired,
        onOptionTextChange: React.PropTypes.func,
        onOptionDelete: React.PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            adding: false,
            openOption: null,
            bulkText: '',
        }
    }

    render() {
        let items = this.props.options.map(o => {
            let open = (!this.state.adding && this.state.openOption == o);

            return (
                <SurveyQuestionOption key={ o.id } option={ o }
                    open={ open }
                    onOpen={ this.onOptionOpen.bind(this, o) }
                    onCancel={ this.onOptionCancel.bind(this, o) }
                    onDelete={ this.props.onOptionDelete.bind(this, o) }
                    onTextChange={ this.onOptionTextChange.bind(this, o) }
                    />
            );
        });

        let addSection;

        if (this.state.adding === 'single') {
            addSection = (
                <SurveyQuestionOption
                    option={{ text: '' }} open={ true }
                    onTextChange={ this.onNewOptionTextChange.bind(this) }
                    onCancel={ this.onNewOptionCancel.bind(this) }
                    />
            );
        }
        else if (this.state.adding === 'bulk') {
            const numLines = this.state.bulkText
                .split('\n')
                .filter(s => Boolean(s))
                .length;

            const saveButton = (numLines == 0)? null : (
                <Button key="saveBulkButton"
                    className="SurveyQuestionOutline-saveBulkButton"
                    labelMsg="misc.surveyOutline.option.saveBulkButton"
                    labelValues={{ numLines }}
                    onClick={ this.onSaveBulkButtonClick.bind(this) }
                    />
            );

            addSection = (
                <div className="SurveyQuestionOutline-addBulk">
                    <Msg tagName="p"
                        id="misc.surveyOutline.option.bulkInstructions"
                        />
                    <textarea
                        value={ this.state.bulkText }
                        onChange={ this.onBulkTextChange.bind(this) }
                        />
                    <Button
                        className="SurveyQuestionOutline-cancelBulkButton"
                        labelMsg="misc.surveyOutline.option.cancelButton"
                        onClick={ this.onOptionCancel.bind(this) }
                        />
                    { saveButton }
                </div>
            );
        }
        else {
            addSection = [
                <Button key="addButton" labelMsg="misc.surveyOutline.option.addButton"
                    className="SurveyQuestionOutline-addButton"
                    onClick={ this.onAddButtonClick.bind(this, 'single') }
                    />,
                <Button key="bulkButton" labelMsg="misc.surveyOutline.option.addBulkButton"
                    className="SurveyQuestionOutline-bulkButton"
                    onClick={ this.onAddButtonClick.bind(this, 'bulk') }
                    />
            ];
        }

        return (
            <div className="SurveyQuestionOutline">
                <Reorderable disabled={ !!this.state.openOption }
                    onReorder={ this.props.onReorder }>
                    { items }
                </Reorderable>
                { addSection }
            </div>
        );
    }

    onOptionTextChange(option, text) {
        if (this.props.onOptionTextChange) {
            this.props.onOptionTextChange(option, text);
        }
    }

    onAddButtonClick(type) {
        this.setState({
            openOption: null,
            bulkText: '',
            adding: type,
        });
    }

    onBulkTextChange(ev) {
        this.setState({
            bulkText: ev.target.value,
        });
    }

    onSaveBulkButtonClick() {
        if (this.props.onOptionsCreate) {
            const lines = this.state.bulkText
                .split('\n')
                .filter(line => Boolean(line));

            this.props.onOptionsCreate(lines);
        }

        this.setState({
            adding: false,
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

    onOptionOpen(o) {
        this.setState({
            openOption: o,
            adding: false,
        });
    }

    onOptionCancel(o) {
        this.setState({
            openOption: null,
            adding: false,
        });
    }

    onNewOptionCancel() {
        this.setState({
            adding: false,
        });
    }
}
