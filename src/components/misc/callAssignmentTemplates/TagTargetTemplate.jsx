import React from 'react';

import AssignmentTemplate from './AssignmentTemplate';


export default class TagTargetTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tagId: undefined,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tags && nextProps.tags.length) {
            this.setState({
                tagId: nextProps.tags[0].id.toString(),
            });
        }
    }

    render() {
        let configValues = {
            tagSelect: (
                <select name="tag" value={ this.state.tagId }
                    onChange={ this.onChange.bind(this) }>
                { this.props.tags.map(c => (
                    <option key={ c.id } value={ c.id.toString() }>
                        { c.title }
                    </option>
                )) }
                </select>
            )
        };

        return (
            <AssignmentTemplate type="tagTarget"
                configValues={ configValues }
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }
                onCreate={ this.onCreate.bind(this) }/>
        );
    }

    onChange(ev) {
        this.setState({
            tagId: ev.target.value,
        });
    }

    onCreate(type) {
        if (this.props.onCreate) {
            let tags = this.props.tags;
            let config = {
                tag: tags.find(c =>
                    c.id.toString() == this.state.tagId)
            };

            this.props.onCreate(type, config);
        }
    }
}
