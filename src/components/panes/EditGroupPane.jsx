import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import GroupForm from '../forms/GroupForm';
import Button from '../misc/Button';
import DeleteButton from '../misc/DeleteButton';
import { getListItemById } from '../../utils/store';
import {
    retrieveGroup,
    updateGroup,
    deleteGroup,
} from '../../actions/group';


const mapStateToProps = (state, props) => ({
    groupItem: getListItemById(state.groups.groupList, props.paneData.params[0]),
});


@connect(mapStateToProps)
@injectIntl
export default class EditGroupPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let groupId = this.getParam(0);
        this.props.dispatch(retrieveGroup(groupId));
    }

    getPaneTitle() {
        const formatMessage = this.props.intl.formatMessage;
        if (this.props.groupItem && this.props.groupItem.data) {
            return formatMessage({ id: 'panes.editGroup.title' },
                { title: this.props.groupItem.data.title });
        }
    }


    renderPaneContent(data) {
        if (this.props.groupItem && this.props.groupItem.data) {
            let group = this.props.groupItem.data;

            return [
                <GroupForm ref="form" group= { group }
                    onSubmit={ this.onSubmit.bind(this) }/>,
                <DeleteButton key="deleteButton"
                    onClick={ this.onDeleteClick.bind(this) }/>
            ];
        }
        else {
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditGroupPane-saveButton"
                labelMsg="panes.editGroup.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let groupId = this.getParam(0);
        let values = this.refs.form.getChangedValues();

        this.props.dispatch(updateGroup(groupId, values));
        this.closePane();
    }

    onDeleteClick() {
        const groupId = this.getParam(0);
        this.props.dispatch(deleteGroup(groupId));
    }
}
