const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./config/db');
const User = require('./models/User');
const StudentProfile = require('./models/StudentProfile');
const Opportunity = require('./models/Opportunity');
const Application = require('./models/Application');
const Certificate = require('./models/Certificate');
const Project = require('./models/Project');
const Assessment = require('./models/Assessment');
const { calculateSkillMatch } = require('./utils/skillMatcher');

const seedData = async (shouldExit = true) => {
  try {
    console.log('[SEED] Clearing existing records...');
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    await Certificate.deleteMany({});
    await Project.deleteMany({});
    await Assessment.deleteMany({});

    console.log('[SEED] Creating default users...');
    // 1. College Admin
    const admin = await User.create({
      name: 'Prof. Robert Vance',
      email: 'admin@skillbridge.edu',
      password: 'Password123!',
      role: 'admin',
      college: 'Institute of Advanced Technology',
    });

    // 2. Industry Recruiter
    const recruiter = await User.create({
      name: 'Sarah Jenkins',
      email: 'recruiter@techcorp.com',
      password: 'Password123!',
      role: 'recruiter',
      company: 'TechCorp Labs',
    });

    const recruiter2 = await User.create({
      name: 'David Miller',
      email: 'david@cloudscale.io',
      password: 'Password123!',
      role: 'recruiter',
      company: 'CloudScale Systems',
    });

    // 3. Students
    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'student@skillbridge.edu',
      password: 'Password123!',
      role: 'student',
      college: 'Institute of Advanced Technology',
    });

    const student2 = await User.create({
      name: 'Maya Patel',
      email: 'maya.patel@skillbridge.edu',
      password: 'Password123!',
      role: 'student',
      college: 'Institute of Advanced Technology',
    });

    console.log('[SEED] Creating student profiles...');
    const alexProfile = await StudentProfile.create({
      user: student1._id,
      name: student1.name,
      email: student1.email,
      college: student1.college,
      branch: 'Computer Science & Engineering',
      graduationYear: 2026,
      skills: ['React', 'JavaScript', 'HTML/CSS', 'Git', 'Tailwind CSS', 'Node.js'],
      interests: ['Frontend Engineering', 'Full Stack Architecture', 'Open Source'],
      bio: 'Enthusiastic final-year CSE undergraduate passionate about building scalable, accessible web applications and modern interactive experiences.',
      resumeUrl: 'https://skillbridge.example/resumes/alex-rivera-resume.pdf',
      roleReadiness: {
        frontend: {
          percentage: 85,
          strengths: ['React & State Management', 'Modern JavaScript (ES6+)', 'Git & Version Control'],
          gaps: ['TypeScript', 'Testing (Jest/Cypress)'],
          recommendation: 'You are 85% ready for Frontend Developer. Improve TypeScript and Testing.',
        },
        dataAnalyst: {
          percentage: 50,
          strengths: ['Problem Solving & Incident Response'],
          gaps: ['SQL & Data Aggregation', 'Data Cleaning & Python/Pandas'],
          recommendation: 'You are 50% ready for Data Analyst. Improve SQL and Python.',
        },
        backend: {
          percentage: 70,
          strengths: ['RESTful API Architecture', 'Node.js & Express Middleware'],
          gaps: ['Database Design & Indexing'],
          recommendation: 'You are 70% ready for Backend Developer. Improve Database Indexing.',
        },
      },
    });

    const mayaProfile = await StudentProfile.create({
      user: student2._id,
      name: student2.name,
      email: student2.email,
      college: student2.college,
      branch: 'Data Science & Artificial Intelligence',
      graduationYear: 2026,
      skills: ['Python', 'SQL', 'Pandas', 'Git', 'Data Visualization', 'Machine Learning', 'Tableau'],
      interests: ['Predictive Analytics', 'Business Intelligence', 'Data Engineering'],
      bio: 'Data Science major with expertise in exploratory data analysis, statistical modeling, and relational database querying.',
      resumeUrl: 'https://skillbridge.example/resumes/maya-patel-resume.pdf',
      roleReadiness: {
        frontend: {
          percentage: 45,
          strengths: ['Git & Version Control'],
          gaps: ['React & State Management', 'Modern JavaScript (ES6+)'],
          recommendation: 'You are 45% ready for Frontend Developer. Improve React and JavaScript.',
        },
        dataAnalyst: {
          percentage: 90,
          strengths: ['SQL & Data Aggregation', 'Data Cleaning & Python/Pandas', 'Problem Solving'],
          gaps: ['Advanced A/B Testing'],
          recommendation: 'You are 90% ready for Data Analyst. Excellent command of core analytical tools!',
        },
        backend: {
          percentage: 60,
          strengths: ['Database Design & Indexing', 'SQL'],
          gaps: ['RESTful API Architecture', 'Node.js & Express Middleware'],
          recommendation: 'You are 60% ready for Backend Developer. Improve Express and REST.',
        },
      },
    });

    console.log('[SEED] Creating sample opportunities...');
    const opp1 = await Opportunity.create({
      recruiter: recruiter._id,
      title: 'Frontend Engineering Intern',
      company: 'TechCorp Labs',
      type: 'Internship',
      location: 'Remote',
      stipendOrSalary: '₹35,000 / month',
      duration: '6 Months',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      description: 'Join our design systems engineering squad building next-generation web portals. You will craft reusable component libraries in React, integrate RESTful APIs, and participate in daily agile standups.',
      requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'Git'],
      eligibility: 'Pre-final or final year B.Tech / MCA students. Strong grasp of modern JavaScript and component architecture.',
      status: 'active',
    });

    const opp2 = await Opportunity.create({
      recruiter: recruiter2._id,
      title: 'Junior Backend Developer',
      company: 'CloudScale Systems',
      type: 'Job',
      location: 'Bangalore, India',
      stipendOrSalary: '₹12 - 15 LPA',
      duration: 'Full Time',
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      description: 'Seeking a proactive Junior Backend Developer to assist in architecting high-throughput microservices, managing MongoDB cluster replication, and building secure RESTful authorization endpoints.',
      requiredSkills: ['Node.js', 'Express', 'MongoDB', 'REST APIs', 'Git'],
      eligibility: 'Graduating batch of 2025/2026. Prior internship or production project experience preferred.',
      status: 'active',
    });

    const opp3 = await Opportunity.create({
      recruiter: recruiter._id,
      title: 'Data Analyst Intern',
      company: 'TechCorp Labs',
      type: 'Internship',
      location: 'Hyderabad, India',
      stipendOrSalary: '₹30,000 / month',
      duration: '3 Months',
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      description: 'Work alongside senior analysts to build executive dashboards, clean behavioral customer telemetry, and generate SQL queries on petabyte-scale data lakes.',
      requiredSkills: ['SQL', 'Python', 'Pandas', 'Statistics', 'Git'],
      eligibility: 'Open to B.Tech, M.Tech, and Data Science students with strong problem-solving skills.',
      status: 'active',
    });

    const opp4 = await Opportunity.create({
      recruiter: recruiter2._id,
      title: 'Full Stack Associate Software Engineer',
      company: 'CloudScale Systems',
      type: 'Job',
      location: 'Pune, India',
      stipendOrSalary: '₹9 - 13 LPA',
      duration: 'Full Time',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      description: 'Develop full stack cloud solutions using React on the frontend and Node.js with MongoDB on the backend. Ideal for enthusiastic engineers who love shipping end-to-end features.',
      requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'REST APIs'],
      eligibility: 'Min 7.0 CGPA, B.Tech / B.E. / M.Tech in CS, IT, or related fields.',
      status: 'active',
    });

    console.log('[SEED] Creating applications with smart match calculation...');
    const match1 = calculateSkillMatch(opp1.requiredSkills, alexProfile.skills);
    await Application.create({
      opportunity: opp1._id,
      student: student1._id,
      studentProfile: alexProfile._id,
      matchScore: match1.matchPercentage,
      matchedSkills: match1.matchedSkills,
      missingSkills: match1.missingSkills,
      recommendationMessage: match1.recommendationMessage,
      status: 'Interview',
      notes: 'I have hands-on experience building React applications with Tailwind CSS and Git version control.',
      statusHistory: [
        { status: 'Applied', updatedAt: new Date(Date.now() - 5 * 86400000), comment: 'Application submitted' },
        { status: 'Shortlisted', updatedAt: new Date(Date.now() - 3 * 86400000), comment: 'Profile and match score meet criteria' },
        { status: 'Interview', updatedAt: new Date(Date.now() - 1 * 86400000), comment: 'Technical interview scheduled for Friday 2 PM' },
      ],
    });

    const match2 = calculateSkillMatch(opp2.requiredSkills, alexProfile.skills);
    await Application.create({
      opportunity: opp2._id,
      student: student1._id,
      studentProfile: alexProfile._id,
      matchScore: match2.matchPercentage,
      matchedSkills: match2.matchedSkills,
      missingSkills: match2.missingSkills,
      recommendationMessage: match2.recommendationMessage,
      status: 'Applied',
      notes: 'Excited about backend engineering and expanding my Node.js skillset.',
      statusHistory: [
        { status: 'Applied', updatedAt: new Date(Date.now() - 2 * 86400000), comment: 'Application submitted' },
      ],
    });

    const match3 = calculateSkillMatch(opp3.requiredSkills, mayaProfile.skills);
    await Application.create({
      opportunity: opp3._id,
      student: student2._id,
      studentProfile: mayaProfile._id,
      matchScore: match3.matchPercentage,
      matchedSkills: match3.matchedSkills,
      missingSkills: match3.missingSkills,
      recommendationMessage: match3.recommendationMessage,
      status: 'Selected',
      notes: 'Strong background in Python and complex SQL query optimization.',
      statusHistory: [
        { status: 'Applied', updatedAt: new Date(Date.now() - 8 * 86400000), comment: 'Applied' },
        { status: 'Shortlisted', updatedAt: new Date(Date.now() - 6 * 86400000), comment: 'High match score' },
        { status: 'Interview', updatedAt: new Date(Date.now() - 4 * 86400000), comment: 'Cleared technical interview' },
        { status: 'Selected', updatedAt: new Date(Date.now() - 1 * 86400000), comment: 'Offer letter dispatched' },
      ],
    });

    console.log('[SEED] Creating digital portfolio projects & certificates...');
    await Certificate.create({
      student: student1._id,
      title: 'Meta Front-End Developer Professional Certificate',
      issuer: 'Coursera / Meta',
      issueDate: new Date('2025-08-15'),
      credentialUrl: 'https://coursera.org/verify/META-FE-99201',
      verificationStatus: 'verified',
      verifiedBy: admin._id,
      verifiedAt: new Date(),
      notes: 'Verified via credential link and academic registry.',
    });

    await Certificate.create({
      student: student1._id,
      title: 'AWS Certified Cloud Practitioner (CLF-C02)',
      issuer: 'Amazon Web Services',
      issueDate: new Date('2025-11-20'),
      credentialUrl: 'https://aws.amazon.com/verification/AWS-CCP-4821',
      verificationStatus: 'pending',
      notes: 'Submitted for College Admin verification.',
    });

    await Project.create({
      student: student1._id,
      title: 'DevConnect - Developer Collaboration Network',
      description: 'A full-stack social portal for developers featuring markdown article publishing, project showcases, real-time comment threads, and Github OAuth.',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS'],
      repoUrl: 'https://github.com/alexrivera/devconnect',
      liveUrl: 'https://devconnect-demo.example.com',
      verificationStatus: 'verified',
      verifiedBy: admin._id,
      verifiedAt: new Date(),
      notes: 'Capstone project approved by Department Review Board.',
    });

    await Project.create({
      student: student1._id,
      title: 'AlgoVision - Algorithm Visualizer',
      description: 'An interactive visualization engine simulating Dijkstra, A* Pathfinding, and QuickSort with real-time speed regulation and step-through debugging.',
      technologies: ['React', 'JavaScript', 'HTML5 Canvas', 'CSS'],
      repoUrl: 'https://github.com/alexrivera/algovision',
      liveUrl: 'https://algovision-demo.example.com',
      verificationStatus: 'pending',
      notes: 'Independent project submitted for verification.',
    });

    console.log('[SEED] Creating sample assessment history...');
    await Assessment.create({
      student: student1._id,
      answers: [
        { questionId: 1, questionText: 'React side effects', selectedOption: 'useEffect', isCorrect: true, category: 'Technical', competency: 'React & State Management' },
        { questionId: 2, questionText: 'JavaScript Event Loop', selectedOption: 'Asynchronous code does not block the main thread and relies on the Event Loop and Callback Queue', isCorrect: true, category: 'Technical', competency: 'Modern JavaScript (ES6+)' },
        { questionId: 3, questionText: 'REST Idempotency', selectedOption: 'PUT', isCorrect: true, category: 'Technical', competency: 'RESTful API Architecture' },
        { questionId: 4, questionText: 'Express Middleware next()', selectedOption: 'The client request hangs indefinitely until a timeout occurs', isCorrect: true, category: 'Technical', competency: 'Node.js & Express Middleware' },
        { questionId: 5, questionText: 'Database Indexing', selectedOption: 'They speed up read query retrieval times at the cost of slight overhead on write operations', isCorrect: true, category: 'Technical', competency: 'Database Design & Indexing' },
        { questionId: 6, questionText: 'SQL HAVING vs WHERE', selectedOption: 'WHERE', isCorrect: false, category: 'Technical', competency: 'SQL & Data Aggregation' },
        { questionId: 7, questionText: 'Data Outliers', selectedOption: 'Ignore all missing rows and duplicate the outliers to balance variance', isCorrect: false, category: 'Technical', competency: 'Data Cleaning & Python/Pandas' },
        { questionId: 8, questionText: 'Git interactive rebase', selectedOption: 'It allows cleaning up commit history by squashing typo fixes and rewording messages for a linear history', isCorrect: true, category: 'Technical', competency: 'Git & Version Control' },
        { questionId: 9, questionText: 'Peer review disagreement', selectedOption: 'Ask clarifying questions about the trade-offs, share your concrete concerns with benchmarks or examples, and collaborate on the best trade-off', isCorrect: true, category: 'Soft Skills', competency: 'Team Collaboration & Code Review' },
        { questionId: 10, questionText: 'Production incident priority', selectedOption: 'Mitigate user impact immediately by rolling back or triggering a feature flag, communicate status to stakeholders, and investigate root cause via post-mortem afterwards', isCorrect: true, category: 'Soft Skills', competency: 'Problem Solving & Production Incident Response' },
      ],
      totalScore: 8,
      roleReadiness: alexProfile.roleReadiness,
      completedAt: new Date(Date.now() - 3 * 86400000),
    });

    console.log('===========================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('Demo Accounts:');
    console.log('1. Student:       student@skillbridge.edu   / Password123!');
    console.log('2. Recruiter:     recruiter@techcorp.com    / Password123!');
    console.log('3. College Admin: admin@skillbridge.edu     / Password123!');
    console.log('===========================================================');

    if (shouldExit) {
      process.exit(0);
    }
  } catch (err) {
    console.error('[SEED ERROR]:', err);
    if (shouldExit) {
      process.exit(1);
    }
  }
};

const seedIfEmpty = async () => {
  const count = await User.countDocuments();
  if (count === 0) {
    console.log('[DB] Database is empty. Seeding initial test data...');
    await seedData(false);
  } else {
    console.log(`[DB] Database contains ${count} existing users. Skipping auto-seed.`);
  }
};

if (require.main === module) {
  connectDB().then(() => seedData(true));
}

module.exports = { seedData, seedIfEmpty };