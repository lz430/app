import React from 'react';
import { NextAuth } from 'next-auth/client';

export default class extends React.Component {
    static async getInitialProps({ req }) {
        if (req) {
            console.log('WTF');
            console.log(req.session);
            if (!req.session.views) {
                req.session.views = 1;
            } else {
                req.session.views++;
            }
        }
        return {};
    }
}
