import React from 'react';
import { NextAuth } from 'next-auth/client';

export default class extends React.Component {
    static async getInitialProps({ req }) {
        return {
            session: await NextAuth.init({ req }), // Add this.props.session to all pages
            lang: 'en', // Add a lang property to all pages for accessibility
        };
    }
}
