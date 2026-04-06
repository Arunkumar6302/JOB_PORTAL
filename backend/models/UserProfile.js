const pool = require('../config/database');

class UserProfile {
  static async ensureTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        profile_photo_url TEXT,
        display_name VARCHAR(120),
        headline VARCHAR(180),
        basic_details JSONB NOT NULL DEFAULT '{}'::jsonb,
        education_details JSONB NOT NULL DEFAULT '[]'::jsonb,
        internships JSONB NOT NULL DEFAULT '[]'::jsonb,
        work_experience JSONB NOT NULL DEFAULT '[]'::jsonb,
        skills JSONB NOT NULL DEFAULT '[]'::jsonb,
        subsets JSONB NOT NULL DEFAULT '[]'::jsonb,
        languages JSONB NOT NULL DEFAULT '[]'::jsonb,
        projects JSONB NOT NULL DEFAULT '[]'::jsonb,
        accomplishments JSONB NOT NULL DEFAULT '{}'::jsonb,
        extra_curricular_activities JSONB NOT NULL DEFAULT '[]'::jsonb,
        resume_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
    `;

    await pool.query(query);
  }

  static getDefaultProfile(user) {
    return {
      userId: user.id,
      profilePhotoUrl: '',
      displayName: user.name || '',
      headline: '',
      basicDetails: {
        fullName: user.name || '',
        email: user.email || '',
        phone: '',
        dateOfBirth: '',
        gender: '',
        currentLocation: '',
        preferredLocation: '',
        professionalSummary: ''
      },
      educationDetails: [],
      internships: [],
      workExperience: [],
      skills: [],
      subsets: [],
      languages: [],
      projects: [],
      accomplishments: {
        certifications: [],
        patents: [],
        awards: [],
        achievements: [],
        scholarships: []
      },
      extraCurricularActivities: [],
      resumeUrl: '',
      updatedAt: null
    };
  }

  static mapRowToProfile(row, user) {
    const defaultProfile = this.getDefaultProfile(user);
    if (!row) {
      return defaultProfile;
    }

    return {
      userId: row.user_id,
      profilePhotoUrl: row.profile_photo_url || '',
      displayName: row.display_name || user.name || '',
      headline: row.headline || '',
      basicDetails: {
        ...defaultProfile.basicDetails,
        ...(row.basic_details || {})
      },
      educationDetails: row.education_details || [],
      internships: row.internships || [],
      workExperience: row.work_experience || [],
      skills: row.skills || [],
      subsets: row.subsets || [],
      languages: row.languages || [],
      projects: row.projects || [],
      accomplishments: {
        ...defaultProfile.accomplishments,
        ...(row.accomplishments || {})
      },
      extraCurricularActivities: row.extra_curricular_activities || [],
      resumeUrl: row.resume_url || '',
      updatedAt: row.updated_at
    };
  }

  static async getByUserId(user) {
    await this.ensureTable();

    const query = 'SELECT * FROM user_profiles WHERE user_id = $1';
    const result = await pool.query(query, [user.id]);
    return this.mapRowToProfile(result.rows[0], user);
  }

  static sanitizeProfileData(data, user) {
    return {
      profilePhotoUrl: data.profilePhotoUrl || '',
      displayName: data.displayName || user.name || '',
      headline: data.headline || '',
      basicDetails: data.basicDetails || {},
      educationDetails: Array.isArray(data.educationDetails) ? data.educationDetails : [],
      internships: Array.isArray(data.internships) ? data.internships : [],
      workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
      skills: Array.isArray(data.skills) ? data.skills : [],
      subsets: Array.isArray(data.subsets) ? data.subsets : [],
      languages: Array.isArray(data.languages) ? data.languages : [],
      projects: Array.isArray(data.projects) ? data.projects : [],
      accomplishments: data.accomplishments || {
        certifications: [],
        patents: [],
        awards: [],
        achievements: [],
        scholarships: []
      },
      extraCurricularActivities: Array.isArray(data.extraCurricularActivities)
        ? data.extraCurricularActivities
        : [],
      resumeUrl: data.resumeUrl || ''
    };
  }

  static async upsertByUserId(user, data) {
    await this.ensureTable();
    const profile = this.sanitizeProfileData(data, user);

    const query = `
      INSERT INTO user_profiles (
        user_id,
        profile_photo_url,
        display_name,
        headline,
        basic_details,
        education_details,
        internships,
        work_experience,
        skills,
        subsets,
        languages,
        projects,
        accomplishments,
        extra_curricular_activities,
        resume_url,
        updated_at
      )
      VALUES (
        $1, $2, $3, $4, $5::jsonb, $6::jsonb, $7::jsonb, $8::jsonb,
        $9::jsonb, $10::jsonb, $11::jsonb, $12::jsonb, $13::jsonb, $14::jsonb, $15, CURRENT_TIMESTAMP
      )
      ON CONFLICT (user_id) DO UPDATE SET
        profile_photo_url = EXCLUDED.profile_photo_url,
        display_name = EXCLUDED.display_name,
        headline = EXCLUDED.headline,
        basic_details = EXCLUDED.basic_details,
        education_details = EXCLUDED.education_details,
        internships = EXCLUDED.internships,
        work_experience = EXCLUDED.work_experience,
        skills = EXCLUDED.skills,
        subsets = EXCLUDED.subsets,
        languages = EXCLUDED.languages,
        projects = EXCLUDED.projects,
        accomplishments = EXCLUDED.accomplishments,
        extra_curricular_activities = EXCLUDED.extra_curricular_activities,
        resume_url = EXCLUDED.resume_url,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      user.id,
      profile.profilePhotoUrl,
      profile.displayName,
      profile.headline,
      JSON.stringify(profile.basicDetails),
      JSON.stringify(profile.educationDetails),
      JSON.stringify(profile.internships),
      JSON.stringify(profile.workExperience),
      JSON.stringify(profile.skills),
      JSON.stringify(profile.subsets),
      JSON.stringify(profile.languages),
      JSON.stringify(profile.projects),
      JSON.stringify(profile.accomplishments),
      JSON.stringify(profile.extraCurricularActivities),
      profile.resumeUrl
    ];

    const result = await pool.query(query, values);
    return this.mapRowToProfile(result.rows[0], user);
  }
}

module.exports = UserProfile;
