/**
 * Calculate ROI and generate a technology roadmap based on assessment inputs
 */
export function calculateROI({ priorities, maturity, fin_inputs, benchmarks, technologies }) {
  // 1. Determine maturity gaps (5 - score) × weight
  const gaps = calculateMaturityGaps(maturity);
  
  // 2. Rank pillars by gap × priority weight
  const priorityWeights = generatePriorityWeights(priorities);
  const rankedPillars = rankPillarsByGap(gaps, priorityWeights);
  
  // 3. Map top gaps to tech candidates from technologies
  const techCandidates = mapGapsToTechnologies(rankedPillars, technologies);
  
  // 4. Build roadmap: <12 mo, 12-24 mo, 24-36 mo buckets
  const roadmap = buildRoadmap(techCandidates);
  
  // 5. Pull %-improvement ranges from benchmarks
  // 6. If fin_inputs present, convert % to $; else show % only
  const benefits = calculateBenefits(roadmap, benchmarks, fin_inputs);
  
  // Calculate payback period in months
  const paybackMonths = calculatePaybackPeriod(benefits, roadmap, fin_inputs);
  
  return {
    roadmap,
    headlineBenefits: benefits,
    paybackMonths,
    assumptions: "Based on industry averages for similar manufacturing operations."
  };
}

/**
 * Calculate maturity gaps (5 - score)
 */
function calculateMaturityGaps(maturity) {
  const gaps = {};
  
  for (const [pillar, score] of Object.entries(maturity)) {
    gaps[pillar] = 5 - score; // Gap = Ideal (5) - Current
  }
  
  return gaps;
}

/**
 * Generate priority weights based on ranking
 */
function generatePriorityWeights(priorities) {
  const weights = {};
  const ranking = priorities.ranking || [];
  
  // Higher position in ranking = higher weight (inverse scale)
  // Weight scale: 1.0 to 0.5 depending on position
  ranking.forEach((priority, index) => {
    weights[priority] = 1 - (index / (2 * ranking.length));
  });
  
  return weights;
}

/**
 * Rank pillars by gap × priority weight
 */
function rankPillarsByGap(gaps, priorityWeights) {
  // Map of pillars to their related business priorities
  const pillarToPriorityMap = {
    'Process': ['Cost', 'Delivery'],
    'Asset': ['Cost', 'Delivery'],
    'People': ['Safety', 'Quality'],
    'Technology': ['Cost', 'Quality', 'Flexibility'],
    'Organization': ['Cost', 'Delivery', 'Flexibility'],
    'Quality': ['Quality'],
    'Delivery': ['Delivery'],
    'Sustainability': ['Sustainability']
  };
  
  // Calculate weighted scores for each pillar
  const weightedScores = {};
  
  for (const [pillar, gap] of Object.entries(gaps)) {
    const relatedPriorities = pillarToPriorityMap[pillar] || [];
    let priorityWeight = 0;
    
    // Sum priority weights for this pillar
    relatedPriorities.forEach(priority => {
      priorityWeight += priorityWeights[priority] || 0;
    });
    
    // Average weight if multiple priorities
    if (relatedPriorities.length > 0) {
      priorityWeight /= relatedPriorities.length;
    }
    
    weightedScores[pillar] = gap * priorityWeight;
  }
  
  // Sort pillars by weighted score descending
  return Object.entries(weightedScores)
    .sort((a, b) => b[1] - a[1])
    .map(([pillar]) => pillar);
}

/**
 * Map gaps to technology candidates
 */
function mapGapsToTechnologies(rankedPillars, technologies) {
  const techCandidates = [];
  
  // For each pillar, find matching technologies
  rankedPillars.forEach(pillar => {
    const matchingTech = technologies.filter(tech => 
      tech.pillar === pillar || tech.pillar.includes(pillar)
    );
    
    if (matchingTech.length > 0) {
      techCandidates.push(...matchingTech);
    }
  });
  
  // Remove duplicates by ID
  const uniqueTech = techCandidates.filter((tech, index, self) =>
    index === self.findIndex(t => t.id === tech.id)
  );
  
  return uniqueTech;
}

/**
 * Build technology roadmap with timeframes
 */
function buildRoadmap(techCandidates) {
  // Group technologies into timeframes
  const roadmap = [
    {
      timeframe: "0-12 months",
      technologies: techCandidates.slice(0, 2).map(tech => tech.name)
    },
    {
      timeframe: "12-24 months",
      technologies: techCandidates.slice(2, 4).map(tech => tech.name)
    },
    {
      timeframe: "24-36 months", 
      technologies: techCandidates.slice(4, 6).map(tech => tech.name)
    }
  ];
  
  return roadmap;
}

/**
 * Calculate benefits based on benchmarks and financial inputs
 */
function calculateBenefits(roadmap, benchmarks, fin_inputs) {
  // Default improvement percentages based on benchmark data
  const improvements = {
    downtime_reduction: benchmarks.find(b => b.category === "Downtime")?.med || 15,
    scrap_reduction: benchmarks.find(b => b.category === "Scrap")?.med || 8,
    energy_savings: benchmarks.find(b => b.category === "Energy")?.med || 6,
  };
  
  // Convert percentages to monetary benefits if financial inputs are available
  if (fin_inputs) {
    const monetaryBenefits = {
      downtime_reduction_pct: improvements.downtime_reduction,
      scrap_reduction_pct: improvements.scrap_reduction,
      energy_savings_pct: improvements.energy_savings,
    };
    
    // Calculate monetary values
    if (fin_inputs.downtime_hours && fin_inputs.downtime_cost_per_hour) {
      monetaryBenefits.downtime_savings_annual = (fin_inputs.downtime_hours * fin_inputs.downtime_cost_per_hour * improvements.downtime_reduction) / 100;
    }
    
    if (fin_inputs.scrap_cost) {
      monetaryBenefits.scrap_savings_annual = (fin_inputs.scrap_cost * improvements.scrap_reduction) / 100;
    }
    
    if (fin_inputs.energy_spend) {
      monetaryBenefits.energy_savings_annual = (fin_inputs.energy_spend * improvements.energy_savings) / 100;
    }
    
    // Calculate total annual savings
    monetaryBenefits.total_annual_savings = (
      (monetaryBenefits.downtime_savings_annual || 0) + 
      (monetaryBenefits.scrap_savings_annual || 0) + 
      (monetaryBenefits.energy_savings_annual || 0)
    );
    
    return monetaryBenefits;
  }
  
  // Otherwise just return the percentage improvements
  return improvements;
}

/**
 * Calculate payback period in months
 */
function calculatePaybackPeriod(benefits, roadmap, fin_inputs) {
  // If no financial inputs, use a default payback period
  if (!fin_inputs || !benefits.total_annual_savings) {
    return 18; // Default 18 months
  }
  
  // Estimate implementation cost based on technologies
  const techCount = roadmap.reduce((count, phase) => 
    count + phase.technologies.length, 0);
  
  // Rough estimate: $100K per technology for first year
  const estimatedCost = techCount * 100000;
  
  // Calculate payback: Cost / (Annual Savings / 12)
  return Math.round((estimatedCost / (benefits.total_annual_savings / 12)));
} 