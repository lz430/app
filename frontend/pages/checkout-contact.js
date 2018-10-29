import '../styles/app.scss';
import React from 'react';
import CheckoutConfirmContainer from '../modules/checkout-confirm/Container';
import Head from 'next/head';

export default class Page extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                </Head>
                <CheckoutConfirmContainer />
            </React.Fragment>
        );
    }
}
