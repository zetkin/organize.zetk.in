import React from 'react/addons';

import ActionLocationItem from './ActionLocationItem';


export default class ActionLocations extends React.Component {
    render() {
        const actions = this.props.actions;
        const locations = {};

        var i;

        for (i = 0; i < actions.length; i++) {
            var action = actions[i];
            var loc = action.location;

            if (!locations.hasOwnProperty(loc.id)) {
                locations[loc.id] = {
                    loc: loc,
                    numMorningActions: 0,
                    numNoonActions: 0,
                    numAfternoonActions: 0,
                    numEveningActions: 0,
                    numNightActions: 0
                };
            }

            var startTime = new Date(action.start_time);
            var hour = startTime.getHours();

            if (hour <= 4 || hour > 22) {
                locations[loc.id].numNightActions++;
            }
            else if (hour <= 9) {
                locations[loc.id].numMorningActions++;
            }
            else if (hour <= 13) {
                locations[loc.id].numNoonActions++;
            }
            else if (hour <= 17) {
                locations[loc.id].numAfternoonActions++;
            }
            else if (hour <= 22) {
                locations[loc.id].numEveningActions++;
            }
        }

        const numLocations = Object.keys(locations).length;
        const average = actions.length / numLocations;

        return (
            <ul className="actionlocations">
                {Object.keys(locations).map(function(id) {
                    const loc = locations[id].loc;
                    const counts = locations[id]

                    return <ActionLocationItem key={ id } location={ loc }
                            numActionsAverage={ average }
                            numMorningActions={ counts.numMorningActions }
                            numNoonActions={ counts.numNoonActions }
                            numAfternoonActions={ counts.numAfternoonActions }
                            numEveningActions={ counts.numEveningActions }
                            numNightActions={ counts.numNightActions }/>
                })}
            </ul>
        );
    }
}

ActionLocations.propTypes = {
    actions: React.PropTypes.array.isRequired
};
