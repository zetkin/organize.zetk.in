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

        // Load query matches if not already loaded (or loading)
        if (queryItem && queryItem.data && !queryItem.data.matchList) {
            console.log('No matches');
            let queryId = this.getParam(0);
            this.props.dispatch(retrieveQueryMatches(queryId));
        }
    }

    getRenderData() {
        return {
            queryItem: this.props.queryItem,
        };
    }

    getPaneTitle(data) {
        return data.queryItem? data.queryItem.data.title : '';
    }

    getPaneSubTitle(data) {
        return (
            <a key="editLink" onClick={ this.onEditClick.bind(this) }>
                <Msg id="panes.query.editLink"/>
            </a>
        );
    }

    renderPaneContent(data) {
        let item = data.queryItem;
        if (item && item.data && item.data.matchList) {
            let matchList = item.data.matchList;
            let content = [];

            let summary = [
              { name: 'desc', value: data.queryItem.data.info_text },
            ];

            if (!matchList.isPending) {
                summary.push({ name: 'size',
                               msgId: 'panes.query.summary.size',
                               msgValues: { size: matchList.items.length } });
            }

            content = content.concat([
                <InfoList key="infoList" data={summary} />,
            ]);

            if (!matchList.isPending) {
                content = content.concat([<PersonList key="peopleList" personList={ matchList }
                               onItemClick={ this.onPersonItemClick.bind(this) }/>])
            } else {
                content = content.concat([<LoadingIndicator />]);
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
