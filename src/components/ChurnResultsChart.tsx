import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, TooltipProps } from 'recharts';
import { formatCurrency } from '@/utils/roiCalculator';

interface ChurnResultsChartProps {
  currentLost: number;
  potentialSaved: number;
  stillLost: number;
}

const ChurnResultsChart = ({ currentLost, potentialSaved, stillLost }: ChurnResultsChartProps) => {
  const data = [
    {
      name: 'Current Churn Loss',
      value: currentLost,
      fill: '#ef4444' // Red
    },
    {
      name: 'After Optimization',
      value: stillLost,
      fill: '#f97316' // Orange
    }
  ];

  const savingsData = [
    { name: 'Potential Savings', value: potentialSaved, fill: '#5BC77E' } // Green updated to #5BC77E
  ];

  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-md">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-sm text-gray-800">{formatCurrency(payload[0].value as number)}/month</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
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
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-xs">Current Loss</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-xs">Optimized Loss</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-xs">Retained Revenue</span>
        </div>
      </div>
    </div>
  );
};

export default ChurnResultsChart;
