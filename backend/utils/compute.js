// utils/scoring.js

// helper to round to 2 decimals
export function round2(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// compute weighted score for a single criterion (per judge)
export function computeCriterionScore(score, criterion) {
  return round2(score.value * (criterion.weight / 100));
}

// compute a criteria score for one judge (sum of criterions)
export function computeCriteriaScore(criterions, scores, judgeId) {
  let total = 0;
  criterions.forEach((criterion) => {
    const score = scores.find(
      (s) => s.criterionId === criterion.id && s.userId === judgeId
    );
    if (score) {
      total += computeCriterionScore(score, criterion);
    }
  });
  return round2(total);
}

// compute portion score for one judge
export function computePortionScore(portion, allScores, judgeId) {
  let total = 0;
  portion.criterias.forEach((criteria) => {
    const criteriaScore = computeCriteriaScore(
      criteria.criterions,
      allScores,
      judgeId
    );
    total += criteriaScore * (criteria.weight / 100);
  });
  return round2(total);
}

// average portion score per team (across all judges)
export function computeTeamPortionScore(portion, allScores, teamId, judgeIds) {
  const judgeTotals = judgeIds.map((judgeId) =>
    computePortionScore(
      portion,
      allScores.filter((s) => s.teamId === teamId),
      judgeId
    )
  );
  const avg = judgeTotals.reduce((a, b) => a + b, 0) / judgeTotals.length;
  return round2(avg);
}

// 1. Per-judge breakdown
export function getJudgeBreakdown(portion, allScores, teamId, judgeId) {
  return computePortionScore(
    portion,
    allScores.filter((s) => s.teamId === teamId),
    judgeId
  );
}

// 2. Per-team total (averaged across judges)
export function getTeamTotals(portions, allScores, teamId, judgeIds) {
  const totals = {};
  portions.forEach((portion) => {
    totals[portion.id] = computeTeamPortionScore(
      portion,
      allScores,
      teamId,
      judgeIds
    );
  });
  return totals;
}

// 3. Leaderboard
export function getLeaderboard(portions, allScores, teams, judgeIds) {
  return teams
    .map((team) => {
      const totals = getTeamTotals(portions, allScores, team.id, judgeIds);
      const grandTotal = Object.values(totals).reduce((a, b) => a + b, 0);
      return {
        teamId: team.id,
        teamName: team.name,
        totals,
        grandTotal: round2(grandTotal),
      };
    })
    .sort((a, b) => b.grandTotal - a.grandTotal);
}

/**
 * Compute weighted criterion score per judge (with team context)
 */
export function computeCriterionScoreForTeam(
  scores,
  criterion,
  teamId,
  judgeId
) {
  const score = scores.find(
    (s) =>
      s.criterionId === criterion.id &&
      s.teamId === teamId &&
      s.userId === judgeId
  );
  if (!score) return 0;
  return round2(score.value * (criterion.weight / 100));
}

/**
 * Compute criteria score (sum of criterions, averaged across judges, with team context)
 */
export function computeCriteriaScoreForTeam(
  criteria,
  scores,
  teamId,
  judgeIds
) {
  const judgeTotals = judgeIds.map((judgeId) => {
    let subtotal = 0;
    criteria.criterions.forEach((criterion) => {
      subtotal += computeCriterionScoreForTeam(
        scores,
        criterion,
        teamId,
        judgeId
      );
    });
    return subtotal;
  });

  // average across judges
  const avg = judgeTotals.reduce((a, b) => a + b, 0) / judgeTotals.length;
  return round2(avg);
}
