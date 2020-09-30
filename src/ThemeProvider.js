import React, { Component } from 'react';
import { ThemeProvider, Themes } from './styles';
import { connect } from 'react-redux';

const mapState = (state) => ({
  theme: Themes[state.ui.theme],
});
const mapDispatch = {};

const connector = connect(mapState, mapDispatch);

class StorePoweredThemeProvider extends Component {
  constructor(props) {
    super(props);

    console.log(this.props.theme);
  }

  render() {
    return <ThemeProvider theme={this.props.theme}>{this.props.children}</ThemeProvider>;
  }
}

export default connector(StorePoweredThemeProvider);
