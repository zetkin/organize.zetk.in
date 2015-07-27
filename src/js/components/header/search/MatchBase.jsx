import React from 'react/addons';

import { Link } from 'react-router-component';


export default class MatchBase extends React.Component {
    render() {
        return (
            <li>
                <Link href={ this.getLinkTarget() }>
                    { this.getTitle() }
                </Link>
            </li>
        );
    }
}

MatchBase.propTypes = {
    data: React.PropTypes.object.isRequired
};
