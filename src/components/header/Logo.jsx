import React from 'react';
import { connect } from 'react-redux';

import { gotoSection } from '../../actions/view';


@connect(state => ({}))
export default class Logo extends React.Component {
    render() {
        return (
            <a className="Logo" href="/"
                onClick={ this.onClick.bind(this) }>
                <img src="/static/img/logo-white.png"
                    alt="Zetkin"/>
            </a>
        );
    }

    onClick(ev) {
        ev.preventDefault();
        this.props.dispatch(gotoSection(null));
    }
}
