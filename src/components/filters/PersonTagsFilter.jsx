import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import SelectInput from '../forms/inputs/SelectInput';
import IntInput from '../forms/inputs/IntInput';
import TagCloud from '../misc/tagcloud/TagCloud';
import { retrievePersonTags } from '../../actions/personTag';
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
            atleast: 2,
        };
    }

    componentReceivedProps(nextProps) {
        if (nextProps.config !== this.props.config) {
            this.setState({
                condition: nextProps.config.condition,
                tags: nextProps.config.tags,
            });
        }
    }

    componentDidMount() {
        super.componentDidMount();

        let tagList = this.props.personTags.tagList;

        if (tagList.items.length == 0 && !tagList.isPending) {
            this.props.dispatch(retrievePersonTags());
        }
    }

    renderFilterForm(config) {
        const msg = id => this.props.intl.formatMessage({ id });
        const CONDITION_OPTIONS = {
            'all': msg('filters.personTags.opOptions.all'),
            'any': msg('filters.personTags.opOptions.any'),
            'atleast': msg('filters.personTags.opOptions.atleast'),
            'none': msg('filters.personTags.opOptions.none'),
        };

        let tagList = this.props.personTags.tagList;
        let tags = this.state.tags
            .map(tagId => getListItemById(tagList, tagId))
            .filter(tagItem => tagItem)
            .map(tagItem => tagItem.data);

        const atleast = this.state.condition === 'atleast' ? 
                <IntInput key="atleast" value={ this.state.atleast }
                    onValueChange={ this.onAtLeastChange.bind(this) } /> : null;

        return [
            <SelectInput key="condition" name="condition"
                labelMsg="filters.personTags.opLabel"
                options={ CONDITION_OPTIONS } value={ this.state.condition }
                onValueChange={ this.onSelectCondition.bind(this) }/>,
            atleast,
            <TagCloud key="tags" tags={ tags }
                showAddButton={ true } showRemoveButtons={ true }
                onAdd={ this.onAddTag.bind(this) }
                onRemove={ this.onRemoveTag.bind(this) }/>
        ];
    }

    getConfig() {
        return {
            atleast: this.state.atleast,
            condition: this.state.condition,
            tags: this.state.tags,
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
        this.props.openPane('selectpersontags', action.payload.id);
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

    onAtLeastChange(name, value) {
        this.setState({ atleast: parseInt(value) }, () => 
            this.onConfigChange());
    }

}
