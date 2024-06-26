import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const PeriodButtons = ({ onSelectPeriod }) => {
  const periods = [
    { label: 'Hoje', value: 'hoje' },
    { label: 'Última Semana', value: 'ultima_semana' },
    { label: 'Último Mês', value: 'ultimo_mes' },
    { label: 'Semestre', value: 'semestre' },
    { label: 'Ano', value: 'ano' },
  ];

  return (
    <View style={styles.container}>
      {periods.map((period) => (
        <TouchableOpacity
          key={period.value}
          style={styles.button}
          onPress={() => onSelectPeriod(period.value)}
        >
          <Text style={styles.buttonText}>{period.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PeriodButtons;
