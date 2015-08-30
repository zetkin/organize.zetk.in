import React from 'react/addons';
import cx from 'classnames';

import { Link } from 'react-router-component';


export default class MatchBase extends React.Component {
    render() {
        const classes = cx({
            'focused': this.props.focused
        });

        return (
            <li className={ classes }>
                <Link href={ this.getLinkTarget() }>
                    { this.getImage() }
                    { this.getTitle() }
                </Link>
            </li>
        );
    }

    getImage() {
        return null;
    }
}

MatchBase.propTypes = {
    focused: React.PropTypes.bool,
    data: React.PropTypes.object.isRequired
};

MatchBase.defaultProps = {
    focused: false
};
