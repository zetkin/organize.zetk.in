import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import SelectInput from '../../../forms/inputs/SelectInput';
import { retrieveFieldTypesForOrganization } from '../../../../actions/personField';
import { createSelection } from '../../../../actions/selection';
import { getListItemsByIds } from '../../../../utils/store';


@connect(state => ({ fieldTypes: state.personFields.fieldTypes }))
export default class PersonFieldColumnSettings extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        openPane: React.PropTypes.func.isRequired,
        onChangeConfig: React.PropTypes.func,
    };

    componentDidMount() {
        this.props.dispatch(retrieveFieldTypesForOrganization());
    }

    render() {
        let config = this.props.config;
        let field = config.field_id + '.' + config.field_type;

        let fieldTypes = this.props.fieldTypes;

        const FIELD_OPTIONS = this.props.fieldTypes.items.reduce((obj, field) => {
            obj[field.data.id + '.' + field.data.type] = field.data.title;
            return obj;
        }, {});

        return (
            <div className="PersonFieldColumnSettings">
                <Msg tagName="h3" id="panes.import.settings.personField.h" />
                <Msg tagName="p"
                    id="panes.import.settings.personField.instructions"/>
                <SelectInput name="field"
                    value={ field } options={ FIELD_OPTIONS }
                    onValueChange={ this.onChangeField.bind(this) }/>
            </div>
        );
    }

    onChangeField(prop, value) {
        if (this.props.onChangeConfig) {
            const m = value.match(/^(\d+)\.(.+)$/);
            this.props.onChangeConfig({ field_id: m[1],
                                        field_type: m[2], });
        }
    }
}
