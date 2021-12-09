import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import FilterOrganizationSelect from './FilterOrganizationSelect';
import SelectInput from '../forms/inputs/SelectInput';
import IntInput from '../forms/inputs/IntInput';
import TagCloud from '../misc/tagcloud/TagCloud';
import { retrievePersonTagsRecursive } from '../../actions/personTag';
import { createSelection } from '../../actions/selection';
import { getListItemById } from '../../utils/store';


@connect(state => ({ personTags: state.personTags }))
@injectIntl
export default class PersonTagsFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            condition: props.config.condition || 'all',
            tags: props.config.tags || [],
            min_matching: props.config.min_matching || 2,
            organizationOption: props.config.organizationOption || 'all',
            specificOrganizations: props.config.specificOrganizations || [],
        };
    }

    componentReceivedProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState({
                condition: nextProps.config.condition,
                tags: nextProps.config.tags,
                organizationOption: nextProps.config.organizationOption,
                specificOrganizations: nextProps.config.specificOrganizations,
            });
        }
    }

    componentDidMount() {
        super.componentDidMount();

        let tagList = this.props.personTags.tagList;

        if ((tagList.items.length == 0 || tagList.recursive) && !tagList.isPending) {
            this.props.dispatch(retrievePersonTagsRecursive());
        }
    }

    renderFilterForm(config) {
        const msg = id => this.props.intl.formatMessage({ id });
        const CONDITION_OPTIONS = {
            'all': msg('filters.personTags.opOptions.all'),
            'any': msg('filters.personTags.opOptions.any'),
            'some': msg('filters.personTags.opOptions.some'),
            'none': msg('filters.personTags.opOptions.none'),
        };

        let tagList = this.props.personTags.tagList;
        let tags = this.state.tags
            .map(tagId => getListItemById(tagList, tagId))
            .filter(tagItem => tagItem)
            .map(tagItem => tagItem.data);

        const some = this.state.condition === 'some' ? 
                <IntInput key="some" value={ this.state.min_matching }
                    labelMsg="filters.personTags.someLabel"
                    onValueChange={ this.onMinMatchingChange.bind(this) } /> : null;

        return [
            <FilterOrganizationSelect
                config={ config } 
                openPane={ this.props.openPane }
                onChangeOrganizations={ this.onChangeOrganizations.bind(this) }
                />,
            <SelectInput key="condition" name="condition"
                labelMsg="filters.personTags.opLabel"
                options={ CONDITION_OPTIONS } value={ this.state.condition }
                onValueChange={ this.onSelectCondition.bind(this) }/>,
            some,
            <TagCloud key="tags" tags={ tags }
                showAddButton={ true } showRemoveButtons={ true }
                onAdd={ this.onAddTag.bind(this) }
                onRemove={ this.onRemoveTag.bind(this) }/>
        ];
    }

    getConfig() {
        return {
            min_matching: this.state.min_matching,
            condition: this.state.condition,
            tags: this.state.tags,
            organizationOption: this.state.organizationOption,
            specificOrganizations: this.state.specificOrganizations,
        };
    }

    onAddTag() {
        let action = createSelection('persontag', null, null, ids => {
            // Add new ids, making sure there are no duplicates
            let newTags = ids.filter(id => this.state.tags.indexOf(id) < 0);
            let tags = this.state.tags.concat(newTags);

            this.setState({ tags }, () =>
                this.onConfigChange());
        });

        this.props.dispatch(action);

        // TODO: Use action in the future instead,
        //       once panes have been refactored as a redux store
        this.props.openPane('selectpersontags', action.payload.id, this.state.organizationOption, JSON.stringify(this.state.specificOrganizations));
    }

    onRemoveTag(tag) {
        let tags = this.state.tags.filter(tagId => tagId !== tag.id);
        this.setState({ tags }, () =>
            this.onConfigChange());
    }

    onSelectCondition(name, value) {
        this.setState({ condition: value }, () =>
            this.onConfigChange());
    }

    onMinMatchingChange(name, value) {
        this.setState({ min_matching: parseInt(value) }, () => 
            this.onConfigChange());
    }

}
