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
            <li className="actionlocationitem"
                onMouseOver={ this.onMouseOver.bind(this) }
                onMouseOut={ this.props.onMouseOut }>
                <span className="title">{ loc.title }</span>
                <span style={ countStyle } className="actioncount">
                    <span>{ totalCount }</span>
                </span>
                <DayCycleGraph phases={ counts }
                    onMouseOver={ this.onDayCycleMouseOver.bind(this) }
                    onMouseOut={ this.onDayCycleMouseOut.bind(this) }/>
            </li>
        );
    }

    onMouseOver(ev) {
        if (this.props.onMouseOver) {
            this.props.onMouseOver(this.props.location);
        }
    }

    onDayCycleMouseOver(phase) {
        if (this.props.onMouseOverPhase) {
            this.props.onMouseOverPhase(this.props.location, phase);
        }
    }

    onDayCycleMouseOut() {
        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
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
    }).isRequired,
    onMouseOver: React.PropTypes.func,
    onMouseOverPhase: React.PropTypes.func,
    onMouseOut: React.PropTypes.func
};
