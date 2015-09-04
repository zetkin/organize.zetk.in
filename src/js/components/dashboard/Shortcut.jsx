import React from 'react/addons';

import { Link } from 'react-router-component';


export default class Shortcut extends React.Component {
    render() {
        const href = '/' + this.props.target;
        const label = this.props.label || this.props.target;

        return (
            <Link href={ href }>{ label }</Link>
        );
    }
}

Shortcut.propTypes = {
    label: React.PropTypes.string,
    target: React.PropTypes.string.isRequired
};
