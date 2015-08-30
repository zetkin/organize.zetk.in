import React from 'react/addons';

import Logo from './Logo';
import Search from './search/Search';
import UserMenu from './UserMenu';


export default class Header extends React.Component {
    render() {
        return (
            <header className="appheader">
                <Logo />
                <Search onMatchNavigate={ this.props.onSearchNavigate }/>
                <UserMenu />
            </header>
        );
    }
}

Header.propTypes = {
    onSearchNavigate: React.PropTypes.func
};
