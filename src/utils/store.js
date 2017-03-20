export function createList(items, meta = {}) {
    return {
        isPending: meta.isPending || false,
        lastPage: 0,
        error: meta.error || null,
        items: createListItems(items || []),
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
    let items = list.items.concat();

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
        items.push(createListItem(newData, meta));
    }

    return Object.assign({}, list, { items });
}

export function updateOrAddListItems(list, newItems, meta) {
    // TODO: This can be more efficient
    let newList = list;
    for (let i = 0; i < newItems.length; i++) {
        newList = updateOrAddListItem(newList,
            newItems[i].id, newItems[i]);
    }

    return Object.assign({}, newList, meta);
}


export function getListItemById(list, id) {
    if (!list.items)
        return null;

    return list.items.find(i => i.data && i.data.id == id);
}

export function getListItemsByIds(list, ids) {
    return ids
        .map(id => getListItemById(list, id))
        .filter(item => item !== null);
}

export function removeListItem(list, id) {
    if (!list.items)
        return null;

    // Create new list of all items except the one to be removed
    return Object.assign({}, list, {
        items: list.items.filter(i => i.data && i.data.id != id)
    });
}
