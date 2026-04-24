// Complete mock data for UGOVA - works without Supabase connection
// When Supabase is connected, data syncs to DB

export interface Job {
  id: string;
  title: string;
  organization: string;
  location: string;
  type: string;
  salary: string;
  lastDate: string;
  eligibility: string;
  category: string;
  description: string;
  applyLink: string;
  postedDate: string;
  status: 'active' | 'closed' | 'upcoming';
}

export interface Scheme {
  id: string;
  title: string;
  ministry: string;
  category: string;
  benefit: string;
  eligibility: string;
  lastDate: string;
  description: string;
  applyLink: string;
  status: 'active' | 'closed';
}

export interface Exam {
  id: string;
  title: string;
  organization: string;
  examDate: string;
  lastDate: string;
  eligibility: string;
  syllabus: string;
  fee: string;
  applyLink: string;
  status: 'upcoming' | 'ongoing' | 'closed';
}

export interface Application {
  id: string;
  userId: string;
  type: 'job' | 'scheme' | 'exam';
  itemId: string;
  title: string;
  organization: string;
  appliedDate: string;
  status: 'applied' | 'in-progress' | 'rejected' | 'selected';
  lastDate: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deadline' | 'update' | 'success' | 'alert';
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  education: string;
  category: string;
  age: number;
  location: string;
  skills: string[];
  experience: string;
  resumeUrl: string;
  documents: Document[];
  createdAt: string;
}

export interface Document {
  id: string;
  type: string;
  url: string;
  status: 'pending' | 'verified' | 'rejected';
  uploadedAt: string;
}

// Mock Jobs
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    title: 'Junior Software Developer',
    organization: 'National Informatics Centre (NIC)',
    location: 'Delhi, Mumbai, Bangalore',
    type: 'Full-time',
    salary: '₹35,000 - ₹50,000/month',
    lastDate: '2024-07-15',
    eligibility: 'B.Tech/BCA in Computer Science, Age 18-30',
    category: 'IT',
    description: 'Develop and maintain government digital infrastructure. Work on e-governance projects, web applications, and digital services.',
    applyLink: 'https://www.nic.in',
    postedDate: '2024-06-01',
    status: 'active',
  },
  {
    id: 'job-2',
    title: 'Bank Probationary Officer',
    organization: 'State Bank of India (SBI)',
    location: 'All India',
    type: 'Full-time',
    salary: '₹42,000 - ₹65,000/month',
    lastDate: '2024-08-10',
    eligibility: 'Graduate in any discipline, Age 20-30',
    category: 'Banking',
    description: 'Entry-level management position in India\'s largest bank. Responsible for banking operations, customer service, and loan processing.',
    applyLink: 'https://www.sbi.co.in',
    postedDate: '2024-06-05',
    status: 'active',
  },
  {
    id: 'job-3',
    title: 'UPSC Civil Services - IAS Officer',
    organization: 'Union Public Service Commission',
    location: 'All India',
    type: 'Permanent',
    salary: '₹56,100 - ₹2,50,000/month',
    lastDate: '2024-02-20',
    eligibility: 'Graduate in any discipline, Age 21-32',
    category: 'Civil Services',
    description: 'Administrative service of India. IAS officers handle administration, policy formulation, and implementation at district, state, and central levels.',
    applyLink: 'https://www.upsc.gov.in',
    postedDate: '2024-01-15',
    status: 'active',
  },
  {
    id: 'job-4',
    title: 'Railway Technician Grade-III',
    organization: 'Indian Railways (RRB)',
    location: 'All India',
    type: 'Full-time',
    salary: '₹19,900 - ₹35,000/month',
    lastDate: '2024-09-01',
    eligibility: 'ITI/Diploma in relevant trade, Age 18-33',
    category: 'Technical',
    description: 'Maintain and repair railway equipment, signals, and rolling stock. Work in workshops and maintenance depots.',
    applyLink: 'https://www.rrbcdg.gov.in',
    postedDate: '2024-06-10',
    status: 'active',
  },
  {
    id: 'job-5',
    title: 'Nurse Grade-A',
    organization: 'AIIMS (All India Institute)',
    location: 'Delhi',
    type: 'Full-time',
    salary: '₹44,900 - ₹65,000/month',
    lastDate: '2024-07-30',
    eligibility: 'B.Sc Nursing/GNM, Registration with NMC',
    category: 'Healthcare',
    description: 'Provide patient care in premier medical institution. Work in specialized departments and emergency services.',
    applyLink: 'https://www.aiims.edu',
    postedDate: '2024-06-12',
    status: 'active',
  },
  {
    id: 'job-6',
    title: 'Teacher - Primary Level',
    organization: 'Kendriya Vidyalaya Sangathan (KVS)',
    location: 'All India',
    type: 'Full-time',
    salary: '₹35,400 - ₹65,000/month',
    lastDate: '2024-08-20',
    eligibility: 'B.Ed + CTET Qualified, Age 18-40',
    category: 'Education',
    description: 'Teach students in central government schools. Develop curriculum plans, conduct classes, and evaluate students.',
    applyLink: 'https://www.kvsangathan.nic.in',
    postedDate: '2024-06-15',
    status: 'active',
  },
];

