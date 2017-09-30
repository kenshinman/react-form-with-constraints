import * as React from 'react';
import * as ReactDOM from 'react-dom';

import './index.html';
import '../Password/style.css';

interface Errors {
  username: string[];
  password: string[];
  passwordConfirm: string[];
}

function validateUsername(username: string) {
  const errors = [] as string[];
  if (username.length === 0) errors.push("Can't be empty");
  if (!username.includes('@')) errors.push('Should contain @');
  return errors;
}

function validatePassword(password: string) {
  const errors = [] as string[];
  if (password.length === 0) errors.push("Can't be empty");
  if (password.length < 5) errors.push('Should be at least 5 characters long');
  return errors;
}

function validatePasswordConfirm(password: string, passwordConfirm: string) {
  const errors = [] as string[];
  if (passwordConfirm !== password) errors.push('Not the same password');
  return errors;
}

function containErrors(errors: Errors) {
  return errors.username.length > 0 || errors.password.length > 0 || errors.passwordConfirm.length > 0;
}


interface Props {}

interface State {
  errors: Errors;
}

class Form extends React.Component<Props, State> {
  username: HTMLInputElement;
  password: HTMLInputElement;
  passwordConfirm: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = {
      errors: {
        username: [],
        password: [],
        passwordConfirm: []
      }
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handlePasswordConfirmChange = this.handlePasswordConfirmChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleUsernameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          username: validateUsername(value)
        }
      };
    });
  }

  handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          password: validatePassword(value),
          passwordConfirm: validatePasswordConfirm(value, this.passwordConfirm.value)
        }
      };
    });
  }

  handlePasswordConfirmChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.currentTarget.value;
    this.setState(prevState => {
      return {
        errors: {
          ...prevState.errors,
          passwordConfirm: validatePasswordConfirm(this.password.value, value)
        }
      };
    });
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    this.setState(
      prevState => {
        return {
          errors: {
            ...prevState.errors,
            username: validateUsername(this.username.value),
            password: validatePassword(this.password.value),
            passwordConfirm: validatePasswordConfirm(this.password.value, this.passwordConfirm.value)
          }
        };
      },
      () => {
        if (!containErrors(this.state.errors)) {
          alert('Valid form');
        } else {
          alert('Invalid form');
        }
      }
    );
  }

  render() {
    const { errors } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          <label>Username</label>
          <input ref={username => this.username = username!}
                 onChange={this.handleUsernameChange} />
          <div className="error">
            {errors.username.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label>Password</label>
          <input type="password"
                 ref={password => this.password = password!}
                 onChange={this.handlePasswordChange} />
          <div className="error">
            {errors.password.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <div>
          <label>Confirm Password</label>
          <input type="password"
                 ref={passwordConfirm => this.passwordConfirm = passwordConfirm!}
                 onChange={this.handlePasswordConfirmChange} />
          <div className="error">
            {errors.passwordConfirm.map(error => <div key={error}>{error}</div>)}
          </div>
        </div>

        <button>Submit</button>
      </form>
    );
  }
}

ReactDOM.render(<Form />, document.getElementById('app'));
