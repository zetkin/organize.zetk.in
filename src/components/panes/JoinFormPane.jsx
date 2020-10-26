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

const PERSON_FIELDS = [
    'first_name',
    'last_name',
    'co_address',
    'street_address',
    'zip_code',
    'city',
    'country',
    'email',
    'gender',
    'phone',
    'alt_phone',
];

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
            const fieldTypes = this.props.fieldTypes;
            const form = formItem.data;

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
            if (fieldTypes && fieldTypes.items) {
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

            const msg = id => this.props.intl.formatMessage({ id });

            let personFieldOptGroup = null;
            const personFieldOptions = PERSON_FIELDS
                .filter(fieldName => !form.fields.includes(fieldName))
                .map(fieldName => (
                    <option key={ fieldName } value={ fieldName }>
                        { msg(`panes.joinForm.fields.labels.${fieldName}`) }
                    </option>
                ))

            if (personFieldOptions.length) {
                personFieldOptGroup = (
                    <optgroup label={ msg('panes.joinForm.fields.groups.person') }>
                        { personFieldOptions }
                    </optgroup>
                );
            };

            let customFieldOptGroup = null;
            if (fieldTypes && fieldTypes.items) {
                const customFieldOptions = fieldTypes.items
                    .map(item => item.data)
                    .filter(fieldType => !form.fields.includes(fieldType.slug))
                    .map(fieldType => (
                        <option key={ fieldType.slug } value={ fieldType.slug }>
                            { fieldType.title }
                        </option>
                    ));

                if (customFieldOptions.length) {
                    customFieldOptGroup = (
                        <optgroup label={ msg('panes.joinForm.fields.groups.custom') }>
                            { customFieldOptions }
                        </optgroup>
                    );
                }
            }

            let addSection = null;
            if (personFieldOptGroup || customFieldOptGroup) {
                addSection = (
                    <div className="JoinFormPane-addField">
                        <select onChange={ this.onAddField.bind(this) }>
                            <option>{ msg('panes.joinForm.fields.selectLabel') }</option>
                            { personFieldOptGroup }
                            { customFieldOptGroup }
                        </select>
                    </div>
                );
            }

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
                    { addSection }
                </div>
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onAddField(ev) {
        const formItem = this.props.formItem;
        if (formItem && !formItem.isPending) {
            const form = formItem.data;
            const fields = form.fields.concat([ ev.target.value ]);
            this.props.dispatch(updateJoinForm(form.id, { fields }));
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
