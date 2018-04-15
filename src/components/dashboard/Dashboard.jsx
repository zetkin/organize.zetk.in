import { connect } from 'react-redux';
import React from 'react';

import Footer from './Footer';
import Shortcut from './Shortcut';
import DraggableWidget from './widgets/DraggableWidget';
import Widget from './widgets/Widget';
import { moveWidget } from '../../actions/dashboard';
import { gotoSection } from '../../actions/view';

const mapStateToProps = (state, props) => ({
    shortcuts: state.dashboard.shortcuts,
    widgets: state.dashboard.widgets,
});

@connect(mapStateToProps)
export default class Dashboard extends React.Component {
    render() {
        const { shortcuts, widgets } = this.props;

        let widgetElements = [];
        let favoriteElements = [];
        let shortcutElements = [];

        shortcuts.forEach((shortcut, index) => {
            if (index < 6) {
                favoriteElements.push(
                    <li key={ shortcut }>
                        <Shortcut section={ shortcut }
                            expanded={ true }
                            onClick={ this.onClickShortcut.bind(this) }
                            />
                    </li>
                );
            }
            else {
                shortcutElements.push(
                    <li key={ shortcut }>
                        <Shortcut section={ shortcut }
                            onClick={ this.onClickShortcut.bind(this) }
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

    onClickShortcut(section, subSection) {
        this.props.dispatch(gotoSection(section, subSection));
    }

    onMoveWidget(widget, before) {
        this.props.dispatch(moveWidget(widget.type, before.type));
    }
}
