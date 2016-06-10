import React from 'react';
import ReactDOM from 'react-dom';
import cx from 'classnames';

import PaneManager from '../../utils/PaneManager';
import { resolvePane } from '../panes';
import { componentClassNames } from '../';
import {
    openPane,
    closePane,
    replacePane,
    pushPane,
    gotoSection,
} from '../../actions/view';


export default class SectionBase extends React.Component {
    static propTypes = {
        panes: React.PropTypes.array.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    };

    runPaneManager() {
        const panes = Object.keys(this.refs)
            .filter(key => (key.indexOf('pane') == 0 && key != 'paneContainer'))
            .sort()
            .map(function(key) {
                var paneDOMNode = ReactDOM.findDOMNode(this.refs[key]);
                return paneDOMNode;
            }, this);

        const containerDOMNode = ReactDOM.findDOMNode(this.refs.paneContainer);
        PaneManager.run(panes, containerDOMNode);
    }

    componentDidMount() {
        this.runPaneManager();
    }

    componentWillUnmount() {
        PaneManager.stop();
    }

    componentDidUpdate() {
        this.runPaneManager();
    }

    render() {
        var panes = [];
        var subSections = this.getSubSections();
        var curSubSectionIndex;

        if (this.props.panes.length == 0) {
            curSubSectionIndex = 0;
            let Pane = subSections[0].startPane;
            panes.push(
                <Pane ref="pane0" key={ subSections[0].path } isBase={ true }
                    onOpenPane={ this.onOpenPane.bind(this, 0) }
                    onPushPane={ this.onPushPane.bind(this) }
                    paneType={ subSections[0].path }/>);
        }
        else {
            var subRefIndex = 1;
            var subStartIndex = 1;

            for (let i = 0; i < subSections.length; i++) {
                var section = subSections[i];
                if (section.path == this.props.panes[0].type) {
                    curSubSectionIndex = i;

                    let Pane = section.startPane;
                    panes.push(
                        <Pane ref="pane0" key={ section.path } isBase={ true }
                            onOpenPane={ this.onOpenPane.bind(this, 0) }
                            onPushPane={ this.onPushPane.bind(this) }
                            paneType={ section.path }/>);
                    break;
                }
            }

            // No base pane could be found. For most sub-sections, the first
            // URL segment after the section references the sub-section. But
            // for the start sub-section this might not be defined, e.g. the
            // sub-section at /people/list can also be found at /people. Since
            // no sub-section could be found, the segment at 0 probably really
            // references the next pane, so we should fall back to use the
            // default/home pane of this sub-section first.
            if (panes.length == 0) {
                curSubSectionIndex = 0;
                section = subSections[0];
                let Pane = section.startPane;
                panes.push(
                    <Pane ref="pane0" key={ section.path } isBase={ true }
                        onOpenPane={ this.onOpenPane.bind(this, 0) }
                        onPushPane={ this.onPushPane.bind(this) }
                        paneType={ section.path }/>);

                subStartIndex = 0;
            }

            for (let i = subStartIndex; i < this.props.panes.length; i++) {
                let paneData = this.props.panes[i];
                let Pane = resolvePane(paneData.type);

                panes.push(
                    <Pane ref={ 'pane' + subRefIndex } key={ paneData.id }
                        onClose={ this.onClosePane.bind(this, i) }
                        onReplace={ this.onReplacePane.bind(this, i) }
                        onOpenPane={ this.onOpenPane.bind(this, i) }
                        onPushPane={ this.onPushPane.bind(this) }
                        paneType={ paneData.type }
                        params={ paneData.params }/>
                );

                subRefIndex++;
            }
        }

        const sectionType = this.constructor.name
            .replace(/Section$/, '').toLowerCase();

        const helpUrl = '/help/sections/' + sectionType;
        const classes = cx(componentClassNames(this));

        let subMenuItems = subSections.map((subData, idx) => {
            let classes = cx('SectionBase-navItem',
                'SectionBase-navItem-' + subData.path, {
                    'selected': (idx === curSubSectionIndex)
                });

            return (
                <li key={ subData.path } className={ classes }>
                    <a onClick={ this.onClickSub.bind(this, subData) }>
                        { subData.title }</a>
                </li>
            );
        });

        return (
            <div className={ classes }>
                <nav className="SectionBase-nav">
                    <ul>
                        { subMenuItems }
                        <li key="back"
                            className='SectionBase-navItem SectionBase-navBack'>
                            <a onClick={ this.onClickBack.bind(this) }>
                                Back to<br/>
                                dashboard</a></li>
                    </ul>
                    <div className="SectionBase-navMisc">
                        <a target="_blank" href="http://zetkin.org">About</a>
                        <a target="_blank" href={ helpUrl }>Help</a>
                    </div>
                </nav>
                <div className="SectionBase-container" ref="paneContainer">
                    { panes }
                </div>
            </div>
        );
    }

    onClickSub(subData) {
        this.props.dispatch(gotoSection(this.props.section, subData.path));
    }

    getSubSections() {
        return [];
    }

    renderSectionContent() {
        throw "renderSectionContent() not implemented";
    }

    gotoSubSectionAt(index) {
        var subSections = this.getSubSections();

        if (index < subSections.length) {
            var router = this.context.router;
            var basePath = router.getMatch().matchedPath;
            var path = basePath + '/' + subSections[index].path;

            router.navigate(path);
            return true;
        }
        else {
            return false;
        }
    }

    onClickBack(index) {
        this.props.dispatch(gotoSection(null));
    }

    onClosePane(index) {
        this.props.dispatch(closePane(index));
    }

    onReplacePane(index, paneType, params) {
        this.props.dispatch(replacePane(index, paneType, params));
    }

    onOpenPane(index, paneType, params) {
        this.props.dispatch(openPane(index, paneType, params));
    }

    onPushPane(paneType, params) {
        this.props.dispatch(pushPane(paneType, params));
    }
}
