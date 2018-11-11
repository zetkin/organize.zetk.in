import cx from 'classnames';
import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { DropTarget } from 'react-dnd';

import FilterListItem from './FilterListItem';
import DropContainer from '../misc/DropContainer';
import makeRandomString from '../../utils/makeRandomString';


const filterTarget = {
    canDrop(props, monitor) {
        // A filter can never be dropped onto the list. It must be dropped
        // onto one of the DropContainers that are added between list items
        // while isDraggingOver.
        return false;
    }
}


function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isDraggingOver: monitor.isOver(),
    };
}

@DropTarget('filter', filterTarget, collectTarget)
export default class FilterList extends React.Component {
    static propTypes = {
        filters: React.PropTypes.array.isRequired,
        onAppendFilter: React.PropTypes.func,
        onRemoveFilter: React.PropTypes.func,
        onChangeFilter: React.PropTypes.func,
    };

    static contextTypes = {
        intl: React.PropTypes.shape({
            formatMessage: React.PropTypes.func,
        }),
    };

    constructor(props) {
        super(props);

        this.state = {
            filters: props.filters.map(f => Object.assign({}, f, {
                id: makeRandomString(10),
            })),
        };
    }

    render() {
        let filters = this.state.filters;
        let filterElements = [];

        const msg = id => this.context.intl.formatMessage({ id });

        const filterTypes = {
            'all': msg('filters.types.all'),
            'call_history': msg('filters.types.callHistory'),
            'campaign_participation': msg('filters.types.campaignParticipation'),
            'person_data': msg('filters.types.personData'),
            'person_tags': msg('filters.types.personTags'),
            'random': msg('filters.types.random'),
            'sub_query': msg('filters.types.subQuery'),
            'survey_submission': msg('filters.types.surveySubmission'),
            'survey_response': msg('filters.types.surveyResponse'),
            'survey_option': msg('filters.types.surveyOption'),
            'user': msg('filters.types.user'),
        };

        let items = [];
        for (let i = 0; i < filters.length; i++) {
            let filter = filters[i];

            items.push(
                <FilterListItem key={ filter.id } filter={ filter }
                    openPane={ this.props.openPane } // TODO: Remove eventually
                    showOpSwitch={ i > 0 && !this.props.isDraggingOver }
                    onChangeConfig={ this.onChangeConfig.bind(this, i) }
                    onChangeOp={ this.onChangeOp.bind(this, i) }
                    onRemove={ this.onFilterRemove.bind(this, i) }/>
            );

            if (this.props.isDraggingOver) {
                let key = 'dropAfter-' + filter.id;
                items.push(
                    <li key={ key }>
                        <DropContainer type="filter"
                            instructionsMsg="filters.dropInstructions"
                            onDrop={ this.onDrop.bind(this, i+1) }/>
                    </li>
                );
            }
        }

        let addSection = null;
        if (!this.props.isDraggingOver) {
            addSection = (
                <div className="FilterList-addSection">
                    <select value=""
                        onChange={ this.onFilterTypeSelect.bind(this) }>
                        <Msg tagName="option" id="filters.addFilter"/>
                        {Object.keys(filterTypes).map(function(type) {
                            const label = filterTypes[type];
                            return (
                                <option key={ type } value={ type }>
                                    { label }</option>
                            );
                        })}
                    </select>
                </div>
            );
        }

        let classes = cx('FilterList', {
            'FilterList-isDraggingOver': this.props.isDraggingOver,
        });

        return this.props.connectDropTarget(
            <div className={ classes }>
                <ul className="FilterList-items">
                    { items }
                </ul>
                { addSection }
            </div>
        );
    }

    getFilterSpec() {
        return this.state.filters;
    }

    onFilterTypeSelect(ev) {
        let filterType = ev.target.value;

        this.setState({
            filters: this.state.filters.concat([{
                op: 'add',
                id: makeRandomString(10),
                type: filterType,
                config: {},
            }]),
        })
    }

    onChangeConfig(filterIndex, config) {
        let filters = this.state.filters.concat();

        filters[filterIndex].config = config;
        this.setState({
            filters: filters,
        });
    }

    onChangeOp(filterIndex, op) {
        let filters = this.state.filters.concat();

        filters[filterIndex] = Object.assign({}, filters[filterIndex], { op });
        this.setState({
            filters: filters,
        });
    }

    onFilterRemove(filterIndex) {
        let filters = this.state.filters.filter((f, idx) => idx != filterIndex);

        // Counteracts weirdness with the "new" first filter having
        // a sub relationship to the removed filter
        if (filters.length) {
            filters[0].op = "add";
        }

        this.setState({ filters });

    }

    onDrop(targetIdx, item) {
        let filters = this.state.filters.concat();
        let filter = filters.find(f => f.id == item.id);
        let idx = filters.indexOf(filter);

        // Remove old filter
        filters.splice(idx, 1);

        // If the new position is later in the array, it will now have
        // been moved back by one, since an earlier filter was removed
        if (targetIdx > idx) targetIdx--;

        // Insert into it's new position
        filters.splice(targetIdx, 0, item);

        this.setState({ filters });
    }
}
