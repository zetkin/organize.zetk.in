import React from 'react';

import { stringFromAddress } from '../../../utils/location';


export default class AddressListItem extends React.Component {
    static propTypes = {
        onItemClick: React.PropTypes.func,
        data: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            street: React.PropTypes.string.isRequired,
            number: React.PropTypes.string,
            suffix: React.PropTypes.string,
        })
    }

    render() {
        let addr = this.props.data;

        return (
            <div className="AddressListItem"
                onClick={ this.props.onItemClick }>

                <div className="AddressListItem-col">
                    { stringFromAddress(addr) }
                </div>
            </div>
        );
    }
}

