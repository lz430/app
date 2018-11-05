import '../styles/app.scss';
import PropTypes from 'prop-types';
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Row, Col, Container } from 'reactstrap';

import ShopByBrand from '../modules/home/components/ShopByBrand';
import ShopByStyle from '../modules/home/components/ShopByStyle';
import HomepageHero from '../modules/home/components/HomepageHero';
import { getSearchQuery } from '../modules/deal-list/selectors';
import { setSelectedMake } from '../modules/deal-list/actions';

import {
    headerClearAutocompleteResults,
    headerRequestAutocomplete,
} from '../apps/page/actions';

import { withRouter } from 'next/router';
import withTracker from '../components/withTracker';
import { nextRouterType } from '../core/types';

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

    items = [
        {
            src: 'https://via.placeholder.com/50.png?text=Dodge',
            altText: 'Slide 1',
            caption: 'Slide 1',
        },
        {
            src: 'https://via.placeholder.com/50.png?text=Jeep',
            altText: 'Slide 2',
            caption: 'Slide 2',
        },
        {
            src: 'https://via.placeholder.com/50.png?text=Ford',
            altText: 'Slide 3',
            caption: 'Slide 3',
        },
    ];

    render() {
        return (
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
                                src="https://via.placeholder.com/400x250"
                                alt="placeholder"
                            />
                            <h3>Test it out</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Quae corrupti facere autem ut
                                eligendi dignissimos.
                            </p>
                        </Col>
                        <Col md="6">
                            <img
                                className="img-fluid"
                                src="https://via.placeholder.com/400x250"
                                alt="placeholder"
                            />
                            <h3>Purchase</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Facere eius architecto, quo
                                corporis perspiciatis error.
                            </p>
                        </Col>
                    </Row>
                </Container>

                <div className="container-fluid callout__testimonials">
                    <Container>
                        <Row>
                            <Col>
                                <h4>What our customers are saying</h4>
                            </Col>
                        </Row>

                        <Row>
                            <Col md="4">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Obcaecati quas omnis,
                                    iusto vero accusamus nam veniam reiciendis
                                    quaerat quod ipsum praesentium, unde
                                    molestiae! Obcaecati, error temporibus ipsam
                                    ipsum voluptas. Est?15
                                </p>
                                <div className="author">
                                    <span>Monica P</span>
                                </div>
                            </Col>
                            <Col md="4">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Officiis ab aperiam
                                    suscipit enim, voluptatibus officia eaque
                                    iusto perspiciatis, excepturi necessitatibus
                                    aliquam quia impedit cumque quo blanditiis
                                    magni illo accusamus et!15
                                </p>
                                <div className="author">
                                    <span>Jason B, Traverse City MI</span>
                                </div>
                            </Col>
                            <Col md="4">
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipisicing elit. Quod quae soluta maiores
                                    recusandae, voluptatem ad officiis molestiae
                                    sunt cum blanditiis harum quasi laborum
                                    aliquam magnam architecto itaque ullam. Sit,
                                    distinctio!15
                                </p>
                                <div className="author">
                                    <span>Lori P, Birmingham MI</span>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>

                <Container>
                    <Row>
                        <Col>
                            <h5>Featured In: </h5>
                        </Col>
                        <Col>
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </Col>
                        <Col>
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </Col>
                        <Col>
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </Col>
                        <Col>
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        autocompleteResults: state.page.headerAutocompleteResults,
        searchQuery: getSearchQuery(state),
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
