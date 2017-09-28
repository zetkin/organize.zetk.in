import React from 'react';


export default class InfoList extends React.Component {
    static propTypes = {
        data: React.PropTypes.array.isRequired,
    }

    render() {
        return (
            <ul className="InfoList">
            {
                this.props.data.map(item => {
                    let className = 'InfoListItem InfoListItem-' + item.name;
                    let value = item.value;
                    if (!value) {
                        value = '-';
                    }
                    return <li className={ className } key={item.name}>{value}</li>
                })
            }
            </ul>
        );
    }
}
