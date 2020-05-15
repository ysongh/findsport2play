import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';

import styles from './Login.module.css';
import TextFieldGroup from '../common/TextFieldGroup';
import { loginUser } from '../../actions/authActions';

class Login extends Component{
    constructor(){
        super();
        this.state = {
            email: '',
            password: '',
            errors: {}
        };
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    
    componentDidMount(){
      if(this.props.auth.isAuthenticated){
        this.props.history.push('/events');
      }
    }
    
    componentWillReceiveProps(nextProps){
      if(nextProps.auth.isAuthenticated){
        this.props.history.push('/events');
      }
      if(nextProps.errors){
        this.setState({errors: nextProps.errors});
      }
    }
    
    onChange(e){
        this.setState({[e.target.name]: e.target.value});
    }
    
    onSubmit(e){
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        
        this.props.loginUser(userData);
    }
    
    render(){
        const {errors} = this.state;

        const {
          login,
          login__button,
          login__buttonGroup,
          button__login,
          button__goBack } = styles;
        
        return(
            <Grid className={login} container justify="center">
              <Grid item xs={12} sm={8} md={6}>
                <h1 className="display-4 text-center mt-5">Log In</h1>
                <form onSubmit={this.onSubmit} className="mb-2">
                  <TextFieldGroup
                    label="Email"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                  <TextFieldGroup
                    label="Password"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                  <div className={login__buttonGroup}>
                    <input type="submit" className={login__button + ' ' + button__login} />
                    <Link to="/" className={login__button + ' ' + button__goBack}>
                      Go Back
                    </Link>
                  </div>
                </form>
              </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(mapStateToProps, {loginUser})(Login);