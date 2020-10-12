import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import EditableText from '../../misc/EditableText';
import LoadingIndicator from '../../misc/LoadingIndicator';
import PersonViewTable from '../../misc/personViews/PersonViewTable';
import RootPaneBase from '../RootPaneBase';
import {
    addPersonViewRow,
    createPersonView,
    retrievePersonView,
    retrievePersonViewColumns,
    retrievePersonViewRows,
    retrievePersonViews,
    updatePersonView,
} from '../../../actions/personView';
import { getListItemById } from '../../../utils/store';


const mapStateToProps = state => ({
    views: state.personViews,
});


@connect(mapStateToProps)
@injectIntl
export default class PersonViewsPane extends RootPaneBase {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();

        const viewId = this.getParam(0);
        if (viewId) {
            this.props.dispatch(retrievePersonView(viewId));
            this.props.dispatch(retrievePersonViewColumns(viewId));
            this.props.dispatch(retrievePersonViewRows(viewId));
        }
        else {
            this.props.dispatch(retrievePersonViews());
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.paneData != this.props.paneData) {
            const viewId = this.getParam(0);
            if (viewId && viewId != 'news') {
                this.props.dispatch(retrievePersonView(viewId));
                this.props.dispatch(retrievePersonViewColumns(viewId));
                this.props.dispatch(retrievePersonViewRows(viewId));
            }
            else {
                this.props.dispatch(retrievePersonViews());
            }
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
                return [
                    <a key="backLink"
                        onClick={ () => this.gotoPane('views') }
                        >
                        <Msg id="panes.personViews.view.backLink"/>
                    </a>,
                    <EditableText tagName="h1" key="title"
                        content={ viewItem.data.title }
                        onChange={ this.onChange.bind(this, 'title') }
                        placeholder={ this.props.intl.formatMessage({ id: 'panes.personViews.placeholders.title' }) }
                        />,
                    <EditableText tagName="p" key="description"
                        content={ viewItem.data.description }
                        onChange={ this.onChange.bind(this, 'description') }
                        placeholder={ this.props.intl.formatMessage({ id: 'panes.personViews.placeholders.description' }) }
                        />,
                    <div key="view">
                        <PersonViewTable
                            viewId={ viewId }
                            openPane={ this.openPane.bind(this) }
                            columnList={ this.props.views.columnsByView[viewId] }
                            rowList={ this.props.views.rowsByView[viewId] }
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
}
