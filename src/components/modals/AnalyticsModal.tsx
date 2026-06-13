import React from 'react';
import { Modal } from '../ui/Modal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const unitTypeData = [
  { name: '1 BR', value: 120 },
  { name: '2 BR', value: 200 },
  { name: '3 BR', value: 100 },
  { name: 'Penthouse', value: 30 },
];
const COLORS = ['#1E3A8A', '#06b6d4', '#f59e0b', '#8b5cf6'];

const investmentScoreData = [
  { subject: 'Location', A: 90, fullMark: 100 },
  { subject: 'Price', A: 85, fullMark: 100 },
  { subject: 'Amenities', A: 95, fullMark: 100 },
  { subject: 'Design', A: 88, fullMark: 100 },
  { subject: 'ROI', A: 85, fullMark: 100 },
];

const blockSalesData = [
  { name: 'Block A', Sold: 80, Available: 120 },
  { name: 'Block B', Sold: 150, Available: 100 },
];

export const AnalyticsModal: React.FC = () => {
  return (
    <Modal title="Project Analytics" maxWidth="max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Unit Distribution</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={unitTypeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {unitTypeData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-3 mt-2 flex-wrap">
            {unitTypeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-xs text-gray-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800">
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Investment Score</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={investmentScoreData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Fenica" dataKey="A" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-5 rounded-xl border border-gray-800 md:col-span-2">
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Sales Progress</h4>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={blockSalesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{fontSize: 12}} />
                <YAxis stroke="#64748b" tick={{fontSize: 12}} />
                <RechartsTooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: '8px' }} cursor={{ fill: '#1e293b' }} />
                <Bar dataKey="Sold" stackId="a" fill="#1E3A8A" radius={[0, 0, 4, 4]} />
                <Bar dataKey="Available" stackId="a" fill="#334155" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Modal>
  );
};
