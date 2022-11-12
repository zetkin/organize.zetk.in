import React from 'react';
import truncText from '../../../../utils/truncText';

export default function SurveyOptionsCell(props) {
    let options = [];
    if (props.content && props.content.length) {
        options = props.content.reduce((acc, option) => {
            option.selected.forEach(s => {
                if (!acc.find(x => s.id == x.id)) {
                    acc.push(s);
                }
            });
            return acc;
        }, options);
    }
    return (
        <td className={`SurveyOptionsCell`}>
        { options.map(o => (
            <li className="SurveyOption-text"
                key={ o.id }>
                { o.text }
            </li>
        )) }
        </td>
    );
}
