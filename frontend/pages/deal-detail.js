import '../styles/app.scss';
import React from 'react';
import DealDetail from '../src/pages/deal-detail/Container';
import Head from 'next/head';

export default class Page extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                </Head>
                <DealDetail />
            </React.Fragment>
        );
    }
}
