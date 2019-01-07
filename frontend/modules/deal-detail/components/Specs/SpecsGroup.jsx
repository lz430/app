import React from 'react';
import PropTypes from 'prop-types';

import { dealType } from '../../../../core/types';
import SpecsDetails from './SpecsDetails';

export default class SpecsGroup extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
        specs: PropTypes.array.isRequired,
        toggleActiveCategory: PropTypes.func.isRequired,
        activeCategory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    };

    state = {
        category: 'Engine',
        collapse: false,
        active: null,
    };

    toggle = id => {
        this.setState({
            collapse: !this.state.collapse,
            active: id,
        });
    };

    render() {
        return this.props.specs.map((item, i) => {
            return (
                <SpecsDetails
                    key={`detail-group-${item.category}-${i}`}
                    deal={this.props.deal}
                    values={item.values}
                    category={item.category}
                    isOpen={item.category === this.props.activeCategory}
                    toggleActiveCategory={this.props.toggleActiveCategory}
                />
            );
        });
    }
}
