function updateOrAdd(dataSet, id, newData) {
    var i;
    var updated = false;

    for (i = 0; i < dataSet.length; i++) {
        if (dataSet[i].id == id) {
            dataSet[i] = newData;
            updated = true;
            break;
        }
    }

    if (!updated) {
        dataSet.push(newData);
    }
}


function remove(dataSet, id) {
    var i;

    for (i = 0; i < dataSet.length; i++) {
        if (dataSet[i].id == id) {
            dataSet.splice(i, 1);
            return;
        }
    }
}


export default {
    updateOrAdd: updateOrAdd,
    remove: remove
}
