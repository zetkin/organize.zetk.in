const { getCountryTools } = require('verifiera');
const Sugar = require('sugar-date');

export default (dateStr) => {
let date = Sugar.Date(dateStr);
    // Check if date is valid
    if(date.isValid().raw) {
        return date.format('{yyyy}-{MM}-{dd}').raw;
    } else {
        // Check if removing last four digits of a digit-only string yields valid date
        let strippedDateStr = dateStr.replace(/[^\d]/g,'');
        // Only do this on 12-digit dates, this is likely a Swedish personal number with a four digit year.
        if(strippedDateStr.length == 12) {
            strippedDateStr = strippedDateStr.slice(0,-4);
        }
        date = Sugar.Date(strippedDateStr);
        if(date.isValid().raw) {
            return date.format('{yyyy}-{MM}-{dd}').raw;
        }
        // Check if dateStr is an ID number from SE,DK,FI,NO,CZ,SK,PL
        const ssn = getCountryTools(dateStr);
        if(ssn.validate()) {
            // Get the birthday from the ID number
            date = ssn.getBirthday();
            if(date) {
                return date;
            }
        }
    }
    return null;
}
