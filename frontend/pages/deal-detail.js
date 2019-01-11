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

                            <script
                                dangerouslySetInnerHTML={{
                                    __html: `
                                var ciads_settings = { rtSiteId: 28162 , rtUuId: '1d01d0c0-f87c-40a5-acb5-2872ee342180'  };
                        `,
                                }}
                            />
                            <script
                                type="text/javascript"
                                src="https://media-cdn.ipredictive.com/js/cirt_v2.min.js"
                            />
                        </React.Fragment>
                    )}
                </Head>
                <DealDetail initialQuoteParams={this.props.query} />
            </React.Fragment>
        );
    }
}
