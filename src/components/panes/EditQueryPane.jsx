import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import QueryForm from '../forms/QueryForm';
import Button from '../misc/Button';
import FilterList from '../filters/FilterList';
import { getListItemById } from '../../utils/store';
import {
    addQueryFilter,
    updateQuery,
    updateQueryFilter,
    removeQueryFilter,
    retrieveQuery,
} from '../../actions/query';


@connect(state => ({ queries: state.queries }))
@injectIntl
export default class EditQueryPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let queryId = this.getParam(0);
        this.props.dispatch(retrieveQuery(queryId));
    }

    getRenderData() {
        let queryList = this.props.queries.queryList;
        let queryId = this.getParam(0);

        return {
            queryItem: getListItemById(queryList, queryId)
        };
    }

    getPaneTitle(data) {
        let type = (data.queryItem && data.queryItem.data)?
                data.queryItem.data.type : 'standalone';

        let msgId = 'panes.editQuery.title.' + type;

        return this.props.intl.formatMessage({ id: msgId });
    }

    renderPaneContent(data) {
        if (data.queryItem && !data.queryItem.isPending) {
            let query = data.queryItem.data;
            let filters = query.filter_spec;
            let form = null;

            if (query.type == 'standalone') {
                form = (
                    <QueryForm key="form" ref="form" query={ query }
                        onSubmit={ this.onSubmit.bind(this) }/>
                );
            }

            return [
                form,
                <Msg tagName="h3" key="filterHeader"
                    id="panes.editQuery.filterHeader"/>,
                <Msg tagName="p" key="filterIntro"
                    id="panes.editQuery.filterIntro"/>,
                <FilterList ref="filters" key="filters" filters={ filters }
                    openPane={ this.openPane.bind(this) }/>, // TODO: Remove eventually
            ];
        }
        else {
            // TODO: Show loading indicator
            return null;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditQueryPane-saveButton"
                labelMsg="panes.editQuery.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let queryId = this.getParam(0);
        let values = this.refs.form.getValues();
        let listComponent = this.refs.filters.decoratedComponentInstance;

        values = Object.assign({}, values, {
            filter_spec: listComponent.getFilterSpec(),
        });

        this.props.dispatch(updateQuery(queryId, values));
        this.closePane();
    }
}
