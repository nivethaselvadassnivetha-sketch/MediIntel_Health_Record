import React, { useState, useMemo } from 'react';
import { TimelineEvent, Patient } from '../../types/healthcare';
import { PatientGraphData } from '../../services/api';
import {
  Calendar,
  TrendingDown,
  Activity,
  Heart,
  Pill,
  FileText,
  Hospital,
  ChevronRight,
  Filter,
  BarChart3,
  LineChart as LineChartIcon,
  CheckCircle2,
  AlertCircle,
  CalendarDays,
  Clock,
  Sparkles
} from 'lucide-react';

interface PatientGraphicalHistoryProps {
  patient: Patient;
  timelineEvents: TimelineEvent[];
  graphData: PatientGraphData | null;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const PatientGraphicalHistory: React.FC<PatientGraphicalHistoryProps> = ({
  patient,
  timelineEvents,
  graphData
}) => {
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeMetricTab, setActiveMetricTab] = useState<'HBA1C' | 'BP' | 'GLUCOSE' | 'VISITS'>('HBA1C');

  // Available years derived from events
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    timelineEvents.forEach((e) => {
      if (e.year) years.add(e.year);
    });
    // Ensure 2024, 2025, 2026 are represented
    [2024, 2025, 2026].forEach((y) => years.add(y));
    return Array.from(years).sort((a, b) => b - a);
  }, [timelineEvents]);

  // Filtered timeline events
  const filteredEvents = useMemo(() => {
    return timelineEvents.filter((evt) => {
      if (selectedYear !== 'ALL' && String(evt.year) !== selectedYear) return false;
      if (selectedMonth !== 'ALL' && evt.month !== selectedMonth) return false;
      if (activeCategory !== 'ALL' && evt.category !== activeCategory) return false;
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [timelineEvents, selectedYear, selectedMonth, activeCategory]);

  // Compute month-wise distribution for current selected year (or all years)
  const monthlyActivityData = useMemo(() => {
    const counts = MONTH_NAMES.map((month) => {
      const monthEvents = timelineEvents.filter((e) => {
        const matchesMonth = e.month?.startsWith(month);
        const matchesYear = selectedYear === 'ALL' || String(e.year) === selectedYear;
        return matchesMonth && matchesYear;
      });
      return {
        month,
        count: monthEvents.length,
        events: monthEvents
      };
    });

    const maxCount = Math.max(...counts.map((c) => c.count), 1);
    return { counts, maxCount };
  }, [timelineEvents, selectedYear]);

  // Multi-year comparison summary
  const yearlySummary = useMemo(() => {
    return availableYears.map((year) => {
      const yrEvents = timelineEvents.filter((e) => e.year === year);
      const labsCount = yrEvents.filter((e) => e.category === 'Lab Result').length;
      const rxCount = yrEvents.filter((e) => e.category === 'Medication Update' || e.category === 'Prescription').length;
      const consultCount = yrEvents.filter((e) => e.category === 'Consultation' || e.category === 'Hospital Visit').length;

      return {
        year,
        total: yrEvents.length,
        labsCount,
        rxCount,
        consultCount
      };
    });
  }, [availableYears, timelineEvents]);

  // Biometric longitudinal progression series (HbA1c)
  const hba1cPoints = [
    { date: 'Mar 2024', val: 8.4, status: 'Elevated', note: 'Initial Type 2 Diagnosis. Commenced Metformin 250 mg BD' },
    { date: 'Jun 2024', val: 8.1, status: 'Elevated', note: 'Followup review. Diet adjustments' },
    { date: 'Nov 2024', val: 7.7, status: 'Borderline', note: 'Moderate improvement noted' },
    { date: 'Apr 2025', val: 7.5, status: 'Borderline', note: 'Slight fasting spike' },
    { date: 'Aug 2025', val: 7.3, status: 'Improving', note: 'Metformin titrated up to 500 mg BD' },
    { date: 'Dec 2025', val: 7.0, status: 'Near Goal', note: 'Consistent glycemic compliance' },
    { date: 'Mar 2026', val: 6.8, status: 'Goal Achieved', note: 'HbA1c &lt; 7.0% target reached' }
  ];

  // Blood pressure longitudinal progression series
  const bpPoints = [
    { date: 'Mar 2024', sys: 138, dia: 88, status: 'Stage 1 HTN' },
    { date: 'Jun 2024', sys: 134, dia: 86, status: 'Prehypertension' },
    { date: 'Nov 2024', sys: 130, dia: 84, status: 'Borderline' },
    { date: 'Aug 2025', sys: 126, dia: 82, status: 'Improving' },
    { date: 'Mar 2026', sys: 122, dia: 78, status: 'Normal' }
  ];

  // Glucose fasting progression series
  const glucosePoints = [
    { date: 'Mar 2024', fasting: 162, pp: 218 },
    { date: 'Jun 2024', fasting: 148, pp: 194 },
    { date: 'Nov 2024', fasting: 136, pp: 178 },
    { date: 'Aug 2025', fasting: 124, pp: 156 },
    { date: 'Mar 2026', fasting: 114, pp: 138 }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with Year Selector Pills & Quick Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-2 rounded-xl bg-teal-50 text-teal-700">
                <BarChart3 className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Longitudinal Health History Analytics
                </h3>
                <p className="text-xs text-slate-500">
                  Month-wise and year-wise graphical progression of clinical encounters, lab vitals, and treatments.
                </p>
              </div>
            </div>
          </div>

          {/* Year Filter Switcher */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-2xl self-start md:self-auto">
            <button
              onClick={() => { setSelectedYear('ALL'); setSelectedMonth('ALL'); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedYear === 'ALL'
                  ? 'bg-white text-teal-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Years (2024–2026)
            </button>
            {availableYears.map((yr) => (
              <button
                key={yr}
                onClick={() => { setSelectedYear(String(yr)); setSelectedMonth('ALL'); }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedYear === String(yr)
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* 3 Metric Cards for Selected Period with Medical Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 text-white flex items-center justify-center shrink-0 shadow-xs">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider block">
                Logged Encounters
              </span>
              <div className="text-2xl font-mono font-bold text-teal-950">
                {filteredEvents.length}
              </div>
              <span className="text-[11px] text-teal-700">
                {selectedYear === 'ALL' ? 'Across all recorded years' : `In calendar year ${selectedYear}`}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                HbA1c Reduction
              </span>
              <div className="text-2xl font-mono font-bold text-emerald-950">
                8.4% → 6.8%
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">
                -1.6% (Target goal achieved)
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block">
                Blood Pressure Control
              </span>
              <div className="text-2xl font-mono font-bold text-blue-950">
                122/78 mmHg
              </div>
              <span className="text-[11px] text-blue-700">
                Improved from baseline 138/88
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: MONTH-WISE INTERACTIVE BAR ACTIVITY CHART */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Calendar className="w-4 h-4 mr-1.5 text-teal-600" />
              Month-Wise Clinical Activity Distribution ({selectedYear === 'ALL' ? 'Cumulative Across All Years' : `Year ${selectedYear}`})
            </h4>
            <p className="text-xs text-slate-500">
              Click any month bar below to filter down to that specific month's clinical records.
            </p>
          </div>

          {selectedMonth !== 'ALL' && (
            <button
              onClick={() => setSelectedMonth('ALL')}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors self-start sm:self-auto"
            >
              Reset to All Months
            </button>
          )}
        </div>

        {/* 12 Months Graphical Bar Graph */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-12 gap-1.5 sm:gap-2 h-44 items-end px-2">
            {monthlyActivityData.counts.map((item) => {
              const heightPercent = item.count > 0 ? Math.max((item.count / monthlyActivityData.maxCount) * 100, 18) : 6;
              const isSelected = selectedMonth.startsWith(item.month);

              return (
                <div
                  key={item.month}
                  onClick={() => setSelectedMonth(isSelected ? 'ALL' : item.month)}
                  className="group flex flex-col items-center cursor-pointer h-full justify-end"
                  title={`${item.month}: ${item.count} recorded events`}
                >
                  {/* Badge count above bar on hover or selected */}
                  <span className={`text-[10px] font-mono font-bold mb-1 transition-opacity ${
                    item.count > 0 ? 'text-slate-700' : 'text-slate-300'
                  } ${isSelected ? 'text-teal-700 scale-110' : ''}`}>
                    {item.count > 0 ? item.count : '0'}
                  </span>

                  {/* Vertical bar */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[28px] rounded-t-lg transition-all duration-300 ${
                      isSelected
                        ? 'bg-teal-700 ring-2 ring-teal-400 shadow-md'
                        : item.count > 0
                        ? 'bg-teal-500 hover:bg-teal-600 group-hover:scale-y-105'
                        : 'bg-slate-100 group-hover:bg-slate-200'
                    }`}
                  />

                  {/* Month Label */}
                  <span className={`mt-2 text-[11px] font-semibold transition-colors ${
                    isSelected
                      ? 'text-teal-900 font-bold'
                      : 'text-slate-500 group-hover:text-slate-900'
                  }`}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Monthly Activity Active Indicator */}
        {selectedMonth !== 'ALL' && (
          <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between text-xs text-teal-900">
            <span>
              Currently viewing only records from <strong>{selectedMonth} {selectedYear !== 'ALL' ? selectedYear : ''}</strong>
            </span>
            <button
              onClick={() => setSelectedMonth('ALL')}
              className="font-bold underline hover:text-teal-700"
            >
              Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* SECTION 2: BIOMETRIC PROGRESSION & CLINICAL TREND GRAPHS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Activity className="w-4 h-4 mr-1.5 text-teal-600" />
              Longitudinal Biometric & Clinical Trends
            </h4>
            <p className="text-xs text-slate-500">
              Track chronic disease indicators across monthly clinical lab followups.
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto text-xs font-semibold">
            <button
              onClick={() => setActiveMetricTab('HBA1C')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetricTab === 'HBA1C' ? 'bg-white text-teal-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HbA1c Trend
            </button>
            <button
              onClick={() => setActiveMetricTab('BP')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetricTab === 'BP' ? 'bg-white text-teal-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setActiveMetricTab('GLUCOSE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeMetricTab === 'GLUCOSE' ? 'bg-white text-teal-900 shadow-2xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fasting Blood Sugar
            </button>
          </div>
        </div>

        {/* Metric 1: HbA1c Progression Visual */}
        {activeMetricTab === 'HBA1C' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-teal-600 mr-1.5" />
                  Target (&lt; 7.0%)
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-1.5" />
                  Elevated (7.0 - 8.0%)
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-rose-500 mr-1.5" />
                  High Risk (&gt; 8.0%)
                </span>
              </div>
              <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                -1.6% Overall Reduction
              </span>
            </div>

            {/* SVG Visual Line & Area Graph for HbA1c */}
            <div className="relative bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="h-44 w-full flex items-end justify-between px-4 pb-6 pt-2">
                {hba1cPoints.map((pt, idx) => {
                  // Normalize 6.0% to 9.0% range
                  const percent = Math.min(Math.max(((pt.val - 6.0) / 3.0) * 100, 10), 95);
                  const isGoal = pt.val <= 7.0;

                  return (
                    <div key={pt.date} className="flex flex-col items-center flex-1">
                      {/* Value Bubble */}
                      <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md mb-2 shadow-2xs ${
                        isGoal ? 'bg-emerald-600 text-white' : pt.val > 8.0 ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {pt.val}%
                      </span>

                      {/* Bar / Node line */}
                      <div className="w-full flex justify-center h-28 items-end">
                        <div
                          style={{ height: `${percent}%` }}
                          className={`w-3.5 rounded-t-lg transition-all duration-500 ${
                            isGoal ? 'bg-emerald-500 hover:bg-emerald-600' : pt.val > 8.0 ? 'bg-rose-500 hover:bg-rose-600' : 'bg-amber-500 hover:bg-amber-600'
                          }`}
                        />
                      </div>

                      {/* Date label */}
                      <span className="text-[10px] font-medium text-slate-500 mt-2 text-center">
                        {pt.date}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Target Line Annotation */}
              <div className="border-t-2 border-dashed border-emerald-500/60 w-full absolute top-[52%] left-0 right-0 pointer-events-none">
                <span className="absolute right-4 -top-3 text-[10px] font-bold text-emerald-700 bg-white px-1.5 py-0.5 rounded border border-emerald-300">
                  Target Threshold: 7.0%
                </span>
              </div>
            </div>

            {/* Treatment Milestones along the timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-mono text-slate-400 text-[10px]">Phase 1 • Mar 2024</span>
                <strong className="text-slate-900 block">Baseline 8.4%</strong>
                <p className="text-slate-600 text-[11px]">Type 2 Diabetes diagnosis at Indiranagar Clinic. Metformin 250 mg commenced.</p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-mono text-slate-400 text-[10px]">Phase 2 • Aug 2025</span>
                <strong className="text-amber-700 block">Titration 7.3%</strong>
                <p className="text-slate-600 text-[11px]">Dr. Sarah Mathew titrated dosage to Metformin 500 mg twice daily.</p>
              </div>
              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-mono text-emerald-700 text-[10px]">Phase 3 • Mar 2026</span>
                <strong className="text-emerald-900 block">Optimal Goal 6.8%</strong>
                <p className="text-emerald-950 text-[11px]">Glycated hemoglobin within optimal management range. Maintain current therapy.</p>
              </div>
            </div>
          </div>
        )}

        {/* Metric 2: Blood Pressure Progression Visual */}
        {activeMetricTab === 'BP' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Systolic & Diastolic Progression (mmHg)</span>
                <span className="text-emerald-700 font-bold">Latest: 122/78 mmHg (Normal)</span>
              </div>

              <div className="space-y-3">
                {bpPoints.map((bp) => (
                  <div key={bp.date} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{bp.date}</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-sm text-slate-900">{bp.sys}/{bp.dia} mmHg</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          bp.status === 'Normal' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {bp.status}
                        </span>
                      </div>
                    </div>
                    {/* Visual bar pair */}
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden flex">
                      <div style={{ width: `${(bp.sys / 160) * 100}%` }} className="bg-teal-600 h-full" title={`Systolic: ${bp.sys}`} />
                      <div style={{ width: `${(bp.dia / 160) * 100}%` }} className="bg-cyan-400 h-full" title={`Diastolic: ${bp.dia}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Metric 3: Fasting Glucose Progression Visual */}
        {activeMetricTab === 'GLUCOSE' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Fasting vs Post-Prandial Blood Sugar (mg/dL)</span>
                <span className="text-emerald-700 font-bold">Latest Fasting: 114 mg/dL</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {glucosePoints.map((g) => (
                  <div key={g.date} className="p-3 bg-white rounded-xl border border-slate-200 text-center space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{g.date}</span>
                    <div className="text-xl font-mono font-bold text-slate-900">{g.fasting}</div>
                    <span className="text-[10px] text-slate-500 block">Fasting (mg/dL)</span>
                    <div className="text-xs font-mono text-teal-700 pt-1 border-t border-slate-100">
                      PP: {g.pp} mg/dL
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 3: YEAR-WISE BREAKDOWN TABLE WITH CLINICAL IMAGERY */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <CalendarDays className="w-4 h-4 mr-1.5 text-teal-600" />
              Annual Longitudinal History Matrix
            </h4>
            <p className="text-xs text-slate-500">
              Comparative overview across 2024, 2025, and 2026.
            </p>
          </div>
        </div>

        {/* Year Comparison Bento Cards with Images */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {yearlySummary.map((yr) => {
            const isCurrentSelected = selectedYear === String(yr.year);

            return (
              <div
                key={yr.year}
                onClick={() => { setSelectedYear(String(yr.year)); setSelectedMonth('ALL'); }}
                className={`rounded-3xl border p-5 cursor-pointer transition-all space-y-4 ${
                  isCurrentSelected
                    ? 'border-teal-600 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                }`}
              >
                {/* Year Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-slate-900">{yr.year}</span>
                    {isCurrentSelected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-700 text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {yr.total} Events
                  </span>
                </div>

                {/* Sub-counts */}
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center">
                      <Hospital className="w-3.5 h-3.5 mr-1 text-teal-600" />
                      Consultations & Inpatient
                    </span>
                    <strong className="text-slate-900 font-mono">{yr.consultCount}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500 flex items-center">
                      <Activity className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Lab & Diagnostic Tests
                    </span>
                    <strong className="text-slate-900 font-mono">{yr.labsCount}</strong>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500 flex items-center">
                      <Pill className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      Medication Adjustments
                    </span>
                    <strong className="text-slate-900 font-mono">{yr.rxCount}</strong>
                  </div>
                </div>

                {/* Aesthetic Graphic Badge based on Year */}
                <div className="pt-2">
                  {yr.year === 2024 && (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                      <strong>Diagnosis & Stabilization:</strong> Identified T2D and commenced oral glycemic therapy.
                    </div>
                  )}
                  {yr.year === 2025 && (
                    <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-[11px] text-teal-900">
                      <strong>Dosage Titration:</strong> Optimization of Metformin and regular cardiovascular checks.
                    </div>
                  )}
                  {yr.year === 2026 && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                      <strong>Glycemic Target Achieved:</strong> HbA1c 6.8% with zero adverse events recorded.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: DETAILED ENCOUNTERS LIST FOR FILTERED TIMELINE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center">
              <Clock className="w-4 h-4 mr-1.5 text-teal-600" />
              Chronological Encounter Records ({filteredEvents.length} Items)
            </h4>
            <span className="text-xs text-slate-500">
              {selectedYear === 'ALL' ? 'Showing all historical records' : `Showing records for ${selectedYear}`}
              {selectedMonth !== 'ALL' ? ` (${selectedMonth})` : ''}
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 text-xs">
            {['ALL', 'Consultation', 'Lab Result', 'Medication Update', 'Hospital Visit'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'ALL' ? 'All Records' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Encounters List */}
        <div className="divide-y divide-slate-100">
          {filteredEvents.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No clinical records match the selected month and year filters.
            </div>
          ) : (
            filteredEvents.map((evt) => (
              <div key={evt.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-500 font-semibold">{evt.date}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      {evt.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">Year {evt.year}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900">{evt.title}</h5>
                  <p className="text-xs text-slate-600">{evt.summary}</p>
                  <div className="text-[11px] text-slate-500">
                    Attending: <strong>{evt.doctorName}</strong> • Facility: {evt.facility}
                  </div>
                </div>

                {evt.details.labValues && evt.details.labValues.length > 0 && (
                  <div className="sm:self-center shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                      {evt.details.labValues[0].parameter}: {evt.details.labValues[0].value}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
