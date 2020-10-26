import cx from 'classnames';
import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import LoadingIndicator from '../misc/LoadingIndicator';
import { getListItemById } from '../../utils/store';
import { retrieveFieldTypesForOrganization } from '../../actions/personField';
import {
    retrieveJoinForm,
    updateJoinForm,
} from '../../actions/joinForm';
import InfoList from '../misc/InfoList';
import Reorderable from '../misc/reorderable/Reorderable';


const mapStateToProps = (state, props) => {
    const formId = props.paneData.params[0];

    return {
        formItem: getListItemById(state.joinForms.formList, formId),
        fieldTypes: state.personFields.fieldTypes,
    };
};


@connect(mapStateToProps)
@injectIntl
export default class JoinFormPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        const formItem = this.props.formItem;
        if (!formItem || !formItem.data) {
            this.props.dispatch(retrieveJoinForm(this.getParam(0)));
        }

        const fieldTypes = this.props.fieldTypes;
        if (!fieldTypes || !fieldTypes.data) {
            this.props.dispatch(retrieveFieldTypesForOrganization());
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

            const fieldTypesBySlug = {};
            if (this.props.fieldTypes && this.props.fieldTypes.items) {
                this.props.fieldTypes.items.forEach(item => {
                    fieldTypesBySlug[item.data.slug] = item.data;
                });
            }

            const fieldElements = form.fields.map(fieldName => {
                let type;
                let label;

                if (fieldName in fieldTypesBySlug) {
                    const fieldData = fieldTypesBySlug[fieldName];
                    label = fieldData.title;
                    type = fieldData.type;
                }
                else {
                    type = 'person';
                    label = (
                        <Msg id={ `panes.joinForm.fields.labels.${fieldName}` }/>
                    );
                }

                const classes = cx('JoinFormPane-field', type, {
                    custom: (fieldName in fieldTypesBySlug),
                });

                return (
                    <div key={ fieldName } className={ classes }>
                        { label }
                    </div>
                );
            });

            return [
                <InfoList key="summary-infolist"
                    data={[
                        { name: 'desc', value: form.description },
                        { name: 'access', msgId: accessLabelMsgId },
                        { name: 'editLink', onClick: this.onEditSummaryClick.bind(this), msgId: 'panes.joinForm.summary.editLink' }
                    ]}
                />,
                <div key="fields">
                    <Msg tagName="h3" id="panes.joinForm.fields.h"/>
                    <Reorderable onReorder={ this.onFieldReorder.bind(this) }>
                        { fieldElements }
                    </Reorderable>
                </div>
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onEditSummaryClick(ev) {
        this.openPane('editjoinform', this.getParam(0));
    }

    onFieldReorder(order) {
        const formId = this.getParam(0);
        this.props.dispatch(updateJoinForm(formId, { fields: order }));
    }
}
