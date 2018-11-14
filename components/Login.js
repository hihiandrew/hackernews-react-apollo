import React, { Component } from 'react';
import { AUTH_TOKEN } from '../constants';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;
const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

class Login extends Component {
  state = {
    login: true,
    email: '',
    password: '',
    name: '',
  };

  handleChange = e =>
    this.setState({
      [e.target.name]: e.target.value,
    });

  saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };

  _confirm = async data => {
    const { login } = this.state;
    const { history } = this.props;
    const { token } = login ? data.login : data.signup;
    this.saveUserData(token);
    history.push('/');
  };

  render() {
    const { login, email, password, name } = this.state;
    return (
      <div>
        <h4 className="mv3">{login ? 'Login' : 'Sign up'}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              value={name}
              onChange={this.handleChange}
              type="text"
              name="name"
              placeholder="Your name"
            />
          )}
          <input
            value={email}
            onChange={this.handleChange}
            type="text"
            name="email"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={this.handleChange}
            type="password"
            name="password"
            placeholder="Choose a safe password"
          />
        </div>
        <div className="flex mt3">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
            variables={{ email, password, name }}
            onCompleted={data => this._confirm(data)}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? 'login' : 'create account'}
              </div>
            )}
          </Mutation>
          <div
            className="pointer button"
            onClick={() => this.setState({ login: !login })}
          >
            {login ? 'need to create an account?' : 'already have an account?'}
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
