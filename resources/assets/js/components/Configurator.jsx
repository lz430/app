import React from 'react';
import StyleSelector from './StyleSelector';
import MakeSelector from './MakeSelector';
import api from '../src/api';
import axios from 'axios';
import R from 'ramda';

class Configurator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            styles: null,
            makes: null,
            selectedStyles: [],
            selectedMakes: [],
        };

        this.onSelectStyle = this.onSelectStyle.bind(this);
        this.onSelectMake = this.onSelectMake.bind(this);
    }

    componentDidMount() {
        axios.all([api.getBodyStyles(), api.getMakes()]).then(
            axios.spread((styles, makes) => {
                this.setState({
                    styles: styles.data.data,
                    makes: makes.data.data,
                });
            })
        );
    }

    onSelectStyle(style) {
        this.setState({
            selectedStyles: R.contains(style, this.state.selectedStyles)
                ? R.reject(R.equals(style), this.state.selectedStyles)
                : R.append(style, this.state.selectedStyles),
        });
    }

    onSelectMake(id) {
        this.setState({
            selectedMakes: R.contains(id, this.state.selectedMakes)
                ? R.reject(R.equals(id), this.state.selectedMakes)
                : R.append(id, this.state.selectedMakes),
        });
    }

    render() {
        return this.state.styles && this.state.makes
            ? <div className="configurator">
                  <StyleSelector
                      styles={this.state.styles}
                      selectedStyles={this.state.selectedStyles}
                      onSelectStyle={this.onSelectStyle}
                  />

                  <MakeSelector
                      makes={this.state.makes}
                      selectedMakes={this.state.selectedMakes}
                      onSelectMake={this.onSelectMake}
                  />
              </div>
            : <div>'Loading'</div>;
    }
}

export default Configurator;
