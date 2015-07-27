import React from 'react/addons';


export default class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            changedValues: {},
            values: {}
        };
    }

    render() {
        var inputs = this.props.children;

        if (!Array.isArray(inputs)) {
            inputs = [inputs];
        }

        return (
            <form onSubmit={ this.onSubmit.bind(this) }>
                <ul>
                {inputs.map(function(input, index) {
                    var props = input.props;

                    if (props.name !== undefined
                        && !this.state.values.hasOwnProperty(props.name)) {

                        this.state.values[props.name] = props.initialValue;
                    }

                    props.value = this.state.values[props.name]
                    props.onValueChange = this.onValueChange.bind(this);
                    delete props.initialValue;

                    var elem = React.cloneElement(input, props);

                    return <li key={ index }>{ elem }</li>;
                }, this)}
                </ul>
            </form>
        );
    }

    getValues() {
        return this.state.values;
    }

    getChangedValues() {
        return this.state.changedValues;
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
    onSubmit: React.PropTypes.func
};
