import React from 'react';


export default (props) => {
    const js = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${props.measurementId}');
    `;

    return (
        <script dangerouslySetInnerHTML={{ __html: js }}/>
    );
};
