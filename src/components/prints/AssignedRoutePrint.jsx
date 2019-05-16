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
            let cmp = a0.street.localeCompare(a1.street, 'en');

            if (cmp == 0) {
                cmp = a0.number - a1.number;
            }

            if (cmp == 0 && a0.suffix && a1.suffix) {
                cmp = a0.suffix.localeCompare(a1.suffix, 'en');
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
                            assignment={ this.props.assignment }
                            addresses={ addresses }
                            />
                        <InstructionsPage
                            getNextPageNumber={ getNextPageNumber }
                            assignment={ this.props.assignment }
                            addresses={ addresses }
                            route={ this.props.route }
                            ar={ this.props.ar }
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

                <Avatar orgId={ props.assignment.organization.id }
                    person={ props.assignee }/>
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
    let pageNumber = props.getNextPageNumber();
    let routeDescription = null;

    return (
        <div className="AssignedRoutePrint-instructionsPage">
            <h1>{ props.assignment.title }</h1>
            <div className="AssignedRoutePrint-assignmentDescription">
                { props.assignment.description }
            </div>

            <div className="AssignedRoutePrint-instructions"
                dangerouslySetInnerHTML={{ __html: instructions }}
                />

            <div className="AssignedRoutePrint-routeDescription">
                <h1><Route route={ props.route }/></h1>
                <p>{ props.route.info_text }</p>
                <AddressSummary
                    addresses={ props.addresses }/>
            </div>

            <PageFooter pageNumber={ pageNumber }
                route={ props.route }
                ar={ props.ar }
                />
        </div>
    );
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

function AddressSummary(props) {
    let addressesByStreet = {};
    props.addresses.forEach(addr => {
        if (!addressesByStreet.hasOwnProperty(addr.street)) {
            addressesByStreet[addr.street] = [];
        }

        addressesByStreet[addr.street].push(addr);
    });

    let streetItems = Object.keys(addressesByStreet).map(street => {
        let curSeries = null;
        let series = [];
        let addresses = addressesByStreet[street];
        let prevNum = null;

        addresses.forEach(addr => {
            let number = parseInt(addr.number);

            if (!curSeries) {
                series.push(curSeries = [number]);
                prevNum = number;
            }
            else if (number && prevNum && number == (prevNum + 1)) {
                curSeries[1] = addr.number;
                prevNum = addr.number;
            }
            else {
                curSeries = null;
                prevNum = null;
            }
        });

        let seriesLabel = series
            .map(s => s.join('-'))
            .join(', ');

        return (
            <li key={ street }>
                <span className="AssignedRoutePrint-street">{ street }</span>
                <span className="AssignedRoutePrint-numbers">{ seriesLabel }</span>
            </li>
        );
    });

    return (
        <div className="AssignedRoutePrint-addressSummary">
            <Msg tagName="h2" id="prints.assignedRoute.addrSummary.h"/>
            <ul>
                { streetItems }
            </ul>
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
