import React from 'react';
import { connect } from 'react-redux';

import LoadingIndicator from './LoadingIndicator';
import { createInvite } from '../../actions/invite';


let selectInviteCreateState = state => ({
    error: state.invites.createError,
    isPending: state.invites.createIsPending,
});

@connect(selectInviteCreateState)
export default class InviteBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            inviteEmail: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.error) {
            this.setState({
                inviteEmail: nextProps.error.email,
            });
        }
    }

    render() {
        let formElements = [];

        if (this.props.error) {
            formElements.push(
                <p key="error" className="InviteBox-error">
                    { this.props.error.description }
                </p>
            );
        }

        formElements.push(
            <input key="email" type="email"
                disabled={ this.props.isPending }
                value={ this.state.inviteEmail }
                onChange={ this.onInviteEmailChange.bind(this) }/>
        );

        if (this.props.isPending) {
            formElements.push(
                <LoadingIndicator key="loadingIndicator"/>
            );
        }
        else {
            formElements.push(
                <input key="submit" type="submit" value="Send invite"/>
            );
        }

        return (
            <div className="InviteBox">
                <h2>Send new invite</h2>
                <p>
                    Enter an e-mail address to send an invite.
                </p>
                <form onSubmit={ this.onInviteSubmit.bind(this) }>
                    { formElements }
                </form>
            </div>
        );
    }

    onInviteEmailChange(ev) {
        this.setState({
            inviteEmail: ev.target.value,
        });
    }

    onInviteSubmit(ev) {
        ev.preventDefault()
        this.props.dispatch(createInvite(this.state.inviteEmail));
        this.setState({
            inviteEmail: null,
        });
    }
}
