import React from 'react/addons';
import { Link } from 'react-router-component';

import FluxComponent from '../FluxComponent';


export default class SectionBase extends FluxComponent {
    render() {
        var i;
        var subSections = this.getSubSections();
        var navItems = [];

        for (i in subSections) {
            var subData = subSections[i];

            // TODO: Add icons et c
            navItems.push(
                <li key={ i }>{ subData.title }</li>
            );
        }

        return (
            <div className="section">
                <nav className="section-nav">
                    <ul>
                        { navItems }
                        <li key="back"><Link href="/">Dashboard</Link></li>
                    </ul>
                </nav>
                <div className="section-content">
                    { this.renderSectionContent() }
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
