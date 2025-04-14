'use client';
import {
  Chart as ChartJS,
  CategoryScale, // Eje X
  LinearScale, // Eje Y
  BarElement, // Para las barras
  Title, // Título
  Tooltip, // Tooltips al pasar el mouse
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const initialData = [
  { year: 2010, count: 10 },
  { year: 2011, count: 20 },
  { year: 2012, count: 15 },
  { year: 2013, count: 25 },
  { year: 2014, count: 22 },
  { year: 2015, count: 30 },
  { year: 2016, count: 28 },
];

export const options = {
  responsive: true, // Hace que el gráfico se adapte al tamaño del contenedor
  // maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const, // Posición de la leyenda
    },
    title: {
      display: true,
      text: 'Post by years', // Título del gráfico
    },
  },
  scales: {
    // Configuración de los ejes
    y: {
      beginAtZero: true, // Asegura que el eje Y empiece en 0
    },
  },
};

const chartData = {
  labels: initialData.map((row) => row.year), // Etiquetas para el eje X
  datasets: [
    {
      label: 'Post by years', // Etiqueta para este conjunto de datos
      data: initialData.map((row) => row.count), // Los valores numéricos
      backgroundColor: 'rgba(54, 162, 235, 0.6)', // Color de las barras
      borderColor: 'rgba(54, 162, 235, 1)', // Color del borde de las barras
      borderWidth: 1,
    },
    // Puedes añadir más datasets aquí si quieres comparar (ej. otra línea, otras barras)
    // {
    //   label: 'Otro Dataset',
    //   data: [/* otros datos */],
    //   backgroundColor: 'rgba(255, 99, 132, 0.6)',
    // }
  ],
};

const PostGraph = () => {
  return (
    <div
      style={{
        position: 'relative',
        height: '40vh',
        width: '100%',
        margin: 'auto',
      }}
    >
      {' '}
      <Bar
        options={options}
        data={chartData}
      />
    </div>
  );
};

export default PostGraph;
