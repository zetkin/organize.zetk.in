import cx from 'classnames';
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
            collapseHeader: false,
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
            // Check what changed. If it was just something like a column title,
            // i.e. not the order or number of columns, we can keep the rows.
            const oldList = prevProps.views.columnsByView[viewId];
            const newList = this.props.views.columnsByView[viewId];

            const didChange = () => {
                if (!oldList || !oldList.items) {
                    return true;
                }

                if (oldList.items.length != newList.items.length) {
                    return true;
                }

                // Check if there is any case of ID mismatch, i.e. order changed.
                return oldList.items.some((item, index) => item.data.id != newList.items[index].data.id);
            };

            if (didChange()) {
                this.props.dispatch(retrievePersonViewRows(viewId));
                if (this.state.query) {
                    this.props.dispatch(retrievePersonViewQuery(viewId, this.state.query));
                }
            }
        }

        if (this.state.query && prevState.query != this.state.query) {
            this.props.dispatch(retrievePersonViewQuery(viewId, this.state.query));
        }
    }

    renderPaneTop() {
        const viewId = this.getParam(0);
        const collapseClasses = cx('PersonViewsPane-collapseHeaderLink', {
            collapsed: this.state.collapseHeader,
        });

        if (viewId) {
            return (
                <div key="topLinks" className="PersonViewsPane-topLinks">
                    <div key="backLink" className="PersonViewsPane-backLink"
                        onClick={ () => this.gotoPane('views') }
                        >
                        <Msg id="panes.personViews.view.backLink"/>
                    </div>,
                    <div key="collapseLink" className={ collapseClasses }
                        onClick={ this.onClickCollapseHeader.bind(this) }
                        >
                        { this.state.collapseHeader ?
                            <Msg id="panes.personViews.view.showHeader" />
                            :
                            <Msg id="panes.personViews.view.hideHeader" />
                        }
                    </div>
                </div>
            );
        }
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
                    const queries = queryList.items.map(i => i.data).filter(q => !!q.title).sort((a, b) => a.title.localeCompare(b.title));

                    querySelect = (
                        <RelSelectInput name="query"
                            value={ this.state.query } objects={ queries } showEditLink={ true }
                            onValueChange={ (name, val) => this.setState({ query: val }) }
                            onCreate={ this.onQueryCreate.bind(this) }
                            onEdit={ this.onQueryEdit.bind(this) }
                            hidden={ this.state.collapseHeader }
                            />
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
                    <div key="header" className={"PersonViewsPane-singleViewHeader" + (this.state.collapseHeader ? "-collapsed" : "") }>
                        <EditableText tagName="h1" key="title"
                            flash={ true }
                            content={ viewItem.data.title }
                            onChange={ this.onChange.bind(this, 'title') }
                            placeholder={ this.props.intl.formatMessage({ id: 'panes.personViews.placeholders.title' }) }
                            multiline={ false }
                            maxLength={ 80 }
                            />
                        <div className="PersonViewsPane-adminLinks">
                            <a className="PersonViewsPane-deleteLink"
                                onClick={ this.onClickDelete.bind(this) }>
                                <Msg id="panes.personViews.view.delete" />
                            </a>
                            <a className="PersonViewsPane-settingsLink"
                                onClick={ () => this.openPane('editpersonview', viewId) }>
                                <Msg id="panes.personViews.view.settings" />
                            </a>
                        </div>
                        <EditableText tagName="p" key="description"
                            content={ viewItem.data.description }
                            onChange={ this.onChange.bind(this, 'description') }
                            placeholder={ this.props.intl.formatMessage({ id: 'panes.personViews.placeholders.description' }) }
                            multiline={ true }
                            />
                    </div>,
                    <div key="mode" className="PersonViewsPane-singleViewModes">
                        <ViewSwitch states={ viewStates } selected={ this.state.viewMode }
                            onSwitch={ vs => this.setState({ 
                                viewMode: vs, 
                                collapseHeader: vs == 'query' ? false : this.state.collapseHeader
                            })
                            }
                            />
                        { querySelect }
                    </div>,
                    <div key="view" className={ "PersonViewsPane-singleViewTable" + (this.state.collapseHeader ? "-collapsed" : "") }>
                        <PersonViewTable
                            viewId={ viewId }
                            openPane={ this.openPane.bind(this) }
                            columnList={ this.props.views.columnsByView[viewId] }
                            rowList={ rowList }
                            placeholder={ placeholder }
                            showAddSection={ this.state.viewMode == 'saved' }
                            onDownload={ this.onClickDownload.bind(this) }
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
            const sortedViewItems = this.props.views.viewList.items.sort((v1, v2) => v1.data.title.localeCompare(v2.data.title));
            return (
                <ul className="PersonViewsPane-viewList">
                    <li
                        className="PersonViewsPane-viewItem PersonViewsPane-new"
                        onClick={ this.onClickNew.bind(this) }
                        >
                        <div className="PersonViewsPane-viewItemIcon"/>
                        <span className="PersonViewsPane-viewItemTitle">
                            <Msg id="panes.personViews.newBlankButton"/>
                        </span>
                    </li>
                {sortedViewItems.map(viewItem => (
                    <li key={ viewItem.data.id }
                        className="PersonViewsPane-viewItem"
                        onClick={ () => this.gotoPane('views', viewItem.data.id) }
                        >
                        <div className="PersonViewsPane-viewItemIcon"/>
                        <span className="PersonViewsPane-viewItemTitle">{ viewItem.data.title }</span>
                    </li>
                ))}
                </ul>
            );
        }
        else if (this.props.views.viewList.isPending) {
            return <LoadingIndicator/>;
        }
    }

    onClickDownload() {
        const viewId = this.getParam(0);
        const queryId = (this.state.viewMode === 'saved') ? undefined : this.state.query;

        this.openPane('confirmexport', viewId, queryId);
    }

    onClickDelete() {
        const viewId = this.getParam(0);
        const viewItem = getListItemById(this.props.views.viewList, viewId);
        let title = ''
        if(viewItem) {
            title = viewItem.data.title;
        }
        this.openPane('confirmdelete', viewId, 'view');
    }

    onClickCollapseHeader() {
        this.setState({ 
            collapseHeader: !this.state.collapseHeader,
        })
    }

    onClickNew() {
        const msg = id => this.props.intl.formatMessage({ id });
        const defaultTitle = msg('panes.personViews.newView.defaultTitle');

        let title = defaultTitle;

        // If there are other views named exactly like defaultTitle, find the
        // next numeric suffix and append it
        if (this.props.views.viewList && this.props.views.viewList.items) {
            const titles = this.props.views.viewList.items.map(item => item.data.title);

            // Find all unnamed views and extract suffixes,
            // using zero to represent no suffix
            const suffixes = titles
                .filter(title => title.indexOf(defaultTitle) === 0)
                .map(title => title.substr(defaultTitle.length + 1).trim())
                .map(suffix => suffix == ''? 0 : parseInt(suffix))
                .filter(suffix => !isNaN(suffix));

            if (suffixes.length) {
                const max = Math.max.apply(null, suffixes);
                const suffix = max + 1;
                title = `${defaultTitle} ${suffix}`;
            }
        }

        const viewData = { title };

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
