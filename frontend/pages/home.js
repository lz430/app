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
            <div>
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

                <div className="container callout__info">
                    <div className="row">
                        <div className="col-6">
                            <img
                                src="https://via.placeholder.com/400x250"
                                alt="placeholder"
                            />
                            <h3>Test it out</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Quae corrupti facere autem ut
                                eligendi dignissimos.
                            </p>
                        </div>
                        <div className="col-6">
                            <img
                                src="https://via.placeholder.com/400x250"
                                alt="placeholder"
                            />
                            <h3>Purchase</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Facere eius architecto, quo
                                corporis perspiciatis error.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="container-fluid callout__testimonials">
                    <Container>
                        <Row>
                            <Col>
                                <h4>What our customers are saying</h4>
                            </Col>
                        </Row>

                        <Row>
                            <div className="col-4">
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
                            </div>
                            <div className="col-4">
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
                            </div>
                            <div className="col-4">
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
                            </div>
                        </Row>
                    </Container>
                </div>

                <div className="container ">
                    <div className="row">
                        <div className="col">
                            <h5>Featured In: </h5>
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div className="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                    </div>
                </div>
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
