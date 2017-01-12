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

function convertDDToDMS(D, lng){
    return {
        dir : D<0?lng?'W':'S':lng?'E':'N',
        deg : 0|(D<0?D=-D:D),
        min : 0|D%1*60,
        sec :(0|D*60%1*6000)/100
    };
}

export const convertLngToDMS = d => convertDDToDMS(d, true);
export const convertLatToDMS = d => convertDDToDMS(d, false);
