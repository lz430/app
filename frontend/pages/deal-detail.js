import '../styles/app.scss';
import React from 'react';
import DealDetail from '../modules/deal-detail/Container';
import Head from 'next/head';
import PropTypes from 'prop-types';
import config from '../core/config';

export default class Page extends React.Component {
    static propTypes = {
        query: PropTypes.object,
    };

    static async getInitialProps({ query }) {
        console.log('getInitialProps', query);
        return {
            query: query ? query : {},
        };
    }

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                    {config['REACT_APP_ENVIRONMENT'] === 'production' && (
                        <React.Fragment>
                            <script
                                src={`//mpp.vindicosuite.com/conv/m=2;t=26853;he=<hashed_email>;ts=${Math.random()}`}
                                async
                            />
                            <noscript>
                                <img
                                    src="//mpp.vindicosuite.com/conv/m=1;t=26853;he=<hashed_email>;ts=<ts>"
                                    width="0"
                                    height="1"
                                />
                            </noscript>
                        </React.Fragment>
                    )}
                </Head>
                <DealDetail initialQuoteParams={this.props.query} />
            </React.Fragment>
        );
    }
}
