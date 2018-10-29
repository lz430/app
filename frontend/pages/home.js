import '../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    CarouselCaption,
    Jumbotron,
    Button,
} from 'reactstrap';
// import SearchWidget from '../components/App/Header/SearchWidget';
import { NavItem, NavLink } from 'reactstrap';
import Link from 'next/link';

export default class extends React.Component {
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
                <Jumbotron>
                    <img
                        src="https://via.placeholder.com/1900x400"
                        alt="placeholder"
                    />
                    <div className="search">
                        <div className="__container">
                            <h3>Search new cars from local dealers</h3>
                        </div>
                    </div>
                </Jumbotron>

                <div className="container callout__categories">
                    <div className="row">
                        <div className="__category">
                            <h3>Category__name</h3>
                            <img
                                src="https://via.placeholder.com/400x150"
                                alt="image"
                            />
                            <NavItem>
                                <Link href="/#" as="/#" passHref>
                                    <NavLink>See All</NavLink>
                                </Link>
                            </NavItem>
                        </div>
                        <div className="__category">
                            <h3>Category__name</h3>
                            <img
                                src="https://via.placeholder.com/400x150"
                                alt="image"
                            />
                            <NavItem>
                                <Link href="/#" as="/#" passHref>
                                    <NavLink>See All</NavLink>
                                </Link>
                            </NavItem>
                        </div>
                        <div className="__category">
                            <h3>Category__name</h3>
                            <img
                                src="https://via.placeholder.com/400x150"
                                alt="image"
                            />
                            <NavItem>
                                <Link href="/#" as="/#" passHref>
                                    <NavLink>See All</NavLink>
                                </Link>
                            </NavItem>
                        </div>
                        <div className="__category">
                            <h3>Category__name</h3>
                            <img
                                src="https://via.placeholder.com/400x150"
                                alt="image"
                            />
                            <NavItem>
                                <Link href="/#" as="/#" passHref>
                                    <NavLink>See All</NavLink>
                                </Link>
                            </NavItem>
                        </div>
                    </div>
                    <div className="row">
                        <Link href="/#" as="/#" passHref>
                            <NavLink className="btn btn-primary">
                                Browse All Cars
                            </NavLink>
                        </Link>
                    </div>
                </div>

                <div className="fluid-container callout__brands">
                    <div className="container">
                        <div className="row">
                            <Link href="/#" as="/#" passHref>
                                <NavLink>
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="placeholder"
                                    />
                                </NavLink>
                            </Link>
                            <Link href="/#" as="/#" passHref>
                                <NavLink>
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="placeholder"
                                    />
                                </NavLink>
                            </Link>
                            <Link href="/#" as="/#" passHref>
                                <NavLink>
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="placeholder"
                                    />
                                </NavLink>
                            </Link>
                            <Link href="/#" as="/#" passHref>
                                <NavLink>
                                    <img
                                        src="https://via.placeholder.com/50"
                                        alt="placeholder"
                                    />
                                </NavLink>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="container callout__shop">
                    <div className="row">
                        <div className="col-4">
                            <h2>Shop</h2>
                            <p>
                                Browser new car inventory of 75-100 local
                                dealers, select features important to you and
                                compare brands to find a car that fits your
                                lifestyle.
                            </p>
                            <Link href="/filter" as="/filter" passHref>
                                <NavLink className="btn btn-primary">
                                    Get Started
                                </NavLink>
                            </Link>
                        </div>
                        <div className="col-8">
                            <img
                                src="https://via.placeholder.com/700x200.png?text=Jeep"
                                alt="placeholder"
                            />
                        </div>
                    </div>
                </div>

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

                <div class="container callout__testimonials">
                    <h4>What our customers are saying</h4>
                    <div class="row">
                        <div class="col-4">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Obcaecati quas omnis, iusto
                                vero accusamus nam veniam reiciendis quaerat
                                quod ipsum praesentium, unde molestiae!
                                Obcaecati, error temporibus ipsam ipsum
                                voluptas. Est?15
                            </p>
                            <div class="author">
                                <span>Monica P</span>
                            </div>
                        </div>
                        <div class="col-4">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Officiis ab aperiam suscipit
                                enim, voluptatibus officia eaque iusto
                                perspiciatis, excepturi necessitatibus aliquam
                                quia impedit cumque quo blanditiis magni illo
                                accusamus et!15
                            </p>
                            <div class="author">
                                <span>Jason B, Traverse City MI</span>
                            </div>
                        </div>
                        <div class="col-4">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur
                                adipisicing elit. Quod quae soluta maiores
                                recusandae, voluptatem ad officiis molestiae
                                sunt cum blanditiis harum quasi laborum aliquam
                                magnam architecto itaque ullam. Sit,
                                distinctio!15
                            </p>
                            <div class="author">
                                <span>Lori P, Birmingham MI</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="container callout__media">
                    <div class="row">
                        <div class="col">h5</div>
                        <div class="col">Featured In:</div>
                        <div class="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div class="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div class="col">
                            <img
                                src="https://via.placeholder.com/200x50"
                                alt="placeholder"
                            />
                        </div>
                        <div class="col">
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
