import React from 'react';
import { connect } from 'react-redux';

import TagCloud from '../../tagcloud/TagCloud';
import { getListItemsByIds } from '../../../../utils/store';


@connect(state => ({ personTags: state.personTags }))
export default class PersonTagColumnValue extends React.Component {
    render() {
        let value = this.props.value;
        let config = this.props.column.config;
        let tagList = this.props.personTags.tagList;

        let mapping = config.mappings.find(m => m.value == value);
        let tags = getListItemsByIds(tagList, mapping.tags).map(i => i.data);

        return (
            <TagCloud tags={ tags }/>
        );
    }
}
