import React, { useState } from 'react';
import { searchOpportunities, checkEligibility } from '../services/api';
import EligibilityView from './EligibilityView';

const OpportunitySearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOpp, setSelectedOpp] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResults([]);
        setSelectedOpp(null);
        setAnalysis(null);

        const data = await searchOpportunities(query);
        setResults(data);
        setLoading(false);
    };

    const handleCheckEligibility = async (opp) => {
        setSelectedOpp(opp.id);
        setAnalyzing(true);
        setAnalysis(null);

        // Pass the opportunity object to the backend
        const result = await checkEligibility(opp);
        setAnalysis(result);
        setAnalyzing(false);
    };

    return (
        <div className="opportunity-search space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Find Opportunities</h2>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search hackathons, internships, etc..."
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>

            <div className="space-y-4">
                {results.map((opp) => (
                    <div key={opp.id} className="bg-white p-6 rounded-lg shadow-md border hover:border-indigo-300 transition-colors">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                    <a href={opp.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                        {opp.title}
                                    </a>
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{opp.source} • Posted: {opp.date_posted || 'Recently'}</p>
                            </div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Match Score: {opp.relevance_score}
                            </span>
                        </div>

                        <p className="mt-3 text-gray-600 text-sm line-clamp-2">{opp.snippet}</p>

                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-sm text-gray-500">Deadline: <span className="font-medium text-gray-900">{opp.deadline || 'Unknown'}</span></span>
                            <button
                                onClick={() => handleCheckEligibility(opp)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Check Eligibility
                            </button>
                        </div>

                        {selectedOpp === opp.id && (
                            <EligibilityView analysis={analysis} loading={analyzing} />
                        )}
                    </div>
                ))}

                {results.length === 0 && !loading && (
                    <p className="text-center text-gray-500 mt-8">No results found. Try a different search term.</p>
                )}
            </div>
        </div>
    );
};

export default OpportunitySearch;
