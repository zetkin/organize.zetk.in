import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import Button from '../../misc/Button';
import RootPaneBase from '../RootPaneBase';


const mapStateToProps = state => ({
    assignmentList: state.canvassAssignments.assignmentList,
});

@connect(mapStateToProps)
@injectIntl
export default class AllCanvassAssignmentsPane extends RootPaneBase {
    componentDidMount() {
    }

    getRenderData() {
        return {
        };
    }

    getPaneFilters(data, filters) {
        return null;
    }

    renderPaneContent(data) {
        return null;
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="AllCanvassAssignmentsPane-addButton"
                labelMsg="panes.allCanvassAssignments.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
        ];
    }

    onFiltersApply(filters) {
    }

    onAddClick() {
        this.openPane('addcanvassassignment');
    }
}
