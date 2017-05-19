import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import QueryForm from '../forms/QueryForm';
import Button from '../misc/Button';
import { createQuery } from '../../actions/query';


@connect(state => ({ queries: state.queries }))
@injectIntl
export default class AddQueryPane extends PaneBase {
    getPaneTitle(data) {
        let msgId = 'panes.addQuery.title';

        return this.props.intl.formatMessage({ id: msgId });
    }

    renderPaneContent(data) {
        let query = {
            title: this.getParam(0) || '',
        }

        return (
            <QueryForm key="form" ref="form" query={ query }
                onSubmit={ this.onSubmit.bind(this) }/>
        );
    }

    renderPaneFooter(data) {
        return (
            <Button className="AddQueryPane-saveButton"
                labelMsg="panes.addQuery.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let queryId = this.getParam(0);
        let values = this.refs.form.getValues();

        values.filter_spec = [];

        this.props.dispatch(createQuery(values, this.props.paneData.id));
    }
}
