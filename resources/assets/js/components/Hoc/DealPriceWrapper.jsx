import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

function DealPriceWrapper(ComponentToDecorate) {
    class ComponentDecorated extends React.Component {
        static propTypes = {
            deal: PropTypes.object.isRequired,
        };

        constructor(props) {
            super(props);
        }

        componentDidMount() {
            // fetch data and stuff
        }

        render() {
            return <ComponentToDecorate {...this.props} />;
        }
    }

    function mapStateToProps(state) {
        return {
            searchQuery: state.searchQuery,
        };
    }

    const mapDispatchToProps = {
        // your shared action call
    };

    return connect(
        mapStateToProps,
        mapDispatchToProps
    )(ComponentDecorated);
}

export default DealPriceWrapper;
