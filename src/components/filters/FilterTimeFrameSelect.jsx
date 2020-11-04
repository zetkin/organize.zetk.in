import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import SelectInput from '../forms/inputs/SelectInput';
import DateInput from '../forms/inputs/DateInput';
import IntInput from '../forms/inputs/IntInput';


@injectIntl
export default class FilterTimeFrameSelect extends React.Component {
    static defaultProps = {
        future: true,
        inlast: true,
    }

    constructor(props) {
        super(props);

        this.state = stateFromConfig(props.config);
    }

    render() {
        let timeframe = this.state.timeframe;

        const msg = id => this.props.intl.formatMessage({ id: this.props.labelMsgStem + '.' + id });

        const DATE_OPTIONS = {
            'any': msg('options.any'),
            'future': msg('options.future'),
            'past': msg('options.past'),
            'after': msg('options.after'),
            'before': msg('options.before'),
            'between': msg('options.between'),
            'inlast': msg('options.inlast'),
        };

        if (!this.props.future) {
            delete DATE_OPTIONS['future'];
        }
        if (!this.props.inlast) {
            delete DATE_OPTIONS['inlast'];
        }

        let daysInput = null;
        if (timeframe == 'inlast') {
            daysInput = (
                <div className="FilterTimeFrameSelect-days">
                    <IntInput key="days" name="days" value={ this.state.days }
                        onValueChange={ this.onChangeSimpleField.bind(this) }/>
                    <Msg tagName="label" id="filters.personField.labels.days"/>
                </div>
            );
        }

        let afterInput = null;
        if (timeframe == 'after' || timeframe == 'between') {
            afterInput = (
                <DateInput key="after" name="after"
                    className="CampaignFilter-after"
                    value={ this.state.after }
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>
            );
        }

        let beforeInput = null;
        if (timeframe == 'before' || timeframe == 'between') {
            beforeInput = (
                <DateInput key="before" name="before"
                    className="CampaignFilter-before"
                    value={ this.state.before }
                    onValueChange={ this.onChangeSimpleField.bind(this) }/>
            );
        }

        return (
            <div className="FilterTimeFrameSelect">
                <SelectInput key="timeframe" name="timeframe"
                    labelMsg={ this.props.labelMsgStem + '.label' }
                    options={ DATE_OPTIONS } value={ this.state.timeframe }
                    onValueChange={ this.onSelectTimeframe.bind(this) }/>

                { afterInput }
                { beforeInput }
                { daysInput }
            </div>
        );
    }

    onSelectTimeframe(name, value) {
        let before = undefined;
        let after = undefined;
        let days = undefined;
        let today = Date.create();
        let todayStr = today.format('{yyyy}-{MM}-{dd}');

        switch (value) {
            case 'future':
                after = 'now';
                break;
            case 'past':
                before = 'now';
                break;
            case 'after':
                after = todayStr;
                break;
            case 'before':
                before = todayStr;
                break;
            case 'between':
                after = todayStr;
                before = today.addDays(30).format('{yyyy}-{MM}-{dd}');
                break;
            case 'inlast':
                days = this.state.days || '30';
                after = `-${days}d`;
        }

        this.setState({ timeframe: value, before, after, days }, () =>
            this.dispatchChange());
    }

    onChangeSimpleField(name, value) {
        let stateChange = { [name]: value };
        if(name == 'days') {
            stateChange['after'] = `-${value}d`;
        }

        this.setState(stateChange, () =>
            this.dispatchChange());
    }

    dispatchChange() {
        if (this.props.onChange) {
            this.props.onChange({
                after: this.state.after,
                before: this.state.before,
            });
        }
    }
}

function stateFromConfig(config) {
    const state = {
        after: config.after,
        before: config.before,
        timeframe: 'any',
    };

    let inlast;
    if(config.after) {
        inlast = config.after.match(/^-(\d+)d$/)
    }

    if (config.before && config.after) {
        state.timeframe = 'between';
    }
    else if (config.before == 'now') {
        state.timeframe = 'past';
    }
    else if (config.before) {
        state.timeframe = 'before';
    }
    else if (config.after == 'now') {
        state.timeframe = 'future';
    }
    else if(config.after && inlast) {
        state.timeframe = 'inlast';
        state.days = inlast[1];
    }
    else if (config.after) {
        state.timeframe = 'after';
    }

    return state;
}
