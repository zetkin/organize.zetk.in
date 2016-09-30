import React from 'react';
import { connect } from 'react-redux';

import CampaignSectionPaneBase from './CampaignSectionPaneBase';
import CampaignSelect from '../../misc/CampaignSelect';
import CampaignPlayer from '../../misc/campaignplayer/CampaignPlayer';
import ActionMiniCalendar from '../../misc/actioncal/ActionMiniCalendar';
import { getLocationAverage } from '../../../utils/location';
import { retrieveActions } from '../../../actions/action';
import { retrieveLocations } from '../../../actions/location';
import { filteredActionList } from '../../../store/actions';


const mapStateToProps = state => ({
    locations: state.locations,
    filteredActionList: filteredActionList(state)
});

@connect(mapStateToProps)
export default class CampaignPlaybackPane extends CampaignSectionPaneBase {
    getPaneTitle() {
        return 'Campaign playback';
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrieveActions());
        this.props.dispatch(retrieveLocations());
    }

    renderPaneTop() {
        let actionList = this.props.filteredActionList;
        let actions = actionList.items.map(i => i.data);

        return <ActionMiniCalendar actions={ actions }
                    onSelectDay={ this.onSelectDay.bind(this) }
                    onAddAction={ this.onCalendarAddAction.bind(this) }
                    onMoveAction={ this.onCalendarMoveAction.bind(this) }
                    onSelectAction={ this.onSelectAction.bind(this) }/>
    }

    renderPaneContent() {
        let actionList = this.props.filteredActionList;
        let actions = actionList.items.map(i => i.data);

        let locList = this.props.locations.locationList;
        let locations = locList.items.map(i => i.data);
        let center = getLocationAverage(locList);

        return (
            <CampaignPlayer key="player"
                actions={ actions } locations={ locations }
                centerLat={ center.lat } centerLng={ center.lng }/>
        );
    }

    getPaneTools() {
        return (
            <CampaignSelect
                onCreate={ this.onCreateCampaign.bind(this) }
                onEdit={ this.onEditCampaign.bind(this) }/>
        );
    }
}
