import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';
import cx from 'classnames';

const SCOPES = {
    'all' : null,
    'people': ['personquery', 'person'],
    'campaign': ['action', 'campaign', 'activity'],
    'dialog': ['callassignment'],
    'maps': ['location'],
    'survey': ['survey', 'surveysubmission'],
};

export default class ScopeSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {
        var selectedScope = this.props.value;

        let scopeKey = 'all';
        if (selectedScope) {
            scopeKey = Object.keys(SCOPES).find((key) => {
                if (key == 'all') {
                    return false;
                }
                else {
                    return SCOPES[key].every(s => selectedScope.includes(s));
                }
            });
        }

        var selectedClassNames = cx(
            'ScopeSelect-value',
            scopeKey
        );

        var listClassNames = cx({
            'ScopeSelect': true,
            'open': this.state.open
        });

        return (
            <ul className={ listClassNames }
                onClick={ this.onListClick.bind(this) }>

                <li key={ scopeKey } className={ selectedClassNames }/>

                {Object.keys(SCOPES).map((key) => {
                    var classNames = cx(
                        'ScopeSelect-item',
                        key,
                        {'selected': key == scopeKey }
                    );


                    return (
                        <li key={ key } className={ classNames }
                            onClick={ this.onScopeClick.bind(this, SCOPES[key]) }>
                            <Msg id={ 'header.search.scopes.' + key }/></li>
                    );
                }, this)}
            </ul>
        );
    }

    onListClick() {
        this.setState({
            open: !this.state.open
        });
    }

    onScopeClick(scope) {
        if (this.props.onSelect) {
            this.props.onSelect(scope);
        }
    }
}

ScopeSelect.propTypes = {
    value: React.PropTypes.array,
    onSelect: React.PropTypes.func
};
