import React from 'react/addons';

import FluxComponent from '../../FluxComponent';
import ScopeSelect from './ScopeSelect';
import CampaignMatch from './CampaignMatch';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';


export default class Search extends FluxComponent {
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
                {results.map(function(match) {
                    var Match;
                    var key = match.type + ':' + match.data.id;

                    switch(match.type) {
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

                    return <Match key={ key } data={ match.data }/>;
                })}
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

    onKeyDown(ev) {
        var inputDOMNode = React.findDOMNode(this.refs.searchField);
        if (ev.keyCode == 27 && ev.target == inputDOMNode) {
            inputDOMNode.blur();
            this.getActions('search').clearSearch();
        }
    }

    onChange(ev) {
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
