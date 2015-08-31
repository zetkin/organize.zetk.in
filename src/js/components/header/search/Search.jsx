import React from 'react/addons';

import FluxComponent from '../../FluxComponent';
import ScopeSelect from './ScopeSelect';
import ActionDayMatch from './ActionDayMatch';
import CampaignMatch from './CampaignMatch';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';


export default class Search extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            focusedIndex: undefined
        };
    }

    componentDidMount() {
        this.listenTo('search', this.forceUpdate);
        document.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    componentDidUpdate() {
        var searchStore = this.getStore('search');

        if (searchStore.isSearchActive()) {
            var inputDOMNode = React.findDOMNode(this.refs.searchField);
            inputDOMNode.focus();
        }
    }

    render() {
        var searchStore = this.getStore('search');
        var results = searchStore.getResults();
        var scope = searchStore.getScope();
        var resultList;
        var classes = ['search-form'];

        if (searchStore.isSearchActive()) {
            classes.push('focused');
        }

        if (results.length) {
            resultList = (
                <ul className="search-form-results">
                {results.map(function(match, idx) {
                    const key = match.type + ':' + match.data.id;
                    const focused = (this.state.focusedIndex === idx);

                    var Match;

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
                    value={ searchStore.getQuery() }
                    onChange={ this.onChange.bind(this) }
                    onFocus={ this.onFocus.bind(this) }
                    onBlur={ this.onBlur.bind(this) }/>

                { resultList }
            </form>
        );
    }

    onScopeSelect(scope) {
        this.getActions('search').changeScope(scope);
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
                paneType = 'editlocation';
                params = [ match.data.id ];
                break;
            case 'person':
                defaultBase = '/people/list';
                paneType = 'person';
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
        const searchStore = this.getStore('search');
        const results = searchStore.getResults();
        const inputDOMNode = React.findDOMNode(this.refs.searchField);
        const focusedIndex = this.state.focusedIndex;

        if (ev.keyCode == 27 && ev.target == inputDOMNode) {
            inputDOMNode.blur();
            this.getActions('search').clearSearch();
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
        else if (ev.keyCode == 13 && focusedIndex >= 0) {
            const selected = results[focusedIndex];

            this.onMatchSelect(selected);

            ev.preventDefault();
            inputDOMNode.blur();
            this.getActions('search').clearSearch();
        }
    }

    onChange(ev) {
        this.setState({
            focusedIndex: undefined
        });

        this.getActions('search').search(ev.target.value);
    }

    onFocus(ev) {
        var searchStore = this.getStore('search');
        if (!searchStore.isSearchActive()) {
            this.getActions('search').beginSearch();
        }
    }

    onBlur(ev) {
        this.getActions('search').endSearch();
    }
}

Search.propTypes = {
    onMatchNavigate: React.PropTypes.func
};
