import React from 'react/addons';


export default class Footer extends React.Component {
    render() {
        const info = [
            'Zetkin is developed by the Zetkin Foundation, a non-profit with',
            'the mission to revolutionize the organization of activism.'
        ].join(' ');

        return (
            <footer>
                { info }
                <ul>
                    <li><a href="http://zetkin.org" target="_blank">
                        About Zetkin Foundation</a></li>
                    <li><a href="/help" target="_blank">
                        Learn how to use Zetkin</a></li>
                </ul>
            </footer>
        );
    }
}
