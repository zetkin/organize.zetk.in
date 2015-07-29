import React from 'react/addons';
import cx from 'classnames';

import FluxComponent from './FluxComponent';


export default class KeyboardShortcuts extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            showMainReference: false,
            keyPrefix: null
        };
    }

    componentDidMount() {
        document.addEventListener('keydown',
            this.onKeyDown.bind(this));
        document.addEventListener('keypress',
            this.onKeyPress.bind(this));
    }

    render() {
        var classNames = cx({
            'shortcutref': true,
            'visible': this.state.showMainReference
        });

        return (
            <div className={ classNames }>
                <div className="shortcutref-content">
                    <h1>Shortcut reference</h1>
                    <h2>Navigation shortcuts</h2>
                    <ul>
                        <li><code>gh</code> Go home to dashboard</li>
                        <li><code>gp</code> Go to people section</li>
                        <li><code>gc</code> Go to campaign section</li>
                        <li><code>gm</code> Go to maps section</li>
                    </ul>

                    <h2>Search</h2>
                    <ul>
                        <li><code>{ '//' }</code> Activate search field</li>
                    </ul>

                    <h2>Misc</h2>
                    <ul>
                        <li><code>?</code> Open shortcut reference</li>
                        <li><code>ESC</code> Cancel (e.g. close shortcut reference)</li>
                    </ul>
                </div>
            </div>
        );
    }

    onKeyPress(ev) {
        if (ev.target == document.body) {
            if (this.state.keyPrefix === 'g') {
                switch (ev.keyCode) {
                    case 49:    // 1 = 1st sub-section
                        this.closeReference();
                        this.navigateToSubSection(0);
                        break;
                    case 50:    // 2 = 2nd sub-section
                        this.closeReference();
                        this.navigateToSubSection(1);
                        break;
                    case 51:    // 3 = 3rd sub-section
                        this.closeReference();
                        this.navigateToSubSection(2);
                        break;
                    case 52:    // 4 = 4th sub-section
                        this.closeReference();
                        this.navigateToSubSection(3);
                        break;
                    case 53:    // 5 = 5th sub-section
                        this.closeReference();
                        this.navigateToSubSection(4);
                        break;
                    case 54:    // 6 = 6th sub-section
                        this.closeReference();
                        this.navigateToSubSection(5);
                        break;
                    case 55:    // 7 = 7th sub-section
                        this.closeReference();
                        this.navigateToSubSection(6);
                        break;

                    case 104:   // 'h' == home
                        this.closeReference();
                        this.navigateToSection('/');
                        break;
                    case 109:   // 'm' == maps
                        this.closeReference();
                        this.navigateToSection('/maps');
                        break;
                    case 112:   // 'p' == people
                        this.closeReference();
                        this.navigateToSection('/people');
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
                        this.closeReference();
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
                        this.setState({
                            showMainReference: true
                        });
                        break;
                }
            }
        }
    }

    navigateToSection(path) {
        this.props.onSectionShortcut(path);
    }

    navigateToSubSection(index) {
        this.props.onSubSectionShortcut(index);
    }

    closeReference() {
        this.setState({
            showMainReference: false
        });
    }

    onKeyDown(ev) {
        if (ev.keyCode === 27) {
            this.closeReference();
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
    onSectionShortcut: React.PropTypes.func.isRequired,
    onSubSectionShortcut: React.PropTypes.func.isRequired
};
