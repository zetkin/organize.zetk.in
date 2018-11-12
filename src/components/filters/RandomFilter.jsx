import React from 'react';

import FilterBase from './FilterBase';
import IntInput from '../forms/inputs/IntInput';
import SelectInput from '../forms/inputs/SelectInput';
import Button from '../misc/Button';
import makeRandomString from '../../utils/makeRandomString';
import { injectIntl } from 'react-intl';

@injectIntl
export default class RandomFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            amount: props.config.amount || 20,
            seed: props.config.seed || makeRandomString(6),
            unit: props.config.unit || 'people'
        };
    }

    componentReceivedProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState({
                amount: nextProps.config.amount,
                seed: nextProps.config.seed,
                unit: nextProps.config.unit,
            });
        }
    }

    renderFilterForm(config) {
        const { unit, amount } = this.state;
        const msg = id => this.props.intl.formatMessage({ id });
        const units = {
            'people': msg('filters.random.units.people'),
            'percentage': msg('filters.random.units.percentage'),
        };

        return [
            <IntInput key="size" name="size"
                className="RandomFilter__size"
                labelMsg="filters.random.size"
                value={ amount }
                onValueChange={ this.onSizeChange }
            />,
            <SelectInput key="unit" name="unit"
                className="RandomFilter__unit"
                labelMsg="filters.random.units.label"
                options={ units }
                value={ this.state.unit }
                onValueChange={ this.onUnitChange }
            />,
            <div className="RandomFilter__btnWrapper">
                <Button
                    labelMsg="filters.random.randomize"
                    onClick={ this.onSeedChange }
                />
            </div>
        ];
    }

    getConfig() {
        const { amount, seed, unit } = this.state;
        // We're doing this because percentages are interpeted
        // as fractions in the backend.
        const size = unit === 'percentage'
            ? parseFloat('0.' + amount)
            : amount;

        return { size, amount, seed, unit };
    }

    // If they want to extract all the people, they should use
    // the 'Everyone' filter.
    capPercentualValue = ({ amount, unit }) => {
        unit = unit || this.state.unit;
        amount = amount || this.state.amount;

        if (amount >= 100) {
            amount = 99;
            this.setState({ amount });
        }

        return amount;
    }

    onSizeChange = (_, amount) => {
        amount = parseInt(amount);
        if (this.state.unit === "percentage") {
            amount = this.capPercentualValue({ amount });
        }

        this.setState({ amount }, () => this.onConfigChange());
    }

    onUnitChange = (_, unit) => {
        if (unit === "percentage") {
            this.capPercentualValue({ unit });
        }

        this.setState({ unit }, () => this.onConfigChange());
    }

    onSeedChange = () => {
        const seed = makeRandomString(6);
        this.setState({ seed }, () => this.onConfigChange());
    }
}
