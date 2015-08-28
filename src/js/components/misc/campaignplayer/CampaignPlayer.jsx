import React from 'react/addons';

import Scrubber from './Scrubber';


export default class CampaignPlayer extends React.Component {
    constructor(props) {
        super(props);

        const startDate = props.actions.length?
            new Date(props.actions[0].start_time) : null;

        this.state = {
            playing: true,
            time: startDate? startDate.getTime() : 0
        };
    }

    componentWillReceiveProps(nextProps) {
        const actions = nextProps.actions;

        if (actions.length) {
            const startDate = new Date(actions[0].start_time);
            const endDate = new Date(actions[actions.length-1].end_time);

            if (this.state.time < startDate.getTime()) {
                this.setState({
                    playing: false,
                    time: startDate.getTime()
                });

                cancelAnimationFrame(this.rafId);
            }
            else if (this.state.time > endDate.getTime()) {
                this.setState({
                    playing: false,
                    time: endDate.getTime()
                });

                cancelAnimationFrame(this.rafId);
            }
        }
        else {
            cancelAnimationFrame(this.rafId);
        }
    }

    componentDidMount() {
        if (this.props.actions.length) {
            this.play();
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.rafId);
    }

    render() {
        var d = new Date(this.state.time);

        const actions = this.props.actions;
        const startTime = actions.length?
            new Date(actions[0].start_time).getTime() : 0;
        const endTime = actions.length?
            new Date(actions[actions.length-1].end_time).getTime() : 0;

        return (
            <div className="campaignplayer">
                <input type="button" value="play"
                    onClick={ this.onPlay.bind(this) }/>
                <input type="button" value="stop"
                    onClick={ this.onStop.bind(this) }/>
                <h1>{ d.toUTCString() }</h1>
                <Scrubber time={ this.state.time }
                    startTime={ startTime } endTime={ endTime }
                    onScrubBegin={ this.onScrubBegin.bind(this) }
                    onScrubEnd={ this.onScrubEnd.bind(this) }
                    onScrub={ this.onScrub.bind(this) }/>
            </div>
        );
    }

    onScrubBegin() {
        this.wasPlaying = this.state.playing;
        this.stop();
    }

    onScrubEnd() {
        if (this.wasPlaying) {
            this.wasPlaying = undefined;

            this.play();
        }
    }

    onScrub(time) {
        this.setState({
            time: time
        });
    }

    onPlay(ev) {
        if (!this.state.playing) {
            const actions = this.props.actions;
            const endDate = new Date(actions[actions.length-1].end_time);

            if (this.state.time >= endDate.getTime()) {
                const startDate = new Date(actions[0].start_time);
                this.play(startDate.getTime());
            }
            else {
                this.play();
            }
        }
    }

    onStop(ev) {
        this.stop();
    }

    play(startTime) {
        const updateTime = (function() {
            const actions = this.props.actions;
            const endDate = new Date(actions[actions.length-1].end_time);
            const newTime = this.state.time + 1000000;

            if (startTime !== undefined) {
                this.setState({
                    playing: true,
                    time: startTime
                });

                startTime = undefined;
                this.rafId = requestAnimationFrame(updateTime.bind(this));
            }
            else if (newTime < endDate.getTime()) {
                this.setState({
                    playing: true,
                    time: newTime
                });

                this.rafId = requestAnimationFrame(updateTime.bind(this));
            }
            else {
                this.setState({
                    playing: false,
                    time: endDate.getTime()
                });
            }
        }).bind(this);

        updateTime();
    }

    stop() {
        cancelAnimationFrame(this.rafId);

        this.setState({
            playing: false
        });
    }
}

CampaignPlayer.propTypes = {
    actions: React.PropTypes.array
};
