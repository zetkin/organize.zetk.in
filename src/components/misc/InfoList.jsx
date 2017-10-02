import React from 'react';


export default class InfoList extends React.Component {
    static propTypes = {
        data: React.PropTypes.object,
    }

    render() {
        return (
            <ul className="InfoList">
            {this.props.children.map(item => {
                let attr = item.props.name || item.key;
                let value = item.props.children;

                if (!value && this.props.data) {
                    value = this.props.data[attr];
                }

                if (!value) {
                    value = '-';
                }

                return (
                    <InfoList.Item key={ attr } name={ attr }>
                        { value }
                    </InfoList.Item>
                );
            })}
            </ul>
        );
    }
}

InfoList.Item = props => {
    let className = 'InfoListItem InfoListItem-' + props.name;

    return (
        <li className={ className }>
            { props.children }
        </li>
    );
};
