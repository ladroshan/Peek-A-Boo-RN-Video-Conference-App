/* eslint-disable eqeqeq */
/* eslint-disable no-alert */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {CallService} from '../../services';

const SIZE_SCREEN = Dimensions.get('window');

export default ({
  isActiveSelect,
  opponentsIds,
  selectedUsersIds,
  currentUserLoginId,
  currentUserFullName,
  selectUser,
  unselectUser,
}) => {
  if (!isActiveSelect) {
    return null;
  }

  const [contactsList, setContactsList] = useState([]);
  const [contactLoading, setContactLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const colors = [
    '#177987',
    '#a5e900',
    '#5eba7d',
    '#3aad85',
    '#00a587',
    '#ff4e8f',
    '#ff005e',
    '#00abfe',
    '#53aaf0',
    '#860000',
    '#fd5a15',
    '#b400fe',
    '#ff7600',
    '#ffe000',
  ];

  const randomColor = () => {
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const checkValidLoginName = () => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(searchValue).toLowerCase());
  };

  const inTheArray = user => {
    if (!contactsList[0]) {
      return false;
    } else {
      const dupUsers = contactsList[0].filter(ele => ele.login === user);
      if (dupUsers.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  };

  const findContact = async searchedLoginName => {
    if (!checkValidLoginName()) {
      alert('Enter a valid Login Name');
    } else if (inTheArray(searchedLoginName)) {
      alert('This user already exixts in the group.');
    } else {
      console.log(contactsList, 'list');
      console.log(contactsList.length, 'lennn');
      if (contactsList.length >= 3) {
        alert('Only 4 Users are allowed');
      } else {
        setContactLoading(true);
        setContactsList([
          await CallService.getUserByLogin(
            searchedLoginName,
            currentUserLoginId,
          ).catch(err =>
            alert(
              `Error.\n\n${
                JSON.parse(JSON.stringify(err)).code == '401'
                  ? 'Unauthorized. Please Login Again.'
                  : JSON.parse(JSON.stringify(err)).code == '404'
                  ? "Couldn't find the User with login Name:\n" +
                    searchedLoginName
                  : 'Server Error. Pleas login and try again.'
              }`,
            ),
          ),
          ...contactsList,
        ]);
        setSearchValue('');
        setContactLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {currentUserFullName && (
        <Text style={styles.name}>{'Welcome\n' + currentUserFullName}</Text>
      )}
      <Text style={styles.descriptionText}>
        Enter the Login Name of your contact
      </Text>
      <View style={styles.description}>
        <TextInput
          style={styles.searchInput}
          autoCapitalize="none"
          placeholder="Login name"
          returnKeyType="search"
          onChangeText={keyword => setSearchValue(keyword)}
          placeholderTextColor="grey"
          value={searchValue}
          maxLength={255}
        />
        <TouchableOpacity
          style={styles.searchButton(
            checkValidLoginName() ? '#ff7600' : 'grey',
          )}
          onPress={() => findContact(searchValue)}>
          <Text style={styles.searchText}>{'Search'}</Text>
        </TouchableOpacity>
      </View>

      {contactsList[0] && (
        <Text style={styles.title}>Select users to start Videocall</Text>
      )}
      {contactsList[0] ? (
        contactsList.map(ele => {
          // const user = CallService.getUserById(id);
          let user = ele[0];
          const selected = selectedUsersIds.some(userId => user.id === userId);
          const type = selected
            ? 'radio-button-checked'
            : 'radio-button-unchecked';
          user.color = randomColor();
          const onPress = selected ? unselectUser : selectUser;
          return (
            <View>
              <TouchableOpacity
                style={styles.userLabel(
                  user.color ? user.color : randomColor(),
                )}
                onPress={() => onPress(user.id)}>
                <Text style={styles.userName}>
                  {user.full_name.length > 20
                    ? user.full_name.slice(0, 20) + '...'
                    : user.full_name}
                </Text>
                <MaterialIcon name={type} size={20} color="white" />
              </TouchableOpacity>
            </View>
          );
        })
      ) : (
        <View />
      )}
      {contactLoading && (
        <Text size="small" color="white">
          Loading...
        </Text>
      )}
      {contactLoading && <ActivityIndicator size="small" color="white" />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFill,
    // justifyContent: 'center',
    backgroundColor: '#001a15',
    alignItems: 'center',
    marginTop: 25,
  },
  title: {
    fontSize: 20,
    color: '#1198d4',
    padding: 20,
    marginTop: 30,
  },
  name: {
    fontSize: 30,
    fontWeight: '700',
    color: '#009378',
  },
  userLabel: backgroundColor => ({
    backgroundColor,
    width: 300,
    height: 50,
    borderRadius: 25,
    border: '1px solid red',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    paddingLeft: 25,
  }),
  searchButton: backgroundColor => ({
    backgroundColor,
    width: 200,
    height: 50,
    borderRadius: 25,
    border: '1px solid red',
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    marginLeft: 50,
    paddingLeft: 65,
  }),
  searchText: {
    color: 'white',
    fontSize: 20,
  },
  userName: {
    color: 'white',
    fontSize: 20,
  },
  searchInput: {
    fontSize: 18,
    color: 'white',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: '#ff7600',
  },
  description: {
    width: SIZE_SCREEN.width - 110,
  },
  descriptionText: {
    paddingVertical: 5,
    color: '#ff7600',
    fontSize: 15,
    marginTop: 25,
  },
});
