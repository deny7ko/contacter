import React from "react";
import { Redirect } from "react-router-dom";
import { compose } from 'recompose';

import AuthUserContext from "./context";
import { withFirebase } from "components/Firebase";
import * as ROUTES from "constants/routes";

const withAuthorization = condition => Component => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(
        authUser => {
          if (!condition(authUser)) {
            return <Redirect to={ROUTES.SIGN_IN} />
          }
        }
      )
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return(
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      )
    }
  }

  return compose(
    withFirebase
  )(WithAuthorization);
};

export default withAuthorization;
