// Grafico.js

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const GraphScreen = ({ route }) => {
  const { token } = route.params;
  const [period, setPeriod] = useState('hoje');
  const [saldoConta, setSaldoConta] = useState(0);
  const [totalReceitas, setTotalReceitas] = useState(0);
  const [totalDespesas, setTotalDespesas] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [dailyExpenses, setDailyExpenses] = useState([]);

  const fetchData = async (periodo) => {
    try {
      const response = await fetch(`http://172.16.4.17:8000/api/Financa/GetMovimentacoesGraficos/1/?periodo=${periodo}`, {
        headers: {
          Authorization: `Token ${token}`
        }
      });
      const data = await response.json();
      setSaldoConta(data.saldo_conta || 0);
      setTotalReceitas(data.total_receitas || 0);
      setTotalDespesas(data.total_despesas || 0);

      // Configuração dos dados para o gráfico de pizza
      const receita = data.movimentacoes_por_tipo?.receita || 0;
      const despesa = data.movimentacoes_por_tipo?.despesa || 0;
      const transferencia = data.movimentacoes_por_tipo?.transferencia || 0;
      const chartData = [
        { name: 'Receita', value: receita, color: '#2ecc71' },
        { name: 'Despesa', value: despesa, color: '#e74c3c' },
        { name: 'Transferência', value: transferencia, color: '#f1c40f' }
      ];
      setChartData(chartData);

      // Configuração dos dados para o gráfico de barras (despesas diárias)
      const dailyExpensesData = Object.keys(data.despesas_diarias).map((date) => ({
        date: new Date(date),
        value: data.despesas_diarias[date]
      }));
      setDailyExpenses(dailyExpensesData);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  useEffect(() => {
    fetchData(period);
  }, [period]);

  const handlePeriodSelect = (selectedPeriod) => {
    setPeriod(selectedPeriod);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <PeriodButtons onSelectPeriod={handlePeriodSelect} />
        <InfoCard label="Saldo Total" value={saldoConta} />
        <InfoCard label="Total de Receitas" value={totalReceitas} />
        <InfoCard label="Total de Despesas" value={totalDespesas} />
        <Text style={styles.chartTitle}>Distribuição por Tipo de Movimentação</Text>
        <PieChart
          data={chartData}
          width={300}
          height={200}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
        <Text style={styles.chartTitle}>Despesas Diárias (Gráfico de Barras)</Text>
        <BarChart
          data={{
            labels: dailyExpenses.map(entry => entry.date.toLocaleDateString()),
            datasets: [{
              data: dailyExpenses.map(entry => entry.value),
              color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
              strokeWidth: 2
            }]
          }}
          width={Dimensions.get('window').width - 20}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(231, 76, 60, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForVerticalLabels: {
              fontSize: 10
            }
          }}
          verticalLabelRotation={30}
        />
      </View>
    </ScrollView>
  );
};

const PeriodButtons = ({ onSelectPeriod }) => {
  const periods = [
    { label: 'Hoje', value: 'hoje' },
    { label: 'Última Semana', value: 'ultima_semana' },
    { label: 'Último Mês', value: 'ultimo_mes' },
    { label: 'Semestre', value: 'semestre' },
    { label: 'Ano', value: 'ano' },
  ];

  return (
    <View style={styles.buttonsContainer}>
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

const InfoCard = ({ label, value }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value.toFixed(2)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
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
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
});

export default GraphScreen;













// import React from 'react';
// import { ScrollView, View, Text, Dimensions, StyleSheet } from 'react-native';
// import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';

// const screenWidth = Dimensions.get('window').width;

// const barData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     {
//       data: [20, 45, 28, 80, 99, 43],
//     },
//   ],
// };

// const lineData = {
//   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//   datasets: [
//     {
//       data: [20, 45, 28, 80, 99, 43],
//       strokeWidth: 2, // optional
//     },
//   ],
// };

// const pieData = [
//   {
//     name: 'Receita',
//     population: 50000,
//     color: '#4CAF50',
//     legendFontColor: '#0000FF',
//     legendFontSize: 15,
//   },
//   {
//     name: 'Despesa',
//     population: 30000,
//     color: '#FF9800',
//     legendFontColor: '#0000FF',
//     legendFontSize: 15,
//   },
//   {
//     name: 'Transferência',
//     population: 20000,
//     color: '#F44336',
//     legendFontColor: '#0000FF',
//     legendFontSize: 15,
//   },
// ];

// const chartConfig = {
//   backgroundGradientFrom: '#FFFFFF',
//   backgroundGradientFromOpacity: 0,
//   backgroundGradientTo: '#FFFFFF',
//   backgroundGradientToOpacity: 0.5,
//   color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//   labelColor: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//   strokeWidth: 2, // optional, default 3
//   barPercentage: 0.5,
//   useShadowColorFromDataset: false, // optional
//   decimalPlaces: 2,
// };

// const generateRandomColors = (length) => {
//   const colors = [];
//   for (let i = 0; i < length; i++) {
//     const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
//     colors.push(color);
//   }
//   return colors;
// };

// const Grafico = () => {
//   const barChartColors = generateRandomColors(barData.datasets[0].data.length);
//   barData.datasets[0].backgroundColor = barChartColors;

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>Gráfico de Barras</Text>
//       <BarChart
//         style={styles.chart}
//         data={barData}
//         width={screenWidth}
//         height={220}
//         yAxisLabel="$"
//         chartConfig={chartConfig}
//         verticalLabelRotation={30}
//       />
//       <Text style={styles.header}>Gráfico de Linha</Text>
//       <LineChart
//         style={styles.chart}
//         data={lineData}
//         width={screenWidth}
//         height={220}
//         yAxisLabel="$"
//         chartConfig={{
//           ...chartConfig,
//           color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`, // Blue lines
//         }}
//       />
//       <Text style={styles.header}>Gráfico de Pizza</Text>
//       <PieChart
//         style={styles.chart}
//         data={pieData}
//         width={screenWidth}
//         height={220}
//         chartConfig={chartConfig}
//         accessor="population"
//         backgroundColor="transparent"
//         paddingLeft="15"
//         absolute
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   header: {
//     fontSize: 20,
//     textAlign: 'center',
//     marginVertical: 10,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
// });

// export default Grafico;
