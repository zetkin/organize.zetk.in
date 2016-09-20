import React from 'react';
import { connect } from 'react-redux';

import TagCloud from '../../tagcloud/TagCloud';
import { retrievePersonTags } from '../../../../actions/personTag';
import { createSelection } from '../../../../actions/selection';
import { getListItemsByIds } from '../../../../utils/store';


@connect(state => ({ personTags: state.personTags }))
export default class PersonTagColumnSettings extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        openPane: React.PropTypes.func.isRequired, // TODO: Remove after refactor
        onChangeConfig: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.dispatch(retrievePersonTags());
    }

    render() {
        let config = this.props.config;
        let tagList = this.props.personTags.tagList;

        return (
            <div className="PersonTagColumnSettings">
                <ul className="PersonTagColumnSettings-mappings">
                { config.mappings.map(mapping => {
                    let value = mapping.value;
                    let label = value?
                        'Mapping for value: ' + mapping.value
                        : 'Mapping for empty cells';

                    let tags = getListItemsByIds(tagList, mapping.tags)
                        .map(i => i.data);

                    return (
                        <li key={ label }
                            className="PersonTagColumnSettings-mapping">
                            <h4>{ label }</h4>
                            <TagCloud tags={ tags }
                                showAddButton={ true }
                                showRemoveButtons={ true }
                                onAdd={ this.onAddTag.bind(this, value) }
                                onRemove={ this.onRemoveTag.bind(this, value) }
                                />
                        </li>
                    );
                }) }
                </ul>
            </div>
        );
    }

    onAddTag(value) {
        let action = createSelection('persontag', null, null, ids => {
            let config = this.props.config;
            let oldMapping = config.mappings.find(m => m.value === value);
            let newMapping = Object.assign({}, oldMapping, {
                tags: oldMapping.tags.concat(ids)
            });

            config = Object.assign({}, config, {
                mappings: config.mappings.map(m =>
                    (m.value === value)? newMapping :  m),
            });

            if (this.props.onChangeConfig) {
                this.props.onChangeConfig(config);
            }
        });

        this.props.dispatch(action);
        this.props.openPane('selectpersontags', action.payload.id);
    }

    onRemoveTag(value, tag) {
        let config = this.props.config;
        let oldMapping = config.mappings.find(m => m.value === value);
        let newMapping = Object.assign({}, oldMapping, {
            tags: oldMapping.tags.filter(id => id !== tag.id),
        });

        config = Object.assign({}, config, {
            mappings: config.mappings.map(m =>
                (m.value === value)? newMapping :  m),
        });

        if (this.props.onChangeConfig) {
            this.props.onChangeConfig(config);
        }
    }
}
