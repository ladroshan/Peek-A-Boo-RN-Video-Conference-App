import React from 'react';
import {ActivityIndicator, View, Text, StyleSheet} from 'react-native';

export default ({name}) => (
  <View style={styles.container}>
    <View style={styles.info}>
      <Text style={styles.text}>{name}</Text>
      <ActivityIndicator size="small" color="white" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#001a15',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    fontSize: 25,
    fontStyle: 'italic',
    color: 'white',
    marginRight: 16,
  },
});
