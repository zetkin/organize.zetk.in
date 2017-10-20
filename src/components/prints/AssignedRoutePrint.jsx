import url from 'url';
import geodist from 'geodist';
import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';

import Avatar from '../misc/Avatar';
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
                            ar={ this.props.ar }
                            route={ this.props.route }
                            assignee={ this.props.assignee }
                            addresses={ this.props.routeAddresses }
                            />
                        <InstructionsPage
                            assignment={ this.props.assignment }
                            />
                        <AddressPages
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
            <header>
                <div className="AssignedRoutePrint-route">
                    <Msg id="prints.assignedRoute.header.route"
                        values={{ route: props.route.id }}/>
                </div>
                <div className="AssignedRoutePrint-assignedRoute">
                    # { props.ar.id }
                </div>
            </header>

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

            <AddressMap addresses={ props.addresses }
                />
        </div>
    );
}


function InstructionsPage(props) {
    let instructions = props.assignment.instructions;

    if (instructions) {
        return (
            <div className="AssignedRoutePrint-instructionsPage">
                <h1>{ props.assignment.title }</h1>
                <div className="AssignmentRoutePrint-instructions"
                    dangerouslySetInnerHTML={{ __html: instructions }}
                    />
            </div>
        );
    }
    else {
        return null;
    }
}

function AddressPages(props) {
    return (
        <div className="AssignedRoutePrint-addrPages">
            <div className="AssignedRoutePrint-addrPage">
            </div>
        </div>
    );
}
