import React from 'react';
import PropTypes from 'prop-types';
import { Col, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

class ListGroupCollapse extends React.Component {
    static propTypes = {
        item: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
        });
    }

    render() {
        const item = this.props.item;
        return (
            <Col>
                <div key={item.title}>
                    <div
                        className={this.state.active ? 'title active' : 'title'}
                        onClick={this.toggle}
                    >
                        {item.title}
                        <FontAwesomeIcon icon={faChevronDown} />
                    </div>
                    <Collapse isOpen={this.state.collapse}>
                        <div className="content">{item.content}</div>
                    </Collapse>
                </div>
            </Col>
        );
    }
}

export default ListGroupCollapse;
