import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';
import IntInput from '../../forms/inputs/IntInput';


export default class RandomTargetTemplate extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.selected && !nextProps.config.size) {
            nextProps.onConfigChange({
                size: 50,
            });
        }
    }

    render() {
        return (
            <AssignmentTemplate type="randomTarget"
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }>

                <IntInput name="size"
                    value={ this.props.config.size }
                    onValueChange={ this.onChange.bind(this) }
                    />
            </AssignmentTemplate>
        );
    }

    componentDidMount() {
        let tags = this.props.tags;

        if (tags && tags.length && !this.props.config.tagId) {
            // Emit default configuration
            this.props.onConfigChange({
                tagId: tags[0].id.toString(),
            });
        }
    }

    onChange(name, val) {
        if (this.props.onConfigChange) {
            this.props.onConfigChange({
                size: val,
            });
        }
    }
}
