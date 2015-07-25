function updateOrAdd(dataSet, id, newData) {
    var i;
    var updated = false;

    for (i = 0; i < dataSet.length; i++) {
        if (dataSet[i].id == id) {
            var attr;
            for (attr in newData) {
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
