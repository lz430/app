import React from 'react';
import PropTypes from 'prop-types';

class BodyStyleSelector extends React.Component {
    render() {
        return (
            <div>
                { this.props.bodyStyles.map((bodyStyle) => {
                    return (
                        <div key={bodyStyle.style}>
                            { bodyStyle.style }
                            <br/>
                            <img src={bodyStyle.icon}/>
                        </div>
                    );
                }) }
            </div>
        )
    }
}

BodyStyleSelector.propTypes = {
    bodyStyles: PropTypes.arrayOf(PropTypes.shape({
        style: PropTypes.string,
        icon: PropTypes.string,
    })).isRequired,
    onSelectBodyStyle: PropTypes.func.isRequired,
};

export default BodyStyleSelector;
