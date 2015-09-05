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

    componentDidMount() {
        const listDOMNode = React.findDOMNode(this.refs.objectList);
        listDOMNode.addEventListener('mousewheel', onWheelStopPropagation);
    }

    componentWillUnmount() {
        const listDOMNode = React.findDOMNode(this.refs.objectList);
        listDOMNode.removeEventListener('mousewheel', onWheelStopPropagation);
    }

    renderInput() {
        const value = this.props.value;
        const objects = this.props.objects;
        const showEditLink = this.props.showEditLink;
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

        this.values = filteredObjects.map(o => o[valueField]);

        var createOption = null;
        if (this.props.showCreateOption) {
            const createOptionClasses = cx({
                'relselectinput-create': true,
                'focused': (this.state.focusedIndex == this.values.length)
            });

            createOption = (
                <li key="create" className={ createOptionClasses }
                    onMouseDown={ this.onClickCreate.bind(this) }>
                    Create <em>{ this.state.inputValue || 'new' }...</em>
                </li>
            );

            this.values.push('+');
        }

        var nullOption = null;
        if (this.props.allowNull) {
            const nullOptionClasses = cx({
                'relselectinput-null': true,
                'focused': (this.state.focusedIndex == this.values.length)
            });

            nullOption = (
                <li key="null" className={ nullOptionClasses }
                    onMouseDown={ this.onClickNull.bind(this) }>
                    { this.props.nullLabel }
                </li>
            );

            this.values.push('-');
        }

        return (
            <div className={ classes }>
                <input type="text" ref="input" value={ inputValue }
                    onChange={ this.onInputChange.bind(this) }
                    onFocus={ this.onFocus.bind(this) }
                    onKeyDown={ this.onKeyDown.bind(this) }
                    onBlur={ this.onBlur.bind(this) }/>
                <ul ref="objectList">
                {filteredObjects.map(function(obj, idx) {
                    const value = obj[valueField];
                    const label = obj[labelField];
                    const classes = cx({
                        'selected': (obj == selected),
                        'focused': (idx === this.state.focusedIndex)
                    });

                    var editLink = null;
                    if (showEditLink) {
                        editLink = <a className="relselectinput-editlink"
                            onMouseDown={ this.onClickEdit.bind(this, obj) }>
                            Edit</a>;
                    }

                    return (
                        <li key={ value } className={ classes }
                            onMouseDown={ this.onClickOption.bind(this, obj) }>
                            { label }
                            { editLink }
                        </li>
                    );
                }, this)}
                    { nullOption }
                    { createOption }
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

        const listDOMNode = React.findDOMNode(this.refs.objectList);
        listDOMNode.scrollTop = 0;
    }

    onKeyDown(ev) {
        const focusedIndex = this.state.focusedIndex;
        const objects = this.getFilteredObjects();
        const valueCount = this.values.length;
        const maxIndex = valueCount - 1;

        if (ev.keyCode == 40) {
            // User pressed down, increment or set to zero if undefined
            this.setState({
                focusedIndex: Math.min(maxIndex,
                    (focusedIndex === undefined)? 0 : focusedIndex + 1)
            });

            ev.preventDefault();
        }
        else if (ev.keyCode == 38) {
            // User pressed up, decrement or set to last if undefined
            this.setState({
                focusedIndex: Math.max(0, (focusedIndex === undefined)?
                    maxIndex : focusedIndex - 1)
            });

            ev.preventDefault();
        }
        else if (ev.keyCode == 13) {
            if (focusedIndex >= 0 && focusedIndex < valueCount) {
                const value = this.values[focusedIndex];
                if (value == '+') {
                    // User pressed enter on the "create option"
                    this.createObject();
                }
                else if (value == '-') {
                    this.selectNull();
                }
                else {
                    this.selectValue(value);
                }
            }

            // Blur field and prevent form from being submitted
            React.findDOMNode(this.refs.input).blur();
            ev.preventDefault();
        }
        else if (ev.keyCode == 27) {
            const inputDOMNode = React.findDOMNode(this.refs.input);
            inputDOMNode.blur();
        }
    }

    onClickOption(obj) {
        const valueField = this.props.valueField;
        this.selectValue(obj[valueField]);
    }

    onClickEdit(obj) {
        if (this.props.onEdit) {
            this.props.onEdit(obj);
        }
    }

    onClickCreate() {
        this.createObject();
    }

    onClickNull() {
        this.selectNull();
    }

    onFocus(ev) {
        this.setState({
            inputValue: undefined,
            inputFocused: true
        });
    }

    onBlur(ev) {
        const listDOMNode = React.findDOMNode(this.refs.objectList);
        listDOMNode.scrollTop = 0;

        this.setState({
            inputFocused: false
        });
    }

    createObject() {
        if (this.props.onCreate) {
            this.props.onCreate(this.state.inputValue);
        }
    }

    selectValue(value) {
        if (this.props.onValueChange) {
            const name = this.props.name;

            this.props.onValueChange(name, value);
        }
    }

    selectNull() {
        if (this.props.onValueChange) {
            this.props.onValueChange(name, null);
        }
    }
}

RelSelectInput.propTypes = {
    objects: React.PropTypes.array.isRequired,
    valueField: React.PropTypes.string,
    labelField: React.PropTypes.string,
    nullLabel: React.PropTypes.string,
    showCreateOption: React.PropTypes.bool,
    showEditLink: React.PropTypes.bool,
    allowNull: React.PropTypes.bool,
    onValueChange: React.PropTypes.func,
    onCreate: React.PropTypes.func,
    onEdit: React.PropTypes.func
};

RelSelectInput.defaultProps = {
    showCreateOption: true,
    showEditLink: false,
    valueField: 'id',
    labelField: 'title',
    nullLabel: 'None'
};


function onWheelStopPropagation(ev) {
    ev.stopPropagation();
}
