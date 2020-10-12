import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import EditableText from '../../misc/EditableText';
import LoadingIndicator from '../../misc/LoadingIndicator';
import PersonViewTable from '../../misc/personViews/PersonViewTable';
import RelSelectInput from '../../forms/inputs/RelSelectInput';
import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';
import { retrieveQueries } from '../../../actions/query';
import {
    addPersonViewRow,
    createPersonView,
    retrievePersonView,
    retrievePersonViewColumns,
    retrievePersonViewQuery,
    retrievePersonViewRows,
    retrievePersonViews,
    updatePersonView,
} from '../../../actions/personView';
import { getListItemById } from '../../../utils/store';


const mapStateToProps = state => ({
    queryList: state.queries.queryList,
    views: state.personViews,
});


@connect(mapStateToProps)
@injectIntl
export default class PersonViewsPane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'saved',
        };
    }

    componentDidMount() {
        super.componentDidMount();

        const viewId = this.getParam(0);
        if (viewId && viewId != 'new') {
            this.props.dispatch(retrievePersonView(viewId));
            this.props.dispatch(retrievePersonViewColumns(viewId));
            this.props.dispatch(retrievePersonViewRows(viewId));
            this.props.dispatch(retrieveQueries());
        }
        else {
            this.props.dispatch(retrievePersonViews());
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.paneData != this.props.paneData) {
            this.setState({
                viewMode: 'saved',
                query: null,
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const viewId = this.getParam(0);

        if (prevProps.paneData != this.props.paneData) {
            if (viewId && viewId != 'new') {
                this.props.dispatch(retrievePersonView(viewId));
                this.props.dispatch(retrievePersonViewColumns(viewId));
                this.props.dispatch(retrievePersonViewRows(viewId));
                this.props.dispatch(retrieveQueries());
            }
            else {
                this.props.dispatch(retrievePersonViews());
            }
        }

        if (prevProps.views.columnsByView[viewId] != this.props.views.columnsByView[viewId]) {
            this.props.dispatch(retrievePersonViewRows(viewId));
            if (this.state.query) {
                this.props.dispatch(retrievePersonViewQuery(viewId, this.state.query));
            }
        }

        if (this.state.query && prevState.query != this.state.query) {
            this.props.dispatch(retrievePersonViewQuery(viewId, this.state.query));
        }
    }

    renderPaneTop() {
        return (
            <div key="backLink" className="PersonViewsPane-backLink">
                <a onClick={ () => this.gotoPane('views') }>
                    <Msg id="panes.personViews.view.backLink"/>
                </a>
            </div>
        );
    }

    renderPaneContent(data) {
        const viewId = this.getParam(0);

        if (viewId == 'new') {
            return <LoadingIndicator/>;
        }
        else if (viewId) {
            const viewItem = getListItemById(this.props.views.viewList, viewId);
            if (viewItem) {
                let placeholder = <Msg tagName="p" id="panes.personViews.view.empty"/>;
                let rowList = null;

                const viewStates = {
                    'saved': 'panes.personViews.view.modes.saved',
                    'query': 'panes.personViews.view.modes.query',
                };

                let querySelect = null;
                if (this.state.viewMode == 'query') {
                    const queryList = this.props.queryList;
                    const queries = queryList.items.map(i => i.data);

                    querySelect = (
                        <RelSelectInput name="query"
                            value={ this.state.query } objects={ queries } showEditLink={ true }
                            onValueChange={ (name, val) => this.setState({ query: val }) }
                            onCreate={ this.onQueryCreate.bind(this) }
                            onEdit={ this.onQueryEdit.bind(this) }/>
                    );

                    if (this.state.query) {
                        rowList = this.props.views.matchesByViewAndQuery[viewId][this.state.query];
                    }
                    else {
                        placeholder = (
                            <Msg tagName="p" id="panes.personViews.view.missingQuery"/>
                        );
                    }
                }
                else {
                    rowList = this.props.views.rowsByView[viewId];
                }

                return [
                    <div key="header" className="PersonViewsPane-singleViewHeader">
                        <EditableText tagName="h1" key="title"
                            content={ viewItem.data.title }
                            onChange={ this.onChange.bind(this, 'title') }
                            placeholder={ this.props.intl.formatMessage({ id: 'panes.personViews.placeholders.title' }) }
                            />
                        <EditableText tagName="p" key="description"
                            content={ viewItem.data.description }
                            onChange={ this.onChange.bind(this, 'description') }
                            placeholder={ this.props.intl.formatMessage({ id: 'panes.personViews.placeholders.description' }) }
                            />
                    </div>,
                    <div key="mode" className="PersonViewsPane-singleViewModes">
                        <ViewSwitch states={ viewStates } selected={ this.state.viewMode }
                            onSwitch={ vs => this.setState({ viewMode: vs }) }
                            />
                        { querySelect }
                    </div>,
                    <div key="view" className="PersonViewsPane-singleViewTable">
                        <PersonViewTable
                            viewId={ viewId }
                            openPane={ this.openPane.bind(this) }
                            columnList={ this.props.views.columnsByView[viewId] }
                            rowList={ rowList }
                            placeholder={ placeholder }
                            showAddSection={ this.state.viewMode == 'saved' }
                            onPersonAdd={ person => this.props.dispatch(addPersonViewRow(viewId, person.id)) }
                            />
                    </div>
                ];
            }
            else {
                // Only show while actually loading
                return <LoadingIndicator/>;
            }
        }
        else if (this.props.views.viewList.items) {
            return (
                <ul className="PersonViewsPane-viewList">
                    <li
                        className="PersonViewsPane-viewIcon PersonViewsPane-new"
                        onClick={ this.onClickNew.bind(this) }
                        >
                        <span className="PersonViewsPane-viewIconTitle">
                            <Msg id="panes.personViews.newBlankButton"/>
                        </span>
                    </li>
                {this.props.views.viewList.items.map(viewItem => (
                    <li key={ viewItem.data.id }
                        className="PersonViewsPane-viewIcon"
                        onClick={ () => this.gotoPane('views', viewItem.data.id) }
                        >
                        <span className="PersonViewsPane-viewIconTitle">{ viewItem.data.title }</span>
                    </li>
                ))}
                </ul>
            );
        }
        else if (this.props.views.viewList.isPending) {
            return <LoadingIndicator/>;
        }
    }

    onClickNew() {
        const msg = id => this.props.intl.formatMessage({ id });

        const viewData = {
            title: msg('panes.personViews.newView.defaultTitle'),
        };

        const defaultColumns = [
            {
                'title': msg('panes.personViews.newView.defaultColumns.firstName'),
                'type': 'person_field',
                'config': { 'field': 'first_name' },
            },
            {
                'title': msg('panes.personViews.newView.defaultColumns.lastName'),
                'type': 'person_field',
                'config': { 'field': 'last_name' },
            },
        ];

        this.props.dispatch(createPersonView(viewData, defaultColumns));
        this.gotoPane('views', 'new');
    }

    onChange(attr, value) {
        const viewId = this.getParam(0);
        const data = {
            [attr]: value,
        };

        this.props.dispatch(updatePersonView(viewId, data));
    }

    onQueryCreate(title) {
        this.openPane('addquery', title);
    }

    onQueryEdit(query) {
        this.openPane('editquery', query.id);
    }
}
