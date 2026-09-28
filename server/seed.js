const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Application = require('./models/Application');
const LoginLog = require('./models/LoginLog');

dotenv.config();

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careerlog';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    await LoginLog.deleteMany({});
    await Application.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] Cleared old records...');

    // 1. Create Placement Admin User
    const adminUser = await User.create({
      name: 'Dr. S. Ramanathan (Placement Officer)',
      email: 'admin@careerlog.com',
      password: 'Admin@123',
      role: 'admin',
      college: 'Central Training & Placement Directorate',
      graduationYear: 2020,
      lastLogin: new Date(),
      loginCount: 14,
    });

    // 2. Create Demo Student 1
    const student1 = await User.create({
      name: 'Aditya Narayanan',
      email: 'demo@careerlog.com',
      password: 'Demo@123',
      role: 'student',
      college: 'Institute of Technology & Sciences',
      graduationYear: 2026,
      lastLogin: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
      loginCount: 9,
    });

    // 3. Create Student 2
    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@careerlog.com',
      password: 'Priya@123',
      role: 'student',
      college: 'School of Computer Engineering',
      graduationYear: 2026,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      loginCount: 5,
    });

    console.log('[Seed] Seeded Users:');
    console.log('   👨‍💼 Admin: admin@careerlog.com (Password: Admin@123)');
    console.log('   👨‍🎓 Student 1: demo@careerlog.com (Password: Demo@123)');
    console.log('   👩‍🎓 Student 2: priya@careerlog.com (Password: Priya@123)');

    const today = new Date();
    const subDays = (d) => {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      return date;
    };

    // 4. Seed Applications for Student 1 (Aditya)
    const adityaApps = [
      {
        user: student1._id,
        company: 'Google',
        role: 'Software Engineering Intern',
        jobType: 'Internship',
        location: 'Bangalore (Hybrid)',
        salary: '₹1,20,000/month',
        status: 'Offered',
        appliedDate: subDays(25),
        jobUrl: 'https://careers.google.com',
        notes: 'Round 1 DSA (Graphs/Trees) cleared. Round 2 System Design basics. Received formal offer letter!',
      },
      {
        user: student1._id,
        company: 'Microsoft',
        role: 'Graduate Software Engineer',
        jobType: 'Full-Time',
        location: 'Hyderabad',
        salary: '18 LPA',
        status: 'Interviewing',
        appliedDate: subDays(14),
        jobUrl: 'https://careers.microsoft.com',
        notes: 'Online assessment cleared with 100% score. Technical Round 2 scheduled for this Friday.',
      },
      {
        user: student1._id,
        company: 'Razorpay',
        role: 'Full-Stack Developer Intern',
        jobType: 'Internship',
        location: 'Bangalore (On-site)',
        salary: '₹45,000/month',
        status: 'Interviewing',
        appliedDate: subDays(8),
        jobUrl: 'https://razorpay.com/jobs',
        notes: 'Assignment round submitted: React + Node.js payment webhook simulation.',
      },
      {
        user: student1._id,
        company: 'Zoho Corporation',
        role: 'Member Technical Staff',
        jobType: 'Full-Time',
        location: 'Chennai (On-site)',
        salary: '8.5 LPA',
        status: 'Offered',
        appliedDate: subDays(30),
        notes: 'Campus drive placement offer. HR discussion completed. Offer letter accepted.',
      },
      {
        user: student1._id,
        company: 'Amazon',
        role: 'Cloud Support Associate',
        jobType: 'Full-Time',
        location: 'Chennai (Hybrid)',
        salary: '14 LPA',
        status: 'Applied',
        appliedDate: subDays(4),
        notes: 'Applied through Amazon University portal with referral.',
      },
      {
        user: student1._id,
        company: 'Swiggy',
        role: 'Backend Engineering Intern',
        jobType: 'Internship',
        location: 'Remote',
        salary: '₹40,000/month',
        status: 'Applied',
        appliedDate: subDays(2),
        notes: 'Applied via LinkedIn Easy Apply. Resume screened.',
      },
      {
        user: student1._id,
        company: 'Infosys',
        role: 'Specialist Programmer',
        jobType: 'Full-Time',
        location: 'Mysore (Training)',
        salary: '9.5 LPA',
        status: 'Offered',
        appliedDate: subDays(35),
        notes: 'HackWithInfy finalist direct interview cleared.',
      },
      {
        user: student1._id,
        company: 'Tata Consultancy Services',
        role: 'Prime Software Engineer',
        jobType: 'Full-Time',
        location: 'Pune',
        salary: '9.0 LPA',
        status: 'Rejected',
        appliedDate: subDays(40),
        notes: 'TCS NQT score eligible, but rejected in final managerial interview round.',
      },
    ];

    // 5. Seed Applications for Student 2 (Priya)
    const priyaApps = [
      {
        user: student2._id,
        company: 'Cisco Systems',
        role: 'Network Engineer Intern',
        jobType: 'Internship',
        location: 'Bangalore',
        salary: '₹55,000/month',
        status: 'Offered',
        appliedDate: subDays(20),
        notes: 'Campus interview cleared. Offer confirmed.',
      },
      {
        user: student2._id,
        company: 'Adobe',
        role: 'Product Engineering Intern',
        jobType: 'Internship',
        location: 'Noida',
        salary: '₹1,00,000/month',
        status: 'Interviewing',
        appliedDate: subDays(10),
        notes: 'Round 1 technical interview cleared.',
      },
      {
        user: student2._id,
        company: 'Oracle',
        role: 'Associate Consultant',
        jobType: 'Full-Time',
        location: 'Hyderabad',
        salary: '11 LPA',
        status: 'Applied',
        appliedDate: subDays(6),
        notes: 'Applied on Oracle campus drive portal.',
      },
    ];

    await Application.insertMany([...adityaApps, ...priyaApps]);
    console.log(`[Seed] Seeded ${adityaApps.length + priyaApps.length} campus applications.`);

    // 6. Seed Realistic Login Audit Trail in LoginLog
    const now = Date.now();
    await LoginLog.create([
      {
        user: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin',
        ip: '192.168.1.10 (Faculty Hub)',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
        loginTime: new Date(now - 5 * 60 * 1000), // 5 mins ago
        status: 'Success',
      },
      {
        user: student1._id,
        name: student1.name,
        email: student1.email,
        role: 'student',
        ip: '192.168.1.45 (Campus Wi-Fi)',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/128.0',
        loginTime: new Date(now - 35 * 60 * 1000), // 35 mins ago
        status: 'Success',
      },
      {
        user: student2._id,
        name: student2.name,
        email: student2.email,
        role: 'student',
        ip: '10.20.4.112 (Hostel LAN)',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        loginTime: new Date(now - 2 * 60 * 60 * 1000), // 2 hours ago
        status: 'Success',
      },
      {
        user: student1._id,
        name: student1.name,
        email: student1.email,
        role: 'student',
        ip: '192.168.1.45 (Campus Wi-Fi)',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        loginTime: new Date(now - 6 * 60 * 60 * 1000), // 6 hours ago
        status: 'Success',
      },
      {
        user: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        role: 'admin',
        ip: '192.168.1.10 (Faculty Hub)',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        loginTime: new Date(now - 24 * 60 * 60 * 1000), // Yesterday
        status: 'Success',
      },
      {
        user: student2._id,
        name: student2.name,
        email: student2.email,
        role: 'student',
        ip: '10.20.4.112 (Hostel LAN)',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        loginTime: new Date(now - 28 * 60 * 60 * 1000), // Yesterday
        status: 'Success',
      },
    ]);

    console.log('[Seed] Seeded 6 login audit records for Admin Monitoring.');
    console.log('[Seed] Database initialization complete!');
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]', err);
    process.exit(1);
  }
};

seedDB();