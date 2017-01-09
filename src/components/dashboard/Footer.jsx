import React from 'react';
import { injectIntl, FormattedMessage as Msg } from 'react-intl';

import Link from '../misc/Link';


@injectIntl
export default class Footer extends React.Component {
    render() {
        const formatMessage = this.props.intl.formatMessage;

        let foundationHref = formatMessage({
            id: 'dashboard.footer.foundationLink.href' })

        let helpHref = formatMessage({
            id: 'dashboard.footer.helpLink.href' })

        return (
            <footer className="Footer">
                <Msg tagName="p" id="dashboard.footer.info"/>
                <ul>
                    <li>
                        <Link href={ foundationHref } target="_blank"
                            msgId="dashboard.footer.foundationLink.text"/>
                    </li>
                    <li>
                        <Link href={ helpHref } target="_blank"
                            msgId="dashboard.footer.helpLink.text"/>
                    </li>
                </ul>
            </footer>
        );
    }
}
