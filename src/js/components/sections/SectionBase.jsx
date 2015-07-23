import React from 'react/addons';
import { Link } from 'react-router-component';

import FluxComponent from '../FluxComponent';


class DummyPane extends React.Component {
    render() {
        return <h1>Dummy pane { this.props.params }</h1>;
    }
}

export default class SectionBase extends FluxComponent {
    render() {
        var Pane;
        var panes = [];
        var panePath;
        var router = this.context.router;
        var subSections = this.getSubSections();
        var basePath = router.getMatch().matchedPath;

        var i;
        var subPath = router.getMatch().unmatchedPath;

        if (!subPath) {
            Pane = subSections[0].startPane;
            panePath = basePath + '/' + subSections[0].path;
            panes.push(
                <Pane key={ subSections[0].path }
                        panePath={ panePath }/>);
        }
        else {
            var subPathSegments = subPath.split('/');

            for (i = 0; i < subSections.length; i++) {
                var section = subSections[i];
                if (section.path == subPathSegments[0]) {
                    Pane = section.startPane;
                    panePath = basePath + '/' + section.path;
                    panes.push(<Pane key={ section.path } panePath={ panePath }/>);
                    break;
                }
            }

            for (i = 1; i < subPathSegments.length; i++) {
                var segment = subPathSegments[i];

                panePath = basePath + '/' + subPathSegments.slice(0, i).join('/');
                panes.push(
                    <DummyPane key={ segment } panePath={ panePath } params={ segment }/>
                );
            }
        }

        return (
            <div className="section">
                <nav className="section-nav">
                    <ul>
                        { subSections.map(function(subData) {
                            var path = basePath + '/' + subData.path;
                            return (
                                <li key={ subData.path }>
                                    <Link href={ path}>
                                        { subData.title }
                                    </Link>
                                </li>
                            );
                        }, this)}
                        <li key="back"><Link href="/">Dashboard</Link></li>
                    </ul>
                </nav>
                <div className="section-content">
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
}

SectionBase.contextTypes.router = React.PropTypes.any
