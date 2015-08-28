import React from 'react/addons';


export default class Scrubber extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrubbing: false,
            scrubPos: 0
        };
    }

    render() {
        const startTime = this.props.startTime;
        const endTime = this.props.endTime;
        const time = this.props.time;

        const thumbPos = this.state.scrubbing?
            this.state.scrubPos : (time - startTime) / (endTime - startTime);

        const thumbStyle = {
            left: (thumbPos * 100) + '%'
        }

        return (
            <div className="scrubber" ref="scrubber">
                <button className="thumb" style={ thumbStyle }
                    onMouseDown={ this.onThumbDown.bind(this) }/>
            </div>
        );
    }

    onThumbDown(ev) {
        const scrubber = React.findDOMNode(this.refs.scrubber);
        const startTime = this.props.startTime;
        const endTime = this.props.endTime;
        const time = this.props.time;
        const component = this;

        this.setState({
            scrubbing: true,
            scrubPos: (time - startTime) / (endTime - startTime)
        });

        if (this.props.onScrubBegin) {
            this.props.onScrubBegin();
        }

        function onMouseMove(ev) {
            const bounds = scrubber.getBoundingClientRect();
            const x = ev.clientX - bounds.left;
            const f = (x / scrubber.offsetWidth);

            component.setState({
                scrubPos: f
            });

            if (component.props.onScrub) {
                component.props.onScrub(startTime + (f * (endTime - startTime)));
            }
        }

        function onMouseUp(ev) {
            scrubber.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            component.setState({
                scrubbing: false
            });

            if (component.props.onScrubEnd) {
                component.props.onScrubEnd();
            }
        }

        scrubber.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
}

Scrubber.propTypes = {
    startTime: React.PropTypes.number.isRequired,
    endTime: React.PropTypes.number.isRequired,
    time: React.PropTypes.number.isRequired,
    onScrubBegin: React.PropTypes.func,
    onScrubEnd: React.PropTypes.func,
    onScrub: React.PropTypes.func
};
