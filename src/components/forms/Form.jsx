import React from 'react';
import cx from 'classnames';


export default class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            changedValues: {},
            values: {}
        };
    }

    render() {
        let inputs = this.props.children;
        let classes = cx('Form', this.props.className);

        if (!Array.isArray(inputs)) {
            inputs = [inputs];
        }

        return (
            <form className={ classes }
                onSubmit={ this.onSubmit.bind(this) }>
                <ul>
                {inputs.map(function(input, index) {
                    if (typeof input === 'string') {
                        // Don't modify strings, just add them.
                        let key = 'str' + index;
                        return <li key={ key }>{ input }</li>;
                    }

                    const props = Object.assign({}, input.props);

                    const classes = cx(
                        props.className,
                        'Form-' + props.name
                    );

                    if (props.name !== undefined
                        && !this.state.values[props.name]) {

                        this.state.values[props.name] = props.initialValue;
                    }

                    props.value = this.state.values[props.name] || '';
                    props.onValueChange = this.onValueChange.bind(this);

                    delete props.initialValue;
                    delete props.className;

                    var elem = React.cloneElement(input, props);

                    return (
                        <li className={ classes } key={ index }>
                            { elem }</li>
                    );
                }, this)}
                </ul>
            </form>
        );
    }

    getValues() {
        var values = {};

        for (var key in this.state.values) {
            values[key] = this.state.values[key];
        }

        return values;
    }

    getChangedValues() {
        var values = {};

        for (var key in this.state.changedValues) {
            values[key] = this.state.changedValues[key];
        }

        return values;
    }

    onValueChange(name, value) {
        var changedValues = this.state.changedValues;
        var values = this.state.values;

        values[name] = value;
        changedValues[name] = value;

        this.setState({
            values: values,
            changedValues: changedValues
        });
    }

    onSubmit(ev) {
        if (this.props.onSubmit)
            this.props.onSubmit(ev);

        this.setState({
            changedValues: {}
        });
    }
}

Form.propTypes = {
    className: React.PropTypes.string,
    onSubmit: React.PropTypes.func
};
