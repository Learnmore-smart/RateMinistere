import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^Rate\d{5}$/.test(v) || !/^Rate/.test(v); // Allow Rate12345 format or any other format that doesn't start with "Rate"
      },
      message: 'Invalid username format'
    }
  },
  createdAt: {
    type: Date,
    default: () => {
      const now = new Date();
      return now;
    },
    get: (date) => {
      return date;
    }
  },
  profileDescription: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: null
  },
  lastUsernameUpdate: {
    type: Date,
    default: null
  },
  appearence: {
    customCursor: {
      type: Boolean,
      default: true
    },
    selectedTheme: {
      type: String,
      enum: ['light', 'dark', 'custom'],
      default: 'light'
    },
    backgroundColor: {
      type: String,
      default: null
    },
    gradientEndColor: {
      type: String,
      default: null
    },
    backgroundImage: {
      type: String,
      default: null
    },
  },
  privacySettings: {
    profileVisibility: {
      type: String,
      enum: ['public', 'private', 'friends'],
      default: 'public'
    },
    allowDirectMessages: {
      type: Boolean,
      default: true
    },
    showProfileInSearch: {
      type: Boolean,
      default: true
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    }
  },
  badges: {
    owned: [Number],
    current: {
      type: Number
    }
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  lastPointsAwarded: {
    type: Date
  },
  pointHistory: [{
    action: String,
    points: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { getters: true }
});

// Add a pre-save hook to log dates
userSchema.pre('save', function (next) {
  console.log('Saving user with createdAt:', this.createdAt?.toISOString());
  next();
});

export default mongoose?.models?.User || mongoose.model('User', userSchema, 'users');
