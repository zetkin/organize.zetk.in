import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import LoadingIndicator from '../../misc/LoadingIndicator';
import PersonViewTable from '../../misc/personViews/PersonViewTable';
import RootPaneBase from '../RootPaneBase';
import {
    addPersonViewRow,
    retrievePersonView,
    retrievePersonViewColumns,
    retrievePersonViewRows,
    retrievePersonViews,
} from '../../../actions/personView';
import { getListItemById } from '../../../utils/store';


const mapStateToProps = state => ({
    views: state.personViews,
});


@connect(mapStateToProps)
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
            if (viewId) {
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

        if (viewId) {
            const viewItem = getListItemById(this.props.views.viewList, viewId);
            if (viewItem) {
                return [
                    <a key="backLink"
                        onClick={ () => this.gotoPane('views') }
                        >
                        <Msg id="panes.personViews.view.backLink"/>
                    </a>,
                    <h1 key="title">{ viewItem.data.title }</h1>,
                    <p key="description">{ viewItem.data.description }</p>,
                    <div key="view">
                        <PersonViewTable
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
}
