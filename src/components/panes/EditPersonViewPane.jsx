import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage as Msg, injectIntl } from 'react-intl';

import { getListItemById } from '../../utils/store';
import LoadingIndicator from '../misc/LoadingIndicator';
import PaneBase from './PaneBase';
import Reorderable from '../misc/reorderable/Reorderable';
import { reorderViewColumns } from '../../actions/personView';

const mapStateToProps = (state, props) => ({
    columnList: state.personViews.columnsByView[props.paneData.params[0]],
    viewItem: getListItemById(
        state.personViews.viewList,
        props.paneData.params[0]),
});

@connect(mapStateToProps)
@injectIntl
export default class EditPersonViewPane extends PaneBase {
    componentDidMount() {
        super.componentDidMount();
        if (!this.props.viewItem) {
            // Ugly, but opening this pane from any other context than one
            // where the view has already loaded is an extreme edge case.
            this.closePane();
        }
    }

    getPaneTitle(data) {
        const formatMessage = this.props.intl.formatMessage;
        const { viewItem } = this.props;

        if (viewItem && !viewItem.isPending) {
            return formatMessage(
                { id: 'panes.editPersonView.title' },
                { title: viewItem.data.title });
        }
        else {
            return null;
        }
    }

    renderPaneContent(data) {
        const { columnList, viewItem } = this.props;

        const elements = (columnList && columnList.items)?
            columnList.items.map(item => {
                return (
                    <div key={ item.data.id }
                        className="EditPersonViewPane-columnItem"
                        onClick={ () => this.openPane('editviewcolumn',
                            viewItem.data.id, item.data.id) }
                        >
                        <span>{ item.data.title }</span>
                    </div>
                );
            }) : [];

        if (viewItem && !viewItem.isPending) {
            const view = viewItem.data;
            return [
                <div key="columns" className="EditPersonViewPane-columns">
                    <Msg tagName="h3" id="panes.editPersonView.columns.h"/>
                    <Reorderable key="columns"
                        onReorder={ this.onColumnReorder.bind(this) }
                        >
                        { elements }
                    </Reorderable>
                </div>
            ];
        }
        else {
            return <LoadingIndicator />;
        }
    }

    onColumnReorder(order) {
        const view = this.props.viewItem.data;
        this.props.dispatch(reorderViewColumns(view.id, order));
    }
}
