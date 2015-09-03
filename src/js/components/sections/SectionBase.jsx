import React from 'react/addons';
import { Link } from 'react-router-component';
import cx from 'classnames';

import PaneManager from '../../utils/PaneManager';
import FluxComponent from '../FluxComponent';
import { resolvePane } from '../panes';


export default class SectionBase extends FluxComponent {
    runPaneManager() {
        const panes = Object.keys(this.refs)
            .filter(key => (key.indexOf('pane') == 0 && key != 'paneContainer'))
            .sort()
            .map(function(key) {
                var paneDOMNode = React.findDOMNode(this.refs[key]);
                return paneDOMNode;
            }, this);

        const containerDOMNode = React.findDOMNode(this.refs.paneContainer);
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
        var Pane;
        var panes = [];
        var panePath;
        var router = this.context.router;
        var subSections = this.getSubSections();
        var basePath = router.getMatch().matchedPath;
        var curSubSectionIndex;

        var i;
        var subPath = router.getMatch().unmatchedPath;

        if (!subPath) {
            curSubSectionIndex = 0;
            Pane = subSections[0].startPane;
            panePath = basePath + '/' + subSections[0].path;
            panes.push(
                <Pane ref="pane0" key={ subSections[0].path }
                    onOpenPane={ this.onOpenPane.bind(this, 0) }
                    onPushPane={ this.onPushPane.bind(this) }
                    paneType={ subSections[0].path } panePath={ panePath }/>);
        }
        else {
            var subRefIndex = 1;
            var subStartIndex = 1;
            var subPathSegments = subPath.split('/');

            for (i = 0; i < subSections.length; i++) {
                var section = subSections[i];
                if (section.path == subPathSegments[0]) {
                    curSubSectionIndex = i;
                    Pane = section.startPane;
                    panePath = basePath + '/' + section.path;
                    panes.push(
                        <Pane ref="pane0" key={ section.path }
                            onOpenPane={ this.onOpenPane.bind(this, 0) }
                            onPushPane={ this.onPushPane.bind(this) }
                            paneType={ section.path } panePath={ panePath }/>);
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
                Pane = section.startPane;
                panePath = basePath + '/' + section.path;
                panes.push(
                    <Pane ref="pane0" key={ section.path }
                        onOpenPane={ this.onOpenPane.bind(this, 0) }
                        onPushPane={ this.onPushPane.bind(this) }
                        paneType={ section.path } panePath={ panePath }/>);

                subStartIndex = 0;
            }

            for (i = subStartIndex; i < subPathSegments.length; i++) {
                var segment = subPathSegments[i];
                var segmentData = segment.split(':');
                var paneName = segmentData[0];
                var paneParams = [];

                if (segmentData.length == 2) {
                    paneParams = segmentData[1].split(',');
                }

                panePath = basePath + '/' + subPathSegments.slice(0, i+1).join('/');

                Pane = resolvePane(paneName);
                panes.push(
                    <Pane ref={ 'pane' + subRefIndex } key={ segment }
                        onClose={ this.onClosePane.bind(this, i) }
                        onReplace={ this.onReplacePane.bind(this, i) }
                        onOpenPane={ this.onOpenPane.bind(this, i) }
                        onPushPane={ this.onPushPane.bind(this) }
                        paneType={ paneName }
                        panePath={ panePath } params={ paneParams }/>
                );

                subRefIndex++;
            }
        }

        const sectionType = this.constructor.name
            .replace(/Section$/, '').toLowerCase();

        const helpUrl = '/help/sections/' + sectionType;

        return (
            <div className={ 'section section-' + sectionType }>
                <nav className="section-nav">
                    <ul>
                        { subSections.map(function(subData, index) {
                            var path = basePath + '/' + subData.path;
                            var classes = cx('section-nav-item',
                                'section-nav-item-' + subData.path, {
                                    'selected': (index === curSubSectionIndex)
                                });

                            return (
                                <li key={ subData.path } className={ classes }>
                                    <Link href={ path}>
                                        { subData.title }
                                    </Link>
                                </li>
                            );
                        }, this)}
                        <li key="back"
                            className='section-nav-item section-nav-back'>
                            <Link href="/">Back to <br />Dashboard</Link></li>
                    </ul>
                    <div className="section-nav-misc">
                        <a target="_blank" href="http://zetkin.org">About</a>
                        <a target="_blank" href={ helpUrl }>Help</a>
                    </div>
                </nav>
                <div className="section-content" ref="paneContainer">
                    { panes }
                </div>
            </div>
        );
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

    onClosePane(index) {
        const router = this.context.router;
        const basePath = router.getMatch().matchedPath;
        const subPath = router.getMatch().unmatchedPath;
        const subPathSegments = subPath.split('/');

        // Remove element at index
        subPathSegments.splice(index, 1);
        const path = [ basePath ].concat(subPathSegments).join('/');

        router.navigate(path);
    }

    onReplacePane(index, newSegment) {
        const router = this.context.router;
        const basePath = router.getMatch().matchedPath;
        const subPath = router.getMatch().unmatchedPath;
        const subPathSegments = subPath.split('/');

        // Replace segment at index
        subPathSegments[index] = newSegment;
        const path = [ basePath ].concat(subPathSegments).join('/');

        router.navigate(path);
    }

    onOpenPane(index, newSegment) {
        const router = this.context.router;
        const basePath = router.getMatch().matchedPath;
        const subPath = router.getMatch().unmatchedPath;
        const subPathSegments = subPath? subPath.split('/') : [];

        // Add segment after index
        subPathSegments.splice(index + 1, 0, newSegment);
        const path = [ basePath ].concat(subPathSegments).join('/');

        router.navigate(path);
    }

    onPushPane(newSegment) {
        const router = this.context.router;
        const basePath = router.getMatch().matchedPath;
        const subPath = router.getMatch().unmatchedPath || '';

        // Add segment at the end
        const path = basePath + '/' + subPath + '/' + newSegment;

        router.navigate(path);
    }
}

SectionBase.contextTypes.router = React.PropTypes.any
