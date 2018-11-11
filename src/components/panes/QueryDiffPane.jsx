import React from 'react';
import cx from 'classnames';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import DraggableAvatar from '../misc/DraggableAvatar';
import PaneBase from './PaneBase';
import InfoList from '../misc/InfoList';
import PersonList from '../lists/PersonList';
import SelectInput from '../forms/inputs/SelectInput';
import { getListItemById } from '../../utils/store';
import { retrieveQueries, retrieveQueryMatches } from '../../actions/query';
import LoadingIndicator from '../misc/LoadingIndicator';

const mapStateToProps = state => ({
    queryList: state.queries.queryList,
});

@injectIntl
@connect(mapStateToProps)
export default class QueryDiffPane extends PaneBase {
    constructor(props) {
        super(props);

        this.state = Object.assign({}, this.state, {
            q0: props.paneData.params[0] || null,
            q1: props.paneData.params[1] || null,
        });
    }

    componentDidMount() {
        super.componentDidMount();

        let queryId = this.getParam(0);
        this.props.dispatch(retrieveQueries());

        if (this.state.q0) {
            this.props.dispatch(retrieveQueryMatches(this.state.q0));
        }

        if (this.state.q1) {
            this.props.dispatch(retrieveQueryMatches(this.state.q1));
        }
    }

    getPaneTitle(data) {
        return this.props.intl.formatMessage({ id: 'panes.queryDiff.title' });
    }

    renderPaneContent(data) {
        const queryList = this.props.queryList;

        if (queryList && queryList.items && !queryList.isPending) {
            const queryOptions = {};
            queryList.items.forEach(item => {
                queryOptions[item.data.id] = item.data.title;
            });

            let diffList = null;
            if (this.state.q0 && this.state.q1) {
                diffList = this.renderDiffList();
            }

            return [
                <div key="queries">
                    <SelectInput name="q0"
                        value={ this.state.q0 }
                        labelMsg="panes.queryDiff.queries.first"
                        options={ queryOptions }
                        orderAlphabetically={ true }
                        nullOptionMsg="panes.queryDiff.queries.nullOption"
                        onValueChange={ this.onQueryChange.bind(this) }
                        />
                    <SelectInput name="q1"
                        value={ this.state.q1 }
                        labelMsg="panes.queryDiff.queries.second"
                        options={ queryOptions }
                        orderAlphabetically={ true }
                        nullOptionMsg="panes.queryDiff.queries.nullOption"
                        onValueChange={ this.onQueryChange.bind(this) }
                        />
                </div>,
                <div key="matches">
                    { diffList }
                </div>
            ];
        }
    }

    renderDiffList() {
        const item0 = getListItemById(this.props.queryList, this.state.q0);
        const item1 = getListItemById(this.props.queryList, this.state.q1);
        const q0 = item0.data;
        const q1 = item1.data;

        if (!q0 || !q0.matchList || !q1 || !q1.matchList) {
            return null;
        }

        if (q0.matchList.isPending || q1.matchList.isPending) {
            return <LoadingIndicator/>;
        }

        if (!q0.matchList.items || !q1.matchList.items) {
            return null;
        }

        let matches = [];
        const matchesById = {};
        q0.matchList.items.forEach(item => {
            matchesById[item.data.id] = [true, false];
            matches.push(item.data);
        });

        q1.matchList.items.forEach(item => {
            if (!matchesById[item.data.id]) {
                matchesById[item.data.id] = [false];
                matches.push(item.data);
            }

            matchesById[item.data.id][1] = true;
        });

        matches = matches
            .map(m => {
                const inLists = matchesById[m.id];
                if (inLists[0] && inLists[1]) {
                    m.score = 5;
                }
                else if (inLists[0]) {
                    m.score = 10;
                }
                else {
                    m.score = 0;
                }

                return m;
            })
            .sort((m0, m1) => {
                const diff = m1.score - m0.score;
                if (diff == 0) {
                    return m0.first_name.localeCompare(m1.first_name)
                        + m0.last_name.localeCompare(m1.last_name);
                }
                else {
                    return diff;
                }
            });

        const matchItems = matches.map(person => {
            const inFirst = matchesById[person.id][0];
            const inSecond = matchesById[person.id][1];
            const classes = cx('QueryDiffPane-matchItem', { inFirst, inSecond });

            const inListMsg = 'panes.queryDiff.matches.inList';
            const notInListMsg = 'panes.queryDiff.matches.notInList';

            return (
                <li key={ person.id } className={ classes }>
                    <div className="QueryDiffPane-matchStatus">
                    </div>
                    <DraggableAvatar person={ person }/>
                    <div className="QueryDiffPane-matchMeta">
                        <div className="QueryDiffPane-matchName">
                            { person.first_name + ' ' + person.last_name }
                        </div>
                        <div className="QueryDiffPane-matchInFirst">
                            <Msg id={ inFirst? inListMsg : notInListMsg }
                                values={{ query: q0.title }}/>
                        </div>
                        <div className="QueryDiffPane-matchInSecond">
                            <Msg id={ inSecond? inListMsg : notInListMsg }
                                values={{ query: q1.title }}/>
                        </div>
                    </div>
                </li>
            );
        });

        return (
            <ul className="QueryDiffPane-matchItems">
                { matchItems }
            </ul>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.q0 && this.state.q0 != prevState.q0) {
            this.props.dispatch(retrieveQueryMatches(this.state.q0));
        }

        if (this.state.q1 && this.state.q1 != prevState.q1) {
            this.props.dispatch(retrieveQueryMatches(this.state.q1));
        }
    }

    onQueryChange(name, value) {
        this.setState({
            [name]: value,
        });
    }

    onPersonItemClick(personItem, ev) {
        if (ev && ev.altKey) {
            this.openPane('editperson', personItem.data.id);
        }
        else {
            this.openPane('person', personItem.data.id);
        }
    }
}
