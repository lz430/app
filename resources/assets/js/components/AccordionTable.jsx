import React from 'react';
import { connect } from 'react-redux';
import * as Actions from 'actions/index';

class AccordionTable extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        return this.props.children();
    }
}

const mapStateToProps = state => {
    return {
        compareList: state.compareList,
    };
};

export default connect(mapStateToProps, Actions)(AccordionTable);
