// AI Service - Mock AI with smart matching logic
// When real AI API is connected, swap these functions

import { Job, Scheme, Exam, UserProfile } from './mockData';

export interface AIRecommendation {
  item: Job | Scheme | Exam;
  matchScore: number;
  reason: string;
  type: 'job' | 'scheme' | 'exam';
}

export interface EligibilityResult {
  status: 'eligible' | 'not-eligible' | 'partially-eligible';
  score: number;
  reasons: string[];
  missing: string[];
}

export interface PredictionResult {
  probability: number;
  recommendation: 'apply' | 'try-later' | 'not-recommended';
  factors: {
    competition: string;
    yourProfile: string;
    historical: string;
  };
  tips: string[];
}

// AI Recommendations
export function getAIRecommendations(
  user: UserProfile | null,
  jobs: Job[],
  schemes: Scheme[],
  exams: Exam[]
): AIRecommendation[] {
  if (!user) {
    // Return top 5 from each category randomly
    const recs: AIRecommendation[] = [
      ...jobs.slice(0, 5).map(j => ({
        item: j,
        matchScore: Math.floor(Math.random() * 30) + 60,
        reason: 'Trending opportunity in your region',
        type: 'job' as const,
      })),
      ...schemes.slice(0, 3).map(s => ({
        item: s,
        matchScore: Math.floor(Math.random() * 30) + 60,
        reason: 'Popular scheme for citizens',
        type: 'scheme' as const,
      })),
      ...exams.slice(0, 3).map(e => ({
        item: e,
        matchScore: Math.floor(Math.random() * 30) + 60,
        reason: 'Upcoming exam - prepare early',
        type: 'exam' as const,
      })),
    ];
    return recs.sort((a, b) => b.matchScore - a.matchScore);
  }

  // Smart matching based on user profile
  const recs: AIRecommendation[] = [];

  // Match jobs
  jobs.forEach(job => {
    let score = 50;
    const reasons: string[] = [];

    if (job.eligibility.toLowerCase().includes(user.education.toLowerCase())) {
      score += 15;
      reasons.push('Matches your education');
    }
    if (user.age && job.eligibility.includes('Age')) {
      const ageMatch = job.eligibility.match(/Age\s+(\d+)-(\d+)/);
      if (ageMatch) {
        const minAge = parseInt(ageMatch[1]);
        const maxAge = parseInt(ageMatch[2]);
        if (user.age >= minAge && user.age <= maxAge) {
          score += 10;
          reasons.push('Age criteria matched');
        }
      }
    }
    if (user.location && job.location.includes(user.location)) {
      score += 10;
      reasons.push('Available in your location');
    }
    if (user.category && job.eligibility.toLowerCase().includes(user.category.toLowerCase())) {
      score += 5;
    }
    if (user.skills.length > 0) {
      const skillMatch = user.skills.some(skill =>
        job.description.toLowerCase().includes(skill.toLowerCase()) ||
        job.title.toLowerCase().includes(skill.toLowerCase())
      );
      if (skillMatch) {
        score += 10;
        reasons.push('Your skills align');
      }
    }

    recs.push({
      item: job,
      matchScore: Math.min(score, 98),
      reason: reasons[0] || 'General opportunity',
      type: 'job',
    });
  });

  // Match schemes
  schemes.forEach(scheme => {
    let score = 50;
    const reasons: string[] = [];

    if (scheme.eligibility.toLowerCase().includes(user.education.toLowerCase()) ||
        scheme.eligibility.toLowerCase().includes('all indian') ||
        scheme.eligibility.toLowerCase().includes('all citizens')) {
      score += 15;
      reasons.push('You meet eligibility criteria');
    }
    if (user.category && scheme.eligibility.toLowerCase().includes(user.category.toLowerCase())) {
      score += 10;
      reasons.push('Category benefit applicable');
    }
    if (user.age && scheme.eligibility.includes('age')) {
      score += 5;
    }

    recs.push({
      item: scheme,
      matchScore: Math.min(score, 98),
      reason: reasons[0] || 'Available for your category',
      type: 'scheme',
    });
  });

  // Match exams
  exams.forEach(exam => {
    let score = 50;
    const reasons: string[] = [];

    if (exam.eligibility.toLowerCase().includes(user.education.toLowerCase())) {
      score += 15;
      reasons.push('Eligible based on education');
    }
    if (user.age && exam.eligibility.includes('Age')) {
      const ageMatch = exam.eligibility.match(/Age\s+(\d+)/);
      if (ageMatch) {
        const minAge = parseInt(ageMatch[1]);
        if (user.age >= minAge) {
          score += 10;
          reasons.push('Age criteria satisfied');
        }
      }
    }

    recs.push({
      item: exam,
      matchScore: Math.min(score, 98),
      reason: reasons[0] || 'Upcoming exam',
      type: 'exam',
    });
  });

  return recs
    .filter(r => r.matchScore >= 40)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 12);
}

