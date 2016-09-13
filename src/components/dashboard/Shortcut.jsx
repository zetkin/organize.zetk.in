import React from 'react';


export default class Shortcut extends React.Component {
    static propTypes = {
        label: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func,
    };

    render() {
        return (
            <a onClick={ this.props.onClick }>
                { this.props.label }</a>
        );
    }
}
