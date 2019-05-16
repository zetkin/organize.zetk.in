import React from 'react';
import cx from 'classnames';
import { connect } from 'react-redux';


const mapStateToProps = (state, props) => ({
    orgId: props.orgId || state.org.activeId,
});


@connect(mapStateToProps)
export default class Avatar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pending: true,
            error: false,
        };
    }

    render() {
        const person = this.props.person;
        const avatarDomain = '//api.' + process.env.ZETKIN_DOMAIN;
        const src = avatarDomain + '/v1/orgs/'
            + this.props.orgId + '/people/' + person.id + '/avatar';

        const alt = (person.first_name && person.last_name)?
            person.first_name + ' ' + person.last_name :
            person.name? person.name : '';

        const classes = cx('Avatar', {
            pending: this.state.pending,
            error: this.state.error,
        });

        return (
            <div className={ classes }>
                <img ref="image"
                    src={ src } alt={ alt } title={ alt }
                    onLoad={ this.onLoad.bind(this) }
                    onError={ this.onError.bind(this) }
                    onClick={ this.props.onClick }
                    />
            </div>
        );
    }

    componentDidMount() {
        if (this.refs.image.complete) {
            this.onLoad();
        }
    }

    onLoad() {
        this.setState({
            pending: false,
            error: false,
        });
    }

    onError() {
        this.setState({
            pending: false,
            error: true,
        });
    }
}

Avatar.propTypes = {
    person: React.PropTypes.shape({
        id: React.PropTypes.any, // TODO: Use string
        first_name: React.PropTypes.string,
        last_name: React.PropTypes.string
    })
};
