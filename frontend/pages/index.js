import '../styles/app.scss';

import React from 'react';
import Router from 'next/router';

export default class Page extends React.Component {
    static async getInitialProps({ ctx }) {
        if (ctx.res) {
            ctx.res.writeHead(301, {
                Location: '/filter',
            });
            ctx.res.end();
        } else {
            Router.push('/filter');
        }
        return {};
    }
}
