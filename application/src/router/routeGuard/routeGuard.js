import React from 'react'
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

const mapStateToProps = (state) => ({
    auth: state.auth
})

const RouteGuard = ({component: Component, auth, ...rest }) => {
    return (
        <Route { ...rest }>
            {auth.token ? <Component /> : <Redirect to={"/"}/>}
        </Route>
    )
}

export default connect(mapStateToProps, null)(RouteGuard);