import url from 'url';
import geodist from 'geodist';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Avatar from '../misc/Avatar';
import Route from '../misc/elements/Route';
import AddressMap from '../sections/canvass/elements/AddressMap';
import InfoList from '../misc/InfoList';


const mapStateToProps = state => {
    return {
        ...state.prints.printData,
    };
};


@connect(mapStateToProps)
export default class AssignedRoutePrint extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let stateJson = JSON.stringify(this.props.initialState);
        let addresses = this.props.routeAddresses.concat().sort((a0, a1) => {
            let cmp = a0.street.localeCompare(a1.street);

            if (cmp == 0) {
                cmp = a0.number - a1.number;
            }

            if (cmp == 0 && a0.suffix && a1.suffix) {
                cmp = a0.suffix.localeCompare(a1.suffix);
            }

            return cmp;
        });

        let pageNumber = 1;
        let getNextPageNumber = () => pageNumber++;

        return (
            <html>
                <head>
                    <Msg tagName="title" id="prints.assignedRoute.title"/>
                    <script src="/static/main.js"></script>
                    <link rel="stylesheet" type="text/css"
                        href="/static/css/style.css"/>
                    <script type="text/javascript"
                          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCih1zeZELzFJxP2SFkNJVDLs2ZCT_y3gY&libraries=visualization,geometry"/>
                    <link rel="icon" type="image/png"
                        href="/static/images/favicon.png"/>
                </head>
                <body data-component="AssignedRoutePrint" className="AssignedRoutePrint">
                    <div className="AssignedRoutePrint-pages">
                        <SummaryPage
                            getNextPageNumber={ getNextPageNumber }
                            ar={ this.props.ar }
                            route={ this.props.route }
                            assignee={ this.props.assignee }
                            addresses={ addresses }
                            />
                        <InstructionsPage
                            getNextPageNumber={ getNextPageNumber }
                            assignment={ this.props.assignment }
                            />
                        <AddressPages
                            getNextPageNumber={ getNextPageNumber }
                            ar={ this.props.ar }
                            route={ this.props.route }
                            addresses={ addresses }
                            />
                    </div>
                    <script type="text/json"
                        id="App-initialState"
                        dangerouslySetInnerHTML={{ __html: stateJson }}/>
                </body>
            </html>
        );
    }
}

function SummaryPage(props) {
    let assigneeInfo;
    let pageNumber = props.getNextPageNumber();

    if (props.assignee) {
        assigneeInfo = (
            <div className="AssignedRoutePrint-assignee">
                <Msg tagName="h2" id="prints.assignedRoute.assignee.h"/>

                <Avatar person={ props.assignee }/>
                <InfoList data={[
                    { name: 'name', value: props.assignee.first_name + ' ' + props.assignee.last_name },
                    { name: 'email', value: props.assignee.email },
                    { name: 'phone', value: props.assignee.phone },
                ]}/>
            </div>
        );
    }
    else {
        assigneeInfo = (
            <div className="AssignedRoutePrint-unassigned">
                <Msg tagName="h2" id="prints.assignedRoute.unassigned.h"/>

                <div className="AssignedRoutePrint-assigneeName">
                    <Msg id="prints.assignedRoute.unassigned.name"/>
                </div>
                <div className="AssignedRoutePrint-assigneePhone">
                    <Msg id="prints.assignedRoute.unassigned.phone"/>
                </div>
                <div className="AssignedRoutePrint-assigneeEmail">
                    <Msg id="prints.assignedRoute.unassigned.email"/>
                </div>
            </div>
        );
    }

    let addressCount = props.addresses.length;
    let householdCount = props.addresses.reduce(
        (sum, addr) => sum + addr.household_count, 0);

    let min = { lat: Infinity, lon: Infinity };
    let max = { lat: -Infinity, lon: -Infinity };
    props.addresses.forEach(addr => {
        min.lat = Math.min(min.lat, addr.latitude);
        min.lon = Math.min(min.lon, addr.longitude);
        max.lat = Math.max(max.lat, addr.latitude);
        max.lon = Math.max(max.lon, addr.longitude);
    });

    let radius = geodist(min, max, { unit: 'meters' });

    return (
        <div className="AssignedRoutePrint-introPage">
            <h1><Route route={ props.route }/></h1>
            <div className="AssignedRoutePrint-info">
                <InfoList data={[
                    { name: 'radius', msgId: 'prints.assignedRoute.info.radius',
                        msgValues: { radius }},
                    { name: 'addresses', msgId: 'prints.assignedRoute.info.addresses',
                        msgValues: { count: addressCount }},
                    { name: 'households', msgId: 'prints.assignedRoute.info.households',
                        msgValues: { count: householdCount }},
                ]}/>
            </div>

            { assigneeInfo }

            <div className="AssignedRoutePrint-status">
                <div className="AssignedRoutePrint-assignedDate">
                    <Msg id="prints.assignedRoute.status.assigned"/>
                </div>
                <div className="AssignedRoutePrint-returnedDate">
                    <Msg id="prints.assignedRoute.status.returned"/>
                </div>
                <div className="AssignedRoutePrint-completed">
                    <Msg id="prints.assignedRoute.status.completed"/>
                </div>
            </div>

            <AddressMap addresses={ props.addresses }
                mode="browse"
                />

            <PageFooter pageNumber={ pageNumber }
                route={ props.route }
                ar={ props.ar }
                />
        </div>
    );
}


