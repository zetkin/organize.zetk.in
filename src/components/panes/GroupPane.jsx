import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import DraggableAvatar from '../misc/DraggableAvatar';
import Button from '../misc/Button';
import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';
import PersonSelectWidget from '../misc/PersonSelectWidget';

import { getListItemById } from '../../utils/store';
import {
    retrieveGroup,
    retrieveGroupMembers,
    promoteGroupManager,
    demoteGroupManager,
} from '../../actions/group';


const mapStateToProps = (state, props) => ({
    groupItem: getListItemById(state.groups.groupList, props.paneData.params[0]),
    memberList: state.groups.membersByGroup[props.paneData.params[0]],
});


@connect(mapStateToProps)
@injectIntl
export default class GroupPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let groupId = this.getParam(0);
        this.props.dispatch(retrieveGroup(groupId));
        this.props.dispatch(retrieveGroupMembers(groupId));
    }

    getPaneTitle() {
        const formatMessage = this.props.intl.formatMessage;
        if (this.props.groupItem && this.props.groupItem.data) {
            return this.props.groupItem.data.title;
        }
        else {
            return formatMessage({ id: 'panes.group.pendingTitle' });
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
            let managerContent = null;

            if (this.props.memberList && this.props.memberList.items) {
                managerContent = this.props.memberList.items
                    .filter(item => !!item.data.role)
                    .map(item => {
                        return (
                            <PersonSelectWidget key={ item.data.id }
                                person={ item.data } preventChange={ true }
                                onSelect={ this.onManagerSelect.bind(this, item.data.id) }/>
                        );
                    });

                // Widget to select new manager
                managerContent.push(
                    <PersonSelectWidget key={ 'new' + managerContent.length }
                        onSelect={ this.onManagerSelect.bind(this, null) }/>
                );

                let memberItems = this.props.memberList.items.map(item => {
                    return (
                        <li key={ item.data.id }>
                            <DraggableAvatar person={ item.data }/>
                        </li>
                    );
                });

                memberContent = (
                    <ul className="GroupPane-memberList">
                        { memberItems }
                    </ul>
                );

                groupSize = memberItems.length;
            }
            else if (this.props.memberList && this.props.memberList.isPending) {
                groupSize = group.size;
                memberContent = <LoadingIndicator/>;
                managerContent = <LoadingIndicator/>;
            }

            const linkUrl = '//www.' + process.env.ZETKIN_DOMAIN + '/o/'
                + group.organization.id + '/groups/' + group.id;

            return [
                <InfoList key="infoList"
                    data={[
                        { name: 'desc', value: group.description },
                        { name: 'size', msgId: 'panes.group.summary.size', msgValues: { size: groupSize } },
                        { name: 'link', href: linkUrl, target: '_blank', msgId: 'panes.group.summary.viewLink' },
                    ]}
                />,
                <div key="managers">
                    <Msg tagName="h3" id="panes.group.managers.h"/>
                    { managerContent }
                </div>,
                <div key="members">
                    <Msg tagName="h3" id="panes.group.members.h"/>
                    { memberContent }
                </div>,
            ];
        }
    }

    onManagerSelect(originalId, person) {
        const groupId = this.getParam(0);

        if (originalId) {
            // Remove manager
            this.props.dispatch(demoteGroupManager(groupId, originalId));
        }
        else {
            // Add manager
            this.props.dispatch(promoteGroupManager(groupId, person.id));
        }
    }
}
