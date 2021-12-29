export default (orgList, collection, config) => {
    let filterOrgs;
    if(config.organizationOption == 'all') {
        filterOrgs = orgList;
    } else if(config.organizationOption == 'suborgs') {
        // activeOrg is the first org in list returned by flattenOrganizations, exclude it
        filterOrgs = orgList.slice(1)
    } else if(config.organizationOption == 'current') {
        // use only activeOrg
        filterOrgs = orgList.slice(0,1)
    } else if(config.organizationOption == 'specific') {
        // only use the specified organizations
        filterOrgs = orgList.filter(o => config.specificOrganizations.includes(o.id));
    }
    filterOrgs = filterOrgs.map(o => o.id);

    return collection.filter(item => filterOrgs.includes(item.data.organization.id));
}
