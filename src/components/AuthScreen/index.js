/* eslint-disable no-alert */
import React, {PureComponent} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  StatusBar,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {AuthService} from '../../services';
import {showAlert} from '../../helpers/Alert';

export default class AuthScreen extends PureComponent {
  state = {
    isLogging: false,
    viewPassInputLogin: true,
    viewPassInputReg: true,
    view: 'buttons',
    login: {loginName: '', password: ''},
    register: {fullName: '', loginName: '', password: '', confirmPassword: ''},
  };

  setIsLogging = isLogging => this.setState({isLogging});

  guestLogin = () => {
    showAlert(
      `Someother device is currently using Guest Login.
Please Login/SignUp directly to proceed further.`,
      'Error',
    );
  };

  // login = currentUser => {
  //   const _onSuccessLogin = () => {
  //     const {navigation} = this.props;
  //     const opponentsIds = users
  //       .filter(opponent => opponent.id !== currentUser.id)
  //       .map(opponent => opponent.id);

  //     const currentUserLoginId = currentUser.login;
  //     navigation.push('VideoScreen', {opponentsIds, currentUserLoginId});
  //   };

  //   const _onFailLogin = (error = {}) => {
  //     alert(`Error.\n\n${JSON.stringify(error)}`);
  //   };

  //   this.setIsLogging(true);

  //   AuthService.login(currentUser)
  //     .then(_onSuccessLogin)
  //     .catch(_onFailLogin)
  //     .then(() => this.setIsLogging(false));
  // };

