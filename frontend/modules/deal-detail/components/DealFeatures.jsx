import React from 'react';
import { dealType } from '../../../core/types';
import DealColors from '../../../components/Deals/DealColors';
import StandardFeaturesModal from './StandardFeaturesModal';
import AdditionalFeaturesModal from './AdditionalFeaturesModal';

export default class extends React.PureComponent {
    static propTypes = {
        deal: dealType.isRequired,
    };

    state = {
        basicFeatures: [],
        fuelEconomy: {},
        upholsteryType: null,
        standardFeaturesModalOpen: false,
        additionalFeaturesModalOpen: false,
    };

    componentDidMount() {
        if (this.props.deal) {
            const {
                body_style,
                driven_wheels,
                fuel_econ_city,
                fuel_econ_hwy,
            } = this.props.deal.version;

            const { engine, transmission } = this.props.deal;

            const basicFeatures = [
                { name: 'Body', content: body_style },
                { name: 'Drive Train', content: driven_wheels },
                { name: 'Engine', content: engine },
                { name: 'Transmission', content: transmission },
            ];

            const fuelEconomy = {
                city: fuel_econ_city,
                highway: fuel_econ_hwy,
            };

            this.setState({ basicFeatures, fuelEconomy });
        }
    }

    toggleStandardFeaturesModal() {
        this.setState({
            standardFeaturesModalOpen: !this.state.standardFeaturesModalOpen,
        });
    }

    toggleAdditionalFeaturesModal() {
        this.setState({
            additionalFeaturesModalOpen: !this.state
                .additionalFeaturesModalOpen,
        });
    }

    render() {
        const { deal } = this.props;

        return (
            <div className="deal-details__deal-content">
                <div className="deal-details__deal-content-header">
                    <div className="deal-details__deal-content-at-a-glance">
                        This Vehicle At-A-Glance
                    </div>
                    <div className="deal-details__deal-content-color">
                        <DealColors deal={deal} />
                    </div>
                </div>
                <div className="deal-details__deal-content-body">
                    <div>
                        <div className="deal-details__deal-content-subtitle">
                            Standard Features
                        </div>
                        <ul className="deal-details__deal-content-features">
                            {this.state.basicFeatures
                                ? this.state.basicFeatures.map(
                                      (feature, index) => {
                                          return (
                                              <li key={index}>
                                                  {feature.name}:{' '}
                                                  {feature.content}
                                              </li>
                                          );
                                      }
                                  )
                                : ''}

                            {this.state.fuelEconomy ? (
                                <li>
                                    Fuel Economy - City:{' '}
                                    {this.state.fuelEconomy.city} Highway:{' '}
                                    {this.state.fuelEconomy.highway}
                                </li>
                            ) : (
                                ''
                            )}
                        </ul>

                        <ul className="deal-details__deal-content-features">
                            {deal.features.slice(0, 5).map((feature, index) => {
                                return <li key={index}>{feature.feature}</li>;
                            })}
                        </ul>
                        <span
                            className="link deal-details__deal-content-see-all"
                            onClick={() => this.toggleStandardFeaturesModal()}
                        >
                            See all standard features &gt;
                        </span>
                    </div>
                    {deal.vauto_features.length > 1 && (
                        <div>
                            <div className="deal-details__deal-content-subtitle">
                                Included Options
                            </div>
                            <ul className="deal-details__deal-content-features">
                                {deal.vauto_features
                                    .slice(0, 5)
                                    .map((feature, index) => {
                                        return <li key={index}>{feature}</li>;
                                    })}
                            </ul>
                            <span
                                className="link deal-details__deal-content-see-all"
                                onClick={() =>
                                    this.toggleAdditionalFeaturesModal()
                                }
                            >
                                See all Included Options &gt;
                            </span>
                        </div>
                    )}
                </div>
                <StandardFeaturesModal
                    toggle={this.toggleStandardFeaturesModal.bind(this)}
                    isOpen={this.state.standardFeaturesModalOpen}
                    deal={this.props.deal}
                    basicFeatures={this.state.basicFeatures}
                    fuelEconomy={this.state.fuelEconomy}
                />

                <AdditionalFeaturesModal
                    toggle={this.toggleAdditionalFeaturesModal.bind(this)}
                    isOpen={this.state.additionalFeaturesModalOpen}
                    deal={this.props.deal}
                />
            </div>
        );
    }
}
