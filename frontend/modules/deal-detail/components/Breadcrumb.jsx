import React from 'react';
import PropTypes from 'prop-types';
import { Container, Breadcrumb, BreadcrumbItem } from 'reactstrap';
import BackToSearchResultsLink from '../../../apps/page/components/BackToSearchResultsLink';

export default class extends React.PureComponent {
    static propTypes = {
        searchQuery: PropTypes.object,
    };
    render() {
        return (
            <Container>
                <Breadcrumb>
                    <BreadcrumbItem>
                        <BackToSearchResultsLink
                            searchQuery={this.props.searchQuery}
                        />
                    </BreadcrumbItem>
                    <BreadcrumbItem active>View Deal</BreadcrumbItem>
                </Breadcrumb>
            </Container>
        );
    }
}
