import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import QueryForm from '../forms/QueryForm';
import Button from '../misc/Button';
import DeleteButton from '../misc/DeleteButton';
import FilterList from '../filters/FilterList';
import { getListItemById } from '../../utils/store';
import {
    addQueryFilter,
    updateQuery,
    updateQueryFilter,
    removeQueryFilter,
    retrieveQuery,
    removeQuery
} from '../../actions/query';
import { retrieveSubOrgsRecursive } from '../../actions/subOrg';


const mapStateToProps = (state, props) => ({
    queryItem: getListItemById(state.queries.queryList,
        props.paneData.params[0]),
});

@connect(mapStateToProps)
@injectIntl
export default class EditQueryPane extends PaneBase {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();

        if (this.props.queryItem && !this.props.queryItem.isPending) {
            this.setState({
                query: this.props.queryItem.data,
            });
        }
        else {
            const queryId = this.getParam(0);
            this.props.dispatch(retrieveQuery(queryId));
            this.props.dispatch(retrieveQuery(queryId));
        }
        this.props.dispatch(retrieveSubOrgsRecursive());
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.queryItem) {
            return this.closePane();
        }

        if (!this.state.query && nextProps.queryItem && !nextProps.queryItem.isPending) {
            this.setState({
                query: nextProps.queryItem.data,
            });
        }
    }

    getPaneTitle() {
        let type = this.state.query?
                this.state.query.type : 'standalone';

        let msgId = 'panes.editQuery.title.' + type;

        return this.props.intl.formatMessage({ id: msgId });
    }

    renderPaneContent() {
        if (this.state.query) {
            const query = this.state.query;
            const filters = query.filter_spec;

            let form = null;
            let deleteButton = null;

            if (query.type == 'standalone') {
                form = (
                    <QueryForm key="form" ref="form" query={ query }
                        onSubmit={ this.onSubmit.bind(this) }/>
                );

                deleteButton = (
                    <DeleteButton key="deleteButton"
                        onClick={ this.onDeleteClick }/>
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
                deleteButton,
            ];
        }
        else {
            // TODO: Show loading indicator
            return null;
        }
    }

    renderPaneFooter() {
        return (
            <Button className="EditQueryPane-saveButton"
                labelMsg="panes.editQuery.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onDeleteClick = () => {
        const actionId = this.getParam(0);
        this.props.dispatch(removeQuery(actionId));
    }

    onSubmit(ev) {
        ev.preventDefault();

        let queryId = this.getParam(0);
        let values = this.refs.form? this.refs.form.getChangedValues() : {};
        let listComponent = this.refs.filters.decoratedComponentInstance;

        values = Object.assign({}, values, {
            filter_spec: listComponent.getFilterSpec(),
        });

        this.props.dispatch(updateQuery(queryId, values));
        this.closePane();
    }
}
