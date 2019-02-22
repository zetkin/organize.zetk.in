import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import LoadingIndicator from '../../misc/LoadingIndicator';
import ScopeSelect from './ScopeSelect';
import matches from './matches';
import { gotoSection, pushPane } from '../../../actions/view';
import {
    beginSearch,
    changeSearchScope,
    clearSearch,
    resetSearchQuery,
    search,
} from '../../../actions/search';

const field = "top"

@injectIntl
@connect(state => ({ search: state.search[field], view: state.view }))
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

        if (searchStore.isActive && searchStore.query && searchStore.query.length < 3) {
            resultList = (
                <ul className="Search-results">
                    <li className="Search-keepTyping">
                        <Msg id="header.search.keepTyping"/>
                    </li>
                </ul>
            );
        }
        else if (results.length || searchStore.isPending) {
            let loadingIndicator = null;
            if (searchStore.isPending) {
                loadingIndicator = (
                    <li key="pending" className="Search-loadingIndicator">
                        <LoadingIndicator/>
                    </li>
                );
            }

            resultList = (
                <ul className="Search-results">
                {results.map(function(match, idx) {
                    const key = match.type + ':' + match.data.id;
                    const focused = (this.state.focusedIndex === idx);

                    var Match = matches.resolve(match.type);
                    if (!Match) {
                        console.warn('Unknown search match type', match.type);
                        return null;
                    }

                    return <Match key={ key } data={ match.data }
                        onSelect={ this.onMatchSelect.bind(this, match) }
                        focused={ focused }/>;
                }, this)}

                    { loadingIndicator }
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
        this.props.dispatch(changeSearchScope(field, scope));
    }

    onMatchSelect(match) {
        let defaultSection;
        let paneType;
        let params;

        switch (match.type) {
            case 'activity':
                defaultSection = 'campaign';
                paneType = 'editactivity';
                params = [ match.data.id ];
                break;
            case 'actionday':
                defaultSection = 'campaign';
                paneType = 'actionday';
                params = [ match.data.date ];
                break;
            case 'assigned_route':
                defaultSection = 'canvass';
                paneType = 'assignedroute';
                params = [ match.data.id ];
                break;
            case 'callassignment':
                defaultSection = 'dialog';
                paneType = 'callassignment';
                params = [ match.data.id ];
                break;
            case 'campaign':
                defaultSection = 'campaign';
                paneType = 'editcampaign';
                params = [ match.data.id ];
                break;
            case 'canvass_route':
                defaultSection = 'canvass';
                paneType = 'route';
                params = [ match.data.id ];
                break;
            case 'canvass_assignment':
                defaultSection = 'canvass';
                paneType = 'canvassassignment';
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
            case 'survey':
                defaultSection = 'survey';
                paneType = 'survey';
                params = [ match.data.id ];
                break;
            case 'surveysubmission':
                defaultSection = 'survey';
                paneType = 'surveysubmission';
                params = [ match.data.id ];
                break;
            case 'personquery':
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
            this.props.dispatch(clearSearch(field));
        }
        else if (ev.keyCode == 40 && searchStore.isActive) {
            // Down
            this.setState({
                focusedIndex: Math.min(results.length,
                    (focusedIndex === undefined)? 0 : focusedIndex + 1)
            });

            ev.preventDefault();
        }
        else if (ev.keyCode == 38 && searchStore.isActive) {
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

        const query = ev.target.value;

        if (query) {
            this.props.dispatch(search(ev.target.value, field));
        }
        else {
            this.props.dispatch(resetSearchQuery(field));
        }
    }

    onFocus(ev) {
        var searchStore = this.props.search;
        if (!searchStore.isActive) {
            this.props.dispatch(beginSearch(field));
        }
    }

    onBlur(ev) {
        setTimeout(() => {
            this.props.dispatch(clearSearch(field));
        }, 350);
    }
}

Search.propTypes = {
    onMatchNavigate: React.PropTypes.func
};
