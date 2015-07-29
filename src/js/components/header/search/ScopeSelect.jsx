import React from 'react/addons';
import cx from 'classnames';


const SCOPES = [ 'all', 'people', 'campaign', 'maps' ];

export default class ScopeSelect extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    render() {
        var selectedScope = this.props.value || 'all';
        var selectedClassNames = cx(
            'search-form-scopeselect-value',
            'search-form-scopeselect-' + selectedScope
        );

        var listClassNames = cx({
            'search-form-scopeselect': true,
            'open': this.state.open
        });

        return (
            <ul className={ listClassNames }
                onClick={ this.onListClick.bind(this) }>

                <li key={ selectedScope } className={ selectedClassNames }/>

                {SCOPES.map(function(scope) {
                    var classNames = cx(
                        'search-form-scopeselect-item',
                        'search-form-scopeselect-' + scope
                    );

                    return (
                        <li key={ scope } className={ classNames }
                            onClick={ this.onScopeClick.bind(this, scope) }>
                            { scope }</li>
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
    value: React.PropTypes.string,
    onSelect: React.PropTypes.func
};
