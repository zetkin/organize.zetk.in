import ReactDOM from 'react-dom';
import React from 'react';

import InputBase from './InputBase';


export default class TimeInput extends InputBase {
    constructor(props) {
        super(props);

        this.state = {
            hourFocused: false,
            minuteFocused: false
        };
    }

    renderInput() {
        const valueFields = this.props.value.split(':');
        var hour = parseInt(valueFields[0]);
        var minute = parseInt(valueFields[1]);

        if (!this.state.hourFocused) hour = zeroPad(hour);
        if (!this.state.minuteFocused) minute = zeroPad(minute);

        return (
            <div className="TimeInput">
                <input type="text" pattern="[0-9]{1,2}"
                    ref="hourInput" value={ hour }
                    onFocus={ this.onHourFocus.bind(this) }
                    onBlur={ this.onHourBlur.bind(this) }
                    onKeyDown={ this.onHourKeyDown.bind(this) }
                    onChange={ this.onChangeHour.bind(this) }/>
                :
                <input type="text" pattern="[0-9]{1,2}"
                    ref="minuteInput" value={ minute }
                    onFocus={ this.onMinuteFocus.bind(this) }
                    onBlur={ this.onMinuteBlur.bind(this) }
                    onKeyDown={ this.onMinuteKeyDown.bind(this) }
                    onChange={ this.onChangeMinute.bind(this) }/>
            </div>
        );
    }

    onHourFocus(ev) {
        const hourDOMNode = ReactDOM.findDOMNode(this.refs.hourInput);
        hourDOMNode.select();
    }

    onHourBlur(ev) {
        this.setState({
            hourFocused: false
        });
    }

    onMinuteFocus(ev) {
        const minuteDOMNode = ReactDOM.findDOMNode(this.refs.minuteInput);
        minuteDOMNode.select();
    }

    onMinuteBlur(ev) {
        this.setState({
            minuteFocused: false
        });
    }

    onChangeHour(ev) {
        const value = parseInt(ev.target.value);
        this.setHour(value);

        if (ev.target.value.toString().length > 1) {
            const minDOMNode = ReactDOM.findDOMNode(this.refs.minuteInput);
            minDOMNode.focus();
        }
        else {
            this.setState({
                hourFocused: true
            });
        }
    }

    onChangeMinute(ev) {
        const value = parseInt(ev.target.value);

        this.setState({
            minuteFocused: true
        });

        this.setMinute(value);
    }

    onHourKeyDown(ev) {
        const value = parseInt(ev.target.value);

        if (ev.keyCode == 38) {
            this.setHour(value + 1);
            ev.preventDefault();
        }
        else if (ev.keyCode == 40) {
            this.setHour(value - 1);
            ev.preventDefault();
        }
        else {
        }
    }

    onMinuteKeyDown(ev) {
        const value = ev.target.value;

        switch (ev.keyCode) {
            case 38:
                this.setMinute(value + 1);
                ev.preventDefault();
                break;
            case 40:
                this.setMinute(value - 1);
                ev.preventDefault();
                break;
        }
    }

    setHour(hour) {
        const valueFields = this.props.value.split(':')

        if (isNaN(hour)) {
            hour = 0;
        }
        else if (hour < 0) {
            hour = 23;
        }
        else if (hour > 23) {
            hour = 0;
        }

        valueFields[0] = zeroPad(hour);

        const value = valueFields.join(':');
        this.props.onValueChange(this.props.name, value);
    }

    setMinute(minute) {
        const valueFields = this.props.value.split(':')

        if (isNaN(minute)) {
            minute = 0;
        }
        else if (minute < 0) {
            minute = 59;
        }
        else if (minute > 59) {
            minute = 0;
        }

        valueFields[1] = zeroPad(minute);

        const value = valueFields.join(':');
        this.props.onValueChange(this.props.name, value);
    }
}

function zeroPad(n) {
    return (n<10)? '0' + n : n.toString();
}
