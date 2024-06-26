import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const InfoCard = ({ label, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
  },
});

export default InfoCard;
