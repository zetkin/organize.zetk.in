import React from 'react';
import { connect } from 'react-redux';

import { gotoSection } from '../../actions/view';


@connect(state => ({}))
export default class Logo extends React.Component {
    render() {
        let href = '/'
        return (
            <h1 className="Logo">
                <a onClick={ this.onClick.bind(this) }>
                    Zetkin</a></h1>
        );
    }

    onClick() {
        this.props.dispatch(gotoSection(null));
    }
}
