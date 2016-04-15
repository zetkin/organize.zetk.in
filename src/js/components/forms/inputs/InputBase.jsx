import React from 'react';


export default class InputBase extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={ this.props.className }>
                <label>{ this.props.label }</label>
                { this.renderInput() }
            </div>
        );
    }

    onChange(ev) {
        this.props.onValueChange(this.props.name, ev.target.value);
    }
}

InputBase.propTypes = {
    name: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    initialValue: React.PropTypes.string,
    className: React.PropTypes.string
}
