import '../styles/app.scss';
import React from 'react';
import DealDetail from '../modules/deal-detail/Container';
import Head from 'next/head';
import PropTypes from 'prop-types';

export default class Page extends React.Component {
    static propTypes = {
        query: PropTypes.object,
    };

    static async getInitialProps({ query }) {
        return {
            query: query.query ? query : null,
        };
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                </Head>
                <DealDetail initialQuery={this.props.query} />
            </React.Fragment>
        );
    }
}
