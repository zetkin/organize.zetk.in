import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class Search extends FluxComponent {
    render() {
        return (
            <form className="search-form">
                <input type="search"/>
            </form>
        );
    }
}
