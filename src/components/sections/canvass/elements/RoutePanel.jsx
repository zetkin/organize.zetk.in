import React from 'react';
import cx from 'classnames';

import Button from '../../../misc/Button';
import LoadingIndicator from '../../../misc/LoadingIndicator';
import RouteList from './RouteList';
import SelectInput from '../../../forms/inputs/SelectInput';
import { FormattedMessage as Msg } from 'react-intl';


export default class RoutePanel extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            viewMode: 'routes',
            generator: {
                viewMode: 'intro',
                selection: 'filter',
                households: 300,
            },
        };
    }

    render() {
        let content;
        let classes;

        if (this.state.viewMode == 'routes') {
            content = this.renderRouteList();
        }
        else if (this.state.viewMode == 'generator') {
            content = this.renderGenerator();
        }

        classes = cx('RoutePanel', this.state.viewMode);

        return (
            <div className={ classes }>
                <div className="RoutePanel-tabs">
                    <Button
                        className="RoutePanel-routesTab"
                        labelMsg="panes.allRoutes.routePanel.tabs.routes"
                        onClick={ this.onTabClick.bind(this, 'routes') }
                        />
                    <Button
                        className="RoutePanel-generatorTab"
                        labelMsg="panes.allRoutes.routePanel.tabs.generator"
                        onClick={ this.onTabClick.bind(this, 'generator') }
                        />
                </div>
                <div className="RoutePanel-content">
                    { content }
                </div>
            </div>
        );
    }

    renderRouteList() {
        let routeList = this.props.routeList;

        if (!routeList || routeList.items.length == 0) {
        }
        else if (routeList.isPending) {
        }
        else {
            return (
                <RouteList list={ routeList }
                    onRouteMouseOver={ this.onRouteMouseOver.bind(this) }
                    onRouteMouseOut={ this.onRouteMouseOut.bind(this) }
                    />
            );
        }
    }

    renderGenerator() {
        let generator = this.props.generator;
        let draftList = this.props.draftList;

        if (this.state.generator.viewMode == 'intro') {
            return (
                <div className="RoutePanel-intro">
                    <div className="RoutePanel-introIcon"/>
                    <h2>
                        <Msg id="panes.allRoutes.routePanel.intro.h"/>
                    </h2>
                    <p>
                        <Msg id="panes.allRoutes.routePanel.intro.p"/>
                    </p>
                    <Button
                        className="RoutePanel-introStartButton"
                        labelMsg="panes.allRoutes.routePanel.intro.startButton"
                        onClick={ this.onStartButtonClick.bind(this) }
                        />
                </div>
            );
        }
        else if (generator.isPending) {
            let count = generator.info.routesCompleted;

            return (
                <div className="RoutePanel-progress">
                    <LoadingIndicator />
                    <h2 className="RoutePanel-progressCount">
                        <Msg id="panes.allRoutes.routePanel.progress.counting"
                            values={{ count }}/>
                    </h2>
                </div>
            );
        }
        else if (draftList && draftList.items) {
            return (
                <div className="RoutePanel-drafts">
                    <div className="RoutePanel-draftsContent">
                        <div className="RoutePanel-draftsInfo">
                            <h3 className="RoutePanel-draftsInfoTitle">
                                <Msg id="panes.allRoutes.routePanel.drafts.info.title"/>
                            </h3>
                            <p className="RoutePanel-draftsInfoText">
                                <Msg id="panes.allRoutes.routePanel.drafts.info.text"/>
                            </p>
                        </div>
                        <RouteList list={ draftList }
                            onRouteMouseOver={ this.onRouteMouseOver.bind(this) }
                            onRouteMouseOut={ this.onRouteMouseOut.bind(this) }
                            />
                    </div>
                    <div className="RoutePanel-buttons">
                        <Button
                            className="RoutePanel-discardButton"
                            labelMsg="panes.allRoutes.routePanel.drafts.discard"
                            onClick={ this.props.onDiscardDrafts }
                            />
                        <Button
                            className="RoutePanel-commitButton"
                            labelMsg="panes.allRoutes.routePanel.drafts.commit"
                            onClick={ this.props.onCommitDrafts }
                            />
                    </div>
                </div>
            );
        }
        else {
            let selectionOptions = {
                'all': 'panes.allRoutes.routePanel.form.selection.all',
                'filter': 'panes.allRoutes.routePanel.form.selection.filter',
            };

            return (
                <div className="RoutePanel-form">
                    <h2 className="RoutePanel-formSelection">
                        <Msg id="panes.allRoutes.routePanel.form.selection.h"/>
                    </h2>
                    <SelectInput name="selection" options={ selectionOptions }
                        value={ this.state.generator.selection }
                        onValueChange={ this.onGeneratorChange.bind(this) }
                        optionLabelsAreMessages={ true }
                        />

                    <h2 className="RoutePanel-formSettings">
                        <Msg id="panes.allRoutes.routePanel.form.settings.h"/>
                    </h2>
                    <div className="RoutePanel-formHouseholds">
                        <h3 className="RoutePanel-formHouseholdsTitle">
                            <Msg id="panes.allRoutes.routePanel.form.settings.households.h"/>
                        </h3>
                        <input className="RoutePanel-formHouseholdsInput"
                            name="routeGenHouseholds"
                            onChange={ ev => this.onGeneratorChange('households', ev.target.value) }
                            value={ this.state.generator.households }
                            />
                        <Msg tagName="label"
                            id="panes.allRoutes.routePanel.form.settings.households.label"/>
                    </div>
                    <Button
                        className="RoutePanel-generateButton"
                        labelMsg="panes.allRoutes.routePanel.form.generateButton"
                        onClick={ this.onGenerateButtonClick.bind(this) }
                        />
                </div>
            );
        }
    }

    onTabClick(tab) {
        this.setState({
            viewMode: tab,
        });
    }

    onStartButtonClick() {
        this.setState({
            generator: Object.assign({}, this.state.generator, {
                viewMode: 'form',
            }),
        });
    }

    onGeneratorChange(option, value) {
        this.setState({
            generator: Object.assign({}, this.state.generator, {
                [option]: value,
            }),
        });
    }

    onGenerateButtonClick() {
        if (this.props.onGenerate) {
            let addresses;

            if (this.state.generator.selection == 'filter') {
                console.log('FILTER ADDRESSES');
                addresses = this.props.filteredAddressesSelector();
            }
            else {
                addresses = this.props.addressList.items.map(i => i.data);
            }

            let config = {
                routeSize: parseInt(this.state.generator.households) || 300,
            };

            this.props.onGenerate(addresses.map(a => a.id), config);
        }
    }

    onRouteMouseOver(route) {
        if (this.props.onRouteMouseOver) {
            this.props.onRouteMouseOver(route);
        }
    }

    onRouteMouseOut(route) {
        if (this.props.onRouteMouseOut) {
            this.props.onRouteMouseOut(route);
        }
    }
}
