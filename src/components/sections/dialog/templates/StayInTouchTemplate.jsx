import React from 'react';
import { injectIntl } from 'react-intl';

import AssignmentTemplate from './AssignmentTemplate';


@injectIntl
export default class StayInTouchTemplate extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            interval: '180',
        };
    }

    render() {
        const formatMessage = id => this.props.intl.formatMessage({ id });
        const msgBase = 'panes.callAssignmentTemplate.templates.stayintouch';

        let options = {
            '90': formatMessage(msgBase + '.intervalSelect.three'),
            '180': formatMessage(msgBase + '.intervalSelect.six'),
            '365': formatMessage(msgBase + '.intervalSelect.twelve'),
        };

        let configValues = {
            intervalSelect: (
                <select name="interval" value={ this.state.interval }
                    onChange={ this.onChange.bind(this) }>
                { Object.keys(options).map(key => (
                    <option key={ key } value={ key }>
                        { options[key] }
                    </option>
                )) }
                </select>
            )
        };

        return (
            <AssignmentTemplate type="stayintouch"
                configValues={ configValues }
                onCreate={ this.onCreate.bind(this) }/>
        );
    }

    onChange(ev) {
        this.setState({
            interval: ev.target.value,
        });
    }

    onCreate(type) {
        let config = {
            interval: this.state.interval,
        };

        this.props.onCreate(type, config);
    }
}
