import React from 'react';
import { dealType } from '../../../core/types';
import { Row, Col, Collapse } from 'reactstrap';
import SpecsDetails from './SpecsDetails';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';

export default class extends React.PureComponent {
    state = {
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        category: 'Engine',
        collapse: false,
        active: false,
        activeTab: 'capabilities',
    };

    toggle = () =>
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
        });

    getTheCats() {
        const specsCats = [...new Set(this.props.specs.map(v => v.category))];
        const specsCatsR = specsCats.filter(c => c).map((category, i) => {
            return (
                <React.Fragment>
                    <Col
                        xs="12"
                        key={i}
                        className={
                            this.state.category === category
                                ? 'border-bottom p-15 active'
                                : 'border-bottom p-15 not-active'
                        }
                    >
                        <FontAwesomeIcon
                            icon={
                                this.state.active ? faMinusCircle : faPlusCircle
                            }
                        />
                        <h5
                            onClick={this.toggle.bind(this)}
                            className="collapse-header"
                        >
                            {' '}
                            {category}{' '}
                        </h5>
                        <Collapse isOpen={this.state.collapse}>
                            {this.props.specs.map(item => (
                                <SpecsDetails
                                    vehicle={this.props.vehicle}
                                    values={item.values}
                                    category={item.category}
                                />
                            ))}
                        </Collapse>
                    </Col>
                </React.Fragment>
            );
        });
        return (
            <Row className="deal-details__specs accoridon-heading" id="specs">
                {specsCatsR}
            </Row>
        );
    }

    render() {
        const { deal } = this.props;
        // console.log(this.props);

        return <React.Fragment>{this.getTheCats()}</React.Fragment>;
    }
}
