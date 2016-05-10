import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import ScopeSelect from './ScopeSelect';
import ActionDayMatch from './ActionDayMatch';
import CampaignMatch from './CampaignMatch';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';
import QueryMatch from './QueryMatch';
import { beginSearch, changeSearchScope, clearSearch, endSearch, search
    } from '../../../actions/search';



@connect(state => state)
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

        return (
            <form className={ classes.join(' ') }>
                <ScopeSelect value={ scope }
                    onSelect={ this.onScopeSelect.bind(this) }/>

                <input type="search" ref="searchField"
                    placeholder="Start typing to search"
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
        var defaultBase;
        var paneType;
        var params;

        switch (match.type) {
            case 'actionday':
                defaultBase = '/campaign/actions';
                paneType = 'actionday';
                params = [ match.data.date ];
                break;
            case 'campaign':
                defaultBase = '/campaign/actions';
                paneType = 'editcampaign';
                params = [ match.data.id ];
                break;
            case 'location':
                defaultBase = '/maps/locations';
                paneType = 'editlocationwithmap';
                params = [ match.data.id ];
                break;
            case 'person':
                defaultBase = '/people/list';
                paneType = 'person';
                params = [ match.data.id ];
                break;
            case 'query':
                defaultBase = '/people/list';
                paneType = 'query';
                params = [ match.data.id ];
                break;
            default:
                // TODO: Deal with this? Should never happen
                console.log('UNKNOWN MATCH TYPE');
                return;
        }

        if (this.props.onMatchNavigate) {
            this.props.onMatchNavigate(paneType, params, defaultBase);
        }
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
        this.props.dispatch(endSearch());
    }
}

Search.propTypes = {
    onMatchNavigate: React.PropTypes.func
};
