import { connect } from 'react-redux';
import React from 'react';

import Button from '../../misc/Button';
import GroupList from '../../lists/GroupList';
import RootPaneBase from '../RootPaneBase';
import { retrieveGroups } from '../../../actions/group';


const mapStateToProps = state => ({
    groupList: state.groups.groupList,
});


@connect(mapStateToProps)
export default class GroupListPane extends RootPaneBase {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        super.componentDidMount();

        // TODO: Do this only if data is old or does not exist
        this.props.dispatch(retrieveGroups());
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="GroupListPane-addButton"
                labelMsg="panes.groupList.addButton"
                onClick={ () => this.openPane('addgroup') }
                />
        ];
    }

    renderPaneContent(data) {
        if (this.props.groupList) {
            return (
                <GroupList groupList={ this.props.groupList }
                    onItemClick={ this.onItemClick.bind(this) }
                    />
            );
        }
    }

    onItemClick(item) {
        this.openPane('group', item.data.id);
    }
}
