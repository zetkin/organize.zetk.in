import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default class TagTargetTemplate extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.selected) {
            let tags = nextProps.tags;

            if (tags && tags.length && !nextProps.config.tagId) {
                // Emit default configuration
                nextProps.onConfigChange({
                    tagId: tags[0].id.toString(),
                });
            }
        }
    }
    render() {
        return (
            <AssignmentTemplate type="tagTarget"
                messagePath="panes.addCallAssignment.templates"
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }>

                <select name="tag" value={ this.props.config.tagId }
                    onChange={ this.onChange.bind(this) }>
                { this.props.tags.map(c => (
                    <option key={ c.id } value={ c.id.toString() }>
                        { c.title }
                    </option>
                )) }
                </select>
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

    onChange(ev) {
        if (this.props.onConfigChange) {
            this.props.onConfigChange({
                tagId: ev.target.value,
            });
        }
    }
}
