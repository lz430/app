import '../styles/app.scss';
import React from 'react';
import CheckoutFinancingContainer from '../src/pages/checkout-financing/Container';
import Head from 'next/head';

export default class Page extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                </Head>
                <CheckoutFinancingContainer />
            </React.Fragment>
        );
    }
}
