import { useEffect, useState } from 'react';

export default function ReportPreview({ assessment, benchmarks, technologies }) {
  const [previewData, setPreviewData] = useState({
    priorities: [],
    maturity: {},
    recommendations: []
  });

  useEffect(() => {
    // Update preview data whenever assessment changes
    const priorities = assessment.priorities.ranking || [];
    const maturity = assessment.maturity || {};
    
    // Generate preliminary recommendations based on current data
    const recommendations = generateRecommendations(priorities, maturity, technologies);
    
    setPreviewData({
      priorities,
      maturity,
      recommendations
    });
  }, [assessment, technologies]);

  return (
    <div className="h-full bg-white rounded-lg shadow-lg p-6 overflow-y-auto">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Report Preview</h3>
      
      {/* Priorities Section */}
      {previewData.priorities.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Business Priorities</h4>
          <ol className="list-decimal list-inside space-y-1 text-gray-600">
            {previewData.priorities.map((priority, index) => (
              <li key={index} className="text-sm">{priority}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Maturity Assessment Section */}
      {Object.keys(previewData.maturity).length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Current Maturity</h4>
          <div className="space-y-2">
            {Object.entries(previewData.maturity).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{key}</span>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full mx-0.5 ${
                        i < value ? 'bg-blue-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preliminary Recommendations */}
      {previewData.recommendations.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Preliminary Recommendations</h4>
          <ul className="space-y-2">
            {previewData.recommendations.map((rec, index) => (
              <li key={index} className="text-sm text-gray-600">
                • {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!previewData.priorities.length && !Object.keys(previewData.maturity).length && (
        <p className="text-gray-500 text-sm italic">
          Complete the assessment to see your report preview
        </p>
      )}
    </div>
  );
}

// Helper function to generate preliminary recommendations
function generateRecommendations(priorities, maturity, technologies) {
  const recommendations = [];
  
  // Add recommendations based on priorities
  if (priorities.length > 0) {
    const topPriority = priorities[0];
    recommendations.push(`Focus on ${topPriority} initiatives first`);
  }

  // Add recommendations based on maturity gaps
  Object.entries(maturity).forEach(([key, value]) => {
    if (value < 3) {
      recommendations.push(`Improve ${key} capabilities`);
    }
  });

  return recommendations.slice(0, 3); // Limit to top 3 recommendations for preview
} 