import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Home({ route }) {
  const { token } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Page</Text>
      <Text style={styles.token}>Token: {token}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  token: {
    fontSize: 16,
    color: 'gray',
  },
});
