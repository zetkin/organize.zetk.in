import React from 'react/addons';

import DayCycleGraph from './DayCycleGraph';


export default class ActionLocationItem extends React.Component {
    render() {
        const loc = this.props.location;
        const counts = [
            this.props.numMorningActions,
            this.props.numNoonActions,
            this.props.numAfternoonActions,
            this.props.numEveningActions,
            this.props.numNightActions
        ];

        const totalCount = counts.reduce((x, y) => x + y, 0);
        const average = this.props.numActionsAverage;
        const ballSize = Math.max(24, Math.min(50, 37 * totalCount/average));
        const countStyle = {
            width: ballSize,
            height: ballSize
        };

        return (
            <li className="actionlocationitem">
                <span className="title">{ loc.title }</span>
                <span style={ countStyle } className="actioncount">
                    <span>{ totalCount }</span></span>
                <DayCycleGraph phases={ counts }/>
            </li>
        );
    }
}

ActionLocationItem.propTypes = {
    numMorningActions: React.PropTypes.number.isRequired,
    numNoonActions: React.PropTypes.number.isRequired,
    numAfternoonActions: React.PropTypes.number.isRequired,
    numEveningActions: React.PropTypes.number.isRequired,
    numNightActions: React.PropTypes.number.isRequired,
    location: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired
    }).isRequired
};
