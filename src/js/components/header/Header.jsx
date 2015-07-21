import React from 'react/addons';

import Logo from './Logo';
import Search from './Search';
import UserMenu from './UserMenu';


export default class Header extends React.Component {
    render() {
        return (
            <header>
                <Logo />
                <Search />
                <UserMenu />
            </header>
        );
    }
}
