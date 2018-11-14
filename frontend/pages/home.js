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
import { setSelectedMake } from '../modules/deal-list/actions';

import {
    headerClearAutocompleteResults,
    headerRequestAutocomplete,
} from '../apps/page/actions';

import { withRouter } from 'next/router';
import withTracker from '../components/withTracker';
import { nextRouterType } from '../core/types';
import Head from 'next/head';

class Page extends React.Component {
    static propTypes = {
        autocompleteResults: PropTypes.object,
        searchQuery: PropTypes.object,
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
                </Head>
                <div className="mb-5">
                    <HomepageHero
                        router={this.props.router}
                        autocompleteResults={this.props.autocompleteResults}
                        searchQuery={this.props.searchQuery}
                        onClearSearchResults={this.props.onClearSearchResults}
                        onSetSelectedMake={this.props.onSetSelectedMake}
                        onRequestSearch={this.props.onRequestSearch}
                    />
                    <ShopByStyle />
                    <ShopByBrand />

                    <Container className="callout__info">
                        <Row>
                            <Col md="6">
                                <img
                                    className="img-fluid"
                                    src="https://source.unsplash.com/random/600x300"
                                    alt="placeholder"
                                />
                                <h3 className="mt-2">Test it out</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Facere eius architecto,
                                    quo corporis perspiciatis error. Lorem ipsum
                                    dolor sit amet, consectetur adipisicing
                                    elit. Facere eius architecto, quo corporis
                                    perspiciatis error.
                                </p>
                            </Col>
                            <Col md="6">
                                <img
                                    className="img-fluid"
                                    src="https://source.unsplash.com/random/600x300"
                                    alt="placeholder"
                                />
                                <h3 className="mt-2">Purchase</h3>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Facere eius architecto,
                                    quo corporis perspiciatis error. Lorem ipsum
                                    dolor sit amet, consectetur adipisicing
                                    elit. Facere eius architecto, quo corporis
                                    perspiciatis error.
                                </p>
                            </Col>
                        </Row>
                    </Container>

                    <Testimonials />

                    <Container>
                        <Row className="align-items-center">
                            <Col>
                                <h5>Featured In: </h5>
                            </Col>
                            <Col>
                                <img
                                    src="https://source.unsplash.com/random/200x50"
                                    alt="placeholder"
                                />
                            </Col>
                            <Col>
                                <img
                                    src="https://source.unsplash.com/random/200x50"
                                    alt="placeholder"
                                />
                            </Col>
                            <Col>
                                <img
                                    src="https://source.unsplash.com/random/200x50"
                                    alt="placeholder"
                                />
                            </Col>
                            <Col>
                                <img
                                    src="https://source.unsplash.com/random/200x50"
                                    alt="placeholder"
                                />
                            </Col>
                        </Row>
                    </Container>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        autocompleteResults: state.page.headerAutocompleteResults,
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
