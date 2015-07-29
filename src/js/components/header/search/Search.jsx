import React from 'react/addons';

import FluxComponent from '../../FluxComponent';
import CampaignMatch from './CampaignMatch';
import LocationMatch from './LocationMatch';
import PersonMatch from './PersonMatch';


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
        this.setState({
            focused: false
        });
    }
}
