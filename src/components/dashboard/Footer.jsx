import React from 'react';
import { FormattedMessage as Msg } from 'react-intl';

import Link from '../misc/Link';


export default class Footer extends React.Component {
    render() {
        return (
            <footer className="Footer">
                <Msg tagName="p" id="dashboard.footer.info"/>
                <ul>
                    <li>
                        <Link href="http://zetkin.org" target="_blank"
                            msgId="dashboard.footer.foundationLink"/>
                    </li>
                    <li>
                        <Link href="http://manual.zetkin.org" target="_blank"
                            msgId="dashboard.footer.helpLink"/>
                    </li>
                </ul>
            </footer>
        );
    }
}
