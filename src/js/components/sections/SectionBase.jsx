import React from 'react/addons';
import { Link } from 'react-router-component';
import cx from 'classnames';

import PaneUtils from '../../utils/PaneUtils';
import PaneManager from '../../utils/PaneManager';
import FluxComponent from '../FluxComponent';


export default class SectionBase extends FluxComponent {
    runPaneManager() {
        var panes = [];
        var containerDOMNode;

        Object.keys(this.refs)
            .filter(key => (key.indexOf('pane') == 0 && key != 'paneContainer'))
            .sort()
            .map(function(key) {
                var paneDOMNode = React.findDOMNode(this.refs[key]);
                panes.push(paneDOMNode);
            }, this);

        containerDOMNode = React.findDOMNode(this.refs.paneContainer);
        PaneManager.run(panes, containerDOMNode);
    }

    componentDidMount() {
        this.runPaneManager();
    }

    componentWillUnmount() {
        PaneManager.stop();
    }

    componentDidUpdate() {
        PaneManager.stop();
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
                    paneType={ subSections[0].path } panePath={ panePath }/>);
        }
        else {
            var subPathSegments = subPath.split('/');

            for (i = 0; i < subSections.length; i++) {
                var section = subSections[i];
                if (section.path == subPathSegments[0]) {
                    curSubSectionIndex = i;
                    Pane = section.startPane;
                    panePath = basePath + '/' + section.path;
                    panes.push(
                        <Pane ref="pane0" key={ section.path }
                            paneType={ section.path } panePath={ panePath }/>);
                    break;
                }
            }

            for (i = 1; i < subPathSegments.length; i++) {
                var segment = subPathSegments[i];
                var segmentData = segment.split(':');
                var paneName = segmentData[0];
                var paneParams = [];

                if (segmentData.length == 2) {
                    paneParams = segmentData[1].split(',');
                }

                panePath = basePath + '/' + subPathSegments.slice(0, i+1).join('/');

                Pane = PaneUtils.resolve(paneName);
                panes.push(
                    <Pane ref={ 'pane' + i } key={ segment }
                        paneType={ paneName }
                        panePath={ panePath } params={ paneParams }/>
                );
            }
        }

        var sectionType = this.constructor.name
            .replace(/Section$/, '').toLowerCase();

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
}

SectionBase.contextTypes.router = React.PropTypes.any
