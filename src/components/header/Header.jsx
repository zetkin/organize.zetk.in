import React from 'react';

import Logo from './Logo';
import Search from './search/Search';
import OrgUserMenu from './OrgUserMenu';


export default class Header extends React.Component {
    render() {
        return (
            <header className="Header">
                <Logo />
                <Search onMatchNavigate={ this.props.onSearchNavigate }/>
                <OrgUserMenu />
            </header>
        );
    }
}

Header.propTypes = {
    onSearchNavigate: React.PropTypes.func
};
