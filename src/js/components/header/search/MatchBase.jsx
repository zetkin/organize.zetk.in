import React from 'react/addons';

import { Link } from 'react-router-component';


export default class MatchBase extends React.Component {
    render() {
        return (
            <li>
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
    data: React.PropTypes.object.isRequired
};
