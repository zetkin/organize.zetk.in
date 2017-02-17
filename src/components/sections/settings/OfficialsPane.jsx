import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import OfficialList from '../../misc/officiallist/OfficialList';
import { createSelection } from '../../../actions/selection';
import {
    deleteOfficial,
    retrieveOfficials,
    setOfficialsRole,
    setOfficialRole
} from '../../../actions/official';


const mapStateToProps = state => ({
    activeMembership: state.user.activeMembership,
    officialList: state.officials.officialList,
});

@connect(mapStateToProps)
export default class OfficialsPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveOfficials());
    }

    renderPaneContent() {
        let officialList = this.props.officialList;
        let admins = officialList.items
            .filter(i => i.data.role === 'admin')
            .map(i => i.data);

        let organizers = officialList.items
            .filter(i => i.data.role === 'organizer')
            .map(i => i.data);

        let userProfile = this.props.activeMembership.profile;

        return [
            <div className="OfficialsPane-admins" key="admins">
                <Msg tagName="h1" id="panes.officials.admins.h"/>
                <Msg tagName="p" id="panes.officials.admins.desc"/>
                <OfficialList officials={ admins }
                    userProfile={ userProfile }
                    addMsg="panes.officials.admins.add"
                    selectLinkMsg="panes.officials.admins.selectLink"
                    onAdd={ this.onAdd.bind(this, 'admin') }
                    onRemove={ this.onRemove.bind(this) }
                    onSelect={ this.onSelect.bind(this, 'admin') }/>
            </div>,

            <div className="OfficialsPane-organizers" key="organizers">
                <Msg tagName="h1" id="panes.officials.organizers.h"/>
                <Msg tagName="p" id="panes.officials.organizers.desc"/>
                <OfficialList officials={ organizers }
                    userProfile={ userProfile }
                    addMsg="panes.officials.organizers.add"
                    selectLinkMsg="panes.officials.organizers.selectLink"
                    onAdd={ this.onAdd.bind(this, 'organizer') }
                    onRemove={ this.onRemove.bind(this) }
                    onSelect={ this.onSelect.bind(this, 'organizer') }/>
            </div>
        ];
    }

    onAdd(role, person) {
        if (person) {
            this.props.dispatch(setOfficialRole(person.id, role));
        }
        else {
            let instructions = 'Select people to be added as officials';

            let action = createSelection('person', null, instructions, ids => {
                this.props.dispatch(setOfficialsRole(ids, role));
            });

            this.props.dispatch(action);
            this.openPane('selectpeople', action.payload.id);
        }
    }


    onRemove(official) {
        this.props.dispatch(deleteOfficial(official.id));
    }

    onSelect(role, official) {
        this.openPane('person', official.id)
    }
}
