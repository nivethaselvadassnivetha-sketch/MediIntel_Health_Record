import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Calendar,
  Clock,
  Hospital,
  Stethoscope,
  Activity,
  FlaskConical,
  Pill,
  FileText,
  Scan,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Layers,
  HeartPulse,
  UserCheck
} from 'lucide-react';
import { TimelineEvent, Patient, MedicalDocument } from '../../types/healthcare';

interface LongitudinalWaveTimelineProps {
  patient: Patient;
  timelineEvents: TimelineEvent[];
  documents?: MedicalDocument[];
  onOpenDocumentReview?: (documentId?: string) => void;
}

// Category styling and iconography mapper
const getEventCategoryMeta = (category: string, title: string = '') => {
  const lowerTitle = title.toLowerCase();
  if (category === 'Hospital Visit' || lowerTitle.includes('admission') || lowerTitle.includes('hospital') || lowerTitle.includes('ward')) {
    return {
      label: 'Hospital Visit',
      color: '#e11d48', // rose-600
      bg: 'bg-rose-50',
      border: 'border-rose-300',
      text: 'text-rose-700',
      badgeBg: 'bg-rose-100 text-rose-800',
      icon: Hospital,
      waveAmplitude: 60 // higher crest
    };
  }
  if (category === 'Consultation' || lowerTitle.includes('consultation') || lowerTitle.includes('review') || lowerTitle.includes('evaluation')) {
    return {
      label: 'Doctor Consultation',
      color: '#0d9488', // teal-600
      bg: 'bg-teal-50',
      border: 'border-teal-300',
      text: 'text-teal-700',
      badgeBg: 'bg-teal-100 text-teal-800',
      icon: Stethoscope,
      waveAmplitude: -45 // trough
    };
  }
  if (category === 'Lab Result' || lowerTitle.includes('lab') || lowerTitle.includes('panel') || lowerTitle.includes('blood') || lowerTitle.includes('metabolic')) {
    return {
      label: 'Lab Test',
      color: '#0284c7', // sky-600
      bg: 'bg-sky-50',
      border: 'border-sky-300',
      text: 'text-sky-700',
      badgeBg: 'bg-sky-100 text-sky-800',
      icon: FlaskConical,
      waveAmplitude: 50
    };
  }
  if (category === 'Prescription' || category === 'Medication Update' || lowerTitle.includes('medication') || lowerTitle.includes('prescription')) {
    return {
      label: 'Medications',
      color: '#059669', // emerald-600
      bg: 'bg-emerald-50',
      border: 'border-emerald-300',
      text: 'text-emerald-700',
      badgeBg: 'bg-emerald-100 text-emerald-800',
      icon: Pill,
      waveAmplitude: -55
    };
  }
  if (lowerTitle.includes('scan') || lowerTitle.includes('ultrasound') || lowerTitle.includes('x-ray') || lowerTitle.includes('imaging') || lowerTitle.includes('ecg')) {
    return {
      label: 'Scans & Imaging',
      color: '#7c3aed', // violet-600
      bg: 'bg-violet-50',
      border: 'border-violet-300',
      text: 'text-violet-700',
      badgeBg: 'bg-violet-100 text-violet-800',
      icon: Scan,
      waveAmplitude: 45
    };
  }
  return {
    label: category || 'Medical Report',
    color: '#475569', // slate-600
    bg: 'bg-slate-50',
    border: 'border-slate-300',
    text: 'text-slate-700',
    badgeBg: 'bg-slate-100 text-slate-800',
    icon: FileText,
    waveAmplitude: -40
  };
};

