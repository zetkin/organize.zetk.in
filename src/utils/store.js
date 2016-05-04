export function createList(items, meta = {}) {
    return {
        isPending: meta.isPending || false,
        error: meta.error || null,
        items: items || [],
    };
}

export function createListItem(data, meta = {}) {
    return {
        isPending: meta.isPending || false,
        error: meta.error || null,
        data: data,
    };
}

export function createListItems(rawList) {
    return rawList.map(i => createListItem(i));
}

export function updateOrAddListItem(list, id, newData, meta) {
    let updated = false;
    let items = list.items;

    for (let i = 0; i < items.length; i++) {
        if (items[i].data && items[i].data.id == id) {
            let item = items[i];
            items[i] = Object.assign({}, item, {
                data: Object.assign({}, item.data, newData),
                ...meta
            });
            updated = true;
            break;
        }
    }

    if (!updated) {
        items.push(createListItem(newData));
    }

    return Object.assign({}, list, {
        items: items.concat()
    });
}


export function getListItemById(list, id) {
    if (!list.items)
        return null;

    return list.items.find(i => i.data && i.data.id == id);
}

export function removeListItem(list, id) {
    if (!list.items)
        return null;

    // Create new list of all items except the one to be removed
    return Object.assign({}, list, {
        items: list.items.filter(i => i.data && i.data.id != id)
    });
}
