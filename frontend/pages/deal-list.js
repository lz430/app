import '../styles/app.scss';
import DealList from '../src/pages/deal-list/Container';
import Head from 'next/head';
import React from 'react';

export default class Page extends React.Component {
    static async getInitialProps(chx) {
        console.log('getInitialProps');
        console.log(chx);
        return {};
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Deliver My Ride</title>
                </Head>
                <DealList />
            </div>
        );
    }
}
