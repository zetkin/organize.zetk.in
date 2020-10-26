import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { retrieveJoinForm } from '../../actions/joinForm';
import InfoList from '../misc/InfoList';


const mapStateToProps = (state, props) => {
    const formId = props.paneData.params[0];

    return {
        formItem: getListItemById(state.joinForms.formList, formId),
    };
};


@connect(mapStateToProps)
@injectIntl
export default class JoinFormPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const formItem = this.props.formItem;
        if (!formItem || formItem.data || !formItem.data.elements) {
            this.props.dispatch(retrieveJoinForm(this.getParam(0)));
        }
    }

    getPaneTitle(data) {
        const formItem = this.props.formItem;
        if (formItem && formItem.data && !formItem.isPending) {
            return this.props.formItem.data.title;
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        let formItem = this.props.formItem;
        if (formItem && !formItem.isPending) {
            let form = formItem.data;

            let accessLabelMsgId = 'panes.joinForm.summary.access.';
            if (form.renderable && form.embeddable) {
                accessLabelMsgId += 'embed';
            }
            else if (form.renderable) {
                accessLabelMsgId += 'render';
            }
            else {
                accessLabelMsgId += 'api';
            }

            return [
                <InfoList key="summary-infolist"
                    data={[
                        { name: 'desc', value: form.description },
                        { name: 'access', msgId: accessLabelMsgId },
                        { name: 'editLink', onClick: this.onEditSummaryClick.bind(this), msgId: 'panes.joinForm.summary.editLink' }
                    ]}
                />,
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onEditSummaryClick(ev) {
        this.openPane('editjoinform', this.getParam(0));
    }
}
