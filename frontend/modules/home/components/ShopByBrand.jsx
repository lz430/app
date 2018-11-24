import React from 'react';

import { Container, Row, Collapse } from 'reactstrap';
import Link from 'next/link';

import makes from '../../../content/makes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { track } from '../../../core/services';
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
                purchaseStrategy: 'finance',
            };

            return (
                <div className="brand mb-3" key={filteredMakes[s].title}>
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
                            <img
                                style={{ height: '80px', width: '80px' }}
                                src={filteredMakes[s].logo}
                                alt={filteredMakes[s].title + ' logo'}
                            />
                        </a>
                    </Link>
                </div>
            );
        });
    }

    render() {
        return (
            <div className="container-fluid callout__brands pt-5 pb-3">
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
                            <a className="btn btn-primary">
                                <span>See all brands</span>
                                <FontAwesomeIcon
                                    icon={
                                        this.state.active
                                            ? faChevronUp
                                            : faChevronDown
                                    }
                                />
                            </a>
                        </div>
                    </Row>
                </Container>
            </div>
        );
    }
}
