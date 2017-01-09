import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import React from 'react';

import Footer from './Footer';
import Shortcut from './Shortcut';
import DraggableWidget from './widgets/DraggableWidget';
import Widget from './widgets/Widget';
import { moveWidget } from '../../actions/dashboard';
import { gotoSection } from '../../actions/view';


@connect(state => state)
@injectIntl
export default class Dashboard extends React.Component {
    render() {
        let dashboardStore = this.props.dashboard;
        let shortcuts = dashboardStore.shortcuts;
        let widgets = dashboardStore.widgets;

        let widgetElements = [];
        let favoriteElements = [];
        let shortcutElements = [];

        const formatMessage = this.props.intl.formatMessage;

        shortcuts.forEach((shortcut, index) => {
            let onClick = this.onClickShortcut.bind(this, shortcut);

            if (index < 4) {
                favoriteElements.push(
                    <li key={ shortcut }>
                        <Shortcut section={ shortcut }
                            expanded={ true }
                            onClick={ onClick }
                            />
                    </li>
                );
            }
            else {
                shortcutElements.push(
                    <li key={ shortcut }>
                        <Shortcut section={ shortcut }
                            onClick={ onClick }
                            />
                    </li>
                );
            }
        });

        for (let i = 0; i < widgets.length; i++) {
            var widgetConfig = widgets[i];

            widgetElements.push(
                <DraggableWidget key={ widgetConfig.type } config={ widgetConfig }
                    onMoveWidget={ this.onMoveWidget.bind(this) }>
                    <Widget config={ widgetConfig }/>
                </DraggableWidget>
            );
        }


        return (
            <div className="Dashboard">
                <ul className="Dashboard-favorites">
                    { favoriteElements }
                </ul>
                <ul className="Dashboard-shortcuts">
                    { shortcutElements }
                </ul>
                <div className="Dashboard-widgets">
                </div>
                <Footer/>
            </div>
        );
    }

    onClickShortcut(target) {
        this.props.dispatch(gotoSection(target));
    }

    onMoveWidget(widget, before) {
        this.props.dispatch(moveWidget(widget.type, before.type));
    }
}