export const LongitudinalWaveTimeline: React.FC<LongitudinalWaveTimelineProps> = ({
  patient,
  timelineEvents,
  documents = [],
  onOpenDocumentReview
}) => {
  const [selectedYearFilter, setSelectedYearFilter] = useState<string>('ALL');
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('ALL');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL');

  // Filter events for this patient and sort chronologically (oldest to newest for horizontal wave timeline)
  const patientEvents = useMemo(() => {
    const events = timelineEvents
      .filter((e) => e.patientId === patient.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return events;
  }, [timelineEvents, patient.id]);

  // Available years from events
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    patientEvents.forEach((e) => {
      if (e.year) years.add(e.year);
    });
    // Ensure 2024, 2025, 2026 are included
    [2024, 2025, 2026].forEach((y) => years.add(y));
    return Array.from(years).sort((a, b) => b - a); // 2026, 2025, 2024
  }, [patientEvents]);

  // Filtered timeline events according to active controls
  const filteredEvents = useMemo(() => {
    return patientEvents.filter((evt) => {
      if (selectedYearFilter !== 'ALL' && String(evt.year) !== selectedYearFilter) return false;
      if (selectedMonthFilter !== 'ALL' && evt.month !== selectedMonthFilter) return false;
      if (selectedCategoryFilter !== 'ALL') {
        const meta = getEventCategoryMeta(evt.category, evt.title);
        if (meta.label !== selectedCategoryFilter && evt.category !== selectedCategoryFilter) return false;
      }
      return true;
    });
  }, [patientEvents, selectedYearFilter, selectedMonthFilter, selectedCategoryFilter]);

  // Active selected event on the wave (defaults to the most recent 2026 event)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // Set default selected event to the latest event (e.g. 2026 Hospital/Clinic visit)
  useEffect(() => {
    if (filteredEvents.length > 0 && !selectedEventId) {
      // Pick the last event (most recent)
      setSelectedEventId(filteredEvents[filteredEvents.length - 1].id);
    }
  }, [filteredEvents, selectedEventId]);

  const selectedEvent = useMemo(() => {
    return patientEvents.find((e) => e.id === selectedEventId) || filteredEvents[filteredEvents.length - 1] || null;
  }, [patientEvents, selectedEventId, filteredEvents]);

  // Container ref for smooth scrolling across years
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const wavePointsRef = useRef<Record<string, HTMLDivElement | null>>({});

  // Geometry computation for the continuous wave
  // We allocate space per event along the X-axis
  const nodeSpacing = 190; // pixels between event nodes
  const paddingLeft = 140;
  const paddingRight = 160;
  const totalWidth = Math.max(880, paddingLeft + Math.max(filteredEvents.length - 1, 0) * nodeSpacing + paddingRight);
  const svgHeight = 320;
  const centerY = 160;

  // Calculate coordinates for each event along the smooth wave
  const eventPoints = useMemo(() => {
    return filteredEvents.map((evt, index) => {
      const x = paddingLeft + index * nodeSpacing;
      // Alternate wave crests and troughs with organic variation
      const meta = getEventCategoryMeta(evt.category, evt.title);
      // Base oscillation plus category-specific elevation
      const oscillation = Math.sin(index * 1.35) * 55;
      const categoryOffset = meta.waveAmplitude * 0.45;
      const y = Math.min(Math.max(centerY + oscillation + categoryOffset, 65), svgHeight - 65);

      return {
        event: evt,
        x,
        y,
        meta,
        index
      };
    });
  }, [filteredEvents, paddingLeft, nodeSpacing, centerY, svgHeight]);

  // Construct smooth SVG path (Cubic Bezier Spline) connecting all wave points
  const wavePathData = useMemo(() => {
    if (eventPoints.length === 0) return '';
    if (eventPoints.length === 1) {
      const p = eventPoints[0];
      return `M 0,${centerY} C ${p.x / 2},${centerY} ${p.x / 2},${p.y} ${p.x},${p.y} C ${(p.x + totalWidth) / 2},${p.y} ${(p.x + totalWidth) / 2},${centerY} ${totalWidth},${centerY}`;
    }

    // Start wave from left boundary
    const first = eventPoints[0];
    let d = `M 0,${centerY} C ${first.x * 0.4},${centerY} ${first.x * 0.6},${first.y} ${first.x},${first.y}`;

    for (let i = 0; i < eventPoints.length - 1; i++) {
      const current = eventPoints[i];
      const next = eventPoints[i + 1];
      const dx = next.x - current.x;
      const cp1x = current.x + dx * 0.5;
      const cp1y = current.y;
      const cp2x = current.x + dx * 0.5;
      const cp2y = next.y;

      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }

    // Extend wave to right boundary
    const last = eventPoints[eventPoints.length - 1];
    d += ` C ${last.x + (totalWidth - last.x) * 0.4},${last.y} ${last.x + (totalWidth - last.x) * 0.6},${centerY} ${totalWidth},${centerY}`;

    return d;
  }, [eventPoints, totalWidth, centerY]);

  // Area under the wave for gradient fill
  const waveAreaPath = useMemo(() => {
    if (!wavePathData) return '';
    return `${wavePathData} L ${totalWidth},${svgHeight} L 0,${svgHeight} Z`;
  }, [wavePathData, totalWidth, svgHeight]);

  // Smooth scroll to a specific year
  const handleScrollToYear = (year: number | string) => {
    if (year === 'ALL') {
      setSelectedYearFilter('ALL');
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
      return;
    }

    setSelectedYearFilter(String(year));
    // Find the first event of that year
    const targetPoint = eventPoints.find((p) => String(p.event.year) === String(year));
    if (targetPoint && scrollContainerRef.current) {
      const scrollPos = Math.max(0, targetPoint.x - 260);
      scrollContainerRef.current.scrollTo({ left: scrollPos, behavior: 'smooth' });
    }
  };

  // Navigate to previous or next event on the wave
  const handleStepEvent = (direction: 'PREV' | 'NEXT') => {
    if (!filteredEvents.length) return;
    const currentIndex = filteredEvents.findIndex((e) => e.id === selectedEvent?.id);
    if (currentIndex === -1) return;

    if (direction === 'PREV' && currentIndex > 0) {
      const newEvt = filteredEvents[currentIndex - 1];
      setSelectedEventId(newEvt.id);
      centerOnEvent(newEvt.id);
    } else if (direction === 'NEXT' && currentIndex < filteredEvents.length - 1) {
      const newEvt = filteredEvents[currentIndex + 1];
      setSelectedEventId(newEvt.id);
      centerOnEvent(newEvt.id);
    }
  };

  const centerOnEvent = (id: string) => {
    const pt = eventPoints.find((p) => p.event.id === id);
    if (pt && scrollContainerRef.current) {
      const containerWidth = scrollContainerRef.current.clientWidth;
      const targetScroll = Math.max(0, pt.x - containerWidth / 2);
      scrollContainerRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  // Associated medical report document if attached
  const attachedDocument = useMemo(() => {
    if (!selectedEvent?.documentId) return null;
    return documents.find((d) => d.id === selectedEvent.documentId) || null;
  }, [selectedEvent, documents]);

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* 1. Header & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Previous Longitudinal Health History
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                  Wave Timeline
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Interactive continuous wave progression of clinical encounters, hospital admissions, lab panels, and treatments.
              </p>
            </div>
          </div>

          {/* Quick Year Jump Bar */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1.5 rounded-2xl self-start sm:self-auto">
            <span className="text-slate-400 text-[10px] uppercase font-bold px-1.5">Years:</span>
            {['ALL', '2026', '2025', '2024'].map((yr) => (
              <button
                key={yr}
                onClick={() => handleScrollToYear(yr)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  selectedYearFilter === yr
                    ? 'bg-teal-700 text-white shadow-2xs scale-105'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls: Category & Month */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Category Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto py-0.5 scrollbar-none">
            <span className="text-slate-400 text-[11px] font-semibold mr-1 shrink-0">Filter Event:</span>
            {[
              { label: 'ALL', name: 'All Events' },
              { label: 'Hospital Visit', name: 'Hospital Visits' },
              { label: 'Doctor Consultation', name: 'Consultations' },
              { label: 'Lab Test', name: 'Lab Tests' },
              { label: 'Medications', name: 'Medications' },
              { label: 'Scans & Imaging', name: 'Scans' }
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => setSelectedCategoryFilter(cat.label)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedCategoryFilter === cat.label
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Month Dropdown */}
          <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-xl text-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500 font-medium">Month:</span>
            <select
              value={selectedMonthFilter}
              onChange={(e) => setSelectedMonthFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs"
            >
              <option value="ALL">All Months</option>
              {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Wave-Style Interactive Timeline Canvas */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden relative">
        {/* Top Wave Info Bar */}
        <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
            <span className="text-slate-600 font-medium">
              Touch or click any milestone on the wave to inspect complete medical records
            </span>
          </div>
          <div className="flex items-center space-x-2 text-slate-400 text-[11px]">
            <span className="hidden sm:inline">Swipe or scroll horizontally</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Horizontal Wave Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="relative overflow-x-auto overflow-y-hidden select-none cursor-grab active:cursor-grabbing scrollbar-thin scrollbar-thumb-slate-200"
          style={{ WebkitOverflowScrolling: 'touch', minHeight: '340px' }}
        >
          <div style={{ width: `${totalWidth}px`, height: `${svgHeight}px`, position: 'relative' }}>
            {/* Background Grid & Timeline Baseline */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              width={totalWidth}
              height={svgHeight}
            >
              <defs>
                {/* Wave linear gradient */}
                <linearGradient id="waveStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.4" />
                  <stop offset="35%" stopColor="#0284c7" stopOpacity="0.85" />
                  <stop offset="70%" stopColor="#059669" stopOpacity="0.85" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0.95" />
                </linearGradient>

                {/* Fill under wave */}
                <linearGradient id="waveAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.14" />
                  <stop offset="60%" stopColor="#0284c7" stopOpacity="0.04" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>

                {/* Subtle vertical glow lines */}
                <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="40" y2="0" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="0" x2="0" y2="40" stroke="#f1f5f9" strokeWidth="1" />
                </pattern>
              </defs>

              {/* Background grid */}
              <rect width={totalWidth} height={svgHeight} fill="url(#gridPattern)" />

              {/* Center Baseline Axis */}
              <line
                x1="0"
                y1={centerY}
                x2={totalWidth}
                y2={centerY}
                stroke="#e2e8f0"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Area fill under wave */}
              {waveAreaPath && (
                <path
                  d={waveAreaPath}
                  fill="url(#waveAreaGradient)"
                  className="transition-all duration-700 ease-out"
                />
              )}

              {/* Main Continuous Wave Path */}
              {wavePathData && (
                <path
                  d={wavePathData}
                  fill="none"
                  stroke="url(#waveStrokeGradient)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="filter drop-shadow-sm"
                />
              )}

              {/* Year Delimiter Zones & Annotations */}
              {[2024, 2025, 2026].map((yr) => {
                const yrPoints = eventPoints.filter((p) => p.event.year === yr);
                if (yrPoints.length === 0) return null;
                const minX = Math.min(...yrPoints.map((p) => p.x));
                return (
                  <g key={yr} transform={`translate(${minX - 50}, 30)`}>
                    <rect
                      x="0"
                      y="0"
                      width="68"
                      height="22"
                      rx="11"
                      fill={yr === 2026 ? '#0f172a' : '#f1f5f9'}
                    />
                    <text
                      x="34"
                      y="15"
                      textAnchor="middle"
                      fill={yr === 2026 ? '#ffffff' : '#64748b'}
                      fontSize="11"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {yr}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Interactive Milestone Nodes along the Wave */}
            {eventPoints.map((pt) => {
              const isSelected = selectedEvent?.id === pt.event.id;
              const IconComponent = pt.meta.icon;
              const is2026 = pt.event.year === 2026;
              const isHospitalVisit = pt.meta.label === 'Hospital Visit';

              return (
                <div
                  key={pt.event.id}
                  ref={(el) => { wavePointsRef.current[pt.event.id] = el; }}
                  onClick={() => {
                    setSelectedEventId(pt.event.id);
                    centerOnEvent(pt.event.id);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${pt.x}px`,
                    top: `${pt.y}px`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 30 : 20
                  }}
                  className="group cursor-pointer touch-manipulation"
                >
                  {/* Subtle vertical indicator stem from node to baseline */}
                  <div
                    className={`absolute left-1/2 w-0.5 pointer-events-none transition-opacity duration-300 ${
                      isSelected ? 'opacity-100 bg-teal-500' : 'opacity-25 bg-slate-300 group-hover:opacity-60'
                    }`}
                    style={{
                      top: pt.y > centerY ? `${-(pt.y - centerY)}px` : '0px',
                      height: `${Math.abs(pt.y - centerY)}px`
                    }}
                  />

                  {/* Pulsing Highlight Rings when Selected */}
                  {isSelected && (
                    <>
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: [1, 1.4, 1.2], opacity: [0.6, 0.2, 0.4] }}
                        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                        className="absolute inset-[-14px] rounded-full"
                        style={{ backgroundColor: pt.meta.color, opacity: 0.2 }}
                      />
                      <div
                        className="absolute inset-[-6px] rounded-full animate-ping opacity-35"
                        style={{ backgroundColor: pt.meta.color }}
                      />
                    </>
                  )}

                  {/* Event Point Bubble */}
                  <motion.div
                    whileHover={{ scale: 1.18 }}
                    whileTap={{ scale: 0.94 }}
                    animate={{
                      scale: isSelected ? 1.25 : 1.0,
                      boxShadow: isSelected
                        ? `0 0 0 4px #ffffff, 0 0 0 7px ${pt.meta.color}, 0 8px 20px rgba(0,0,0,0.18)`
                        : '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    style={{
                      backgroundColor: isSelected ? pt.meta.color : '#ffffff',
                      borderColor: pt.meta.color
                    }}
                    className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center transition-colors shadow-sm`}
                  >
                    <IconComponent
                      className={`w-5 h-5 transition-colors ${
                        isSelected ? 'text-white' : pt.meta.text
                      }`}
                    />
                  </motion.div>

                  {/* Floating Marker Badge above/below node */}
                  <div
                    className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-200 ${
                      pt.y > centerY ? '-top-10' : '-bottom-10'
                    }`}
                  >
                    <div
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-2xs border flex items-center space-x-1 transition-all ${
                        isSelected
                          ? 'bg-slate-950 text-white border-slate-800 scale-105 shadow-md'
                          : is2026
                          ? 'bg-white text-slate-900 border-rose-300 font-extrabold'
                          : 'bg-white/95 text-slate-700 border-slate-200 group-hover:border-slate-400'
                      }`}
                    >
                      <span className="font-mono">{pt.event.year}</span>
                      <span>•</span>
                      <span className="truncate max-w-[110px]">{pt.meta.label}</span>
                      {isHospitalVisit && (
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Horizontal Navigation Helper Controls */}
        <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStepEvent('PREV')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center space-x-1 shadow-2xs transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Milestone</span>
            </button>
            <button
              onClick={() => handleStepEvent('NEXT')}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold flex items-center space-x-1 shadow-2xs transition-colors"
            >
              <span>Next Milestone</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-slate-500 text-[11px]">
            Showing <strong className="text-slate-800">{filteredEvents.length}</strong> longitudinal events along the timeline wave
          </div>
        </div>
      </div>

      {/* 3. Detail Pop-up / Card for Selected Wave Event */}
      <AnimatePresence mode="wait">
        {selectedEvent && (
          <motion.div
            key={selectedEvent.id}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="bg-white rounded-3xl border-2 border-teal-500/80 shadow-md p-5 sm:p-6 space-y-4 relative overflow-hidden"
          >
            {/* Top Accent Strip with Wave Node Category Color */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ backgroundColor: getEventCategoryMeta(selectedEvent.category, selectedEvent.title).color }}
            />

            {/* Event Header & Action Close */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-1">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold bg-slate-900 text-white">
                    {selectedEvent.year} — {selectedEvent.category}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    {selectedEvent.date} ({selectedEvent.month})
                  </span>
                  {selectedEvent.year === 2026 && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-rose-600" />
                      Recent 2026 Milestone
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  {selectedEvent.title}
                </h3>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-start">
                {selectedEvent.documentId && onOpenDocumentReview && (
                  <button
                    onClick={() => onOpenDocumentReview(selectedEvent.documentId)}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>View Attached Report</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedEventId(null)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Close Detail Card"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Structured Event Metadata Grid matching required example format */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Hospital / Facility</span>
                <strong className="text-slate-900 block truncate">{selectedEvent.facility}</strong>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Date</span>
                <strong className="text-slate-900 block font-mono">{selectedEvent.date}</strong>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Visit Type</span>
                <strong className="text-teal-800 block">{selectedEvent.category}</strong>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Attending Doctor</span>
                <strong className="text-slate-900 block truncate">{selectedEvent.doctorName}</strong>
              </div>
            </div>

            {/* Diagnoses & Reports Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Diagnosis Field */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center">
                  <Activity className="w-3.5 h-3.5 mr-1 text-teal-600" />
                  Diagnosis:
                </span>
                {selectedEvent.details.diagnoses && selectedEvent.details.diagnoses.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEvent.details.diagnoses.map((d) => (
                      <span
                        key={d}
                        className="px-2.5 py-1 bg-teal-50 text-teal-900 border border-teal-200 rounded-lg font-semibold text-xs"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">No specific diagnosis recorded during this encounter.</p>
                )}

                {/* Prescribed Regimens if available */}
                {selectedEvent.details.prescribedMeds && selectedEvent.details.prescribedMeds.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1 flex items-center">
                      <Pill className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Medications:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.details.prescribedMeds.map((m) => (
                        <span key={m} className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono text-[11px]">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Reports Field */}
              <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block flex items-center">
                  <FileText className="w-3.5 h-3.5 mr-1 text-teal-600" />
                  Reports & Clinical Documentation:
                </span>
                {attachedDocument ? (
                  <div className="p-2.5 bg-sky-50/60 border border-sky-200 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-sky-950 block text-xs">{attachedDocument.title}</strong>
                      <span className="text-[10px] text-sky-700 font-mono">
                        {attachedDocument.id} • {attachedDocument.fileFormat} ({attachedDocument.fileSize})
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800 border border-sky-300">
                      AI Verified
                    </span>
                  </div>
                ) : selectedEvent.documentId ? (
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-slate-800 block text-xs">Medical Document #{selectedEvent.documentId}</strong>
                      <span className="text-[10px] text-slate-500">Archived in Hospital Record Management System</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                      Archived
                    </span>
                  </div>
                ) : (
                  <p className="text-slate-600">{selectedEvent.summary}</p>
                )}

                {/* Lab parameters if available */}
                {selectedEvent.details.labValues && selectedEvent.details.labValues.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                      Laboratory Tests & Values:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {selectedEvent.details.labValues.slice(0, 4).map((lab) => (
                        <div key={lab.parameter} className="p-1.5 bg-slate-50 rounded border border-slate-200 text-[11px] flex justify-between">
                          <span className="text-slate-600 truncate mr-1">{lab.parameter}:</span>
                          <span className="font-mono font-bold text-slate-900">{lab.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Clinician Evaluation Notes & Summary */}
            {selectedEvent.details.notes && (
              <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs text-amber-950">
                <span className="font-bold block text-[10px] uppercase text-amber-800 mb-0.5">
                  Clinician Evaluation Notes:
                </span>
                {selectedEvent.details.notes}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