// Mock Schemes
export const mockSchemes: Scheme[] = [
  {
    id: 'scheme-1',
    title: 'PM Kisan Samman Nidhi',
    ministry: 'Ministry of Agriculture',
    category: 'Agriculture',
    benefit: '₹6,000/year (₹2,000 every 4 months)',
    eligibility: 'Small and marginal farmers with landholding',
    lastDate: 'Ongoing',
    description: 'Direct income support to farmer families. Financial assistance transferred directly to bank accounts in three installments.',
    applyLink: 'https://pmkisan.gov.in',
    status: 'active',
  },
  {
    id: 'scheme-2',
    title: 'Pradhan Mantri Awas Yojana (PMAY)',
    ministry: 'Ministry of Housing',
    category: 'Housing',
    benefit: 'Housing subsidy up to ₹2.67 lakh',
    eligibility: 'EWS/LIG families without pucca house',
    lastDate: '2024-12-31',
    description: 'Housing for all by 2024. Provides affordable housing with interest subsidy on home loans for economically weaker sections.',
    applyLink: 'https://pmaymis.gov.in',
    status: 'active',
  },
  {
    id: 'scheme-3',
    title: 'Startup India Seed Fund Scheme',
    ministry: 'Ministry of Commerce',
    category: 'Business',
    benefit: 'Funding up to ₹20 lakh',
    eligibility: 'DPIIT-recognized startups less than 2 years old',
    lastDate: '2024-09-30',
    description: 'Financial assistance to startups for proof of concept, prototype development, product trials, and market entry.',
    applyLink: 'https://seedfund.startupindia.gov.in',
    status: 'active',
  },
  {
    id: 'scheme-4',
    title: 'Digital India Bhashini',
    ministry: 'Ministry of Electronics',
    category: 'Technology',
    benefit: 'AI-powered language translation services',
    eligibility: 'All Indian citizens',
    lastDate: 'Ongoing',
    description: 'Enable citizens to access digital services in their own language. AI-driven multilingual platform for government services.',
    applyLink: 'https://bhashini.gov.in',
    status: 'active',
  },
  {
    id: 'scheme-5',
    title: 'Mudra Loan (PMMY)',
    ministry: 'Ministry of Finance',
    category: 'Finance',
    benefit: 'Loan up to ₹10 lakh without collateral',
    eligibility: 'Small business owners, entrepreneurs, artisans',
    lastDate: 'Ongoing',
    description: 'Micro Units Development & Refinance Agency. Loans for non-farm small/micro enterprises for income generation activities.',
    applyLink: 'https://www.mudra.org.in',
    status: 'active',
  },
  {
    id: 'scheme-6',
    title: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
    ministry: 'Ministry of Skill Development',
    category: 'Skills',
    benefit: 'Free skill training + certification + job placement',
    eligibility: 'Youth aged 15-45 years',
    lastDate: '2024-12-31',
    description: 'Flagship skill development scheme. Industry-relevant training, NSQF certification, and placement assistance.',
    applyLink: 'https://pmkvyofficial.org',
    status: 'active',
  },
];

// Mock Exams
export const mockExams: Exam[] = [
  {
    id: 'exam-1',
    title: 'JEE Main 2024',
    organization: 'NTA (National Testing Agency)',
    examDate: '2024-04-01',
    lastDate: '2024-02-29',
    eligibility: '12th pass with PCM, Age no limit',
    syllabus: 'Physics, Chemistry, Mathematics (Class 11-12 NCERT)',
    fee: '₹1,000 (General), ₹800 (Reserved)',
    applyLink: 'https://jeemain.nta.nic.in',
    status: 'upcoming',
  },
  {
    id: 'exam-2',
    title: 'NEET UG 2024',
    organization: 'NTA (National Testing Agency)',
    examDate: '2024-05-05',
    lastDate: '2024-03-09',
    eligibility: '12th pass with PCB, Age 17+',
    syllabus: 'Physics, Chemistry, Biology (Class 11-12 NCERT)',
    fee: '₹1,700 (General), ₹1,600 (Reserved)',
    applyLink: 'https://neet.nta.nic.in',
    status: 'upcoming',
  },
  {
    id: 'exam-3',
    title: 'UPSC CSE Prelims 2024',
    organization: 'Union Public Service Commission',
    examDate: '2024-05-26',
    lastDate: '2024-02-20',
    eligibility: 'Graduate in any discipline, Age 21-32',
    syllabus: 'General Studies, CSAT (Aptitude)',
    fee: '₹100 (General), Free (Female/SC/ST)',
    applyLink: 'https://www.upsc.gov.in',
    status: 'upcoming',
  },
  {
    id: 'exam-4',
    title: 'SSC CGL 2024',
    organization: 'Staff Selection Commission',
    examDate: '2024-09-01',
    lastDate: '2024-07-24',
    eligibility: 'Graduate in any discipline, Age 18-32',
    syllabus: 'Quantitative Aptitude, English, Reasoning, General Awareness',
    fee: '₹100 (General), Free (Female/SC/ST)',
    applyLink: 'https://ssc.gov.in',
    status: 'upcoming',
  },
  {
    id: 'exam-5',
    title: 'Railway NTPC 2024',
    organization: 'RRB (Railway Recruitment Board)',
    examDate: '2024-08-15',
    lastDate: '2024-07-10',
    eligibility: '12th pass, Age 18-33',
    syllabus: 'General Awareness, Mathematics, General Intelligence',
    fee: '₹500 (General), ₹250 (Reserved)',
    applyLink: 'https://www.rrbcdg.gov.in',
    status: 'upcoming',
  },
  {
    id: 'exam-6',
    title: 'IBPS PO 2024',
    organization: 'Institute of Banking Personnel',
    examDate: '2024-10-19',
    lastDate: '2024-08-21',
    eligibility: 'Graduate in any discipline, Age 20-30',
    syllabus: 'English, Quantitative Aptitude, Reasoning, General Awareness',
    fee: '₹850 (General), ₹175 (SC/ST)',
    applyLink: 'https://www.ibps.in',
    status: 'upcoming',
  },
];

