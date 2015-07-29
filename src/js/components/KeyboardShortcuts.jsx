import React from 'react/addons';

import FluxComponent from './FluxComponent';


export default class KeyboardShortcuts extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            keyPrefix: null
        };
    }

    componentDidMount() {
        document.addEventListener('keypress',
            this.onKeyPress.bind(this));
    }

    render() {
        return null;
    }

    onKeyPress(ev) {
        if (ev.target == document.body) {
            if (this.state.keyPrefix === 'g') {
                switch (ev.keyCode) {
                    case 104: // 'h' == home
                        this.props.onNavigationShortcut('/');
                        break;
                    case 109: // 'm' == maps
                        this.props.onNavigationShortcut('/maps');
                        break;
                    case 112: // 'p' == people
                        this.props.onNavigationShortcut('/people');
                        break;
                }

                this.setKeyPrefix(null);
            }
            else if (this.state.keyPrefix === '/') {
                // Prevent default, which is to type '/' into the search field
                ev.preventDefault();

                switch (ev.keyCode) {
                    case 47: // '/'
                        // TODO: Focus search field
                        this.getActions('search').beginSearch(null);
                        break;
                }

                this.setKeyPrefix(null);
            }
            else if (this.state.keyPrefix === null) {
                switch (ev.keyCode) {
                    case 103: // 'g'
                        this.setKeyPrefix('g');
                        break;
                    case 47: // '/'
                        this.setKeyPrefix('/');
                        break;
                    case 63: // '?'
                        // TODO: Show reference
                        console.log('should show reference');
                        break;
                }
            }
        }
    }

    setKeyPrefix(c) {
        this.setState({
            keyPrefix: c
        });

        if (c !== null) {
            // Reset key prefix to null after a short delay
            clearTimeout(this.keyPrefixTimeout);
            this.keyPrefixTimeout = setTimeout(function() {
                this.setState({
                    keyPrefix: null
                });
            }.bind(this), 2000);
        }
    }
}

KeyboardShortcuts.propTypes = {
    onNavigationShortcut: React.PropTypes.func.isRequired
};
