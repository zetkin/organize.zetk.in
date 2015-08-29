import React from 'react/addons';
import cx from 'classnames';

import InputBase from './InputBase';


export default class RelSelectInput extends InputBase {
    constructor(props) {
        super(props);

        this.state = {
            focused: false,
            inputValue: undefined
        };
    }

    componentWillReceiveProps(newProps) {
        if ('value' in newProps) {
            this.setState({
                inputValue: undefined
            });
        }
    }

    renderInput() {
        const value = this.props.value;
        const objects = this.props.objects;
        const valueField = this.props.valueField;
        const labelField = this.props.labelField;
        const selected = (value && objects)?
            objects.find(o => o[valueField] == value) : null;

        // Filter objects based on input value, unless it's undefined or
        // an empty string in which case all objects should be displayed.
        var inputValue = this.state.inputValue;
        var filteredObjects = objects.filter(o =>
            (!inputValue || o[labelField].toLowerCase()
                .indexOf(inputValue.toLowerCase()) >= 0));

        if (inputValue === undefined) {
            inputValue = (selected? selected[labelField] : '');
        }

        const classes = cx({
            'relselectinput': true,
            'focused': this.state.focused
        });

        return (
            <div className={ classes }>
                <input type="text" value={ inputValue }
                    onChange={ this.onInputChange.bind(this) }
                    onFocus={ this.onFocus.bind(this) }
                    onBlur={ this.onBlur.bind(this) }/>
                <ul>
                {filteredObjects.map(function(obj) {
                    const value = obj[valueField];
                    const label = obj[labelField];
                    const classes = cx({
                        'selected': (obj == selected)
                    });

                    return (
                        <li key={ value } className={ classes }
                            onMouseDown={ this.onClickOption.bind(this, obj) }>
                            { label }
                        </li>
                    );
                }, this)}
                </ul>
            </div>
        );
    }

    onInputChange(ev) {
        this.setState({
            inputValue: ev.target.value
        });
    }

    onClickOption(obj) {
        if (this.props.onValueChange) {
            const name = this.props.name;
            const value = obj[this.props.valueField];

            this.props.onValueChange(name, value);
        }
    }

    onFocus(ev) {
        this.setState({
            inputValue: undefined,
            focused: true
        });
    }

    onBlur(ev) {
        this.setState({
            focused: false
        });
    }
}

RelSelectInput.propTypes = {
    objects: React.PropTypes.array.isRequired,
    valueField: React.PropTypes.string,
    labelField: React.PropTypes.string
};

RelSelectInput.defaultProps = {
    valueField: 'id',
    labelField: 'title'
};
