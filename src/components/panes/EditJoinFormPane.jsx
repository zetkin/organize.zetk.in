import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import JoinFormForm from '../forms/JoinFormForm';
import Button from '../misc/Button';
import DeleteButton from '../misc/DeleteButton';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { deleteJoinForm, retrieveJoinForm, updateJoinForm }
    from '../../actions/joinForm';

const mapStateToProps = (state, props) => ({
    formItem: getListItemById(
        state.joinForms.formList,
        props.paneData.params[0]),
});

@connect(mapStateToProps)
@injectIntl
export default class EditJoinFormPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const formId = this.getParam(0);
        this.props.dispatch(retrieveJoinForm(formId));
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        const { formItem } = this.props;

        if (formItem && !formItem.isPending) {
            return formatMessage(
                { id: 'panes.editJoinForm.title' },
                { title: formItem.data.title });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        const { formItem } = this.props;
        if (formItem && !formItem.isPending) {
            const form = formItem.data;
            return [
                <JoinFormForm key="form" ref="form"
                    form={ form }
                    onSubmit={ this.onSubmit.bind(this) }/>,
                <DeleteButton key="deleteButton"
                    onClick={ this.onDeleteClick.bind(this) }/>,
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditJoinFormPane-saveButton"
                labelMsg="panes.editJoinForm.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        const formId = this.getParam(0);
        const values = this.refs.form.getChangedValues();

        this.props.dispatch(updateJoinForm(formId, values));
        this.closePane();
    }

    onDeleteClick() {
        const formId = this.getParam(0);

        this.props.dispatch(deleteJoinForm(formId));
    }
}
