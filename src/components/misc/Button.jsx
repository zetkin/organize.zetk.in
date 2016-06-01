import React from 'react';


export default class Button extends React.Component {
    static propTypes = {
        label: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func,
    };

    render() {
        return (
            <button className="Button"
                onClick={ this.props.onClick }>
                { this.props.label }
            </button>
        );
    }
}
