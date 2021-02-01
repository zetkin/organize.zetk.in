import { connect } from 'react-redux';
import cx from 'classnames';
import { injectIntl } from 'react-intl';
import React from 'react';
import ReactDOM from 'react-dom';

import Avatar from '../../Avatar';
import TextInput from '../../../forms/inputs/TextInput';
import {
    beginSearch,
    clearSearch,
    resetSearchQuery,
    search,
} from '../../../../actions/search';
import makeRandomString from '../../../../utils/makeRandomString';

const mapStateToProps = state => ({
    search: state.search,
});

@connect(mapStateToProps)
export default class PersonViewCell extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showSelect: false,
            fieldId: makeRandomString(10)
        };

        this.onClickOutside = this.onClickOutside.bind(this);
    }

    componentWillUnmount(){
        this.props.dispatch(clearSearch(this.state.fieldId));
    }

    render() {
        const classes = cx('PersonViewCell', this.props.column.type, {
            'selected': !!this.props.content,
        });

        let selectDialog = null;
        if (this.state.showSelect) {
            const searchStore = this.props.search[this.state.fieldId];

            let resultList = null;
            if (searchStore && searchStore.results) {
                resultList = (
                    <ul>
                    {searchStore.results.map(match => (
                        <li key={ match.data.id }>
                            <Avatar person={ match.data }/>
                            <span>
                                { match.data.first_name } { match.data.last_name }
                            </span>
                        </li>
                    ))}
                    </ul>
                );
            }

            selectDialog = (
                <div ref="selectDialog" className="PersonViewCell-select">
                    <TextInput name="search"
                        onFocus={ this.onFocus.bind(this) }
                        onValueChange={ this.onQueryChange.bind(this) }
                        labelMsg="misc.personViewTable.cells.local_person.inputLabel"
                        placeholder="misc.personViewTable.cells.local_person.inputPlaceholder"/>
                    <div className="PersonViewCell-selectResults">
                        { resultList }
                    </div>
                </div>
            );
        }

        return (
            <td className={ classes }>
                <Avatar person={{ id: this.props.content }}
                    onClick={ this.onClickCurrent.bind(this) }
                    />
                { selectDialog }
            </td>
        );
    }

    onQueryChange(name, query) {
        if (query){
            this.props.dispatch(search(this.state.fieldId, query));
        }
        else {
            this.props.dispatch(resetSearchQuery(this.state.fieldId));
        }
    }

    onFocus(ev) {
        let searchStore = this.props.search[this.state.fieldId];
        if (!searchStore || !searchStore.isActive) {
            this.props.dispatch(beginSearch(this.state.fieldId, ['person']));
        }
    }

    onClickCurrent() {
        const show = !this.state.showSelect;

        this.setState({
            showSelect: show,
        });

        if (show) {
            document.addEventListener('click', this.onClickOutside);
        }
        else {
            document.removeEventListener('click', this.onClickOutside);
        }
    };

    onClickOutside(ev) {
        const selectDialog = ReactDOM.findDOMNode(this.refs.selectDialog);
        if (selectDialog && !selectDialog.contains(ev.target)) {
            this.setState({
                showSelect: false,
            });

            document.removeEventListener('click', this.onClickOutside);
        }
    }
}
