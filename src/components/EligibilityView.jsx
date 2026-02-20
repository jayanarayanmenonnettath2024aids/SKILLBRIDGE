import React from 'react';

const EligibilityView = ({ analysis, loading }) => {
    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Analyzing eligibility with AI...</p>
            </div>
        );
    }

    if (!analysis) return null;

    if (analysis.error) {
        return <div className="p-4 text-red-600 bg-red-50 rounded-md">Error: {analysis.error}</div>;
    }

    const {
        eligibility_score,
        eligibility_status,
        reasons_met,
        reasons_not_met,
        missing_skills,
        explanation_simple,
        next_steps_roadmap
    } = analysis;

    const scoreColor = eligibility_score >= 80 ? 'text-green-600' : eligibility_score >= 50 ? 'text-yellow-600' : 'text-red-600';

    return (
        <div className="mt-6 bg-white border rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 bg-gray-50 border-b">
                <h3 className="text-lg font-bold text-gray-900">Eligibility Analysis</h3>
                <div className="flex items-center mt-2">
                    <div className={`text-3xl font-bold ${scoreColor}`}>{eligibility_score}%</div>
                    <div className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${eligibility_status === 'Highly Eligible' ? 'bg-green-100 text-green-800' :
                        eligibility_status === 'Not Eligible' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {eligibility_status}
                    </div>
                </div>
                <p className="mt-3 text-gray-700 italic">&quot;{explanation_simple}&quot;</p>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-green-700 mb-2">Why you match:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {reasons_met?.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
                <div>
                    <h4 className="font-semibold text-red-700 mb-2">Gaps identified:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                        {reasons_not_met?.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                </div>
            </div>

            {missing_skills && missing_skills.length > 0 && (
                <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-100">
                    <h4 className="font-semibold text-yellow-800 mb-2">Missing Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                        {missing_skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-white border border-yellow-200 rounded text-xs text-yellow-700">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="p-6 border-t bg-indigo-50">
                <h4 className="font-semibold text-indigo-900 mb-4">Improvement Roadmap</h4>
                <div className="space-y-4">
                    {next_steps_roadmap?.map((step, i) => (
                        <div key={i} className="flex">
                            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-200 text-indigo-700 flex items-center justify-center text-xs font-bold mt-0.5">
                                {i + 1}
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-indigo-900">{step.step}</p>
                                <p className="text-sm text-indigo-700 mt-1">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EligibilityView;
