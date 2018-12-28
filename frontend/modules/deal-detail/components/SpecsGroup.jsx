import React from 'react';
import { dealType } from '../../../core/types';
import { Row, Col, Collapse } from 'reactstrap';
import SpecsDetails from './SpecsDetails';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCar,
    faPlusCircle,
    faMinusCircle,
} from '@fortawesome/free-solid-svg-icons';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        category: 'Engine',
        collapse: false,
        active: false,
    };

    getVehicleData() {
        var theData = this.props.vehicle.equipment;
        // console.log(theData);
        return theData;
    }

    getCategories() {
        var array = [];
        var unique = this.props.vehicle.equipment.forEach(
            v =>
                array.indexOf(v.category) === -1 ? array.push(v.category) : null
        );
        return array;
    }

    toggle = () =>
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
        });

    specSetCat = category =>
        this.setState({
            category: this.category,
        });

    getTheCats() {
        const cats = [...new Set(this.getVehicleData().map(v => v.category))];
        const catsR = cats.filter(c => c).map((category, i) => {
            // console.log(this.props);

            return (
                <Col
                    xs="12"
                    key={i}
                    onClick={() => this.specSetCat(category)}
                    className={
                        this.state.category === category
                            ? 'border-bottom p-15 active'
                            : 'border-bottom p-15 not-active'
                    }
                >
                    <FontAwesomeIcon
                        icon={this.state.active ? faMinusCircle : faPlusCircle}
                    />
                    <h5 className=""> {category} </h5>
                    <SpecsDetails
                        key={this.props.vehicle.id}
                        vehicle={this.props.vehicle}
                    />
                </Col>
            );
        });
        return (
            <Row className="deal-details__specs accoridon-heading" id="specs">
                {catsR}
            </Row>
        );
    }

    render() {
        const { deal } = this.props;
        // console.log(this.state);

        return <React.Fragment>{this.getTheCats()}</React.Fragment>;
    }
}
