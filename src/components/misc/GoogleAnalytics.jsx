import React from 'react';


export default (props) => {
    const measurementId = process.env.GA_MEASUREMENT_ID;

    if (!measurementId) {
        return null;
    }

    const js = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}');
    `;

    return (
        <script dangerouslySetInnerHTML={{ __html: js }}/>
    );
};
