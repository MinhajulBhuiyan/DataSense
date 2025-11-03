import React, { useState, useRef } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, Cell
} from 'recharts';
import { suggestCharts, prepareChartData, ChartSuggestion } from '@/utils/chartAnalyzer';
import { Message as MessageType } from '@/types';

interface DataVisualizationProps {
  message: MessageType;
}

// Professional color palette
const COLORS = [
  '#08834d', // DataSense green
  '#0ea5e9', // Sky blue
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#f97316', // Orange
];

export function DataVisualization({ message }: DataVisualizationProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const { results, columns } = message;

  if (!results || !columns || results.length === 0) {
    return null;
  }

  const suggestions = suggestCharts(results, columns);

  if (suggestions.length === 0) {
    return null;
  }

  const handleGenerateClick = () => {
    setShowModal(true);
    if (!selectedChart && suggestions.length > 0) {
      setSelectedChart(suggestions[0].type);
    }
  };

  const handleDownload = () => {
    if (!chartRef.current) return;

    // Use html2canvas or similar library for download
    // For now, we'll use a simple screenshot approach
    const svgElement = chartRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `chart-${Date.now()}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const renderChart = (chartType: string) => {
    const { chartData, config } = prepareChartData(results, columns, chartType);
    
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 60 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={config.xKey} 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {config.yKeys.map((key: string, index: number) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={COLORS[index % COLORS.length]}
                radius={[8, 8, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'horizontalBar':
        return (
          <BarChart {...commonProps} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
            <YAxis 
              type="category" 
              dataKey={config.xKey}
              width={120}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend />
            {config.yKeys.map((key: string, index: number) => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={COLORS[index % COLORS.length]}
                radius={[0, 8, 8, 0]}
              />
            ))}
          </BarChart>
        );

      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={config.xKey}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {config.yKeys.map((key: string, index: number) => (
              <Line 
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={{ fill: COLORS[index % COLORS.length], r: 5 }}
                activeDot={{ r: 7 }}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={config.xKey}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {config.yKeys.map((key: string, index: number) => (
              <Area 
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        const pieData = chartData.map((item: any) => ({
          name: item[config.xKey],
          value: item[config.yKeys[0]]
        }));

        return (
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(1)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
          </PieChart>
        );

      case 'scatter':
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              dataKey={config.yKeys[0]}
              name={config.yKeys[0]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis 
              type="number" 
              dataKey={config.yKeys[1] || config.yKeys[0]}
              name={config.yKeys[1] || config.yKeys[0]}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Scatter 
              name="Data Points" 
              data={chartData} 
              fill={COLORS[0]}
            />
          </ScatterChart>
        );

      case 'stackedBar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey={config.xKey}
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fill: '#6b7280', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            {config.yKeys.map((key: string, index: number) => (
              <Bar 
                key={key}
                dataKey={key}
                stackId="a"
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </BarChart>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <>
      {/* Generate Infographics Button */}
      <button
        onClick={handleGenerateClick}
        className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors border shadow-sm text-white hover:shadow-md"
        style={{ backgroundColor: '#08834d', borderColor: '#08834d' }}
        title="Generate infographics from data"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
  <span className="text-sm font-medium">Visualize</span>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full h-[95vh] flex flex-col" style={{ maxWidth: '1600px' }}>
            {/* Header - Compact */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Data Visualization</h2>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content - No Scroll */}
            <div className="flex-1 flex flex-col p-6 min-h-0">
              {/* Chart Type Selector - Compact Single Row */}
              <div className="mb-4 flex-shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {suggestions.map((suggestion) => {
                    const IconComponent = getChartIcon(suggestion.type);
                    return (
                      <button
                        key={suggestion.type}
                        onClick={() => setSelectedChart(suggestion.type)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all ${
                          selectedChart === suggestion.type
                            ? 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        }`}
                      >
                        <IconComponent 
                          className={`w-4 h-4 ${
                            selectedChart === suggestion.type
                              ? 'text-gray-600 dark:text-gray-300'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}
                        />
                        <span className={`text-sm ${
                          selectedChart === suggestion.type
                            ? 'text-gray-700 dark:text-gray-300 font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {suggestion.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Chart Display - Takes Remaining Space */}
              {selectedChart && (
                <div className="flex-1 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 p-6 min-h-0" ref={chartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart(selectedChart)}
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Footer - Compact */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/30 flex-shrink-0">
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {results.length} rows • {columns.length} columns
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-700"
                >
                  Close
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-lg transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 flex items-center gap-1.5 border border-gray-200 dark:border-gray-700"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Helper function to get chart icon component
function getChartIcon(type: string) {
  const icons: Record<string, React.FC<{ className?: string }>> = {
    bar: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    horizontalBar: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    line: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4" />
      </svg>
    ),
    area: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    pie: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    scatter: (props) => (
      <svg {...props} fill="currentColor" viewBox="0 0 24 24">
        <circle cx="6" cy="12" r="2" />
        <circle cx="12" cy="8" r="2" />
        <circle cx="16" cy="16" r="2" />
        <circle cx="18" cy="6" r="2" />
      </svg>
    ),
    stackedBar: (props) => (
      <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l3-3 3 3v13m-3-7h.01M15 13h.01M9 17h6" />
      </svg>
    )
  };
  
  return icons[type] || icons.bar;
}
