// utils/scoring.js

export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// compute weighted score for a single criterion
export function computeCriterionScore(scoreValue, criterionWeight) {
  const weighted = round2(scoreValue * (criterionWeight / 100));
  const calculation = `${scoreValue} * (${criterionWeight}/100) = ${weighted}`;
  return { weighted, calculation };
}

// compute subtotal for a criteria (sum of criterion weighted scores)
export function computeCriteriaScore(criterions, allScores, teamId, judgeId) {
  let subtotal = 0;
  const calculations = [];
  const criterionsData = criterions.map((criterion) => {
    const scoreObj = allScores.find(
      (s) =>
        s.teamId === teamId &&
        s.userId === judgeId &&
        s.criterionId === criterion.id
    );
    const value = scoreObj ? scoreObj.value : 0;
    const { weighted, calculation } = computeCriterionScore(
      value,
      criterion.weight
    );
    subtotal += weighted;
    calculations.push(calculation);
    return {
      criterionId: criterion.id,
      name: criterion.name,
      value,
      weighted,
      calculation,
    };
  });

  return {
    subtotal: round2(subtotal),
    criterionsData,
    calculation: calculations.join(" + "),
  };
}

// compute portion subtotal for one judge
export function computePortionScore(portion, allScores, teamId, judgeId) {
  let portionSubtotal = 0;
  const criteriaBreakdown = [];
  const portionCalculations = [];

  portion.criterias.forEach((criteria) => {
    const {
      subtotal: criteriaSubtotal,
      criterionsData,
      calculation: critCalc,
    } = computeCriteriaScore(criteria.criterions, allScores, teamId, judgeId);

    const weightedCriteria = round2(criteriaSubtotal * (criteria.weight / 100));
    const criteriaCalculation = `(${critCalc}) * (${criteria.weight}/100) = ${weightedCriteria}`;
    portionSubtotal += weightedCriteria;
    portionCalculations.push(criteriaCalculation);

    criteriaBreakdown.push({
      criteriaId: criteria.id,
      name: criteria.name,
      subtotal: weightedCriteria,
      calculation: criteriaCalculation,
      criterions: criterionsData,
    });
  });

  return {
    portionSubtotal: round2(portionSubtotal),
    criteriaBreakdown,
    calculation: portionCalculations.join(" + "),
  };
}

// compute team subtotal per portion for multiple judges
export function computePortionRanking(portion, allScores, teams, judgeIds) {
  const results = teams.map((team) => {
    let judgePortionTotals = [];
    let judgeCalculations = [];

    judgeIds.forEach((judgeId) => {
      const { portionSubtotal, calculation } = computePortionScore(
        portion,
        allScores,
        team.id,
        judgeId
      );
      judgePortionTotals.push(portionSubtotal);
      judgeCalculations.push(
        `Judge ${judgeId}: ${calculation} = ${portionSubtotal}`
      );
    });

    const avgSubtotal = round2(
      judgePortionTotals.reduce((a, b) => a + b, 0) / judgePortionTotals.length
    );

    return {
      teamId: team.id,
      teamName: team.name,
      avgSubtotal,
      judgeCalculations,
    };
  });

  // sort descending
  results.sort((a, b) => b.avgSubtotal - a.avgSubtotal);

  return results;
}

// compute team subtotal per criteria for multiple judges
export function computeCriteriaRanking(portion, allScores, teams, judgeIds) {
  const criteriaResults = portion.criterias.map((criteria) => {
    const teamsRanked = teams.map((team) => {
      let judgeTotals = [];
      let judgeCalculations = [];

      judgeIds.forEach((judgeId) => {
        const { subtotal, calculation } = computeCriteriaScore(
          criteria.criterions,
          allScores,
          team.id,
          judgeId
        );

        const weighted = round2(subtotal * (criteria.weight / 100));
        judgeTotals.push(weighted);
        judgeCalculations.push(
          `Judge ${judgeId}: (${calculation}) * (${criteria.weight}/100) = ${weighted}`
        );
      });

      const avgWeighted = round2(
        judgeTotals.reduce((a, b) => a + b, 0) / judgeTotals.length
      );

      return {
        teamId: team.id,
        teamName: team.name,
        avgSubtotal: avgWeighted,
        judgeCalculations,
      };
    });

    teamsRanked.sort((a, b) => b.avgSubtotal - a.avgSubtotal);

    return {
      criteriaId: criteria.id,
      name: criteria.name,
      ranking: teamsRanked,
    };
  });

  return criteriaResults;
}
