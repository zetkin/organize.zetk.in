import React from 'react/addons';
import cx from 'classnames';

import InputBase from './InputBase';


export default class RelSelectInput extends InputBase {
    constructor(props) {
        super(props);

        this.state = {
            inputFocused: false,
            focusedIndex: undefined,
            inputValue: undefined
        };
    }

    componentWillReceiveProps(newProps) {
        if ('value' in newProps) {
            this.setState({
                focusedIndex: undefined,
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

        var inputValue = this.state.inputValue;
        if (inputValue === undefined) {
            inputValue = (selected? selected[labelField] : '');
        }

        const classes = cx({
            'relselectinput': true,
            'focused': this.state.inputFocused
        });

        const filteredObjects = this.getFilteredObjects();

        const createOptionClasses = cx({
            'relselectinput-create': true,
            'focused': (this.state.focusedIndex == filteredObjects.length)
        });

        return (
            <div className={ classes }>
                <input type="text" ref="input" value={ inputValue }
                    onChange={ this.onInputChange.bind(this) }
                    onFocus={ this.onFocus.bind(this) }
                    onKeyDown={ this.onKeyDown.bind(this) }
                    onBlur={ this.onBlur.bind(this) }/>
                <ul>
                {filteredObjects.map(function(obj, idx) {
                    const value = obj[valueField];
                    const label = obj[labelField];
                    const classes = cx({
                        'selected': (obj == selected),
                        'focused': (idx === this.state.focusedIndex)
                    });

                    return (
                        <li key={ value } className={ classes }
                            onMouseDown={ this.onClickOption.bind(this, obj) }>
                            { label }
                        </li>
                    );
                }, this)}
                    <li key="create" className={ createOptionClasses }
                        onMouseDown={ this.onClickCreate.bind(this) }>
                        Create <em>{ this.state.inputValue || 'new' }...</em>
                    </li>
                </ul>
            </div>
        );
    }

    getFilteredObjects() {
        // Filter objects based on input value, unless it's undefined or
        // an empty string in which case all objects should be displayed.
        const labelField = this.props.labelField;
        return this.props.objects.filter(o =>
            (!this.state.inputValue || o[labelField].toLowerCase()
                .indexOf(this.state.inputValue.toLowerCase()) >= 0));
    }

    onInputChange(ev) {
        this.setState({
            focusedIndex: undefined,
            inputValue: ev.target.value
        });
    }

    onKeyDown(ev) {
        const focusedIndex = this.state.focusedIndex;
        const objects = this.getFilteredObjects();
        const objectCount = objects.length;

        if (ev.keyCode == 40) {
            // User pressed down, increment or set to zero if undefined
            this.setState({
                focusedIndex: Math.min(objectCount,
                    (focusedIndex === undefined)? 0 : focusedIndex + 1)
            });

            ev.preventDefault();
        }
        else if (ev.keyCode == 38) {
            // User pressed up, decrement or set to last if undefined
            this.setState({
                focusedIndex: Math.max(0, (focusedIndex === undefined)?
                    objectCount : focusedIndex - 1)
            });

            ev.preventDefault();
        }
        else if (ev.keyCode == 13) {
            if (focusedIndex < objectCount) {
                // User pressed enter and has selected an option index
                const objects = this.getFilteredObjects();
                this.selectObject(objects[focusedIndex]);
            }
            else if (focusedIndex == objectCount) {
                // User pressed enter on the "create option"
                this.createObject();
            }

            // Blur field and prevent form from being submitted
            React.findDOMNode(this.refs.input).blur();
            ev.preventDefault();
        }
    }

    onClickOption(obj) {
        this.selectObject(obj);
    }

    onClickCreate() {
        this.createObject();
    }

    onFocus(ev) {
        this.setState({
            inputValue: undefined,
            inputFocused: true
        });
    }

    onBlur(ev) {
        this.setState({
            inputFocused: false
        });
    }

    createObject() {
        if (this.props.onCreate) {
            this.props.onCreate(this.state.inputValue);
        }
    }

    selectObject(obj) {
        if (this.props.onValueChange) {
            const name = this.props.name;
            const value = obj[this.props.valueField];

            this.props.onValueChange(name, value);
        }
    }
}

RelSelectInput.propTypes = {
    objects: React.PropTypes.array.isRequired,
    valueField: React.PropTypes.string,
    labelField: React.PropTypes.string,
    onCreate: React.PropTypes.func
};

RelSelectInput.defaultProps = {
    valueField: 'id',
    labelField: 'title'
};
