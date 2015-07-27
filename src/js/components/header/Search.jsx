import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class Search extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };
    }

    render() {
        var classes = ['search-form'];
        if (this.state.focused) {
            classes.push('focused');
        }
        return (
            <form className={ classes.join(' ') }>
                <input type="search"
                    onFocus={ this.onFocus.bind(this) }
                    onBlur={ this.onBlur.bind(this) }/>
            </form>
        );
    }

    onFocus(ev) {
        this.setState({
            focused: true
        });
    }

    onBlur(ev) {
        this.setState({
            focused: false
        });
    }
}
