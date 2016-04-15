import React from 'react';

import SectionBase from '../SectionBase';
import LocationsPane from './LocationsPane';


export default class MapsSection extends SectionBase {
    getSubSections() {
        return [
            { path: 'locations', title: 'Locations',
                startPane: LocationsPane }
        ];
    }
}
