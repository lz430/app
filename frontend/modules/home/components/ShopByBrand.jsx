import React from 'react';

import { Container, Row, Collapse, Button } from 'reactstrap';
import Link from 'next/link';

import makes from '../../../content/makes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { track } from '../../../core/services';
import StaticImage from '../../../components/StaticImage';
import LazyLoad from 'react-lazyload';

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

    trackLinkClick(make, query) {
        track('brochure:brand:select', {
            'Brochure Brand': make.title,
            'Brochure Strategy': query.purchaseStrategy,
        });
    }

    renderMakes(featured = false) {
        const filteredMakes = makes.filter(make => make.featured === featured);
        return Object.keys(filteredMakes).map(s => {
            const query = {
                entity: 'model',
                sort: 'payment',
                filters: filteredMakes[s].query,
                purchaseStrategy: 'lease',
            };

            return (
                <div className="brand mb-md-3" key={filteredMakes[s].title}>
                    <Link
                        key={filteredMakes[s].title}
                        href={{ pathname: '/deal-list', query: query }}
                        as={{ pathname: '/filter', query: query }}
                        passHref
                    >
                        <a
                            onClick={() =>
                                this.trackLinkClick(filteredMakes[s], query)
                            }
                        >
                            <LazyLoad once={true} height={120} offset={200}>
                                <StaticImage
                                    path={filteredMakes[s].logo}
                                    width={120}
                                    height={120}
                                    alt={filteredMakes[s].title + ' logo'}
                                />
                            </LazyLoad>
                        </a>
                    </Link>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container-fluid callout__brands bg-focus pt-5 pb-3">
                <Container>
                    <Row>{this.renderMakes(true)}</Row>
                    <Collapse className="row" isOpen={this.state.collapse}>
                        {this.renderMakes(false)}
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
                            <Button
                                tag="a"
                                color="primary"
                                className="shadow-sm font-weight-bold"
                            >
                                <span>See all brands</span>
                                <FontAwesomeIcon
                                    icon={
                                        this.state.active
                                            ? faChevronUp
                                            : faChevronDown
                                    }
                                />
                            </Button>
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}
