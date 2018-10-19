import '../styles/app.scss';
import React from 'react';
import config from '../src/config';
import { Container, Row, Col } from 'reactstrap';
import BrochureHeader from '../components/brochure/brochure-header.jsx';

export default class extends React.Component {
    render() {
        return <BrochureHeader />;
    }
}
