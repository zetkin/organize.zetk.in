import React from 'react/addons';
import cx from 'classnames';

import InputBase from './InputBase';


export default class RelSelectInput extends InputBase {
    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };
    }

    renderInput() {
        const value = this.props.value;
        const objects = this.props.objects;
        const valueField = this.props.valueField;
        const labelField = this.props.labelField;
        const selected = (value && objects)?
            objects.find(o => o[valueField] == value) : null;
        const selectedLabel = selected? selected[labelField] : '';

        const classes = cx({
            'relselectinput': true,
            'focused': this.state.focused
        });

        return (
            <div className={ classes }>
                <input type="text" value={ selectedLabel }
                    onFocus={ this.onFocus.bind(this) }
                    onBlur={ this.onBlur.bind(this) }/>
                <ul>
                {objects.map(function(obj) {
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

    onClickOption(obj) {
        console.log('clicked', obj);
        if (this.props.onValueChange) {
            const name = this.props.name;
            const value = obj[this.props.valueField];

            this.props.onValueChange(name, value);
        }
    }

    onFocus(ev) {
        this.setState({
            focused: true
        });
    }

    onBlur(ev) {
        console.log('blurred');
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
