import React from 'react';
import { connect } from 'react-redux';

import FilterBase from './FilterBase';
import SelectInput from '../forms/inputs/SelectInput';
import TagCloud from '../misc/tagcloud/TagCloud';
import { retrievePersonTags } from '../../actions/personTag';
import { createSelection } from '../../actions/selection';
import { getListItemById } from '../../utils/store';


const CONDITION_OPTIONS = {
    'all': 'All of the following tags',
    'any': 'Any of the following tags',
    'none': 'None of the following tags',
};

@connect(state => ({ personTags: state.personTags }))
export default class PersonTagsFilter extends FilterBase {
    constructor(props) {
        super(props);

        this.state = {
            condition: props.config.condition,
            tags: props.config.tags || [],
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
        let tagList = this.props.personTags.tagList;

        if (tagList.items.length == 0 && !tagList.isPending) {
            this.props.dispatch(retrievePersonTags());
        }
    }

    renderFilterForm(config) {
        let tagList = this.props.personTags.tagList;
        let tags = this.state.tags
            .map(tagId => getListItemById(tagList, tagId))
            .filter(tagItem => tagItem)
            .map(tagItem => tagItem.data);

        return [
            <SelectInput key="condition" name="condition"
                label="Match people with"
                options={ CONDITION_OPTIONS } value={ this.state.condition }
                onValueChange={ this.onSelectCondition.bind(this) }/>,
            <TagCloud key="tags" tags={ tags }
                showAddButton={ true } showRemoveButtons={ true }
                onAdd={ this.onAddTag.bind(this) }
                onRemove={ this.onRemoveTag.bind(this) }/>
        ];
    }

    getConfig() {
        return {
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
}
