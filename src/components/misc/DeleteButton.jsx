import React from 'react';

import Button from './Button';


export default class DeleteButton extends React.Component {
    render() {
        return (
            <Button className="DeleteButton"
                labelMsg="misc.deleteButton.label"
                onClick={ this.props.onClick }
                />
        );
    }
}
