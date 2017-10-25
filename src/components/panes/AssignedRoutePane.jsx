import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import Avatar from '../misc/Avatar';
import Button from '../misc/Button';
import ProgressBar from '../misc/ProgressBar';
import Link from '../misc/Link';
import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';
import PersonSelectWidget from '../misc/PersonSelectWidget';
import { getListItemById } from '../../utils/store';
import {
    retrieveAssignedRoute,
    retrieveAssignedRouteStats,
    updateAssignedRoute,
} from '../../actions/route';


const mapStateToProps = (state, props) => ({
    orgId: state.org.activeId,
    assignedRouteItem: getListItemById(state.routes.assignedRouteList,
        props.paneData.params[0])
});


@connect(mapStateToProps)
@injectIntl
export default class AssignedRoutePane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let arId = this.getParam(0);
        this.props.dispatch(retrieveAssignedRoute(arId));
        this.props.dispatch(retrieveAssignedRouteStats(arId));
    }

    getRenderData() {
        return {
            assignedRouteItem: this.props.assignedRouteItem,
        };
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.assignedRoute.title' });
    }

    renderPaneContent(data) {
        if (data.assignedRouteItem) {
            let ar = data.assignedRouteItem.data;
            let orgId = this.props.orgId;

            let progressContent = <LoadingIndicator/>;
            if (ar && ar.statsItem && ar.statsItem.data) {
                let stats = {
                    allocated: ar.statsItem.data.num_households_allocated,
                    visited: ar.statsItem.data.num_households_visited,
                };

                let progress = stats.visited / stats.allocated;

                progressContent = [
                    <ProgressBar key="bar"
                        progress={ progress }/>,
                    <Msg key="label" tagName="p"
                        id="panes.assignedRoute.progress.label"
                        values={ stats }
                        />,
                    <Button key="updateButton"
                        labelMsg="panes.assignedRoute.progress.updateButton"
                        onClick={ () => this.openPane('assignedroutevisits', ar.id) }
                        />,
                ];
            }

            return [
                <InfoList key="info" data={[
                    { name: 'assignment', value: ar.assignment.title,
                        onClick: () => this.openPane('canvassassignment', ar.assignment.id), },
                    { name: 'route', value: ar.route.id,
                        onClick: () => this.openPane('route', ar.route.id), },
                    { name: 'print', msgId: 'panes.assignedRoute.info.print',
                        href: '/prints/assigned_route/' + orgId + ',' + ar.id,
                        target: '_blank' },
                ]}/>,
                <div key="progress" className="AssignedRoutePane-progress">
                    <Msg tagName="h3" id="panes.assignedRoute.progress.h"/>
                    { progressContent }
                </div>,
                <div key="assignee" className="AssignedRoutePane-assignee">
                    <Msg tagName="h3" id="panes.assignedRoute.assignee.h"/>
                    <PersonSelectWidget
                        onSelect={ this.onAssigneeSelect.bind(this) }
                        person={ ar.canvasser }
                        />
                    <Msg tagName="p" id="panes.assignedRoute.assignee.p"/>
                </div>,
            ];
        }
        else {
            return <LoadingIndicator/>;
        }
    }

    onAssigneeSelect(person) {
        let arId = this.getParam(0);
        let data = {
            canvasser_id: person? person.id : null,
        };

        this.props.dispatch(updateAssignedRoute(arId, data));
    }
}
