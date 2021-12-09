import React from 'react';

import FilterBase from './FilterBase';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import IntInput from '../forms/inputs/IntInput';
import SelectInput from '../forms/inputs/SelectInput';
import Button from '../misc/Button';
import makeRandomString from '../../utils/makeRandomString';
import { injectIntl } from 'react-intl';

@injectIntl
export default class RandomFilter extends FilterBase {
    constructor(props) {
        super(props);

        const { amount, seed, unit, organizationOption, specificOrganizations } = this.mapConfigToState(props.config);
        this.state = {
            amount: amount || 20,
            seed: seed || makeRandomString(6),
            unit: unit || 'people',
            organizationOption: organizationOption || 'all',
            specificOrganizations: specificOrganizations || [],
        };
    }

    shouldComponentUpdate = (_, nextState) => nextState !== this.state;

    componentWillReceiveProps({ config }) {
        const { state, mapConfigToState } = this;
        const mappedState = mapConfigToState(config);

        // We can't simply compare the objects for diffs with === because
        // our data becomes mutable via mapConfigToState
        for (let key in state) {
            if (state[key] !== mappedState[key]) {
                this.setState(mappedState)
            }
        }
    }

    // We use percentages in the frontend
    // e.g 0.7 => 70%
    mapConfigToState = config => {
        const { size, seed } = config;
        const unit = size === 0 && this.state
            ? this.state.unit
            : (size > 0 && size < 1) ? 'percentage' : 'people';
        const amount = Math.round(size * (unit === 'percentage' ? 100 : 1))

        return { 
            amount,
            unit,
            seed,
            organizationOption: config.organizationOption,
            specificOrganizations: config.specificOrganizations,
        }
    }

    // We use fractions in the backend
    // e.g 70% => 0.7
    mapStateToConfig = () => {
        const { 
            amount, 
            seed, 
            unit, 
            organizationOption, 
            specificOrganizations } = this.state;
        const size = !Number.isNaN(amount)
            ? amount / (unit === 'percentage' ? 100 : 1)
            : 0;

        return {
            size,
            seed,
            organizationOption,
            specificOrganizations,
        };
    }

    renderFilterForm(config) {
        const { unit, amount } = this.state;
        const msg = id => this.props.intl.formatMessage({ id });
        const units = {
            people: msg('filters.random.units.people'),
            percentage: msg('filters.random.units.percentage'),
        };

        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,
            <IntInput key="size" name="size"
                className="RandomFilter-size"
                labelMsg="filters.random.size"
                value={ amount }
                onValueChange={ this.onSizeChange }
            />,
            <SelectInput key="unit" name="unit"
                className="RandomFilter-unit"
                labelMsg="filters.random.units.label"
                options={ units }
                value={ unit }
                onValueChange={ this.onUnitChange }
            />,
            <div key="seed" className="RandomFilter-btnWrapper">
                <Button
                    labelMsg="filters.random.randomize"
                    onClick={ this.onSeedChange }
                />
            </div>
        ];
    }

    capPercentualValue = amount => {
        const { amount: oldAmount } = this.state;
        if (amount >= 100) {
            amount = oldAmount < 100
                ? oldAmount
                : 99;
        }

        return amount;
    }

    getConfig = () => this.mapStateToConfig();

    onSizeChange = (_, amount) => {
        amount = parseInt(amount);

        if (this.state.unit === 'percentage') {
            amount = this.capPercentualValue(amount);
        }

        this.setState({ amount }, () => this.onConfigChange());
    }

    onUnitChange = (_, unit) => {
        let { amount } = this.state;

        if (unit === 'percentage') {
            amount = this.capPercentualValue(amount);
        }

        this.setState({ unit, amount }, () => this.onConfigChange());
    }

    onSeedChange = () => {
        const seed = makeRandomString(6);
        this.setState({ seed }, () => this.onConfigChange());
    }
}
