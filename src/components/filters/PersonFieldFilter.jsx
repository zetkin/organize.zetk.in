import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterTimeFrameSelect from './FilterTimeFrameSelect';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import Form from '../forms/Form';
import SelectInput from '../forms/inputs/SelectInput';
import TextInput from '../forms/inputs/TextInput';
import DateInput from '../forms/inputs/DateInput';
import filterByOrg from '../../utils/filterByOrg';
import { retrieveFieldTypesForOrganizationTree } from '../../actions/personField';
import { flattenOrganizationsFromState } from '../../utils/flattenOrganizations';


@injectIntl
@connect(state => ({
    fieldTypes: state.personFields.fieldTypes,
    orgList: flattenOrganizationsFromState(state)
}))
export default class PersonFieldFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.onSelectField = this.onSelectField.bind(this);
        this.onSelectTimeframe = this.onSelectTimeframe.bind(this);

        this.state = {
            field: this.props.config.field ? 
                this.props.fieldTypes.items.find(f => f.data.slug == this.props.config.field) : null,
            config: {
                ...this.props.config,
                organizationOption: this.props.config.organizationOption || 'all',
                specificOrganizations: this.props.config.specificOrganizations || [],
            },
        };
    }

    componentDidMount() {
        super.componentDidMount();

        const fieldTypes = this.props.fieldTypes;

        if (!fieldTypes || !fieldTypes.items || !fieldTypes.items.length || !fieldTypes.recursive) {
            this.props.dispatch(retrieveFieldTypesForOrganizationTree());
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        if(this.props.fieldTypes.items.length !== nextProps.fieldTypes.items.length) {
            this.setState({
                field: nextProps.config.field ? 
                    nextProps.fieldTypes.items.find(f => f.data.slug == this.props.config.field) : null,
            })
        }
    }

    renderFilterForm(config) {
        const msg = id => this.props.intl.formatMessage({ id });
        let fieldOptions = {
            '_': msg('filters.personField.selectField'),
        }
        let fieldTypeItems = this.props.fieldTypes.items || [];
        fieldTypeItems = filterByOrg(this.props.orgList, fieldTypeItems, this.state.config);
        fieldOptions = fieldTypeItems.reduce((obj, field) => {
            if(field.data.type !== 'json') {
                obj[field.data.slug] = field.data.title;
            }
            return obj;
        }, fieldOptions);

        let fieldInputs = [];

        if(this.state.field) {
            if(this.state.field.data.type == 'date') {
                fieldInputs = [
                    <FilterTimeFrameSelect key="timeframe"
                        config = { config }
                        future={ true }
                        inlast={ true }
                        labelMsgStem="filters.personField.timeframe"
                        onChange={ this.onSelectTimeframe }
                        />
                ]
            } else {
                fieldInputs = [
                    <TextInput key="search" name="search"
                        labelMsg={ fieldOptions[this.state.field.data.slug] } 
                        initialValue={ config.search }
                        />
                ]
            }
        }

        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,
            <SelectInput key="selectField" name="field"
                options={ fieldOptions } value={ this.state.field ? this.state.field.data.slug : '_' }
                onValueChange={ this.onSelectField }/>,
            <Form key="form" ref="form"
                onValueChange={ this.onConfigChange.bind(this) } >
                { fieldInputs }
            </Form>
        ];
    }

    getConfig() {
        // If text-type field, return config directly
        if(this.state.field && this.state.field.data.type != 'date') {
            let values = this.refs.form.getValues();
            return {
                field: this.state.field.data.slug,
                search: values.search,
                organizationOption: this.state.config.organizationOption,
                specificOrganizations: this.state.config.specificOrganizations,
            }
        } else {
            // If date, config has been set by onSelectTimeframe
            return this.state.config;
        }
    }

    onSelectField(name, value) {
        const field = this.props.fieldTypes.items.find(f => f.data.slug == value);
        if(field.data.type == 'date') {
            this.setState({
                field: field,
                config: {
                    field: field.data.slug,
                    organizationOption: this.state.config.organizationOption,
                    specificOrganizations: this.state.config.specificOrganizations,
                }
            }, this.onConfigChange.bind(this));
        } else {
            this.setState({
                field: field,
                config: {
                    field: field.data.slug,
                    organizationOption: this.state.config.organizationOption,
                    specificOrganizations: this.state.config.specificOrganizations,
                }
            }, this.onConfigChange.bind(this));
        }
    }

    onSelectTimeframe({ after, before }) {
        this.setState({
            config: { 
                field: this.state.field.data.slug,
                after: after, 
                before: before,
                organizationOption: this.state.config.organizationOption,
                specificOrganizations: this.state.config.specificOrganizations,
            }
        }, this.onConfigChange.bind(this));
    }

    onChangeOrganizations(orgState) {
        let config = this.state.config;
        config = Object.assign(config, orgState);
        this.setState({ config  }, () => this.onConfigChange());
    }
}
