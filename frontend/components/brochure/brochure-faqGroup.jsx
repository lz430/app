import React from 'react';
import { Col, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

class ListGroupCollapse extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
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
