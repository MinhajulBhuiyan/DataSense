/**
 * Chart Analyzer - Intelligently suggests chart types based on data structure
 */

export interface ChartSuggestion {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'horizontalBar' | 'stackedBar';
  label: string;
  confidence: number;
  reason: string;
}

export interface ColumnAnalysis {
  name: string;
  type: 'numeric' | 'categorical' | 'temporal' | 'boolean';
  uniqueValues: number;
  hasNulls: boolean;
  sampleValues: any[];
}

/**
 * Detect column data type
 */
function detectColumnType(values: any[]): 'numeric' | 'categorical' | 'temporal' | 'boolean' {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');
  
  if (nonNullValues.length === 0) return 'categorical';

  // Check if boolean
  const uniqueVals = [...new Set(nonNullValues.map(v => String(v).toLowerCase()))];
  if (uniqueVals.length <= 2 && uniqueVals.every(v => ['true', 'false', '0', '1', 'yes', 'no'].includes(v))) {
    return 'boolean';
  }

  // Check if numeric
  const numericCount = nonNullValues.filter(v => !isNaN(Number(v))).length;
  if (numericCount / nonNullValues.length > 0.8) {
    return 'numeric';
  }

  // Check if temporal (date/time)
  const dateCount = nonNullValues.filter(v => {
    const dateVal = new Date(v);
    return dateVal.toString() !== 'Invalid Date';
  }).length;
  if (dateCount / nonNullValues.length > 0.8) {
    return 'temporal';
  }

  return 'categorical';
}

/**
 * Analyze all columns in the dataset
 */
export function analyzeColumns(data: any[], columns: string[]): ColumnAnalysis[] {
  return columns.map(col => {
    const values = data.map(row => row[col]);
    const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined)).size;
    
    return {
      name: col,
      type: detectColumnType(values),
      uniqueValues,
      hasNulls: values.some(v => v === null || v === undefined),
      sampleValues: values.slice(0, 5)
    };
  });
}

/**
 * Suggest chart types based on data analysis
 */
export function suggestCharts(data: any[], columns: string[]): ChartSuggestion[] {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return [];
  }

  const analysis = analyzeColumns(data, columns);
  const suggestions: ChartSuggestion[] = [];

  const numericCols = analysis.filter(c => c.type === 'numeric');
  const categoricalCols = analysis.filter(c => c.type === 'categorical');
  const temporalCols = analysis.filter(c => c.type === 'temporal');

  // Bar Chart - Great for categorical + numeric
  if (categoricalCols.length >= 1 && numericCols.length >= 1) {
    suggestions.push({
      type: 'bar',
      label: 'Bar Chart',
      confidence: 0.9,
      reason: 'Perfect for comparing categories'
    });

    // Horizontal bar if many categories
    if (categoricalCols[0].uniqueValues > 5) {
      suggestions.push({
        type: 'horizontalBar',
        label: 'Horizontal Bar',
        confidence: 0.85,
        reason: 'Better readability for many categories'
      });
    }
  }

  // Pie Chart - Good for categorical with few categories
  if (categoricalCols.length >= 1 && numericCols.length >= 1) {
    const mainCategory = categoricalCols[0];
    if (mainCategory.uniqueValues <= 8 && mainCategory.uniqueValues >= 2) {
      suggestions.push({
        type: 'pie',
        label: 'Pie Chart',
        confidence: 0.8,
        reason: 'Shows proportional distribution'
      });
    }
  }

  // Line Chart - Perfect for temporal data
  if (temporalCols.length >= 1 && numericCols.length >= 1) {
    suggestions.push({
      type: 'line',
      label: 'Line Chart',
      confidence: 0.95,
      reason: 'Ideal for showing trends over time'
    });
  }

  // Area Chart - Good for temporal data showing volume
  if (temporalCols.length >= 1 && numericCols.length >= 1) {
    suggestions.push({
      type: 'area',
      label: 'Area Chart',
      confidence: 0.85,
      reason: 'Emphasizes volume changes over time'
    });
  }

  // Scatter Plot - For two numeric columns
  if (numericCols.length >= 2) {
    suggestions.push({
      type: 'scatter',
      label: 'Scatter Plot',
      confidence: 0.8,
      reason: 'Shows relationship between variables'
    });
  }

  // Stacked Bar - Multiple numeric columns with categories
  if (categoricalCols.length >= 1 && numericCols.length >= 2) {
    suggestions.push({
      type: 'stackedBar',
      label: 'Stacked Bar',
      confidence: 0.75,
      reason: 'Compare multiple metrics across categories'
    });
  }

  // If no specific suggestions, default to bar chart
  if (suggestions.length === 0 && columns.length >= 2) {
    suggestions.push({
      type: 'bar',
      label: 'Bar Chart',
      confidence: 0.6,
      reason: 'General purpose visualization'
    });
  }

  // Sort by confidence
  return suggestions.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Prepare data for charting based on chart type
 */
export function prepareChartData(
  data: any[],
  columns: string[],
  chartType: string
): { chartData: any[]; config: any } {
  const analysis = analyzeColumns(data, columns);
  const categoricalCol = analysis.find(c => c.type === 'categorical');
  const numericCols = analysis.filter(c => c.type === 'numeric');
  const temporalCol = analysis.find(c => c.type === 'temporal');

  let config: any = {
    xKey: '',
    yKeys: [],
    categoryKey: ''
  };

  // Determine x-axis (category or temporal)
  const xAxisCol = temporalCol || categoricalCol || analysis[0];
  config.xKey = xAxisCol.name;
  config.categoryKey = xAxisCol.name;

  // Determine y-axis (numeric columns)
  config.yKeys = numericCols.length > 0 
    ? numericCols.map(c => c.name)
    : columns.filter(c => c !== config.xKey);

  // Transform data
  const chartData = data.map(row => {
    const transformed: any = {};
    transformed[config.xKey] = row[config.xKey];
    
    config.yKeys.forEach((key: string) => {
      const value = row[key];
      transformed[key] = value !== null && value !== undefined ? Number(value) || 0 : 0;
    });
    
    return transformed;
  });

  return { chartData, config };
}
