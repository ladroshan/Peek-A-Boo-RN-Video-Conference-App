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
    alert(`Someother device is currently using Guest Login.
Please Login/SignUp directly to proceed further.`);
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
        alert('Enter A Valid Login Name');
      } else if (this.state.login.password.length < 8) {
        alert('Enter A Valid Password');
      } else {
        alert('Enter A Valid Login Name and Password');
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
        alert(
          `Error.\n\n${
            // JSON.parse(JSON.stringify(err)).code == '401'
            //   ? 'Invalid User Name or Password.'
            //   : JSON.parse(JSON.stringify(err)).info.errors[0]
            'Invalid User Name or Password.'
          }`,
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
        alert(`Please enter A Valid Details for Registration
Full Name: Min 4 Characters
Login Name: Mail Address
(Ex: abc@def.xyz)
Password: Min 8 Characters`);
      } else if (!this.validLoginName(this.state.register.loginName)) {
        alert(`Enter A Valid Login Name
(Ex: abc@def.xyz)`);
      } else if (this.state.register.fullName.length < 4) {
        alert('Enter A Valid Full Name. Min 4 characters');
      } else if (this.state.register.password.length < 8) {
        alert('Enter A Valid Password. Min 8 characters');
      } else {
        alert(`Please enter A Valid Details for Registration
Full Name: Min 4 Characters
Login Name: Mail Address
(Ex: abc@def.xyz)
Password: Min 8 Characters`);
      }
    } else {
      alert(
        this.state.register.fullName +
          ' -- ' +
          this.state.register.loginName +
          ' -- ' +
          this.state.register.password +
          ' -- ' +
          this.state.register.confirmPassword,
      );
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
            {isLogging && <ActivityIndicator size="small" color="#1198d4" />}
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
                  placeholderTextColor="grey"
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
                  placeholderTextColor="grey"
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
                  <View style={[styles.authBtn('#f35a15')]}>
                    <Text style={styles.authBtnText}>{'Login'}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({view: 'buttons'})}>
                  <View style={[styles.authBtn('#177987')]}>
                    <Text style={styles.authBtnText}>{'Go Back'}</Text>
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
                  placeholderTextColor="grey"
                  maxLength={255}
                />
              </View>
              <View style={[styles.inputContainer]}>
                <TextInput
                  style={[styles.searchInput]}
                  autoCapitalize="none"
                  placeholder="Login name(Email Address)"
                  returnKeyType="search"
                  onChangeText={keyword =>
                    this.setState({
                      register: {...this.state.register, loginName: keyword},
                    })
                  }
                  placeholderTextColor="grey"
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
                  placeholderTextColor="grey"
                  maxLength={255}
                />
                <TouchableOpacity
                  style={[styles.passIcon]}
                  onPress={() => this.passViewLogin()}>
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
                  placeholderTextColor="grey"
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
                      styles.authBtn('#f35a15'),
                      styles.centeredChildren,
                    ]}>
                    <Text style={styles.authBtnText}>{'Signup'}</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({view: 'buttons'})}>
                  <View
                    style={[
                      styles.authBtn('#177987'),
                      styles.centeredChildren,
                    ]}>
                    <Text style={styles.authBtnText}>{'Go Back'}</Text>
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
    backgroundColor: 'white',
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
    color: 'black',
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
    color: 'black',
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
    color: 'black',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: 'grey',
  },
  passIcon: {
    position: 'absolute',
    right: 10,
    marginTop: -25,
    height: 20,
    width: 30,
  },
  passImg: {
    height: 25,
    width: 35,
  },
});
