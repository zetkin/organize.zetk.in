import cx from 'classnames';
import React from 'react';
import { connect } from 'react-redux';

import { beginSearch } from '../actions/search';
import { gotoSection } from '../actions/view';

import { SECTIONS } from './sections';


@connect(state => ({ view: state.view }))
export default class KeyboardShortcuts extends React.Component {
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
            'KeyboardShortcuts': true,
            'KeyboardShortcuts-mainvisible': this.state.showMainReference,
            'KeyboardShortcuts-navvisible': this.state.keyPrefix === 'g'
        });

        return (
            <div className={ classNames }>
                <div className="KeyboardShortcuts-main">
                    <h1>Shortcut reference</h1>
                    <h2>Navigation shortcuts</h2>
                    <ul>
                        <li><code>gh</code> Go home to dashboard</li>
                        <li><code>gp</code> Go to people section</li>
                        <li><code>gc</code> Go to campaign section</li>
                        <li><code>gd</code> Go to dialog section</li>
                        <li><code>gm</code> Go to maps section</li>
                        <li><code>gs</code> Go to survey section</li>
                        <li><code>g{'<N>'}</code> Go to Nth sub-section of current section</li>
                    </ul>

                    <h2>Search</h2>
                    <ul>
                        <li><code>{ '//' }</code> Activate search field</li>
                        <li><code>{ '/p' }</code> Activate search, limiting results to people</li>
                        <li><code>{ '/c' }</code> Activate search, limiting results to campaign</li>
                        <li><code>{ '/d' }</code> Activate search, limiting results to dialog</li>
                        <li><code>{ '/m' }</code> Activate search, limiting results to maps</li>
                    </ul>

                    <h2>Misc</h2>
                    <ul>
                        <li><code>?</code> Open shortcut reference</li>
                        <li><code>ESC</code> Cancel (e.g. close shortcut reference)</li>
                    </ul>
                </div>

                <div className="KeyboardShortcuts-nav">
                    <p>
                        Quickly press another key to navigate.
                    </p>
                    <a href="/help/shortcuts">What is this?</a>
                    <ul>
                        <li><code>h</code> home</li>
                        <li><code>p</code> people</li>
                        <li><code>c</code> campaign</li>
                        <li><code>d</code> dialog</li>
                        <li><code>m</code> maps</li>
                        <li><code>s</code> survey</li>
                        <li><code>1-7</code> sub-section</li>
                    </ul>
                </div>
            </div>
        );
    }

    onKeyPress(ev) {
        // Bail for some special cases
        const tagName = ev.target.tagName.toLowerCase();

        if (tagName == 'input'
            && ev.target.type != 'submit'
            && ev.target.type != 'button') {
            return;
        }
        else if (tagName == 'textarea') {
            return;
        }
        else if (tagName == 'select') {
            return;
        }
        else if (ev.target.contentEditable == "true") {
            // Rich text editors have contentEditable="true".
            return;
        }

        if (this.state.keyPrefix === 'g') {
            switch (ev.charCode) {
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
                    this.props.dispatch(gotoSection('campaign'));
                    break;
                case 100:    // 'd' == dialog
                    this.props.dispatch(gotoSection('dialog'));
                    break;
                case 104:   // 'h' == home
                    this.props.dispatch(gotoSection(null));
                    break;
                case 109:   // 'm' == maps
                    this.props.dispatch(gotoSection('maps'));
                    break;
                case 112:   // 'p' == people
                    this.props.dispatch(gotoSection('people'));
                    break;
                case 115:   // 's' == survey
                    this.props.dispatch(gotoSection('survey'));
                    break;
            }

            this.setKeyPrefix(null);
        }
        else if (this.state.keyPrefix === '/') {
            // Prevent default, which is to type '/' into the search field
            ev.preventDefault();

            switch (ev.charCode) {
                case 47:    // '/'
                    this.closeReference();
                    this.props.dispatch(beginSearch('top'));
                    break;
                case 100:    // 'd' == dialog
                    this.closeReference();
                    this.props.dispatch(beginSearch('top', ['callassignment']));
                    break;
                case 99:    // 'c' == campaign
                    this.closeReference();
                    this.props.dispatch(beginSearch('top', ['action', 'campaign', 'activity']));
                    break;
                case 109:   // 'm' == maps
                    this.closeReference();
                    this.props.dispatch(beginSearch('top', ['location']));
                    break;
                case 112:   // 'p' == people
                    this.closeReference();
                    this.props.dispatch(beginSearch('top', ['personquery', 'person']));
                    break;
                case 115:   // 's' == survey
                    this.closeReference();
                    this.props.dispatch(beginSearch('top', ['survey', 'surveysubmission']));
                    break;
            }

            this.setKeyPrefix(null);
        }
        else if (this.state.keyPrefix === null) {
            switch (ev.charCode) {
                case 103: // 'g'
                    this.setKeyPrefix('g');
                    break;
                case 47: // '/'
                    this.setKeyPrefix('/');
                    break;
                case 63: // '?'
                    this.setState({
                        showMainReference: true
                    });
                    break;
            }
        }
    }

    navigateToSubSection(index) {
        let curSection = SECTIONS[this.props.view.section];
        if (curSection && index < curSection.subSections.length) {
            this.props.dispatch(gotoSection(this.props.view.section,
                curSection.subSections[index].path));
            this.closeReference();
        }
    }

    closeReference() {
        this.setState({
            showMainReference: false
        });
    }

    onKeyDown(ev) {
        if (ev.key === 'Escape') {
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
