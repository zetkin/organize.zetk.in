import React from 'react';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Link from '../misc/Link';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import DraggableAvatar from '../misc/DraggableAvatar';
import TagCloud from '../misc/tagcloud/TagCloud';
import { getListItemById } from '../../utils/store';
import { retrievePerson } from '../../actions/person';
import { createSelection } from '../../actions/selection';
import { retrieveFieldsForPerson } from '../../actions/personField';
import {
    addTagsToPerson,
    removeTagFromPerson,
    retrieveTagsForPerson,
} from '../../actions/personTag';
import InfoList from '../misc/InfoList';


const ADDR_FIELDS = [ 'co_address', 'street_address', 'zip_code', 'city' ];

const mapStateToProps = (state, props) => ({
    personTags: state.personTags,
    personFields: state.personFields.valuesByPerson[props.paneData.params[0]],
    personItem: getListItemById(state.people.personList,
        props.paneData.params[0]),
});

@connect(mapStateToProps)
@injectIntl
export default class PersonPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let personId = this.getParam(0);
        this.props.dispatch(retrievePerson(personId));
        this.props.dispatch(retrieveTagsForPerson(personId));
        this.props.dispatch(retrieveFieldsForPerson(personId));
    }

    getRenderData() {
        return {
            personItem: this.props.personItem,
        }
    }

    getPaneTitle(data) {
        if (data.personItem && data.personItem.data) {
            let person = data.personItem.data;
            return person.name
                || ((person.first_name && person.last_name)?
                    (person.first_name + ' ' + person.last_name) : '');
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

            let createInfoItem = (name, content, forceMissing) => {
                let className = 'PersonPane-' + name;

                if (forceMissing || !content) {
                    className += ' PersonPane-emptyField';
                    if (!content) {
                        content = <span className="PersonPane-infoValue">
                            -</span>;
                    }
                }

                return (
                    <li key={ name } className={ className }>
                        { content }
                    </li>
                );
            };

            const formatMessage = this.props.intl.formatMessage;
            const phoneNumbers = [ person.phone, person.alt_phone ].filter(pn => !!pn);

            let fieldsContent = null;
            if (this.props.personFields) {
                if (this.props.personFields.isPending) {
                    fieldsContent = <LoadingIndicator/>;
                }
                else if (!this.props.personFields.error) {
                    const fields = this.props.personFields.items;
                    if (fields.length) {
                        fieldsContent = (
                            <ul>
                            {fields.map(item => {
                                let value = item.data.value;

                                if (item.data.field.type == 'json') {
                                    value = <Msg id="panes.person.fields.json"/>;
                                }
                                else if (item.data.field.type == 'url') {
                                    value = <a href={ item.data.value } target="_blank">{ item.data.value }</a>;
                                }

                                return (
                                    <li key={ item.data.field.id }>
                                        <span className="PersonPane-fieldLabel">{ item.data.field.title }</span>
                                        <span className="PersonPane-fieldValue">{ value } </span>
                                    </li>
                                );
                            })}
                            </ul>
                        );
                    }
                    else {
                        fieldsContent = <Msg id="panes.person.fields.empty" tagName="p"/>;
                    }
                }
            }

            return [
                <DraggableAvatar key="avatar" ref="avatar" person={ person }/>,
                <InfoList key="info"
                    data={[
                        { name: 'user', msgId: person.is_user ?
                            'panes.person.user.connected' : 'panes.person.user.notConnected' },
                        { name: 'email', value: person.email },
                        { name: 'phone', value: phoneNumbers.join(', ') },
                        { name: 'address', value: addrFields.length? addrFields : null },
                        { name: 'timeline', msgId: 'panes.person.timelineLink', onClick: this.onClickTimeline.bind(this) },
                        { name: 'editLink', msgId: 'panes.person.editLink', onClick: this.onClickEdit.bind(this) }
                    ]}
                />,
                <div key="fields" className="PersonPane-fields">
                    <Msg id="panes.person.fields.h" tagName="h3"/>
                    { fieldsContent }
                </div>,
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

    onClickTimeline(ev) {
        const personId = this.getParam(0);
        this.openPane('timeline', personId);
    }
}
