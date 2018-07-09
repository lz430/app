import React from 'react';
import PropTypes from 'prop-types';

class EquipmentList extends React.PureComponent {
    static propTypes = {
        col: PropTypes.object.isRequired,
        category: PropTypes.string.isRequired,
    };

    equipment() {
        return this.props.col.equipment[this.props.category] || [];
    }

    render() {
        return (
            <ul>
                {this.equipment().map((label, index) => {
                    return <li key={index}>{label}</li>;
                })}
            </ul>
        );
    }
}

export default EquipmentList;
