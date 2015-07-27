import React from 'react/addons';

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
