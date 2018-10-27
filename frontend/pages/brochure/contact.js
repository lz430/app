import '../../styles/app.scss';
import React from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from 'reactstrap';

import { faArrowRight } from '@fortawesome/pro-light-svg-icons/faArrowRight';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class extends React.Component {
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h1>
                            Have a Question? <br />
                            We&#39;re here to help.
                        </h1>
                    </Col>
                </Row>
                <Row>
                    <Col xl={4}>
                        <div>
                            <img
                                alt="Deliver My Ride Location"
                                className="img-fluid"
                                src="/static/images/about-riker.jpg"
                            />
                        </div>
                        <div>
                            35 W Huron Street
                            <br />
                            Suite 1000
                            <br />
                            Pontiac, MI 48342
                        </div>
                        <div>
                            <a href="tel:855-675-7301">855-675-7301</a>
                        </div>
                    </Col>
                    <Col xl={8}>
                        <Form>
                            <FormGroup>
                                <Label for="exampleEmail">Your Name</Label>
                                <Input
                                    type="email"
                                    name="email"
                                    id="exampleEmail"
                                    placeholder="with a placeholder"
                                />
                            </FormGroup>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Email</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="exampleEmail"
                                            placeholder="with a placeholder"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">Phone</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="exampleEmail"
                                            placeholder="with a placeholder"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">City</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="exampleEmail"
                                            placeholder="with a placeholder"
                                        />
                                    </FormGroup>
                                </Col>
                                <Col>
                                    <FormGroup>
                                        <Label for="exampleEmail">State</Label>
                                        <Input
                                            type="email"
                                            name="email"
                                            id="exampleEmail"
                                            placeholder="with a placeholder"
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup>
                                <Label for="exampleText">Message</Label>
                                <Input
                                    type="textarea"
                                    name="text"
                                    id="exampleText"
                                    style={{ height: '150px' }}
                                />
                            </FormGroup>

                            <div className="text-right">
                                <Button color="primary" size="lg">
                                    Submit{' '}
                                    <FontAwesomeIcon icon={faArrowRight} />
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}
