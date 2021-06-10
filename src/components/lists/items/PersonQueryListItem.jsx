import React from 'react';


export default class PersonQueryListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.number.isRequired,
            title: React.PropTypes.string.isRequired,
        })
    }

    render() {
        let query = this.props.data;

        return (
            <div className="PersonQueryListItem"
                onClick={ this.props.onItemClick }>

                <div className="PersonQueryListItem-col">
                    <span className="PersonQueryListItem-title">
                        { query.title }</span>
                    <span className="PersonQueryListItem-description">
                        { query.info_text }</span>
                </div>
                <div className="PersonQueryListItem-orgcol">
                    { query.isShared ?
                        <span className="PersonQueryListItem-shared">
                            { query.organization.title }
                        </span> : null
                    }
                </div>
            </div>
        );
    }
}

