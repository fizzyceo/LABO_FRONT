import React, { useState } from 'react';
import { Play, User, Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Algorithm, ExecutionLog } from '../types';

interface ExecutionPanelProps {
  algorithms: Algorithm[];
}

const ExecutionPanel: React.FC<ExecutionPanelProps> = ({ algorithms }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [dataSource, setDataSource] = useState('manual');
  const [patientId, setPatientId] = useState('');
  const [analysisType, setAnalysisType] = useState('blood');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Ready to execute algorithm');
  const [logs, setLogs] = useState<ExecutionLog[]>([]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const log: ExecutionLog = {
      timestamp: new Date().toLocaleTimeString(),
      message,
      type,
    };
    setLogs(prev => [...prev, log]);
  };

  const runExecution = async () => {
    if (!selectedAlgorithm) {
      alert('Please select an algorithm');
      return;
    }

    const algorithm = algorithms.find(a => a.id.toString() === selectedAlgorithm);
    if (!algorithm) return;

    setIsRunning(true);
    setProgress(0);
    setLogs([]);

    const steps = [
      'Initializing algorithm...',
      'Loading parameter configurations...',
      'Fetching data from source...',
      'Validating parameter conditions...',
      'Executing algorithm logic...',
      'Generating results...',
      'Finalizing execution...',
    ];

    addLog(`Starting execution for Patient: ${patientId}`);
    addLog(`Algorithm: ${algorithm.name}`);
    addLog(`Analysis Type: ${analysisType}`);
    addLog(`Data Source: ${dataSource}`);
    
    // Log global parameters
    if (algorithm.globalParameters && algorithm.globalParameters.length > 0) {
      addLog('Global Parameters:');
      algorithm.globalParameters.forEach(param => {
        addLog(`  └─ ${param.name}: ${param.value}`);
      });
    }
    
    addLog('---');

    for (let i = 0; i < steps.length; i++) {
      setStatus(steps[i]);
      addLog(`${steps[i]}`);
      
      if (i === 3) {
        // Simulate parameter checking
        algorithm.parameters.forEach((param) => {
          addLog(`Checking ${param.label}:`);
          param.subParameters.forEach((subParam) => {
            const passed = Math.random() > 0.2;
            addLog(
              `  └─ ${subParam.param}: ${subParam.config?.type || 'validation'} → ${passed ? 'PASS' : 'FAIL'}`,
              passed ? 'success' : 'error'
            );
          });
        });
      }
      
      setProgress(((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const result = Math.random() > 0.7 ? 'VALIDATED' : 'EXPERT_REQUIRED';
    setStatus(`Execution Complete: ${result}`);
    
    if (result === 'VALIDATED') {
      addLog('Result: VALIDATED', 'success');
      addLog('All parameters passed validation criteria', 'success');
      addLog('Patient analysis approved for reporting', 'success');
    } else {
      addLog('Result: EXPERT_REQUIRED', 'warning');
      addLog('Some parameters require expert review', 'warning');
      addLog('Flagged for manual validation', 'warning');
    }

    setIsRunning(false);
  };

  const getLogIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Algorithm Execution</h2>
        <button
          onClick={runExecution}
          disabled={isRunning}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:transform-none"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Running...' : 'Run Execution'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Algorithm
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="">Select an algorithm...</option>
              {algorithms.map((algorithm) => (
                <option key={algorithm.id} value={algorithm.id}>
                  {algorithm.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Data Source
            </label>
            <select
              value={dataSource}
              onChange={(e) => setDataSource(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="manual">Manual Input</option>
              <option value="scraper">Web Scraper</option>
              <option value="file">File Upload</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Patient ID
            </label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              placeholder="Enter patient ID"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Analysis Type
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
            >
              <option value="blood">Blood Analysis</option>
              <option value="urine">Urine Analysis</option>
              <option value="biochemistry">Biochemistry</option>
              <option value="hematology">Hematology</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Execution Status</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-yellow-500' : 'bg-green-500'}`} />
                <span className="text-sm font-medium">
                  {isRunning ? 'Running' : 'System Ready'}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="text-sm text-gray-600">{status}</div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Execution Log</h4>
            <div className="bg-gray-900 text-white p-4 rounded-lg h-64 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-400">Ready to start execution...</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-2 mb-1">
                    {getLogIcon(log.type)}
                    <span className="text-xs text-gray-400">[{log.timestamp}]</span>
                    <span
                      className={`flex-1 ${
                        log.type === 'success' ? 'text-green-400' :
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'warning' ? 'text-yellow-400' :
                        'text-white'
                      }`}
                      dangerouslySetInnerHTML={{ __html: log.message }}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutionPanel;