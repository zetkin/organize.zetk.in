import React from 'react';
import { injectIntl } from 'react-intl';

import AssignmentTemplate from './AssignmentTemplate';


@injectIntl
export default class StayInTouchTemplate extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (nextProps.selected && !nextProps.config.interval) {
            // Emit default configuration
            nextProps.onConfigChange({
                interval: '180',
            });
        }
    }

    render() {
        const formatMessage = id => this.props.intl.formatMessage({ id });
        const msgBase = 'panes.addCallAssignment.templates.stayintouch';

        let options = {
            '90': formatMessage(msgBase + '.intervalSelect.three'),
            '180': formatMessage(msgBase + '.intervalSelect.six'),
            '365': formatMessage(msgBase + '.intervalSelect.twelve'),
        };

        return (
            <AssignmentTemplate type="stayintouch"
                selected={ this.props.selected }
                onSelect={ this.props.onSelect }>
                <select name="interval" value={ this.props.config.interval }
                    onChange={ this.onChange.bind(this) }>
                { Object.keys(options).map(key => (
                    <option key={ key } value={ key }>
                        { options[key] }
                    </option>
                )) }
                </select>
            </AssignmentTemplate>
        );
    }

    onChange(ev) {
        if (this.props.onConfigChange) {
            this.props.onConfigChange({
                interval: ev.target.value,
            });
        }
    }
}
