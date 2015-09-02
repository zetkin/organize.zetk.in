import React from 'react/addons';


export default class DayCycleGraph extends React.Component {
    render() {
        const phases = this.props.phases;
        const sum = phases.reduce((x, y) => x + y, 0);

        var content = null;

        if (sum > 0) {
            const minWidth = 0.03;
            const minCount = minWidth * sum;
            const staticCounts = phases.filter(x => x <= minCount);
            const dynWidth = 1.0 - (staticCounts.length * minWidth);
            const dynSum = sum - staticCounts.reduce((x, y) => x + y, 0);

            const widths = phases.map(count => (count < minCount)?
                minWidth : dynWidth * count/dynSum);

            content = phases.map(function(count, idx) {
                const className = 'phase' + idx;
                const style = {
                    width: (widths[idx] * 100) + '%'
                };

                return (
                    <li key={ idx } className={ className } style={ style }
                        onMouseOver={ this.onMouseOver.bind(this, idx) }
                        onMouseOut={ this.onMouseOut.bind(this) }>
                        { count }</li>
                );
            }, this);
        }

        return (
            <ul className="daycyclegraph">
                { content }
            </ul>
        );
    }

    onMouseOver(phase, ev) {
        ev.stopPropagation();

        if (this.props.onMouseOver) {
            this.props.onMouseOver(phase);
        }
    }

    onMouseOut() {
        if (this.props.onMouseOut) {
            this.props.onMouseOut();
        }
    }
}

DayCycleGraph.propTypes = {
    onMouseOver: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    phases: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
};
