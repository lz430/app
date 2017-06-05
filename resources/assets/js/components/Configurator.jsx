import React from 'react';
import StyleSelector from 'components/StyleSelector';
import api from 'src/api';

class Configurator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            styles: null,
            makes: null,
            selectedStyles: [],
        };

        this.redirectToFilterPage = this.redirectToFilterPage.bind(this);
        this.onSelectStyle = this.onSelectStyle.bind(this);
    }

    componentDidMount() {
        api.getBodyStyles().then(styles => {
            this.setState({
                styles: styles.data.data,
            });
        });
    }

    redirectToFilterPage(style) {
        window.location = `/filter?style=${style}`;
    }

    onSelectStyle(style) {
        this.redirectToFilterPage(style);
    }

    render() {
        return this.state.styles
            ? <div className="configurator">
                  <div className="configurator__selectors">
                      <StyleSelector
                          styles={this.state.styles}
                          selectedStyles={this.state.selectedStyles}
                          onSelectStyle={this.onSelectStyle}
                      />
                  </div>
              </div>
            : <div>'Loading'</div>;
    }
}

export default Configurator;
