export function getLocationAverage(locList) {
    if (locList.items && locList.items.length) {
        let sumOfLat = 0;
        let sumOfLng = 0;

        locList.items.forEach(function(loc) {
            sumOfLng += loc.data.lng;
            sumOfLat += loc.data.lat;
        });

        return {
            lat: sumOfLat / locList.items.length,
            lng: sumOfLng / locList.items.length
        }
    }
    else {
        return {
            lat: 0,
            lng: 0
        }
    }
}
