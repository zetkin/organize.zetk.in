const { getCountryTools } = require('verifiera');
const Sugar = require('sugar-date');

export default (dateStr) => {
    let date = Sugar.Date(dateStr);
    // Check if date is valid
    if(date.isValid().raw) {
        return date.format('{yyyy}-{MM}-{dd}').raw;
    } else {
        // Check if removing last four digits yields valid date
        const strippedDatStr = dateStr.replace(/[^\d]/g,'').slice(0,-4);
        date = Sugar.Date(strippedDatStr);
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
