
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';
import { formatCurrency } from '@/utils/roiCalculator';

interface ResultsChartProps {
  currentCost: number;
  reducedCost: number;
  savings: number;
}

const ResultsChart = ({ currentCost, reducedCost, savings }: ResultsChartProps) => {
  const data = [
    {
      name: 'Current',
      value: currentCost,
      fill: '#3b82f6' // Blue
    },
    {
      name: 'After Implementation',
      value: reducedCost,
      fill: '#22c55e' // Green
    }
  ];

  const savingsData = [
    { name: 'Savings', value: savings, fill: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-gray-800">{formatCurrency(payload[0].value as number)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" barSize={60}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="flex justify-center items-center space-x-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xs">Current Cost</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs">Reduced Cost</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-xs">Savings</span>
        </div>
      </div>
    </div>
  );
};

export default ResultsChart;