  validLoginName = loginName => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(loginName).toLowerCase());
  };

  login = () => {
    if (
      !this.validLoginName(this.state.login.loginName) ||
      this.state.login.password.length < 8
    ) {
      if (!this.validLoginName(this.state.login.loginName)) {
        showAlert('Enter A Valid Login Name', 'Invalid Input');
      } else if (this.state.login.password.length < 8) {
        showAlert('Enter A Valid Password', 'Invalid Input');
      } else {
        showAlert('Enter A Valid Login Name and Password', 'Invalid Input');
      }
    } else {
      // alert(this.state.login.loginName + ' -- ' + this.state.login.password);
      const currentUser = this.state.login;
      const onSuccessLogin = async resp => {
        const {navigation} = this.props;
        const opponentsIds = [];
        const currentUserLoginId = currentUser.loginName;
        const currentUserFullName = resp.user.full_name;
        navigation.push('VideoScreen', {
          opponentsIds,
          currentUserLoginId,
          currentUserFullName,
        });
      };

      const onFailLogin = (error = {}) => {
        showAlert(
          `Error.\n\n${
            // JSON.parse(JSON.stringify(err)).code == '401'
            //   ? 'Invalid User Name or Password.'
            //   : JSON.parse(JSON.stringify(err)).info.errors[0]
            'Invalid User Name or Password.'
          }`,
          'Login Error',
        );
      };

      this.setIsLogging(true);

      AuthService.login({
        login: currentUser.loginName,
        password: currentUser.password,
      })
        .then(resp => onSuccessLogin(resp))
        .catch(onFailLogin)
        .then(() => this.setIsLogging(false));
    }
  };

  register = () => {
    if (
      this.state.register.fullName.length < 4 ||
      !this.validLoginName(this.state.register.loginName) ||
      this.state.register.password.length < 8
    ) {
      if (
        (!this.validLoginName(this.state.register.loginName) &&
          this.state.register.fullName.length < 4) ||
        (!this.validLoginName(this.state.register.loginName) &&
          this.state.register.password.length < 8) ||
        (this.state.register.password.length < 8 &&
          this.state.register.fullName.length < 4)
      ) {
        showAlert(
          `Please enter A Valid Details for Registration
Full Name: Min 4 Characters
Login Name: Mail Address
(Ex: abc@def.xyz)
Password: Min 8 Characters`,
          'Invalid Input',
        );
      } else if (!this.validLoginName(this.state.register.loginName)) {
        showAlert(
          `Enter A Valid Login Name
(Ex: abc@def.xyz)`,
          'Invalid Input',
        );
      } else if (this.state.register.fullName.length < 4) {
        showAlert('Enter A Valid Full Name. Min 4 characters', 'Invalid Input');
      } else if (this.state.register.password.length < 8) {
        showAlert('Enter A Valid Password. Min 8 characters', 'Invalid Input');
      } else {
        showAlert(
          `Please enter A Valid Details for Registration
Full Name: Min 4 Characters
Login Name: Mail Address
(Ex: abc@def.xyz)
Password: Min 8 Characters`,
          'Invalid Input',
        );
      }
    } else {
      if (
        this.state.register.password !== this.state.register.confirmPassword
      ) {
        showAlert("Passwords doesn't match", 'Invalid Input');
      } else {
        // alert(
        //   this.state.register.fullName +
        //     ' -- ' +
        //     this.state.register.loginName +
        //     ' -- ' +
        //     this.state.register.password +
        //     ' -- ' +
        //     this.state.register.confirmPassword,
        // );
        const dataUser = {
          full_name: this.state.register.fullName,
          login: this.state.register.loginName,
          email: this.state.register.loginName,
          password: this.state.register.password,
        };
        AuthService.register(dataUser)
          .then(() => {
            this.setState({isLoader: false});
            showAlert('Account successfully registered');
            const {navigation} = this.props;
            const opponentsIds = [];
            const currentUserLoginId = dataUser.login;
            const currentUserFullName = dataUser.full_name;
            navigation.push('VideoScreen', {
              opponentsIds,
              currentUserLoginId,
              currentUserFullName,
            });
          })
          .catch(error => {
            this.setState({isLoader: false});
            showAlert(`Error.\n\n${JSON.stringify(error)}`, 'Error');
          });
      }
    }
  };

  passViewLogin = () => {
    this.setState({viewPassInputLogin: !this.state.viewPassInputLogin});
  };

  passViewRegister = () => {
    this.setState({viewPassInputReg: !this.state.viewPassInputReg});
  };

  render() {
    const {isLogging} = this.state;
    const logoSrc = require('../../../assets/logo.png');

    return (
      <View style={[styles.container, styles.f1]}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <SafeAreaView style={[styles.centeredChildren, styles.f1]}>
          <Image resizeMode="contain" source={logoSrc} style={styles.logoImg} />
          <View
            style={[
              styles.f1,
              styles.centeredChildren,
              {flexDirection: 'row'},
            ]}>
            {isLogging && <Text>Connecting... </Text>}
            {!isLogging && <Text style={[styles.titleText]}>Peek-A-Boo</Text>}
            {isLogging && <ActivityIndicator size="small" color="white" />}
          </View>
        </SafeAreaView>
        <SafeAreaView style={[styles.authBtns, styles.f1]}>
          {this.state.view === 'buttons' && (
            // ? Login
            <View>
              <TouchableOpacity onPress={() => this.setState({view: 'login'})}>
                <View
                  style={[styles.authBtn('#177987'), styles.centeredChildren]}>
                  <Text style={styles.authBtnText}>
                    {'Login with an account'}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* Login */}

              {/* Register */}
              <TouchableOpacity
                onPress={() => this.setState({view: 'register'})}>
                <View
                  style={[styles.authBtn('#53aaf0'), styles.centeredChildren]}>
                  <Text style={styles.authBtnText}>
                    {'Signup for an account'}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* Register */}

              {/* Guest */}
              <TouchableOpacity onPress={() => this.guestLogin()}>
                <View
                  style={[styles.authBtn('#f35a15'), styles.centeredChildren]}>
                  <Text style={styles.authBtnText}>{'Log in as Guest'}</Text>
                </View>
              </TouchableOpacity>
            </View>
            // ? Guest
          )}
          {this.state.view === 'login' && (
            <View style={[styles.centeredChildren]}>
              <View style={[styles.centeredChildren]}>
                <Text style={[styles.formHead]}>Login Form</Text>
              </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.searchInput]}
                  autoCapitalize="none"
                  placeholder="Login name"
                  returnKeyType="search"
                  onChangeText={keyword =>
                    this.setState({
                      login: {...this.state.login, loginName: keyword},
                    })
                  }
                  placeholderTextColor="white"
                  // value={searchValue}
                  maxLength={255}
                />
              </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.searchInput]}
                  secureTextEntry={this.state.viewPassInputLogin ? true : false}
                  autoCapitalize="none"
                  placeholder="Password"
                  returnKeyType="search"
                  onChangeText={keyword =>
                    this.setState({
                      login: {...this.state.login, password: keyword},
                    })
                  }
                  placeholderTextColor="white"
                  // value={searchValue}
                  maxLength={255}
                />
                <TouchableOpacity
                  style={[styles.passIcon]}
                  onPress={() => this.passViewLogin()}>
                  <Image
                    style={[styles.passImg]}
                    source={
                      this.state.viewPassInputLogin
                        ? require('../../../assets/view.png')
                        : require('../../../assets/hide.png')
                    }
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.loginBtns]}>
                <TouchableOpacity onPress={() => this.login()}>
                  <View style={[styles.authBtn('#177987')]}>
                    <Text style={styles.authBtnText}>{'Login'}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({view: 'buttons'})}>
                  <View style={[styles.authBtn('#f35a15')]}>
                    <Text style={styles.authBtnText}>{'Cancel'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {this.state.view === 'register' && (
            <View style={[styles.centeredChildren]}>
              <View style={[styles.centeredChildren]}>
                <Text style={[styles.formHead]}>Register Form</Text>
              </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.searchInput]}
                  autoCapitalize="none"
                  placeholder="Enter Full name"
                  returnKeyType="search"
                  onChangeText={keyword =>
                    this.setState({
                      register: {...this.state.register, fullName: keyword},
                    })
                  }
                  placeholderTextColor="white"
                  maxLength={255}
                />
              </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.searchInput]}
                  autoCapitalize="none"
                  placeholder="Login name (Email Address)"
                  returnKeyType="search"
                  onChangeText={keyword =>
                    this.setState({
                      register: {...this.state.register, loginName: keyword},
                    })
                  }
                  placeholderTextColor="white"
                  maxLength={255}
                />
              </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.searchInput]}
                  secureTextEntry={this.state.viewPassInputReg ? true : false}
                  autoCapitalize="none"
                  placeholder="Password"
                  returnKeyType="search"
                  onChangeText={keyword =>
                    this.setState({
                      register: {...this.state.register, password: keyword},
                    })
                  }
                  placeholderTextColor="white"
                  maxLength={255}
                />
                <TouchableOpacity
                  style={[styles.passIcon]}
                  onPress={() => this.passViewRegister()}>
                  <Image
                    style={[styles.passImg]}
                    source={
                      this.state.viewPassInputReg
                        ? require('../../../assets/view.png')
                        : require('../../../assets/hide.png')
                    }
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.searchInput]}
                  // secureTextEntry={this.state.viewPassInputLogin ? true : false}
                  secureTextEntry={true}
                  autoCapitalize="none"
                  placeholder="Confirm Password"
                  returnKeyType="search"
                  onChangeText={keyword =>
                    this.setState({
                      register: {
                        ...this.state.register,
                        confirmPassword: keyword,
                      },
                    })
                  }
                  placeholderTextColor="white"
                  maxLength={255}
                />
                {/* <TouchableOpacity
                  style={[styles.passIcon]}
                  onPress={() => this.passViewLogin()}>
                  <Image
                    style={[styles.passImg]}
                    source={
                      this.state.viewPassInputLogin
                        ? require('../../../assets/view.png')
                        : require('../../../assets/hide.png')
                    }
                  />
                </TouchableOpacity> */}
              </View>
              <View style={[styles.loginBtns]}>
                <TouchableOpacity onPress={() => this.register()}>
                  <View
                    style={[
                      styles.authBtn('#177987'),
                      styles.centeredChildren,
                    ]}>
                    <Text style={styles.authBtnText}>{'Signup'}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({view: 'buttons'})}>
                  <View
                    style={[
                      styles.authBtn('#f35a15'),
                      styles.centeredChildren,
                    ]}>
                    <Text style={styles.authBtnText}>{'Cancel'}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  f1: {
    flex: 1,
  },
  centeredChildren: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#001a15',
  },
  logoImg: {
    width: '90%',
    height: '80%',
  },
  authBtns: {
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  authBtn: backgroundColor => ({
    backgroundColor,
    height: 50,
    borderRadius: 25,
    marginHorizontal: 25,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  authBtnText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  titleText: {
    color: 'white',
    fontSize: 40,
    fontWeight: '700',
    fontStyle: 'italic',
    padding: 25,
  },
  loginBtns: {
    justifyContent: 'center',
    width: '80%',
  },
  formHead: {
    fontSize: 30,
    fontWeight: '700',
    color: 'white',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // padding: 5,
  },
  inputContainer: {
    width: '80%',
    justifyContent: 'center',
    fontSize: 17,
    height: 50,
  },
  searchInput: {
    fontSize: 18,
    color: 'white',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: 'white',
  },
  passIcon: {
    position: 'absolute',
    right: 5,
    marginTop: -25,
    height: 25,
    width: 35,
  },
  passImg: {
    height: 20,
    width: 30,
  },
});
