import React from 'react';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import DraggableAvatar from '../misc/DraggableAvatar';
import TagCloud from '../misc/tagcloud/TagCloud';
import { getListItemById } from '../../utils/store';
import { retrievePerson } from '../../actions/person';
import { createSelection } from '../../actions/selection';
import {
    addTagsToPerson,
    removeTagFromPerson,
    retrieveTagsForPerson,
} from '../../actions/personTag';


const FIELDS = {
    'email': 'E-mail address',
    'phone': 'Phone number',
    'co_address': 'C/o address',
    'street_address': 'Street address',
    'zip_code': 'Zip code',
    'city': 'City',
};

@connect(state => ({ people: state.people, personTags: state.personTags }))
export default class PersonPane extends PaneBase {
    componentDidMount() {
        let personId = this.getParam(0);
        this.props.dispatch(retrievePerson(personId));
        this.props.dispatch(retrieveTagsForPerson(personId));
    }

    getRenderData() {
        let personId = this.getParam(0);
        let personList = this.props.people.personList;

        return {
            personItem: getListItemById(personList, personId),
        }
    }

    getPaneTitle(data) {
        if (data.personItem && data.personItem.data) {
            let person = data.personItem.data;
            return person.first_name + ' ' + person.last_name;
        }
        else {
            return 'Person';
        }
    }

    renderPaneContent(data) {
        if (data.personItem) {
            let person = data.personItem.data;

            let tagCloud = null;
            if (person.tagList && !person.tagList.isPending) {
                let tagList = this.props.personTags.tagList;
                let tags = person.tagList.items
                    .map(i => getListItemById(tagList, i.data.id))
                    .filter(i => i !== null)
                    .map(i => i.data);

                tagCloud = (
                    <TagCloud tags={ tags }
                        showAddButton={ true } showRemoveButtons={ true }
                        onRemove={ this.onRemoveTag.bind(this) }
                        onAdd={ this.onAddTag.bind(this) }/>
                );
            }

            return [
                <DraggableAvatar key="avatar" ref="avatar" person={ person }/>,
                <ul key="info" className="PersonPane-info">
                    { Object.keys(FIELDS).map(name => {
                        if (person[name]) {
                            let className = 'PersonPane-' + name;

                            return (
                                <li key={ name } className={ className }>
                                    <span className="PersonPane-infoLabel">
                                        { FIELDS[name] }</span>
                                    <span className="PersonPane-infoValue">
                                        { person[name] }</span>
                                </li>
                            );
                        }
                    } ) }
                </ul>,
                <a onClick={ this.onClickEdit.bind(this) }>
                    Edit basic information</a>,
                <div className="PersonPane-tags">
                    <h3>Tags</h3>
                    { tagCloud }
                </div>,
            ];
        }
        else {
            // TODO: Loading indicator
            return null;
        }
    }

    onAddTag() {
        let personId = this.getParam(0);
        let action = createSelection('persontag', null, null, ids => {
            this.props.dispatch(addTagsToPerson(personId, ids));
        });

        this.props.dispatch(action);
        this.openPane('selectpersontags', action.payload.id);
    }


    onRemoveTag(tag) {
        let personId = this.getParam(0);
        this.props.dispatch(removeTagFromPerson(personId, tag.id));
    }

    onClickEdit(ev) {
        let personId = this.getParam(0);
        this.openPane('editperson', personId);
    }
}
