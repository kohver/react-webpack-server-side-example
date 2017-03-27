import React from 'react';

export const ServerPage = ({
    title,
    children,
    jsFilenames = [],
    cssFilenames = [],
}) => (
    <html>
    <head>
        <title>
            {title}
        </title>
        {cssFilenames.map((cssFilename, index) =>
            <link key={index} href={'assets/' + cssFilename} rel="stylesheet" />
        )}
    </head>
    <body>
        {children}

        {jsFilenames.map((jsFilename, index) =>
            <script key={index} src={'assets/' + jsFilename}></script>
        )}
    </body>
    </html>
);
