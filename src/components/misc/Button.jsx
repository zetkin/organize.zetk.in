import React from 'react';


export default class Button extends React.Component {
    static propTypes = {
        label: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func,
        className: React.PropTypes.string,
    };

    render() {
        let className = "Button " + this.props.className;
        return (
            <button className={ className }
                onClick={ this.props.onClick }>
                { this.props.label }
            </button>
        );
    }
}
