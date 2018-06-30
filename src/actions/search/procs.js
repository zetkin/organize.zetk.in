import { searchProcFactory } from './utils';

export const ActionDaySearchProc = searchProcFactory('actionday', {
    loader: (z, orgId, qs, lang) => {
        let date = Date.create(qs, lang);
        if (!date.isValid()) {
            return Promise.resolve([]);
        }


        let dateStr = date.format('{yyyy}-{MM}-{dd}');
        let endStr = date.addDays(1).format('{yyyy}-{MM}-{dd}');

        // Searching for date
        return z.resource('orgs', orgId, 'actions')
            .get(null, null, [['start_time', '>=', dateStr], ['end_time', '<', endStr]])
            .then(function(result) {
                let actions = result.data.data;

                if (actions.length > 0) {
                    const matchData = {
                        date: dateStr,
                        action_count: actions.length,
                    };

                    return [matchData]
                }
                else {
                    return [];
                }
            });
    },
});

export const ActivitySearchProc = searchProcFactory('activity');
export const CallAssignmentSearchProc = searchProcFactory('callassignment');
export const CampaignSearchProc = searchProcFactory('campaign');
export const LocationSearchProc = searchProcFactory('location');
export const PersonSearchProc = searchProcFactory('person');
export const PersonQuerySearchProc = searchProcFactory('personquery');
export const SurveySearchProc = searchProcFactory('survey');
export const SurveySubmissionSearchProc = searchProcFactory('surveysubmission');
