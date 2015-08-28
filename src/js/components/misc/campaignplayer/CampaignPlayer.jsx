import React from 'react/addons';


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

        return (
            <div className="campaignplayer">
                <input type="button" value="play"
                    onClick={ this.onPlay.bind(this) }/>
                <input type="button" value="stop"
                    onClick={ this.onStop.bind(this) }/>
                <h1>{ d.toUTCString() }</h1>
            </div>
        );
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
        cancelAnimationFrame(this.rafId);

        this.setState({
            playing: false
        });
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
}

CampaignPlayer.propTypes = {
    actions: React.PropTypes.array
};
