import React from 'react';


export default (props) => {
    let js =
        "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n" +
        "    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n" +
        "    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n" +
        "})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n" +
        "ga('create', 'UA-58227603-4', 'auto');\n" +
        "ga('send', 'pageview');";

    return (
        <script dangerouslySetInnerHTML={{ __html: js }}/>
    );
};
