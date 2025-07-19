import React, { useState } from 'react';
import { Plus, Trash2, TestTube } from 'lucide-react';
import { Mapping } from '../types';
import { parameterDefinitions } from '../data/parameterDefinitions';

const WebScraper: React.FC = () => {
  const [targetUrl, setTargetUrl] = useState('');
  const [mappings, setMappings] = useState<Mapping[]>([{ param: '', selector: '' }]);
  const [scraperCode, setScraperCode] = useState('// Generated scraper code will appear here\n// Click "Test Scraper" to generate');

  const allParameters = parameterDefinitions;

  const addMapping = () => {
    setMappings([...mappings, { param: '', selector: '' }]);
  };

  const removeMapping = (index: number) => {
    setMappings(mappings.filter((_, i) => i !== index));
  };

  const updateMapping = (index: number, field: keyof Mapping, value: string) => {
    const updated = [...mappings];
    updated[index] = { ...updated[index], [field]: value };
    setMappings(updated);
  };

  const generateScraperCode = () => {
    if (!targetUrl.trim()) {
      alert('Please enter a target URL');
      return;
    }

    const validMappings = mappings.filter(m => m.param && m.selector);
    
    let code = `from playwright.sync_api import sync_playwright\n\n`;
    code += `def scrape_parameters(url="${targetUrl}"):\n`;
    code += `    with sync_playwright() as p:\n`;
    code += `        browser = p.chromium.launch()\n`;
    code += `        page = browser.new_page()\n`;
    code += `        page.goto(url)\n\n`;
    code += `        parameters = {}\n`;

    validMappings.forEach((mapping) => {
      code += `        \n        # Extract ${mapping.param}\n`;
      code += `        try:\n`;
      code += `            ${mapping.param}_element = page.locator("${mapping.selector}")\n`;
      code += `            parameters["${mapping.param}"] = ${mapping.param}_element.inner_text()\n`;
      code += `        except:\n`;
      code += `            parameters["${mapping.param}"] = None\n`;
    });

    code += `\n        browser.close()\n`;
    code += `        return parameters\n\n`;
    code += `# Usage\n`;
    code += `# data = scrape_parameters()\n`;
    code += `# print(data)`;

    setScraperCode(code);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Web Scraper Configuration</h2>
        <button
          onClick={generateScraperCode}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-medium hover:transform hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          <TestTube className="w-4 h-4" />
          Test Scraper
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Target URL
            </label>
            <input
              type="url"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Parameter Mappings
            </label>
            
            <div className="space-y-4">
              {mappings.map((mapping, index) => (
                <div key={index} className="flex gap-4 items-center p-4 bg-white rounded-lg border border-gray-200">
                  <select
                    value={mapping.param}
                    onChange={(e) => updateMapping(index, 'param', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Select parameter...</option>
                    {allParameters.map((param) => (
                      <option key={param.name} value={param.name}>
                        {param.label} {param.isGlobal ? '(Global)' : ''}
                      </option>
                    ))}
                  </select>
                  
                  <input
                    type="text"
                    value={mapping.selector}
                    onChange={(e) => updateMapping(index, 'selector', e.target.value)}
                    className="flex-2 px-3 py-2 border border-gray-300 rounded-md focus:border-indigo-500 focus:outline-none font-mono text-sm"
                    placeholder="CSS selector (e.g., #result-value, .data-cell)"
                  />
                  
                  <button
                    onClick={() => removeMapping(index)}
                    className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={addMapping}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors mt-4"
            >
              <Plus className="w-4 h-4" />
              Add Mapping
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Scraper Preview
          </label>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-auto">
            <pre className="whitespace-pre-wrap">{scraperCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebScraper;