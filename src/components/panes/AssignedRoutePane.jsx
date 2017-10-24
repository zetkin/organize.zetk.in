import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';
import cx from 'classnames';

import PaneBase from './PaneBase';
import Avatar from '../misc/Avatar';
import Link from '../misc/Link';
import InfoList from '../misc/InfoList';
import LoadingIndicator from '../misc/LoadingIndicator';
import PersonSelectWidget from '../misc/PersonSelectWidget';
import { getListItemById } from '../../utils/store';


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
                <div key="assignee" className="AssignedRoutePane-assignee">
                    <Msg tagName="h3" id="panes.assignedRoute.assignee.h"/>
                    <PersonSelectWidget
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
}
