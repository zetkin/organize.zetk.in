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
            isDefault: true,
            lat: 50.974300,
            lng: 12.840305,
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


export function dmsStringFromLatLng(lat, lng) {
    let latDMS = convertLatToDMS(lat), lngDMS = convertLngToDMS(lng);
    let latStr = latDMS.deg.toString()
        .concat('° ', latDMS.min, '\' ', latDMS.sec, '" ', latDMS.dir);
    let lngStr = lngDMS.deg.toString()
        .concat('° ', lngDMS.min, '\' ', lngDMS.sec, '" ', lngDMS.dir);

    return latStr + ' ' + lngStr;
}
