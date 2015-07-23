import React from 'react/addons';
import { Link, Locations, Location } from 'react-router-component';

import FluxComponent from '../FluxComponent';


export default class SectionBase extends FluxComponent {
    render() {
        var subSections = this.getSubSections();
        var basePath = this.getBasePath();

        return (
            <div className="section">
                <nav className="section-nav">
                    <ul>
                        { subSections.map(function(subData) {
                            var path = basePath + subData.path;
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
                    <Locations contextual>
                        { subSections.map(function(subData) {
                            var path = (subData.path === '/')?
                                '(/*)' : subData.path + '(/*)';

                            return <Location key={ subData.path }
                                    path={ path }
                                    handler={ subData.startPane }/>;
                        })}
                    </Locations>
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
