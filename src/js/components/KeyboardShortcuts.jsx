import { Link } from 'react-router-component';
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
        var reference;
        var classNames = cx({
            'shortcutref': true,
            'shortcutref-mainvisible': this.state.showMainReference,
            'shortcutref-navvisible': this.state.keyPrefix === 'g'
        });

        return (
            <div className={ classNames }>
                <div className="shortcutref-main">
                    <h1>Shortcut reference</h1>
                    <h2>Navigation shortcuts</h2>
                    <ul>
                        <li><code>gh</code> Go home to dashboard</li>
                        <li><code>gp</code> Go to people section</li>
                        <li><code>gc</code> Go to campaign section</li>
                        <li><code>gm</code> Go to maps section</li>
                        <li><code>g{'<N>'}</code> Go to Nth sub-section of current section</li>
                    </ul>

                    <h2>Search</h2>
                    <ul>
                        <li><code>{ '//' }</code> Activate search field</li>
                        <li><code>{ '/p' }</code> Activate search, limiting results to people</li>
                        <li><code>{ '/c' }</code> Activate search, limiting results to campaign</li>
                        <li><code>{ '/m' }</code> Activate search, limiting results to maps</li>
                    </ul>

                    <h2>Misc</h2>
                    <ul>
                        <li><code>?</code> Open shortcut reference</li>
                        <li><code>ESC</code> Cancel (e.g. close shortcut reference)</li>
                    </ul>
                </div>

                <div className="shortcutref-nav">
                    <p>
                        Quickly press another key to navigate.
                    </p>
                    <Link href="/help/shortcuts">What is this?</Link>
                    <ul>
                        <li><code>h</code> home</li>
                        <li><code>p</code> people</li>
                        <li><code>c</code> campaign</li>
                        <li><code>m</code> maps</li>
                        <li><code>1-7</code> sub-section</li>
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
                        this.navigateToSubSection(0);
                        break;
                    case 50:    // 2 = 2nd sub-section
                        this.navigateToSubSection(1);
                        break;
                    case 51:    // 3 = 3rd sub-section
                        this.navigateToSubSection(2);
                        break;
                    case 52:    // 4 = 4th sub-section
                        this.navigateToSubSection(3);
                        break;
                    case 53:    // 5 = 5th sub-section
                        this.navigateToSubSection(4);
                        break;
                    case 54:    // 6 = 6th sub-section
                        this.navigateToSubSection(5);
                        break;
                    case 55:    // 7 = 7th sub-section
                        this.navigateToSubSection(6);
                        break;

                    case 99:    // 'c' == campaign
                        this.navigateToSection('/campaign');
                        break;
                    case 104:   // 'h' == home
                        this.navigateToSection('/');
                        break;
                    case 109:   // 'm' == maps
                        this.navigateToSection('/maps');
                        break;
                    case 112:   // 'p' == people
                        this.navigateToSection('/people');
                        break;
                }

                this.setKeyPrefix(null);
            }
            else if (this.state.keyPrefix === '/') {
                // Prevent default, which is to type '/' into the search field
                ev.preventDefault();

                switch (ev.keyCode) {
                    case 47:    // '/'
                        this.closeReference();
                        this.getActions('search').beginSearch(null);
                        break;
                    case 99:    // 'c' == campaign
                        this.closeReference();
                        this.getActions('search').beginSearch('campaign');
                        break;
                    case 109:   // 'm' == maps
                        this.closeReference();
                        this.getActions('search').beginSearch('maps');
                        break;
                    case 112:   // 'p' == people
                        this.closeReference();
                        this.getActions('search').beginSearch('people');
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
        this.closeReference();
        this.props.onSectionShortcut(path);
    }

    navigateToSubSection(index) {
        var navigated = this.props.onSubSectionShortcut(index);

        if (navigated) {
            this.closeReference();
        }
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