function InstructionsPage(props) {
    let instructions = props.assignment.instructions;

    if (instructions) {
        let pageNumber = props.getNextPageNumber();

        return (
            <div className="AssignedRoutePrint-instructionsPage">
                <h1>{ props.assignment.title }</h1>
                <div className="AssignmentRoutePrint-instructions"
                    dangerouslySetInnerHTML={{ __html: instructions }}
                    />

                <PageFooter pageNumber={ pageNumber }
                    route={ props.route }
                    ar={ props.ar }
                    />
            </div>
        );
    }
    else {
        return null;
    }
}

function AddressPages(props) {
    let curPage = null;
    let pageData = [];

    props.addresses.forEach(addr => {
        if (!curPage || curPage.addresses.length == 56) {
            pageData.push(curPage = {
                addresses: [],
            });
        }

        curPage.addresses.push(addr);
    });

    let pages = pageData.map(page => {
        let pageNumber = props.getNextPageNumber();

        let addressItems = page.addresses.map(addr => {
            return (
                <li key={ addr.id }
                    className="AssignedRoutePrint-addressListItem">
                    <span className="AssignedRoutePrint-address">
                        { addr.street } { addr.number }{ addr.suffix }</span>
                    <span className="AssignedRoutePrint-households">
                        { addr.household_count }</span>
                    <span className="AssignedRoutePrint-visited"/>
                </li>
            );
        });

        return (
            <div key={ pageNumber }
                className="AssignedRoutePrint-addrPage">

                <div className="AssignedRoutePrint-addrIntro">
                    <Msg tagName="h2" id="prints.assignedRoute.addrList.h"/>
                    <Msg tagName="p" id="prints.assignedRoute.addrList.instructions"/>
                </div>

                <ul className="AssignedRoutePrint-addressList">
                    { addressItems }
                </ul>

                <PageFooter pageNumber={ pageNumber }
                    route={ props.route }
                    ar={ props.ar }
                    />
            </div>
        );
    });

    return (
        <div className="AssignedRoutePrint-addrPages">
            { pages }
        </div>
    );
}

function PageFooter(props) {
    return (
        <footer className="AssignedRoutePrint-footer">
            <div className="AssignedRoutePrint-route">
                <Msg id="prints.assignedRoute.header.route"
                    values={{ route: props.route.id }}/>
            </div>
            <div className="AssignedRoutePrint-logo">
                <img alt="Zetkin" title="Zetkin"
                    src="/static/images/logo-zetkin-hori-black.png"/>
            </div>
            <div className="AssignedRoutePrint-assignedRoute">
                <span># { props.ar.id }</span>
                <Msg id="prints.assignedRoute.header.page"
                    values={{ pageNumber: props.pageNumber }}
                    />
            </div>
        </footer>
    );
};
