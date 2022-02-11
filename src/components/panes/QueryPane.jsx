import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import PaneBase from './PaneBase';
import InfoList from '../misc/InfoList';
import PersonList from '../lists/PersonList';
import { getListItemById } from '../../utils/store';
import { retrieveQuery, retrieveQueryMatches } from '../../actions/query';
import LoadingIndicator from '../misc/LoadingIndicator';

const mapStateToProps = (state, props) => ({
    queryItem: getListItemById(state.queries.queryList,
        props.paneData.params[0]),
    activeOrg: state.org.activeId,
});

@connect(mapStateToProps)
export default class QueryPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();

        let queryId = this.getParam(0);
        this.props.dispatch(retrieveQuery(queryId));
        this.props.dispatch(retrieveQueryMatches(queryId));
    }

    componentWillReceiveProps(nextProps) {
        let queryItem = nextProps.queryItem;

        if (!queryItem) {
            return this.closePane();
        }

        // Load query matches if not already loaded (or loading)
        if (queryItem && queryItem.data && !queryItem.data.matchList) {
            let queryId = this.getParam(0);
            this.props.dispatch(retrieveQueryMatches(queryId));
        }
    }

    getRenderData() {
        return {
            queryItem: this.props.queryItem,
            activeOrg: this.props.activeOrg,
        };
    }

    getPaneTitle(data) {
        return data.queryItem? data.queryItem.data.title : '';
    }

    getPaneSubTitle(data) {
        if (data.queryItem && 
            data.queryItem.data && 
            data.queryItem.data.organization && 
            data.queryItem.data.organization.id == data.activeOrg) {

            return (<a key="editLink" onClick={ this.onEditClick.bind(this) }>
                <Msg id="panes.query.editLink"/>
            </a>);
        } else {
            return null;
        }
    }

    renderPaneContent(data) {
        let item = data.queryItem;
        if (item && item.data && item.data.matchList) {
            let matchList = item.data.matchList;
            let content = []; 

            let summary = [
                { name: 'desc', value: data.queryItem.data.info_text },
            ];
 
            if (item.data.organization && item.data.organization.id != data.activeOrg) {
                summary.push({
                    name: 'ownership',
                    msgId: `panes.query.summary.ownership`,
                    msgValues: {
                        organization: item.data.organization.title,
                    }
                })
            } else {
                summary.push({
                    name: 'org_access',
                    msgId: `panes.query.summary.orgAccess.${item.data.org_access}`,
                })
            }

            if (!matchList.isPending) {
                summary.push({ name: 'size',
                               msgId: 'panes.query.summary.size',
                               msgValues: { size: matchList.items.length } });
            }

            summary.push({
                name: 'diff',
                msgId: 'panes.query.summary.diff',
                onClick: () => this.openPane('querydiff', item.data.id),
            });

            summary.push({
                name: 'refresh',
                msgId:  "panes.query.summary.refresh",
                onClick: () => this.props.dispatch(retrieveQueryMatches(this.getParam(0)))
            })

            content = content.concat([
                <InfoList key="infoList" data={summary} />,
            ]);

            if (!matchList.isPending) {
                content.push(
                    <PersonList key="peopleList" personList={ matchList }
                        onItemClick={ this.onPersonItemClick.bind(this) }/>
                );
            } else {
                content.push(
                    <LoadingIndicator key="loadingIndicator"/>
                );
            }

            return content;
        }
    }

    onPersonItemClick(personItem, ev) {
        if (ev && ev.altKey) {
            this.openPane('editperson', personItem.data.id);
        }
        else {
            this.openPane('person', personItem.data.id);
        }
    }

    onEditClick(ev) {
        this.openPane('editquery', this.getParam(0));
    }
}
