import React from 'react/addons';
import { Link } from 'react-router-component';

export default class Logo extends React.Component {
    render() {
        let href = '/'
        return (
            <h1 className="Logo"><Link href={ href }>Zetkin</Link></h1>
        );
    }
}
