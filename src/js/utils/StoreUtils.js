function updateOrAdd(dataSet, id, newData) {
    var i;
    var updated = false;

    for (i = 0; i < dataSet.length; i++) {
        if (dataSet[i].id == id) {
            var attr;
            for (attr in newData) {
                console.log('updating', attr);
                dataSet[i][attr] = newData[attr];
            }
            updated = true;
            break;
        }
    }

    if (!updated) {
        dataSet.push(newData);
    }
}


export default {
    updateOrAdd: updateOrAdd
}
