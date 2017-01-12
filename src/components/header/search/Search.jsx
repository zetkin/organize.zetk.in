import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';

import ScopeSelect from './ScopeSelect';
import ActionDayMatch from './ActionDayMatch';
import CallAssignmentMatch from './CallAssignmentMatch';
import CampaignMatch from './CampaignMatch';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';
import QueryMatch from './QueryMatch';
import { gotoSection, pushPane } from '../../../actions/view';
import {
    beginSearch,
    changeSearchScope,
    clearSearch,
    search,
} from '../../../actions/search';



@injectIntl
@connect(state => ({ search: state.search, view: state.view }))
export default class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            focusedIndex: undefined
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    componentDidUpdate() {
        let searchStore = this.props.search;

        if (searchStore.isActive) {
            var inputDOMNode = ReactDOM.findDOMNode(this.refs.searchField);
            inputDOMNode.focus();
        }
    }

    render() {
        let searchStore = this.props.search;
        var results = searchStore.results;
        var scope = searchStore.scope;
        var resultList;
        var classes = ['Search'];

        if (searchStore.isActive) {
            classes.push('focused');
        }

        if (results.length) {
            resultList = (
                <ul className="Search-results">
                {results.map(function(match, idx) {
                    const key = match.type + ':' + match.data.id;
                    const focused = (this.state.focusedIndex === idx);

                    var Match;

                    // TODO: Move this to separate index.js?
                    switch(match.type) {
                        case 'actionday':
                            Match = ActionDayMatch;
                            break;
                        case 'call_assignment':
                            Match = CallAssignmentMatch;
                            break;
                        case 'campaign':
                            Match = CampaignMatch;
                            break;
                        case 'location':
                            Match = LocationMatch;
                            break;
                        case 'person':
                            Match = PersonMatch;
                            break;
                        case 'query':
                            Match = QueryMatch;
                            break;
                    }

                    return <Match key={ key } data={ match.data }
                        onSelect={ this.onMatchSelect.bind(this, match) }
                        focused={ focused }/>;
                }, this)}
                </ul>
            );
        }

        let placeholder = this.props.intl.formatMessage(
            { id: 'header.search.typeToSearch' });

        return (
            <form className={ classes.join(' ') }
                onSubmit={ (ev) => ev.preventDefault() }>
                <ScopeSelect value={ scope }
                    onSelect={ this.onScopeSelect.bind(this) }/>

                <input type="search" ref="searchField"
                    placeholder={ placeholder }
                    value={ searchStore.query }
                    onChange={ this.onChange.bind(this) }
                    onFocus={ this.onFocus.bind(this) }
                    onBlur={ this.onBlur.bind(this) }/>

                { resultList }
            </form>
        );
    }

    onScopeSelect(scope) {
        this.props.dispatch(changeSearchScope(scope));
    }

    onMatchSelect(match) {
        let defaultSection;
        let paneType;
        let params;

        switch (match.type) {
            case 'actionday':
                defaultSection = 'campaign';
                paneType = 'actionday';
                params = [ match.data.date ];
                break;
            case 'call_assignment':
                defaultSection = 'dialog';
                paneType = 'callassignment';
                params = [ match.data.id ];
                break;
            case 'campaign':
                defaultSection = 'campaign';
                paneType = 'editcampaign';
                params = [ match.data.id ];
                break;
            case 'location':
                defaultSection = 'maps';
                paneType = 'location';
                params = [ match.data.id ];
                break;
            case 'person':
                defaultSection = 'people';
                paneType = 'person';
                params = [ match.data.id ];
                break;
            case 'query':
                defaultSection = 'people';
                paneType = 'query';
                params = [ match.data.id ];
                break;
            default:
                // TODO: Deal with this? Should never happen
                console.log('UNKNOWN MATCH TYPE');
                return;
        }

        let curSection = this.props.view.section;
        if (!curSection || curSection === 'dashboard') {
            this.props.dispatch(gotoSection(defaultSection));
        }

        this.props.dispatch(pushPane(paneType, params));
    }

    onKeyDown(ev) {
        const searchStore = this.props.search;
        const results = searchStore.results;
        const inputDOMNode = ReactDOM.findDOMNode(this.refs.searchField);
        const focusedIndex = this.state.focusedIndex;

        if (ev.keyCode == 27 && ev.target == inputDOMNode) {
            inputDOMNode.blur();
            this.props.dispatch(clearSearch());
        }
        else if (ev.keyCode == 40) {
            // Down
            this.setState({
                focusedIndex: Math.min(results.length,
                    (focusedIndex === undefined)? 0 : focusedIndex + 1)
            });

            ev.preventDefault();
        }
        else if (ev.keyCode == 38) {
            // Up
            this.setState({
                focusedIndex: Math.max(0, (focusedIndex === undefined)?
                    results.length - 1 : focusedIndex - 1)
            });

            ev.preventDefault();
        }
        else if (results.length && ev.keyCode == 13 && focusedIndex >= 0) {
            const selected = results[focusedIndex];

            this.onMatchSelect(selected);

            ev.preventDefault();
            inputDOMNode.blur();
            this.props.dispatch(clearSearch);
        }
    }

    onChange(ev) {
        this.setState({
            focusedIndex: undefined
        });

        this.props.dispatch(search(ev.target.value));
    }

    onFocus(ev) {
        var searchStore = this.props.search;
        if (!searchStore.isActive) {
            this.props.dispatch(beginSearch());
        }
    }

    onBlur(ev) {
        setTimeout(() => {
            this.props.dispatch(clearSearch());
        }, 350);
    }
}

Search.propTypes = {
    onMatchNavigate: React.PropTypes.func
};
