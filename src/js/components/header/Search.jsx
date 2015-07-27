import React from 'react/addons';

import FluxComponent from '../FluxComponent';


export default class Search extends FluxComponent {
    constructor(props) {
        super(props);

        this.state = {
            focused: false
        };
    }

    componentDidMount() {
        this.listenTo('search', this.forceUpdate);
    }

    render() {
        var searchStore = this.getStore('search');
        var results = searchStore.getResults();
        var resultList;
        var classes = ['search-form'];

        if (this.state.focused) {
            classes.push('focused');
        }

        if (results.length) {
            resultList = (
                <ul className="search-form-results">
                {results.map(function(match) {
                    var key = match.type + ':' + match.data.id;

                    return (
                        <li key={ key }>
                            <span>{ match.type }</span>
                            <span>{ match.data.id }</span>
                        </li>
                    );
                })}
                </ul>
            );
        }

        return (
            <form className={ classes.join(' ') }>
                <input type="search"
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
        this.setState({
            focused: true
        });
    }

    onBlur(ev) {
        this.getActions('search').clearSearch();
        this.setState({
            focused: false
        });
    }
}