// Eligibility Checker
export function checkEligibility(
  user: UserProfile | null,
  item: Job | Scheme | Exam
): EligibilityResult {
  if (!user) {
    return {
      status: 'not-eligible',
      score: 0,
      reasons: ['Please complete your profile to check eligibility'],
      missing: ['Profile not set up'],
    };
  }

  let score = 0;
  const reasons: string[] = [];
  const missing: string[] = [];

  // Education check
  if (item.eligibility.toLowerCase().includes(user.education.toLowerCase()) ||
      item.eligibility.toLowerCase().includes('any discipline') ||
      item.eligibility.toLowerCase().includes('all indian')) {
    score += 30;
    reasons.push('Education requirement matched');
  } else {
    missing.push('Education criteria may not match');
  }

  // Age check
  if (item.eligibility.includes('Age')) {
    const ageRange = item.eligibility.match(/Age\s+(\d+)-?(\d+)?/);
    if (ageRange) {
      const minAge = parseInt(ageRange[1]);
      const maxAge = ageRange[2] ? parseInt(ageRange[2]) : 100;
      if (user.age >= minAge && user.age <= maxAge) {
        score += 25;
        reasons.push(`Age ${user.age} is within required range (${minAge}-${maxAge})`);
      } else {
        missing.push(`Age requirement: ${minAge}-${maxAge} years`);
      }
    }
  }

  // Category check
  if (item.eligibility.toLowerCase().includes(user.category.toLowerCase()) ||
      item.eligibility.toLowerCase().includes('all categories') ||
      item.eligibility.toLowerCase().includes('general')) {
    score += 20;
    reasons.push('Category criteria satisfied');
  } else {
    missing.push('Category preference may apply');
  }

  // Location
  if ('location' in item && item.location.includes(user.location)) {
    score += 10;
    reasons.push('Available in your location');
  }

  // Skills (for jobs)
  if ('skills' in user && user.skills.length > 0 && 'description' in item) {
    const skillMatch = user.skills.some(skill =>
      item.description.toLowerCase().includes(skill.toLowerCase())
    );
    if (skillMatch) {
      score += 10;
      reasons.push('Your skills are relevant');
    }
  }

  // Determine status
  let status: EligibilityResult['status'];
  if (score >= 70) status = 'eligible';
  else if (score >= 40) status = 'partially-eligible';
  else status = 'not-eligible';

  return {
    status,
    score: Math.min(score, 100),
    reasons,
    missing,
  };
}

// Success Prediction
export function predictSuccess(
  user: UserProfile | null,
  item: Job | Scheme | Exam
): PredictionResult {
  if (!user) {
    return {
      probability: 0,
      recommendation: 'not-recommended',
      factors: {
        competition: 'Unknown',
        yourProfile: 'Incomplete',
        historical: 'No data',
      },
      tips: ['Complete your profile first'],
    };
  }

  const eligibility = checkEligibility(user, item);
  const baseProbability = eligibility.score;

  // Adjust based on category
  let adjustedProbability = baseProbability;
  if (user.category === 'SC' || user.category === 'ST') {
    adjustedProbability += 5; // Reservation advantage
  }
  if (user.category === 'OBC') {
    adjustedProbability += 3;
  }

  // Competition factor
  let competition = 'High';
  if ('salary' in item && item.salary.includes('₹50,000')) {
    competition = 'Very High';
    adjustedProbability -= 10;
  } else if ('salary' in item && item.salary.includes('₹20,000')) {
    competition = 'Moderate';
    adjustedProbability += 5;
  }

  if ('fee' in item && item.fee.includes('₹100')) {
    competition = 'Very High';
  }

  // Historical factor
  const historical = adjustedProbability > 70 ? 'Favorable trends' :
                     adjustedProbability > 50 ? 'Average success rate' :
                     'Low historical success';

  // Final probability
  const probability = Math.max(5, Math.min(95, adjustedProbability));

  // Recommendation
  let recommendation: PredictionResult['recommendation'];
  if (probability >= 75) recommendation = 'apply';
  else if (probability >= 45) recommendation = 'try-later';
  else recommendation = 'not-recommended';

  // Tips
  const tips: string[] = [];
  if (probability < 50) {
    tips.push('Consider gaining more experience or qualifications');
    tips.push('Look for similar opportunities with lower competition');
  } else if (probability < 75) {
    tips.push('Strengthen your application with relevant certifications');
    tips.push('Prepare thoroughly for interviews/exams');
  } else {
    tips.push('You have a strong profile - apply confidently');
    tips.push('Prepare supporting documents early');
  }

  return {
    probability,
    recommendation,
    factors: {
      competition,
      yourProfile: `${eligibility.reasons.length} criteria matched`,
      historical,
    },
    tips,
  };
}

