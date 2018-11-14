import React from 'react';

import { Container, Row, Collapse } from 'reactstrap';
import Link from 'next/link';

import makes from '../../../content/makes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
export default class extends React.Component {
    state = {
        collapse: false,
        active: false,
    };
    toggle = () =>
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
        });

    renderFeaturedMakes(make) {
        const query = {
            entity: 'model',
            sort: 'payment',
            filters: make.query,
            purchaseStrategy: 'finance',
        };
        const featuredMakes = makes.filter(make => make.featured === true);
        return Object.keys(featuredMakes).map(function(s) {
            return (
                <div
                    className="featured brand mb-3"
                    key={featuredMakes[s].title}
                >
                    <Link
                        key={featuredMakes[s].title}
                        href={{ pathname: '/deal-list', query: query }}
                        as={{ pathname: '/filter', query: query }}
                        passHref
                    >
                        <a>
                            <img
                                style={{ height: '80px', width: '80px' }}
                                src={featuredMakes[s].logo}
                                alt={featuredMakes[s].title + ' logo'}
                            />
                        </a>
                    </Link>
                </div>
            );
        });
    }

    renderMake(make) {
        const query = {
            entity: 'model',
            sort: 'payment',
            filters: make.query,
            purchaseStrategy: 'finance',
        };
        const normalMakes = makes.filter(make => make.featured === false);
        return Object.keys(normalMakes).map(function(s) {
            return (
                <div className="brand mb-3" key={featuredMakes[s].title}>
                    <Link
                        key={normalMakes[s].title}
                        href={{ pathname: '/deal-list', query: query }}
                        as={{ pathname: '/filter', query: query }}
                        passHref
                    >
                        <a>
                            <img
                                style={{ height: '80px', width: '80px' }}
                                src={normalMakes[s].logo}
                                alt={normalMakes[s].title + ' logo'}
                            />
                        </a>
                    </Link>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container-fluid callout__brands">
                <Container>
                    <Row>{this.renderFeaturedMakes(makes)}</Row>
                    <Collapse className="row" isOpen={this.state.collapse}>
                        {this.renderMake(makes)}
                    </Collapse>
                    <Row className="mt-3">
                        <div
                            className={
                                this.state.active
                                    ? 'text-center active'
                                    : 'text-center'
                            }
                            onClick={this.toggle}
                        >
                            <a className="btn btn-primary">
                                <span>See all brands</span>
                                <FontAwesomeIcon
                                    className={
                                        !this.state.active ? '' : 'hidden'
                                    }
                                    icon={faChevronDown}
                                />
                                <FontAwesomeIcon
                                    className={
                                        this.state.active ? '' : 'hidden'
                                    }
                                    icon={faChevronUp}
                                />
                            </a>
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}
