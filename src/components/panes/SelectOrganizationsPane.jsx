import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';
import { connect } from 'react-redux';

import Button from '../misc/Button';
import PaneBase from './PaneBase';
import OrganizationCloud from '../misc/clouds/OrganizationCloud';
import TextInput from '../forms/inputs/TextInput';
import { getListItemById } from '../../utils/store';
import flattenOrganizations from '../../utils/flattenOrganizations';
import { addToSelection, removeFromSelection, finishSelection }
    from '../../actions/selection';


@connect(state => state)
@injectIntl
export default class SelectOrganizationsPane extends PaneBase {

    constructor(props) {
        super(props);

        this.state = {
            ...this.state,
            orgsFilter: '',
        };
    }

    componentDidMount() {
        super.componentDidMount();
    }

    getRenderData() {
        let selectionId = this.getParam(0);
        let selectionList = this.props.selections.selectionList; 

        return {
            selectionItem: getListItemById(selectionList, selectionId),
            orgList: flattenOrganizations(this.props.subOrgs.items, this.props.user.activeMembership.organization),
        };
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        return formatMessage({ id: 'panes.selectOrganizations.title' });
    }

    renderPaneContent(data) {
        let selection = data.selectionItem.data;

        let orgsSelected = [];
        let orgsAvailable = [];

        if (data.orgList && !data.orgList.isPending) {
            orgsSelected = selection.selectedIds.map(id =>
                data.orgList.find(org => org.id == id));

            orgsAvailable = data.orgList
                .filter(d => selection.selectedIds.indexOf(d.id) < 0)
                .filter(t => {
                    const filter = this.state.orgsFilter.toLowerCase();
                    const orgTitle = t.title.toLowerCase();

                    return orgTitle.includes(filter);
                })
                .sort((t0, t1) => t0.title.localeCompare(t1.title));
        }

        let numSelected = orgsSelected.length;

        return [
            <Msg tagName="h3" key="selectedHeader"
                id="panes.selectOrganizations.selectedHeader"
                values={{ numSelected }}/>,
            <OrganizationCloud key="selectedOrganizations" organizations={ orgsSelected }
                showRemoveButtons={ true }
                onRemove={ this.onRemove.bind(this) }/>,
            <Msg tagName="h3" key="availableHeader"
                id="panes.selectOrganizations.availableHeader"
                values={{ numSelected }}/>,
            <TextInput key="isFilter" name="orgsFilter"
                className="SelectOrganizationsPane-orgsFilter"
                labelMsg="panes.selectOrganizations.orgsFilter.label"
                placeholder="panes.selectOrganizations.orgsFilter.placeholder"
                value={ this.state.orgsFilter }
                onValueChange={ this.onChangeOrgsFilter.bind(this) }/>,
            <OrganizationCloud key="availableOrganizations" organizations={ orgsAvailable }
                onSelect={ this.onSelect.bind(this) }/>,
        ];
    }

    renderPaneFooter(data) {
        let numSelected = data.selectionItem.data.selectedIds.length;

        return (
            <Button className="SelectOrganizationsPane-saveButton"
                labelMsg="panes.selectOrganizations.okButton"
                labelValues={{ numSelected }}
                onClick={ this.onClickSave.bind(this) }/>
        );
    }

    onClickSave() {
        let selectionId = this.getParam(0);
        this.props.dispatch(finishSelection(selectionId));
        this.closePane();
    }

    onSelect(i) {
        let selectionId = this.getParam(0);
        this.props.dispatch(addToSelection(selectionId, i.id));
    }

    onRemove(i) {
        let selectionId = this.getParam(0);
        this.props.dispatch(removeFromSelection(selectionId, i.id));
    }

    onChangeOrgsFilter(name, value) {
        this.setState({ ...this.state, orgsFilter: value});
    }
}

