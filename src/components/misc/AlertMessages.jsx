import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import {
    pollAlertMessages,
} from '../../actions/alert';


const mapStateToProps = state => ({
    messages: state.alerts.messages,
});

@connect(mapStateToProps)
export default class AlertMessages extends React.Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.messages.length == 0 && nextProps.messages.length > 0) {
            // First message, start polling
            this.pollTimer = setInterval(() => this.props.dispatch(pollAlertMessages()), 2000);
        }
        else if (nextProps.messages.length == 0) {
            // No more messages, stop polling
            clearInterval(this.pollTimer);
        }
    }

    render() {
        const messageItems = this.props.messages.map(msg => {
            const labelId = 'alerts.' + msg.type;

            return (
                <li key={ msg.id } className="AlertMessages-messageItem">
                    <Msg id={ labelId }/>
                </li>
            );
        });

        return (
            <div className="AlertMessages">
                <ul className="AlertMessages-messageList">
                    { messageItems }
                </ul>
            </div>
        );
    }
}
