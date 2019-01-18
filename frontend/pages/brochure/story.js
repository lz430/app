import '../../styles/app.scss';
import React from 'react';
import PropTypes from 'prop-types';

import { Container, Row, Col } from 'reactstrap';
import Head from 'next/head';

import { withRouter } from 'next/router';
import { track } from '../../core/services';

import stories from '../../content/stories';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

class StoryPage extends React.Component {
    static propTypes = {
        story: PropTypes.object,
        content: PropTypes.string,
    };

    static async getInitialProps({ query }) {
        let story = null;
        let content = null;

        if (query.slug && stories[query.slug]) {
            story = stories[query.slug];
            content = await require(`../../content/${story['content']}`);
        }

        return {
            story: story,
            content: content,
        };
    }

    componentDidMount() {
        track('page:brochure-story:view');
    }

    render404() {
        return <h1>Not Found</h1>;
    }

    renderStory() {
        return (
            <div className="mb-5 mt-md-5">
                <Container>
                    <Row>
                        <Col md={{ size: 8, offset: 2 }}>
                            <div className="mb-4">
                                <h1>{this.props.story.title}</h1>
                                <h6>
                                    Delivered On {this.props.story.deliveryDate}
                                </h6>
                            </div>
                            <div className="bg-white rounded shadow-sm p-3">
                                <ReactMarkdown source={this.props.content} />
                            </div>
                            <div className="text-center mt-5">
                                <Link
                                    href="/deal-list?entity=model&sort=payment&purchaseStrategy=lease"
                                    as="/filter?entity=model&sort=payment&purchaseStrategy=lease"
                                    passHref
                                >
                                    <a className="btn btn-primary btn-lg">
                                        Find your next car today!
                                    </a>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }

    render() {
        let content;
        if (!this.props.story) {
            content = this.render404();
        } else {
            content = this.renderStory();
        }
        console.log(this.props);
        return (
            <React.Fragment>
                <Head>
                    <title>Deliver My Ride | Story</title>
                </Head>
                <div className="about">{content}</div>
            </React.Fragment>
        );
    }
}

export default withRouter(StoryPage);
