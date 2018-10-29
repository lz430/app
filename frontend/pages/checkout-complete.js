import '../styles/app.scss';
import React from 'react';
import CheckoutCompleteContainer from '../modules/checkout-complete/Container';
import Head from 'next/head';

export default class Page extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                </Head>
                <CheckoutCompleteContainer />
            </React.Fragment>
        );
    }
}
