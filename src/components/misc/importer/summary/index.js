import PersonTagColumnSummary from './PersonTagColumnSummary';


export function resolveSummaryComponent(type) {
    switch (type) {
        case 'person_tag':
            return PersonTagColumnSummary;
        default:
            return null;
    }
}
