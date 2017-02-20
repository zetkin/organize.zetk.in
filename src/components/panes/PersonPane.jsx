import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Link from '../misc/Link';
import LoadingIndicator from '../misc/LoadingIndicator';
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


const BASIC_FIELDS = [ 'email', 'phone' ];
const ADDR_FIELDS = [ 'co_address', 'street_address', 'zip_code', 'city' ];

@connect(state => ({ people: state.people, personTags: state.personTags }))
export default class PersonPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

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
            return null;
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

            let addrFields = ADDR_FIELDS.filter(f => person[f]).map(field => (
                <span key={ field } className="PersonPane-infoValue">
                    { person[field] }
                </span>
            ));

            let createInfoItem = (name, content) => {
                let className = 'PersonPane-' + name;

                if (!content) {
                    className += ' PersonPane-emptyField';
                    content = <span className="PersonPane-infoValue">
                        Missing</span>;
                }

                return (
                    <li key={ name } className={ className }>
                        { content }
                    </li>
                );
            };

            return [
                <DraggableAvatar key="avatar" ref="avatar" person={ person }/>,
                <ul key="info" className="PersonPane-info">
                    { BASIC_FIELDS.map(field => (
                        createInfoItem(field, person[field])
                    )) }
                    { createInfoItem('address',
                        addrFields.length? addrFields : null) }
                </ul>,
                <Link key="editLink"
                    msgId="panes.person.editLink"
                    onClick={ this.onClickEdit.bind(this) }/>,
                <div key="tags" className="PersonPane-tags">
                    <Msg tagName="h3" id="panes.person.tagHeader"/>
                    { tagCloud }
                </div>,
            ];
        }
        else {
            return <LoadingIndicator />;
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
