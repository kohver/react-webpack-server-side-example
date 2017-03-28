import React from 'react';
import { publicPath } from '../paths';

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
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {cssFilenames.map((cssFilename, index) =>
            <link key={index} href={publicPath + cssFilename} rel="stylesheet" />
        )}
    </head>
    <body>
        {children}

        {jsFilenames.map((jsFilename, index) =>
            <script key={index} src={publicPath + jsFilename} />
        )}
    </body>
    </html>
);

if (typeof window !== 'undefined') {
    console.error('Alarm! ServerPage in the client!');
}