// Mock Users for Admin
export const mockUsers: UserProfile[] = [
  {
    id: 'user-1',
    email: 'ramesh.kumar@email.com',
    name: 'Ramesh Kumar',
    role: 'user',
    education: 'B.Tech Computer Science',
    category: 'General',
    age: 24,
    location: 'Delhi',
    skills: ['JavaScript', 'React', 'Node.js'],
    experience: '1 year internship',
    resumeUrl: '',
    documents: [],
    createdAt: '2024-01-15',
  },
  {
    id: 'user-2',
    email: 'priya.sharma@email.com',
    name: 'Priya Sharma',
    role: 'user',
    education: 'B.Sc Nursing',
    category: 'OBC',
    age: 22,
    location: 'Mumbai',
    skills: ['Patient Care', 'Medical Records'],
    experience: 'Fresher',
    resumeUrl: '',
    documents: [],
    createdAt: '2024-02-10',
  },
  {
    id: 'user-3',
    email: 'amit.patel@email.com',
    name: 'Amit Patel',
    role: 'user',
    education: 'B.Com',
    category: 'General',
    age: 26,
    location: 'Ahmedabad',
    skills: ['Accounting', 'Tally', 'Excel'],
    experience: '2 years',
    resumeUrl: '',
    documents: [],
    createdAt: '2024-03-05',
  },
  {
    id: 'admin-1',
    email: 'bagalmukesh6@gmail.com',
    name: 'Mukesh Bagal',
    role: 'admin',
    education: 'M.Tech',
    category: 'General',
    age: 28,
    location: 'Pune',
    skills: ['System Admin', 'Full Stack'],
    experience: '5 years',
    resumeUrl: '',
    documents: [],
    createdAt: '2024-01-01',
  },
];

// Mock Applications
export const mockApplications: Application[] = [
  {
    id: 'app-1',
    userId: 'user-1',
    type: 'job',
    itemId: 'job-1',
    title: 'Junior Software Developer',
    organization: 'NIC',
    appliedDate: '2024-06-10',
    status: 'applied',
    lastDate: '2024-07-15',
  },
  {
    id: 'app-2',
    userId: 'user-1',
    type: 'exam',
    itemId: 'exam-3',
    title: 'UPSC CSE Prelims 2024',
    organization: 'UPSC',
    appliedDate: '2024-02-15',
    status: 'in-progress',
    lastDate: '2024-02-20',
  },
  {
    id: 'app-3',
    userId: 'user-2',
    type: 'job',
    itemId: 'job-5',
    title: 'Nurse Grade-A',
    organization: 'AIIMS',
    appliedDate: '2024-06-20',
    status: 'applied',
    lastDate: '2024-07-30',
  },
];

// Mock Notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Deadline Alert: NIC Job',
    message: 'Junior Software Developer application closes in 5 days. Apply now!',
    type: 'deadline',
    read: false,
    createdAt: '2024-07-10',
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'Welcome to UGOVA!',
    message: 'Your profile is set up. Start exploring opportunities now.',
    type: 'success',
    read: true,
    createdAt: '2024-06-01',
  },
  {
    id: 'notif-3',
    userId: 'user-2',
    title: 'New Scheme Alert',
    message: 'PM Kisan Samman Nidhi - You may be eligible for ₹6,000/year.',
    type: 'update',
    read: false,
    createdAt: '2024-06-15',
  },
];

// LocalStorage helpers for persistence
export const getFromStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const setToStorage = <T>(key: string, data: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore
  }
};

// Current user helper
export const getCurrentUser = (): UserProfile | null => {
  return getFromStorage('ugova_user', null);
};

export const setCurrentUser = (user: UserProfile | null): void => {
  setToStorage('ugova_user', user);
};
