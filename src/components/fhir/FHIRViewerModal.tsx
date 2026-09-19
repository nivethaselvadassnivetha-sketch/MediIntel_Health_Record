import React, { useState } from 'react';
import { X, Copy, Check, FileCode, ExternalLink, ShieldCheck, Database } from 'lucide-react';
import { FHIRBundle } from '../../types/healthcare';

interface FHIRViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fhirBundle: FHIRBundle;
}

export const FHIRViewerModal: React.FC<FHIRViewerModalProps> = ({
  isOpen,
  onClose,
  fhirBundle
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedResourceType, setSelectedResourceType] = useState<string>('Bundle');

  if (!isOpen) return null;

  const resourceTypes = [
    'Bundle',
    'Patient',
    'Observation',
    'MedicationStatement',
    'DiagnosticReport'
  ];

  const getFilteredData = () => {
    if (selectedResourceType === 'Bundle') {
      return fhirBundle;
    }
    const matchingEntries = fhirBundle.entry.filter(
      (e) => e.resource.resourceType === selectedResourceType
    );
    return matchingEntries.length === 1 ? matchingEntries[0].resource : matchingEntries.map(e => e.resource);
  };

  const currentData = getFilteredData();
  const jsonString = JSON.stringify(currentData, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg border border-teal-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold text-white tracking-wide">
                  FHIR R4 Compatible Clinical Output
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-900/80 text-teal-300 border border-teal-700/50">
                  PROTOTYPE SPECIFICATION
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Standardized HL7® FHIR® resources generated from structured EHR data & verified clinical extractions.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resource Selector & Action Bar */}
        <div className="p-3 sm:px-6 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
            <span className="text-xs font-semibold text-slate-500 mr-1 shrink-0">Resource:</span>
            {resourceTypes.map((type) => {
              const count =
                type === 'Bundle'
                  ? fhirBundle.total
                  : fhirBundle.entry.filter((e) => e.resource.resourceType === type).length;
              return (
                <button
                  key={type}
                  onClick={() => setSelectedResourceType(type)}
                  className={`px-3 py-1 text-xs font-medium rounded-lg transition-all shrink-0 ${
                    selectedResourceType === type
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                  }`}
                >
                  {type}
                  <span className="ml-1.5 opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
            <span>
              <strong>Note:</strong> This output represents an HL7 FHIR R4 schema-compliant prototype export for interoperability testing.
            </span>
          </div>
          <span className="text-[11px] text-amber-700 font-mono hidden sm:inline">schema: hl7.org/fhir/R4</span>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed select-text">
          <pre className="whitespace-pre-wrap">{jsonString}</pre>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Total resources in bundle: <strong className="text-slate-800">{fhirBundle.total}</strong> | Generated at: <span className="font-mono">{fhirBundle.timestamp}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
