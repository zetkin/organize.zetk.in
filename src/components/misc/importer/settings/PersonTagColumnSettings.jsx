import React from 'react';


export default class PersonTagColumnSettings extends React.Component {
    static propTypes = {
        config: React.PropTypes.object.isRequired,
        onChangeConfig: React.PropTypes.func,
    };

    render() {
        return (
            <div className="PersonTagColumnSettings">
            </div>
        );
    }
}
