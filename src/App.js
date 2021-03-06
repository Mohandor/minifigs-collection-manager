import React, { Component } from 'react';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from './store/actions';
import Layout from './hoc/Layout/Layout';
import Frames from './containers/Frames/Frames';
import Minifigs from './containers/Minifigs/Minifigs';
import Trunks from './containers/Trunks/Trunks';
import Auth from './containers/Auth/Auth';

export class App extends Component {
    componentDidMount = () => {
        this.props.onTryAutoSignup();
        if (!this.props.minifigs || !this.props.frames || !this.props.trunks) {
            this.props.fetchData();
        }
    }

    render() {
        return (
        <Layout>
            <Switch>
                <Route path="/frames" component={Frames} />
                <Route path="/trunks" component={Trunks} />
                <Route path="/auth" component={Auth} />
                <Route exact path="/" component={Minifigs} />
                <Redirect to='/' />
            </Switch>
        </Layout>
        );
    }
}
const mapStateToProps = state => ({
    minifigs: state.minifigs.minifigs,
    frames: state.minifigs.frames,
    trunks: state.minifigs.trunks
})

const mapDispatchToProps = dispatch => ({
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
    fetchData: () => dispatch(actions.fetchData())
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));