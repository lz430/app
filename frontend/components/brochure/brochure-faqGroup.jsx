import React from 'react';
import PropTypes from 'prop-types';
import { Col, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

class ListGroupCollapse extends React.Component {
    static propTypes = {
        item: PropTypes.object,
    };
    state = {
        collapse: false,
        active: false,
    };

    toggle = () =>
        this.setState({
            collapse: !this.state.collapse,
            active: !this.state.active,
        });

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
                        <FontAwesomeIcon
                            className={!this.state.active ? '' : 'hidden'}
                            icon={faChevronDown}
                        />
                        <FontAwesomeIcon
                            className={this.state.active ? '' : 'hidden'}
                            icon={faChevronUp}
                        />
                    </div>
                    <Collapse isOpen={this.state.collapse}>
                        <div className="content">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: this.props.item.content,
                                }}
                            />
                        </div>
                        {/*<em>{item.category}</em>*/}
                    </Collapse>
                </div>
            </Col>
        );
    }
}

export default ListGroupCollapse;
