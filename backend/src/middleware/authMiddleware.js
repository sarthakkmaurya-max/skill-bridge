const jwt = require('jsonwebtoken');
const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const { isSupabaseConfigured, verifySupabaseToken } = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No token provided.',
    });
  }

  // 1. If Supabase is configured, first attempt to verify as a Supabase Auth JWT
  if (isSupabaseConfigured()) {
    try {
      const { user: supaUser, error: supaErr } = await verifySupabaseToken(token);
      if (supaUser && !supaErr) {
        // Find or link with local User model
        let localUser = await User.findOne({ email: supaUser.email.toLowerCase() });
        if (!localUser) {
          const role = supaUser.user_metadata?.role || 'student';
          const name = supaUser.user_metadata?.name || supaUser.email.split('@')[0];
          const college = supaUser.user_metadata?.college || '';
          const company = supaUser.user_metadata?.company || '';

          localUser = await User.create({
            name,
            email: supaUser.email.toLowerCase(),
            password: 'supabase_managed_account',
            role,
            college,
            company,
          });

          if (role === 'student') {
            await StudentProfile.create({
              user: localUser._id,
              name: localUser.name,
              email: localUser.email,
              college: localUser.college,
              skills: ['JavaScript', 'HTML/CSS', 'Git'],
              interests: ['Web Development'],
            });
          }
        }

        req.user = localUser;
        req.isSupabase = true;
        return next();
      }
    } catch (supaCheckErr) {
      // Proceed to local token check
    }
  }

  // 2. Local JWT verification fallback
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'skillbridge_super_secure_jwt_secret_key_2026');
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
      error: err.message,
    });
  }
};

module.exports = { protect };