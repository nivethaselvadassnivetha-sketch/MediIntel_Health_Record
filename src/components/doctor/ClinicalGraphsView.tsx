import React, { useState } from 'react';
import {
  TrendingDown,
  TrendingUp,
  Activity,
  Heart,
  HeartPulse,
  Flame,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { PatientGraphData } from '../../services/api';
import { Patient } from '../../types/healthcare';

interface ClinicalGraphsViewProps {
  patient: Patient;
  graphData?: PatientGraphData | null;
}

export const ClinicalGraphsView: React.FC<ClinicalGraphsViewProps> = ({
  patient,
  graphData
}) => {
  const [activeGraph, setActiveGraph] = useState<'HBA1C' | 'BP' | 'GLUCOSE'>('HBA1C');
  const [hoveredPoint, setHoveredPoint] = useState<any>(null);

  const hba1cSeries = graphData?.hba1cTrend || [
    { date: '2024-03-15', value: 8.4, label: 'Baseline' },
    { date: '2024-09-10', value: 7.9, label: 'Metformin 500mg' },
    { date: '2025-03-20', value: 7.3, label: 'Diet/Lifestyle' },
    { date: '2025-09-15', value: 7.0, label: 'Maintenance' },
    { date: '2026-03-12', value: 6.8, label: 'Optimal Target' }
  ];

  const bpSeries = graphData?.bpTrend || [
    { date: '2024-03-15', systolic: 148, diastolic: 92 },
    { date: '2024-09-10', systolic: 140, diastolic: 88 },
    { date: '2025-03-20', systolic: 134, diastolic: 84 },
    { date: '2025-09-15', systolic: 128, diastolic: 80 },
    { date: '2026-03-12', systolic: 122, diastolic: 78 }
  ];

  const glucoseSeries = graphData?.glucoseTrend || [
    { date: '2024-03-15', fasting: 172, postPrandial: 238 },
    { date: '2024-09-10', fasting: 148, postPrandial: 195 },
    { date: '2025-03-20', fasting: 126, postPrandial: 168 },
    { date: '2025-09-15', fasting: 114, postPrandial: 148 },
    { date: '2026-03-12', fasting: 106, postPrandial: 138 }
  ];

  return (
    <div className="space-y-6">
      {/* Visual Top Cards Inspired by Uploaded mHealth UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Heart Rate / Vitals Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Current Heart Rate
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {patient.latestVitals.heartRate}
              </span>
              <span className="text-xs text-slate-500 font-bold">BPM</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">
              Normal Sinus Rhythm
            </span>
          </div>

          <div className="relative w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
            <Heart className="w-8 h-8 text-rose-500 animate-pulse" />
          </div>
        </div>

        {/* Blood Pressure Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Arterial Blood Pressure
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-slate-900 font-mono">
                {patient.latestVitals.bloodPressure}
              </span>
              <span className="text-xs text-slate-500 font-bold">mmHg</span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Target Range Met
            </span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            <HeartPulse className="w-8 h-8 text-teal-600" />
          </div>
        </div>

        {/* Metabolic / HbA1c Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Glycemic HbA1c
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl font-extrabold text-teal-700 font-mono">
                {patient.latestVitals.hba1c ? `${patient.latestVitals.hba1c}%` : 'N/A'}
              </span>
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              Optimal Goal (&lt; 7.0%)
            </span>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0">
            <TrendingDown className="w-8 h-8 text-cyan-600" />
          </div>
        </div>
      </div>

      {/* Graph Selector Tabs */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">
              Longitudinal Clinical Biomarker Trends
            </h3>
            <p className="text-xs text-slate-500">
              Multi-year trajectory analytics comparing clinical interventions to patient response.
            </p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveGraph('HBA1C')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeGraph === 'HBA1C' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              HbA1c Glycemic
            </button>
            <button
              onClick={() => setActiveGraph('BP')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeGraph === 'BP' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setActiveGraph('GLUCOSE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeGraph === 'GLUCOSE' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fasting vs PP Glucose
            </button>
          </div>
        </div>

        {/* SVG Graphic Canvas - HbA1c */}
        {activeGraph === 'HBA1C' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Goal: <strong>&lt; 7.0%</strong> (Type 2 Diabetes Mellitus)</span>
              <span className="text-emerald-700 font-semibold">Net Reduction: -1.6% absolute</span>
            </div>

            <div className="relative w-full h-64 bg-slate-50/50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-end">
              {/* Target zone line */}
              <div className="absolute left-8 right-8 top-[48%] border-b border-dashed border-emerald-400 z-0">
                <span className="absolute -top-3.5 right-0 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                  Target Threshold 7.0%
                </span>
              </div>

              {/* Data Points */}
              <div className="relative z-10 flex items-end justify-between h-48 px-4 sm:px-12">
                {hba1cSeries.map((item, idx) => {
                  const heightPct = Math.max(20, Math.min(100, ((item.value - 6.0) / 3.0) * 100));
                  const isOptimal = item.value <= 7.0;

                  return (
                    <div
                      key={item.date}
                      className="flex flex-col items-center space-y-2 group cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(item)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    >
                      <span className={`text-xs font-mono font-bold ${isOptimal ? 'text-teal-700' : 'text-rose-600'}`}>
                        {item.value}%
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-8 sm:w-12 rounded-t-xl transition-all duration-300 group-hover:opacity-80 ${
                          isOptimal
                            ? 'bg-linear-to-t from-teal-600 to-emerald-500'
                            : 'bg-linear-to-t from-rose-500 to-amber-500'
                        }`}
                      />
                      <span className="text-[10px] text-slate-500 font-mono mt-1">
                        {item.date.substring(0, 7)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hovered details note */}
            <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 text-xs text-teal-900 flex items-center justify-between">
              <div>
                <strong>Clinical Assessment:</strong> Continuous titrations of Metformin from 250 mg to 500 mg BD produced sustained glycemic normalization.
              </div>
              <span className="text-[11px] font-bold text-emerald-800">ADA Compliant</span>
            </div>
          </div>
        )}

        {/* SVG Graphic Canvas - Blood Pressure */}
        {activeGraph === 'BP' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Target: <strong>&lt; 130/80 mmHg</strong> (ACC/AHA Guidelines)</span>
              <span className="text-emerald-700 font-semibold">Normalized to 122/78 mmHg</span>
            </div>

            <div className="relative w-full h-64 bg-slate-50/50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-end">
              <div className="relative z-10 flex items-end justify-between h-48 px-4 sm:px-12">
                {bpSeries.map((item) => (
                  <div key={item.date} className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {item.systolic}/{item.diastolic}
                    </span>
                    <div className="flex space-x-1 items-end h-32">
                      <div
                        style={{ height: `${(item.systolic / 180) * 100}%` }}
                        className="w-4 sm:w-6 bg-teal-600 rounded-t-md"
                        title={`Systolic: ${item.systolic}`}
                      />
                      <div
                        style={{ height: `${(item.diastolic / 120) * 100}%` }}
                        className="w-4 sm:w-6 bg-cyan-400 rounded-t-md"
                        title={`Diastolic: ${item.diastolic}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                      {item.date.substring(0, 7)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-600 justify-center">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-teal-600 rounded" />
                <span>Systolic (Target &lt; 130 mmHg)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-cyan-400 rounded" />
                <span>Diastolic (Target &lt; 80 mmHg)</span>
              </div>
            </div>
          </div>
        )}

        {/* SVG Graphic Canvas - Glucose */}
        {activeGraph === 'GLUCOSE' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Target: Fasting &lt; 110 mg/dL • Post-Prandial &lt; 140 mg/dL</span>
              <span className="text-emerald-700 font-semibold">Within Euglycemic Range</span>
            </div>

            <div className="relative w-full h-64 bg-slate-50/50 rounded-2xl border border-slate-200 p-4 flex flex-col justify-end">
              <div className="relative z-10 flex items-end justify-between h-48 px-4 sm:px-12">
                {glucoseSeries.map((item) => (
                  <div key={item.date} className="flex flex-col items-center space-y-2">
                    <span className="text-xs font-mono font-bold text-slate-900">
                      {item.fasting} / {item.postPrandial}
                    </span>
                    <div className="flex space-x-1.5 items-end h-32">
                      <div
                        style={{ height: `${(item.fasting / 200) * 100}%` }}
                        className="w-4 sm:w-6 bg-teal-500 rounded-t-md"
                      />
                      <div
                        style={{ height: `${(item.postPrandial / 260) * 100}%` }}
                        className="w-4 sm:w-6 bg-amber-500 rounded-t-md"
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                      {item.date.substring(0, 7)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-6 text-xs text-slate-600 justify-center">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-teal-500 rounded" />
                <span>Fasting Glucose (mg/dL)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-amber-500 rounded" />
                <span>Post-Prandial 2h Glucose (mg/dL)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
