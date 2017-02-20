import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from './Button';
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
            inviteEmail: '',
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
            <input key="email" type="email" className="InviteBox-emailInput"
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
                <Button key="sendButton"
                    labelMsg="misc.inviteBox.sendButton"
                    onClick={ this.onClickSend.bind(this) }/>
            );
        }

        return (
            <div className="InviteBox">
                <Msg tagName="h2" id="misc.inviteBox.h"/>
                <Msg tagName="p" id="misc.inviteBox.instructions"/>
                { formElements }
            </div>
        );
    }

    onInviteEmailChange(ev) {
        this.setState({
            inviteEmail: ev.target.value,
        });
    }

    onClickSend() {
        this.props.dispatch(createInvite(this.state.inviteEmail));
        this.setState({
            inviteEmail: '',
        });
    }
}
