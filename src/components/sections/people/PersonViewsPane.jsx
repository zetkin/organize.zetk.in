import { connect } from 'react-redux';
import { FormattedMessage as Msg } from 'react-intl';
import React from 'react';

import RootPaneBase from '../RootPaneBase';
import {
    retrievePersonViews,
} from '../../../actions/personView';
import { getListItemById } from '../../../utils/store';


const mapStateToProps = state => ({
    views: state.personViews,
});


@connect(mapStateToProps)
export default class PersonViewsPane extends RootPaneBase {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();

        this.props.dispatch(retrievePersonViews());
    }

    getRenderData() {
    }

    renderPaneContent(data) {
        const paneId = this.getParam(0);

        if (paneId) {
            return [
                <a key="backLink"
                    onClick={ () => this.gotoPane('views') }
                    >
                    <Msg id="panes.personViews.view.backLink"/>
                </a>
            ];
        }
        else if (this.props.views.viewList.items) {
            return (
                <ul className="PersonViewsPane-viewList">
                {this.props.views.viewList.items.map(viewItem => (
                    <li key={ viewItem.data.id }
                        className="PersonViewsPane-viewIcon"
                        onClick={ () => this.gotoPane('views', viewItem.data.id) }
                        >
                        <span className="PersonViewsPane-viewIconTitle">{ viewItem.data.title }</span>
                    </li>
                ))}
                </ul>
            );
        }
    }
}
