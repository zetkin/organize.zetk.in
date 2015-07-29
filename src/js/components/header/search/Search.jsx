import React from 'react/addons';

import FluxComponent from '../../FluxComponent';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';


export default class Search extends FluxComponent {
    componentDidMount() {
        this.listenTo('search', this.forceUpdate);
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
                        case 'person':
                            Match = PersonMatch;
                            break;
                        case 'location':
                            Match = LocationMatch;
                            break;
                    }

                    return <Match key={ key } data={ match.data }/>;
                })}
                </ul>
            );
        }

        return (
            <form className={ classes.join(' ') }>
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

    onChange(ev) {
        this.getActions('search').search(ev.target.value);
    }

    onFocus(ev) {
        var searchStore = this.getStore('search');
        if (!searchStore.isSearchActive()) {
            this.getActions('search').beginSearch(null);
        }
    }

    onBlur(ev) {
        this.getActions('search').endSearch();
    }
}
