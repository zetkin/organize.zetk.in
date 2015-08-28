import React from 'react/addons';

import Scrubber from './Scrubber';


export default class Transport extends React.Component {
    render() {
        return (
            <div className="transport">
                <input type="button" value="play"
                    onClick={ this.props.onPlay }/>
                <input type="button" value="stop"
                    onClick={ this.props.onStop }/>
                <Scrubber time={ this.props.time }
                    startTime={ this.props.startTime } endTime={ this.props.endTime }
                    onScrubBegin={ this.props.onScrubBegin }
                    onScrubEnd={ this.props.onScrubEnd }
                    onScrub={ this.props.onScrub }/>
            </div>
        );
    }
}

Transport.propTypes = {
    time: React.PropTypes.number.isRequired,
    startTime: React.PropTypes.number.isRequired,
    endTime: React.PropTypes.number.isRequired,
    onPlay: React.PropTypes.func,
    onStop: React.PropTypes.func,
    onScrubBegin: React.PropTypes.func,
    onScrubEnd: React.PropTypes.func,
    onScrub: React.PropTypes.func
};
