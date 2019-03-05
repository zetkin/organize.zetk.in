import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import Avatar from '../../misc/Avatar';
import Button from '../../misc/Button';
import LoadingIndicator from '../../misc/LoadingIndicator';
import PersonQueryList from '../../lists/PersonQueryList';
import PersonTagList from '../../lists/PersonTagList';
import RootPaneBase from '../RootPaneBase';
import ViewSwitch from '../../misc/ViewSwitch';
import { findDuplicates, clearDuplicates } from '../../../actions/person';
import { retrieveQueries } from '../../../actions/query';
import { retrievePersonTags } from '../../../actions/personTag';


const mapStateToProps = state => ({
    tagList: state.personTags.tagList,
    queryList: state.queries.queryList,
    duplicateList: state.people.duplicateList,
});


@connect(mapStateToProps)
export default class ManagePeoplePane extends RootPaneBase {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'queries',
        };
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveQueries());
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.viewMode != prevState.viewMode) {
            if (this.state.viewMode == 'queries') {
                this.props.dispatch(retrieveQueries());
            }
            else if (this.state.viewMode == 'tags') {
                this.props.dispatch(retrievePersonTags());
            }
        }
    }

    renderPaneContent(data) {
        if (this.state.viewMode == 'queries') {
            let queryList = this.props.queryList;
            if (queryList && queryList.items) {
                queryList = Object.assign({}, queryList, {
                    items: queryList.items.filter(i => i.data.type == 'standalone'),
                });
            }

            return (
                <PersonQueryList queryList={ queryList }
                    onItemClick={ item => this.openPane('query', item.data.id) }
                    />
            );
        }
        else if (this.state.viewMode == 'tags') {
            let tagList = this.props.tagList;

            return (
                <PersonTagList tagList={ tagList }
                    onItemClick={ item => this.openPane('editpersontag', item.data.id) }
                    />
            );
        }
        else if (this.state.viewMode == 'duplicates') {
            let content = null;

            // TODO: Handle errors separately?
            if (!this.props.duplicateList || this.props.duplicateList.error) {
                content = [
                    <Msg key="h" tagName="h2"
                        id="panes.managePeople.duplicates.intro.h"/>,
                    <Msg key="p" tagName="p"
                        id="panes.managePeople.duplicates.intro.p"/>,
                    <Button key="button" className="ManagePeoplePane-findButton"
                        labelMsg="panes.managePeople.duplicates.intro.findButton"
                        onClick={ () => this.props.dispatch(findDuplicates()) }
                        />
                ];
            }
            else if (this.props.duplicateList.isPending) {
                content = <LoadingIndicator/>;
            }
            else if (this.props.duplicateList.items.length) {
                let items = this.props.duplicateList.items.map(i => {
                    let dup = i.data;
                    let objectItems = dup.objects.map(o => {
                        return (
                            <li key={ o.id }
                                onClick={ () => this.openPane('person', o.id) }>
                                <Avatar person={ o }/>
                                <span className="name">{ o.first_name + ' ' + o.last_name }</span>
                                <span className="email">{ o.email || '-' }</span>
                                <span className="phone">{ o.phone || '-' }</span>
                            </li>
                        );
                    });

                    return (
                        <div key={ dup.objects[0].id }
                            className="ManagePeoplePane-duplicateItem">
                            <Msg tagName="h2"
                                id="panes.managePeople.duplicates.item.h"
                                values={{ count: dup.objects.length }}
                                />
                            <ul className="ManagePeoplePane-objectList">
                                { objectItems }
                            </ul>
                            <Button className="ManagePeoplePane-mergeButton"
                                labelMsg="panes.managePeople.duplicates.item.mergeButton"
                                labelValues={{ count: dup.objects.length }}
                                onClick={ () => this.openPane('mergepeople', '$' + dup.objects[0].id) }
                                />
                        </div>
                    );
                });

                content = [
                    <div key="instructions"
                        className="ManagePeoplePane-instructions">
                        <Msg tagName="p" id="panes.managePeople.duplicates.instructions.p"
                            values={{ count: this.props.duplicateList.items.length }}/>
                        <Button className="ManagePeoplePane-resetButton"
                            labelMsg="panes.managePeople.duplicates.instructions.resetButton"
                            onClick={ () => this.props.dispatch(clearDuplicates()) }
                            />
                    </div>,
                    <div key="list" className="ManagePeoplePane-duplicateList">
                        { items }
                    </div>,
                ];
            }
            else {
                content = [
                    <Msg key="h" tagName="h2"
                        id="panes.managePeople.duplicates.empty.h"/>,
                    <Msg key="p" tagName="p"
                        id="panes.managePeople.duplicates.empty.p"/>,
                    <Button key="button" className="ManagePeoplePane-resetButton"
                        labelMsg="panes.managePeople.duplicates.empty.resetButton"
                        onClick={ () => this.props.dispatch(clearDuplicates()) }
                        />
                ];
            }

            return (
                <div className="ManagePeoplePane-duplicates">
                    { content }
                </div>
            );
        }
    }

    getPaneTools(data) {
        const viewStates = {
            'queries': 'panes.managePeople.viewMode.queries',
            'tags': 'panes.managePeople.viewMode.tags',
            'duplicates': 'panes.managePeople.viewMode.duplicates',
        };

        let tools = [
            <ViewSwitch key="viewSwitch"
                states={ viewStates } selected={ this.state.viewMode }
                onSwitch={ vs => this.setState({ viewMode: vs }) }
                />,
        ];

        if (this.state.viewMode == 'queries') {
            tools.push(
                <Button key="addButton"
                    className="ManagePeoplePane-addButton"
                    labelMsg="panes.managePeople.queries.addButton"
                    onClick={ () => this.openPane('addquery') }
                    />,
            );
        }
        else if (this.state.viewMode == 'tags') {
            tools.push(
                <Button key="addButton"
                    className="ManagePeoplePane-addButton"
                    labelMsg="panes.managePeople.tags.addButton"
                    onClick={ () => this.openPane('addpersontag') }
                    />,
            );
        }

        return tools;
    }
}
