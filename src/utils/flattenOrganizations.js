function getOrgs(org) {
    let orgs = [];

    if(org.is_active) {
        orgs.push(org);
    }

    for(const o of org.sub_orgs) {
        orgs = orgs.concat(getOrgs(o))
    }

    return orgs;
}

const flattenOrganizations = (subOrgs, activeOrg) => {
    let orgs = [];
    if(activeOrg) {
        orgs = [activeOrg];
    }
    for(const o of subOrgs) {
        orgs = orgs.concat(getOrgs(o.data))
    }

    return orgs;
}

// Convenience function for use in mapStateToProps
const flattenOrganizationsFromState = (state) => {
    return flattenOrganizations(state.subOrgs.items, state.user.activeMembership.organization);
}

export default flattenOrganizations;
export { flattenOrganizations, flattenOrganizationsFromState };
