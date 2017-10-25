import React from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import RouteForm from '../forms/RouteForm';
import { getListItemById } from '../../utils/store';
import {
    retrieveRoute,
    updateRoute,
} from '../../actions/route';


const mapStateToProps = (state, props) => {
    return {
        routeItem: getListItemById(state.routes.routeList, props.paneData.params[0]),
    };
};

@connect(mapStateToProps)
@injectIntl
export default class EditRoutePane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveRoute(this.getParam(0)));
    }

    getRenderData() {
        return {
            routeItem: this.props.routeItem
        }
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage(
            { id: 'panes.editRoute.title' });
    }

    renderPaneContent(data) {
        if (data.routeItem) {
            return [
                <RouteForm key="form" ref="form"
                    route={ data.routeItem.data }
                    onSubmit={ this.onSubmit.bind(this) }/>,
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    renderPaneFooter(data) {
        return (
            <Button className="EditRoutePane-saveButton"
                labelMsg="panes.editRoute.saveButton"
                onClick={ this.onSubmit.bind(this) }/>
        );
    }

    onSubmit(ev) {
        ev.preventDefault();

        let values = this.refs.form.getChangedValues();
        if (values.title == '') {
            values.title = null;
        }

        let routeId = this.getParam(0);

        this.props.dispatch(updateRoute(routeId, values));
        this.closePane();
    }
}
