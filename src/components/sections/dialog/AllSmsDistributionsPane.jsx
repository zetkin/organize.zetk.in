import React from 'react';
import { connect } from 'react-redux';

import Button from '../../misc/Button';
import RootPaneBase from '../RootPaneBase';
import { retrieveSmsDistributions } from '../../../actions/smsDistribution';

import SmsDistributionList from '../../lists/SmsDistributionList';

const mapStateToProps = (state, props) => ({
    distributionList: state.smsDistributions.distributionList,
});

@connect(mapStateToProps)
export default class AllSmsDistributionsPane extends RootPaneBase {
    componentDidMount() {
        this.props.dispatch(retrieveSmsDistributions());
    }

    getRenderData() {
        return {
            distributionList: this.props.distributionList,
        };
    }

    renderPaneContent({ distributionList }) {
        return (
            <SmsDistributionList
                smsDistributionList={ distributionList }
                onItemClick={ this.onDistributionClick.bind(this) } />
        );
    }

    getPaneTools(data) {
        return [
            <Button key="addButton"
                className="allSmsDistributionsPane-addButton"
                labelMsg="panes.allSmsDistributions.addButton"
                onClick={ this.onAddClick.bind(this) }/>,
        ];
    }

    onAddClick() {
        this.openPane('addsmsdistribution');
    }

    onDistributionClick(distribution, ev) {
        this.openPane('smsdistribution', distribution.data.id);
    }
}
