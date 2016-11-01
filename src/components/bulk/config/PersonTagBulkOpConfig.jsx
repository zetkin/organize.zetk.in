import React from 'react';
import { connect } from 'react-redux';

import TagCloud from '../../misc/tagcloud/TagCloud';
import { getListItemById } from '../../../utils/store';
import { createSelection } from '../../../actions/selection';


const mapStateToProps = state => ({
    tagList: state.personTags.tagList,
});


@connect(mapStateToProps)
export default class PersonTagBulkOpConfig extends React.Component {
    static propTypes = {
        openPane: React.PropTypes.func,
        config: React.PropTypes.object.isRequired,
        onConfigChange: React.PropTypes.func.isRequired,
    };

    render() {
        let tagIds = this.props.config.tags || [];
        let tags = tagIds.map(id =>
            getListItemById(this.props.tagList, id).data);
            
        return (
            <TagCloud tags={ tags }
                showAddButton={ true } showRemoveButtons={ true }
                onRemove={ this.onRemoveTag.bind(this) }
                onAdd={ this.onAddTag.bind(this) }/>
        );
    }

    onAddTag() {
        let tagIds = this.props.config.tags || [];
        let action = createSelection('persontag', null, null, ids => {
            ids.forEach(id => {
                if (tagIds.indexOf(id) < 0) {
                    tagIds.push(id);
                }
            });

            this.props.onConfigChange({
                tags: tagIds,
            });
        });

        this.props.dispatch(action);
        this.props.openPane('selectpersontags', action.payload.id);
    }

    onRemoveTag(tag) {
        let tagIds = this.props.config.tags || [];
        let index = tagIds.indexOf(tag.id);
        if (index >= 0) {
            tagIds = tagIds.concat();
            tagIds.splice(index, 1);
        }

        this.props.onConfigChange({
            tags: tagIds,
        });
    }
}
