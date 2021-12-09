import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import TagCloudItem from './TagCloudItem';


export default class TagCloud extends React.Component {
    static propTypes = {
        tags: React.PropTypes.array.isRequired,
        onAdd: React.PropTypes.func,
        onEdit: React.PropTypes.func,
        onRemove: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        showAddButton: React.PropTypes.bool,
        showEditButtons: React.PropTypes.bool,
        showRemoveButtons: React.PropTypes.bool,
    };

    static defaultProps = {
        showAddButton: false,
        showEditButtons: false,
        showRemoveButtons: false,
    };

    render() {
        let addButton = null;
        if (this.props.showAddButton) {
            addButton = (
                <div className="TagCloud-addButtonContainer">
                    <div className="TagCloud-addButton"
                        onClick={ this.props.onAdd }>
                        <Msg id="misc.tagCloud.addButton"/>
                    </div>
                </div>
            );
        }

        const multipleOrgs = !this.props.tags.every(tag => tag.organization.id == this.props.tags[0].organization.id);

        const orgIndexes = {};
        const tagsByOrg = [];
        for(const tag of this.props.tags) {
            const orgIdx = orgIndexes[tag.organization.id];
            if(orgIdx != undefined) {
                tagsByOrg[orgIdx].tags.push(tag);
            } else {
                tagsByOrg.push({
                    org: tag.organization,
                    tags: [tag],
                })
                orgIndexes[tag.organization.id] = tagsByOrg.length-1;
            }
        }

        return (
            <div>
            { tagsByOrg.map(orgTags => (
                <div>
                <hr className="TagCloud-orgSeparator" data-content={ orgTags.org.title } />
                <ul className="TagCloud">
                    { orgTags.tags.map(tag => (
                        <TagCloudItem key={ tag.id } tag={ tag }
                            showEditButton={ this.props.showEditButtons }
                            showRemoveButton={ this.props.showRemoveButtons }
                            onEdit={ this.props.onEdit }
                            onSelect={ this.props.onSelect }
                            onRemove={ this.props.onRemove } />
                    )) }
                </ul>
                </div>
            )) }
            <div>
            { addButton }
            </div>
            </div>
        );
    }
}
