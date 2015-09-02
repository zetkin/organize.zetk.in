import React from 'react/addons';

import ActionDistributionItem from './ActionDistributionItem';


export default class ActionDistribution extends React.Component {
    render() {
        const field = this.props.instanceField;
        const actions = this.props.actions;
        const instances = {};

        var i;

        for (i = 0; i < actions.length; i++) {
            var action = actions[i];
            var inst = action[field];

            if (!instances.hasOwnProperty(inst.id)) {
                instances[inst.id] = {
                    inst: inst,
                    numMorningActions: 0,
                    numNoonActions: 0,
                    numAfternoonActions: 0,
                    numEveningActions: 0,
                    numNightActions: 0
                };
            }

            var startTime = new Date(action.start_time);
            var hour = startTime.getUTCHours();

            // TODO: Don't duplicate these constants in ActionStore
            if (hour <= 4 || hour > 22) {
                instances[inst.id].numNightActions++;
            }
            else if (hour <= 9) {
                instances[inst.id].numMorningActions++;
            }
            else if (hour <= 13) {
                instances[inst.id].numNoonActions++;
            }
            else if (hour <= 17) {
                instances[inst.id].numAfternoonActions++;
            }
            else if (hour <= 22) {
                instances[inst.id].numEveningActions++;
            }
        }

        const numInstances = Object.keys(instances).length;
        const average = actions.length / numInstances;

        return (
            <ul className="actiondistro">
                {Object.keys(instances).map(function(id) {
                    const inst = instances[id].inst;
                    const counts = instances[id]

                    return <ActionDistributionItem key={ id } instance={ inst }
                            numActionsAverage={ average }
                            numMorningActions={ counts.numMorningActions }
                            numNoonActions={ counts.numNoonActions }
                            numAfternoonActions={ counts.numAfternoonActions }
                            numEveningActions={ counts.numEveningActions }
                            numNightActions={ counts.numNightActions }
                            onMouseOver={ this.props.onMouseOver }
                            onMouseOut={ this.props.onMouseOut }
                            onMouseOverPhase={ this.props.onMouseOverPhase }/>
                }, this)}
            </ul>
        );
    }
}

ActionDistribution.propTypes = {
    instanceField: React.PropTypes.string.isRequired,
    actions: React.PropTypes.array.isRequired
};
