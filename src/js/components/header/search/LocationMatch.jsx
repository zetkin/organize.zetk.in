import MatchBase from './MatchBase';


export default class LocationMatch extends MatchBase {
    getLinkTarget() {
        return '/maps/locations/location:' + this.props.data.id;
    }

    getTitle() {
        return this.props.data.title;
    }
}
