import React from 'react';
import PropTypes from 'prop-types';

class MakeSelector extends React.Component {
    render() {
        return (
            <div>
                { this.props.makes.map((make) => {
                    return (
                        <div onClick={ this.props.onSelectMake.bind(null, make.id) } key={make.id}>
                            { make.attributes.name }
                            <br/>
                            <img src={ make.attributes.logo }/>
                        </div>
                    );
                }) }
            </div>
        )
    }
}

MakeSelector.propTypes = {
    makes: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        attributes: PropTypes.shape({
            name: PropTypes.string.isRequired,
            logo: PropTypes.string.isRequired,
        }),
    })).isRequired,
    onSelectMake: PropTypes.func.isRequired,
};

export default MakeSelector;
