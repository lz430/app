import Document, { Head, Main, NextScript } from 'next/document';
import React from 'react';

export default class MyDocument extends Document {
    render() {
        return (
            <html>
                <Head>
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                    />
                    <meta name="theme-color" content="#41b1ac" />
                    <link rel="shortcut icon" href="/favicon.ico" />
                </Head>

                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        );
    }
}
