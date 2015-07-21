import React from 'react/addons';

import { Link } from 'react-router-component';


export default class Shortcut extends React.Component {
    render() {
        var href = '/' + this.props.target;

        return (
            <Link href={ href }>{ this.props.target }</Link>
        );
    }
}

Shortcut.propTypes = {
    target: React.PropTypes.string.isRequired
};
