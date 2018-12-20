import React from 'react';
import { Row, Col } from 'reactstrap';
import { Sticky } from 'react-sticky';

import { MediumAndUp, SmallAndDown } from '../../../components/Responsive';

export default class extends React.PureComponent {
    render() {
        console.log(this.props);
        return <div className="deal__highlights" />;
    }
}