// Resume Parser (Mock)
export function parseResume(resumeText: string): {
  skills: string[];
  education: string;
  experience: string;
} {
  const commonSkills = ['JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL',
    'HTML', 'CSS', 'Angular', 'Vue', 'PHP', 'C++', 'Data Analysis',
    'Machine Learning', 'Excel', 'Tally', 'Accounting', 'Nursing',
    'Patient Care', 'Teaching', 'Management'];

  const detectedSkills = commonSkills.filter(skill =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );

  const eduPatterns = [
    { pattern: /b\.tech|btech|bachelor of technology/i, edu: 'B.Tech' },
    { pattern: /bca|bachelor of computer/i, edu: 'BCA' },
    { pattern: /b\.sc|bsc|bachelor of science/i, edu: 'B.Sc' },
    { pattern: /b\.com|bcom|bachelor of commerce/i, edu: 'B.Com' },
    { pattern: /b\.a|ba|bachelor of arts/i, edu: 'B.A' },
    { pattern: /m\.tech|mtech|master of technology/i, edu: 'M.Tech' },
    { pattern: /mba|master of business/i, edu: 'MBA' },
    { pattern: /b\.ed|bed|bachelor of education/i, edu: 'B.Ed' },
    { pattern: /gnm|general nursing/i, edu: 'GNM' },
    { pattern: /b\.sc nursing/i, edu: 'B.Sc Nursing' },
    { pattern: /12th|hsc|higher secondary/i, edu: '12th Pass' },
    { pattern: /10th|ssc|secondary school/i, edu: '10th Pass' },
  ];

  let education = 'Not detected';
  for (const edu of eduPatterns) {
    if (edu.pattern.test(resumeText)) {
      education = edu.edu;
      break;
    }
  }

  // Extract experience
  const expMatch = resumeText.match(/(\d+)\+?\s*years?\s*(of\s*)?experience/i);
  const experience = expMatch ? `${expMatch[1]} years` : 'Not detected';

  return {
    skills: detectedSkills.length > 0 ? detectedSkills : ['General'],
    education,
    experience,
  };
}

// Chat Assistant
export function getChatResponse(userMessage: string): string {
  const lowerMsg = userMessage.toLowerCase();

  if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
    return 'Hello! I\'m UGOVA AI Assistant. How can I help you today? I can help with job searches, scheme eligibility, exam information, and more!';
  }

  if (lowerMsg.includes('job') || lowerMsg.includes('work')) {
    return 'I can help you find government jobs! Visit the Jobs page to browse all opportunities, or tell me your qualifications (education, age, location) and I\'ll recommend the best matches.';
  }

  if (lowerMsg.includes('scheme') || lowerMsg.includes('benefit') || lowerMsg.includes('subsidy')) {
    return 'Government schemes can provide financial support, housing, skill training, and more. Visit the Schemes page or tell me about yourself (farmer, student, business owner) for personalized recommendations.';
  }

  if (lowerMsg.includes('exam') || lowerMsg.includes('test') || lowerMsg.includes('competitive')) {
    return 'I can help you prepare for competitive exams! Visit the Exams page for upcoming exams, eligibility details, and syllabus information. I can also predict your success probability based on your profile.';
  }

  if (lowerMsg.includes('eligible') || lowerMsg.includes('qualification')) {
    return 'To check eligibility, I need to know your: 1) Education level, 2) Age, 3) Category (General/OBC/SC/ST), 4) Location. You can also complete your profile for automatic eligibility checks on all opportunities!';
  }

  if (lowerMsg.includes('resume') || lowerMsg.includes('cv') || lowerMsg.includes('upload')) {
    return 'You can upload your resume in the Profile section. I\'ll extract your skills, education, and experience to provide better recommendations. Supported formats: PDF, DOC, DOCX.';
  }

  if (lowerMsg.includes('apply') || lowerMsg.includes('application')) {
    return 'UGOVA helps you find and track applications. Click "Apply" on any opportunity to save it to your dashboard, then I\'ll redirect you to the official government website to complete the actual application.';
  }

  if (lowerMsg.includes('deadline') || lowerMsg.includes('last date')) {
    return 'I track all deadlines for you! Visit your Dashboard to see upcoming deadlines, and enable notifications to get email reminders before dates expire.';
  }

  if (lowerMsg.includes('thank')) {
    return 'You\'re welcome! Feel free to ask me anything else. I\'m here to help you navigate government opportunities efficiently!';
  }

  return 'I\'m here to assist with government jobs, schemes, and exams. Try asking about: job recommendations, scheme eligibility, exam dates, resume upload, or application tracking. What would you like to know?';
}
