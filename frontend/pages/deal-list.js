import '../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import DealList from '../src/pages/deal-list/Container';
import Head from 'next/head';

export default class Page extends React.Component {
    static propTypes = {
        query: PropTypes.object,
    };

    static async getInitialProps({ ctx }) {
        return {
            query: ctx.query,
        };
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                </Head>
                <DealList initialQuery={this.props.query} />
            </React.Fragment>
        );
    }
}
