import React from 'react/addons';

import { Link } from 'react-router-component';


export default class Shortcut extends React.Component {
    render() {
        return (
            <Link href={ this.props.target }>{ this.props.target }</Link>
        );
    }
}

Shortcut.propTypes = {
    target: React.PropTypes.string.isRequired
};
