import React from 'react';

import Button from '../Button';
import Reorderable from '../reorderable/Reorderable';
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
            openOption: null,
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
                    onTextChange={ this.onOptionTextChange.bind(this, o) }
                    />
            );
        });

        let addSection;

        if (this.state.adding) {
            addSection = (
                <SurveyQuestionOption
                    option={{ text: '' }} open={ true }
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

    onAddButtonClick() {
        this.setState({
            openOption: null,
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

    onOptionOpen(o) {
        this.setState({
            openOption: o,
            adding: false,
        });
    }

    onOptionCancel(o) {
        this.setState({
            openOption: null,
        });
    }

    onNewOptionCancel() {
        this.setState({
            adding: false,
        });
    }
}
