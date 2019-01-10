import '../styles/app.scss';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Row, Col, Container } from 'reactstrap';

import ShopByBrand from '../modules/home/components/ShopByBrand';
import ShopByStyle from '../modules/home/components/ShopByStyle';
import Testimonials from '../modules/home/components/Testimonials';
import HomepageHero from '../modules/home/components/HomepageHero';
import Media from '../modules/home/components/Media';

import { setSelectedMake } from '../modules/deal-list/actions';

import {
    headerClearAutocompleteResults,
    headerRequestAutocomplete,
} from '../apps/page/actions';

import { withRouter } from 'next/router';
import withTracker from '../components/withTracker';
import { nextRouterType } from '../core/types';
import Head from 'next/head';
import { getUserPurchaseStrategy } from '../apps/user/selectors';
import config from '../core/config';

class Page extends React.Component {
    static propTypes = {
        autocompleteResults: PropTypes.object,
        searchQuery: PropTypes.object,
        purchaseStrategy: PropTypes.string,
        onRequestSearch: PropTypes.func.isRequired,
        onSetSelectedMake: PropTypes.func.isRequired,
        onClearSearchResults: PropTypes.func.isRequired,
        router: nextRouterType,
    };

    state = {
        activeIndex: 0,
    };

    render() {
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride</title>
                    {config['REACT_APP_ENVIRONMENT'] === 'production' && (
                        <React.Fragment>
                            <script
                                src={`//mpp.vindicosuite.com/conv/m=1;t=26852;he=<hashed_email>;ts=${Math.random()}`}
                                async
                            />
                            <noscript>
                                <img
                                    src="//mpp.vindicosuite.com/conv/m=1;t=26852;he=<hashed_email>;ts=<ts>"
                                    width="0"
                                    height="1"
                                />
                            </noscript>
                        </React.Fragment>
                    )}
                </Head>
                <div>
                    <HomepageHero
                        purchaseStrategy={this.props.purchaseStrategy}
                        push={this.props.router.push}
                        autocompleteResults={this.props.autocompleteResults}
                        searchQuery={this.props.searchQuery}
                        onClearSearchResults={this.props.onClearSearchResults}
                        onSetSelectedMake={this.props.onSetSelectedMake}
                        onRequestSearch={this.props.onRequestSearch}
                    />
                    <ShopByStyle />
                    <ShopByBrand />
                    <div className="callout__video bg-light pt-5 pb-5">
                        <Container>
                            <Row>
                                <Col className="text-center align-items-center justify-content-center">
                                    <div className="embed-responsive embed-responsive-16by9 ml-auto mr-auto">
                                        <iframe
                                            className="embed-responsive-item"
                                            src="//player.vimeo.com/video/235987207?title=0&amp;byline=0&amp;portrait=0"
                                            width="600"
                                            height="401"
                                            frameBorder="0"
                                            allowFullScreen="allowfullscreen"
                                            data-fluidvids="loaded"
                                        />
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    <Testimonials />
                    <Media />
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        autocompleteResults: state.page.headerAutocompleteResults,
        purchaseStrategy: getUserPurchaseStrategy(state),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetSelectedMake: make => {
            return dispatch(setSelectedMake(make));
        },
        onRequestSearch: query => {
            return dispatch(headerRequestAutocomplete(query));
        },
        onClearSearchResults: () => {
            return dispatch(headerClearAutocompleteResults());
        },
    };
};

export default compose(
    withRouter,
    withTracker,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(Page);
