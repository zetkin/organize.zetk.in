import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import PersonCollection from '../misc/personcollection/PersonCollection';
import PCGroupMemberItem from '../misc/personcollection/items/PCGroupMemberItem';
import PersonSelectWidget from '../misc/PersonSelectWidget';

import { getListItemById } from '../../utils/store';
import {
    retrieveGroup,
    retrieveGroupMembers,
    addGroupMember,
    removeGroupMember,
} from '../../actions/group';


const mapStateToProps = (state, props) => ({
    groupItem: getListItemById(state.groups.groupList, props.paneData.params[0]),
    memberList: state.groups.membersByGroup[props.paneData.params[0]],
});


@connect(mapStateToProps)
@injectIntl
export default class GroupMembersPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const groupId = this.getParam(0);
        this.props.dispatch(retrieveGroup(groupId));
        this.props.dispatch(retrieveGroupMembers(groupId));
    }

    getPaneTitle() {
        const formatMessage = this.props.intl.formatMessage;
        if (this.props.groupItem && this.props.groupItem.data) {
            return formatMessage({ id: 'panes.groupMembers.title' },
                { title: this.props.groupItem.data.title });
        }
    }

    renderPaneContent() {
        let groupSize;

        if (this.props.groupItem && this.props.groupItem.isPending) {
            return <LoadingIndicator/>;
        }
        else if (this.props.groupItem && this.props.groupItem.data) {
            const group = this.props.groupItem.data;

            let memberContent = null;

            if (this.props.memberList && this.props.memberList.items) {
                let members = this.props.memberList.items.map(i => i.data);

                memberContent = (
                    <PersonCollection items={ members }
                        itemComponent={ PCGroupMemberItem }
                        showEditButtons={ false }
                        onRemove={ this.onPersonRemove.bind(this) }
                        />
                );
            }
            else if (this.props.memberList && this.props.memberList.isPending) {
                memberContent = <LoadingIndicator/>;
            }

            const linkUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/o/'
                + group.organization.id + '/groups/' + group.id;

            return [
                <div key="add">
                    <Msg tagName="h3" id="panes.groupMembers.add.h"/>
                    <PersonSelectWidget
                        onSelect={ this.onPersonSelect.bind(this) }/>
                </div>,
                <div key="members">
                    <Msg tagName="h3" id="panes.groupMembers.members.h"/>
                    { memberContent }
                </div>,
            ];
        }
    }

    onPersonRemove(person) {
        const groupId = this.getParam(0);
        this.props.dispatch(removeGroupMember(groupId, person.id));
    }

    onPersonSelect(person) {
        const groupId = this.getParam(0);
        this.props.dispatch(addGroupMember(groupId, person.id));
    }
}
