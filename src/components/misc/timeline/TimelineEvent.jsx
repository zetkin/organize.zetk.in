import React from 'react';
import { FormattedDate, FormattedTime } from 'react-intl';


export default class TimelineEvent extends React.Component {
    render() {
        const ts = new Date(this.props.timestamp);
        const Renderer = this.props.renderer;

        return (
            <div className="TimelineEvent">
                <div className="TimeLineEvent-timestamp">
                    <FormattedDate value={ ts }
                        format={{
                            weekday: 'short',
                            month: 'numeric',
                            year: 'numeric',
                        }}/>
                    <FormattedTime value={ ts }
                        format={{
                            hour: '2-digit',
                            minute: '2-digit',
                        }}/>
                </div>
                <Renderer
                    person={ this.props.person }
                    timestamp={ this.props.timestamp }
                    data={ this.props.data }
                    />
            </div>
        );
    }
}
