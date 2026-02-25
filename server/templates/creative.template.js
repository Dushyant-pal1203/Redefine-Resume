// templates/creative.template.js
module.exports = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{full_name}} - Creative Resume</title>

<style>
.resume-creative-wrapper {
  all: initial;
  display: block;
  font-family: 'Poppins', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2d3436;
  line-height: 1.5;
  font-size: 10px;
}

.resume-creative-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Container */
.resume-creative-wrapper .rc-container {
  background: white;
  border-radius: 40px 40px 30px 30px;
  box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
}

/* Creative Header with Wave */
.resume-creative-wrapper .rc-header-wave {
  background: linear-gradient(120deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);
  padding: 10px 15px 30px;
  position: relative;
  clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%);
}

.resume-creative-wrapper .rc-header-content {
  position: relative;
  z-index: 2;
  color: white;
}

.resume-creative-wrapper .rc-name {
  font-size: 28pt;
  font-weight: 700;
  margin-bottom: 2px;
  letter-spacing: -1px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
  background: linear-gradient(to right, #fff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.resume-creative-wrapper .rc-title {
  font-size: 18px;
  font-weight: 500;
  opacity: 0.95;
  margin-bottom: 5px;
  letter-spacing: 2px;
}
.resume-creative-wrapper .rc-subtitle {
  font-weight: 300;
  opacity: 0.95;
  margin-bottom: 8px;
  letter-spacing: 2px;
}

.resume-creative-wrapper .rc-quick-info {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.resume-creative-wrapper .rc-info-chip {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 4px 10px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255,255,255,0.3);
}

/* FIXED: Link styles */
.resume-creative-wrapper .rc-info-chip a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.resume-creative-wrapper .rc-info-chip a:hover {
  text-decoration: underline;
}

/* Main Content Grid */
.resume-creative-wrapper .rc-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 40px 10px;
  padding-bottom:20px;
  position: relative;
  margin-top: -40px;
}

/* Floating Cards */
.resume-creative-wrapper .rc-card {
  background: white;
  border-radius: 25px;
  padding: 10px;
  box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid rgba(0,0,0,0.05);
  height: fit-content;
  margin-bottom: 4px;
}

/* Creative Section Titles */
.resume-creative-wrapper .rc-section-title {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 10px;
  position: relative;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.resume-creative-wrapper .rc-section-title::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 4px;
  background: linear-gradient(90deg, #4158D0, #C850C0);
  border-radius: 2px;
}

.resume-creative-wrapper .rc-section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 55px;
  width: 20px;
  height: 4px;
  background: linear-gradient(90deg, #C850C0, #FFCC70);
  border-radius: 2px;
}

/* Timeline Items */
.resume-creative-wrapper .rc-timeline-item {
  position: relative;
  padding-left: 30px;
  padding-bottom: 5px;
  border-left: 3px dashed #e0e0e0;
}

.resume-creative-wrapper .rc-timeline-item:last-child {
  border-left: 3px dashed transparent;
  padding-bottom: 0;
}

.resume-creative-wrapper .rc-timeline-dot {
  position: absolute;
  left: -10px;
  top: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4158D0, #C850C0);
  border: 3px solid white;
  box-shadow: 0 3px 8px rgba(0,0,0,0.15);
  z-index: 2;
}

.resume-creative-wrapper .rc-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.resume-creative-wrapper .rc-item-title {
  font-size: 12px;
  font-weight: 700;
  color: #2d3436;
}

.resume-creative-wrapper .rc-item-subtitle {
  color: #666;
  font-weight: 500;
  margin-bottom: 5px;
}

.resume-creative-wrapper .rc-item-date {
  background: linear-gradient(135deg, #f5f7fa, #e4e8f0);
  padding: 5px 10px;
  border-radius: 50px;
  font-weight: 600;
  color: #4158D0;
}

/* Skills Grid */
.resume-creative-wrapper .rc-skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}

.resume-creative-wrapper .rc-skill-badge {
  background: linear-gradient(135deg, #667eea15, #764ba215);
  color: #4158D0;
  padding: 5px 10px;
  border-radius: 50px;
  font-weight: 500;
  border: 1px solid rgba(65, 88, 208, 0.2);
  transition: all 0.3s;
}

.resume-creative-wrapper .rc-skill-badge:hover {
  background: linear-gradient(135deg, #4158D0, #C850C0);
  color: white;
  transform: scale(1.05);
  border-color: transparent;
}

/* Project Cards */
.resume-creative-wrapper .rc-project-grid {
  display: grid;
  gap: 10px;
}

.resume-creative-wrapper .rc-project-card {
  background: linear-gradient(135deg, #f8f9fa, #e9ecef);
  border-radius: 20px;
  padding: 10px;
  border: 1px solid rgba(0,0,0,0.05);
}

.resume-creative-wrapper .rc-project-title {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2d3436;
}

.resume-creative-wrapper .rc-project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 2px 0;
}

.resume-creative-wrapper .rc-tech-tag {
  background: white;
  padding: 5px 10px;
  border-radius: 30px;
  color: #4158D0;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

/* Achievement Tags */
.resume-creative-wrapper .rc-achievement-list {
  list-style: none;
  margin-top: 10px;
}

.resume-creative-wrapper .rc-achievement-item {
  margin-bottom: 8px;
  padding-left: 10px;
  position: relative;
}

.resume-creative-wrapper .rc-achievement-item::before {
  content: '✨';
  position: absolute;
  left: 0;
  color: #C850C0;
}

/* Language Items */
.resume-creative-wrapper .rc-language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px dashed #e0e0e0;
}

.resume-creative-wrapper .rc-language-name {
  font-weight: 600;
}

.resume-creative-wrapper .rc-language-level {
  background: #f0f0f0;
  padding: 5px 10px;
  border-radius: 30px;
  color: #666;
}

/* Interests Cloud */
.resume-creative-wrapper .rc-interests-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.resume-creative-wrapper .rc-interest-item {
  background: white;
  padding: 5px 10px;
  border-radius: 30px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.05);
  border: 1px solid #e0e0e0;
  transition: all 0.3s;
}

.resume-creative-wrapper .rc-interest-item:hover {
  background: linear-gradient(135deg, #4158D0, #C850C0);
  color: white;
  border-color: transparent;
}
</style>
</head>

<body>
<div class="resume-creative-wrapper">
<div class="rc-container">

<div class="rc-header-wave">
  <div class="rc-header-content">
    <div class="rc-name">{{full_name}}</div>
    <div class="rc-title">{{#if job_title}}{{job_title}}{{/if}}</div>
    <div class="rc-subtitle">{{#if headline}}{{headline}}{{/if}}</div>
    <div class="rc-quick-info">
      {{#if email}}<span class="rc-info-chip">📧 {{email}}</span>{{/if}}
      {{#if phone}}<span class="rc-info-chip">📱 {{phone}}</span>{{/if}}
      {{#if location}}<span class="rc-info-chip">📍 {{location}}</span>{{/if}}
    </div>
    
    <div class="rc-quick-info">
      {{#if portfolio_url}}
      <span class="rc-info-chip">
        🌐 
        <a href="{{portfolio_url}}" target="_blank" rel="noopener noreferrer">
          {{#if portfolio_display}}
            {{portfolio_display}}
          {{else}}
            {{#if portfolio_url}}
              {{portfolio_url}}
            {{else}}
              Portfolio
            {{/if}}
          {{/if}}
        </a>
      </span>
      {{/if}}
      
      {{#if linkedin_url}}
      <span class="rc-info-chip">
        🔗 
        <a href="{{linkedin_url}}" target="_blank" rel="noopener noreferrer">
          {{#if linkedin_display}}
            {{linkedin_display}}
          {{else}}
            {{#if linkedin_url}}
              {{linkedin_url}}
            {{else}}
              LinkedIn
            {{/if}}
          {{/if}}
        </a>
      </span>
      {{/if}}
      
      {{#if github_url}}
      <span class="rc-info-chip">
        💻 
        <a href="{{github_url}}" target="_blank" rel="noopener noreferrer">
          {{#if github_display}}
            {{github_display}}
          {{else}}
            {{#if github_url}}
              {{github_url}}
            {{else}}
              GitHub
            {{/if}}
          {{/if}}
        </a>
      </span>
      {{/if}}
    </div>
  </div>
</div>

  <!-- Main Content Grid -->
  <div class="rc-content-grid">
    
    <!-- Left Column -->
    <div class="rc-left-col">
      
      <!-- Summary Card -->
      {{#if professional_summary}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>✨</span> About Me
        </div>
        <p style="color: #4a5568; line-height: 1.8;">{{professional_summary}}</p>
      </div>
      {{/if}}

      <!-- Experience Card -->
      {{#if experience.length}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>💼</span> Experience
        </div>
        {{#each experience}}
        <div class="rc-timeline-item">
          <div class="rc-timeline-dot"></div>
          <div class="rc-item-header">
            <div>
              <div class="rc-item-title">{{#if this.title}}{{this.title}}{{else}}{{this.position}}{{/if}}</div>
              <div class="rc-item-subtitle">{{this.company}}</div>
            </div>
            {{#if this.start_date}}
            <div class="rc-item-date">{{this.start_date}} - {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}</div>
            {{/if}}
          </div>
          {{#if this.location}}<div style=" color: #999; margin: 1px 0;">📍 {{this.location}}</div>{{/if}}
          {{#if this.description}}<p style="color: #4a5568; margin-top: 2px;">{{this.description}}</p>{{/if}}
          
          {{#if this.achievements.length}}
          <ul class="rc-achievement-list">
            {{#each this.achievements}}
            <li class="rc-achievement-item">{{this}}</li>
            {{/each}}
          </ul>
          {{/if}}
        </div>
        {{/each}}
      </div>
      {{/if}}

      <!-- Education Card -->
      {{#if education.length}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>🎓</span> Education
        </div>
        {{#each education}}
        <div class="rc-timeline-item">
          <div class="rc-timeline-dot"></div>
          <div class="rc-item-header">
            <div>
              <div class="rc-item-title">{{this.degree}}</div>
              <div class="rc-item-subtitle">{{#if this.institution}}{{this.institution}}{{else}}{{this.school}}{{/if}}</div>
            </div>
            {{#if this.start_date}}
            <div class="rc-item-date">{{this.start_date}} - {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}</div>
            {{/if}}
          </div>
          {{#if this.grade}}<div style="color: #4158D0; font-weight: 500; margin: 5px 0;">Grade: {{this.grade}}</div>{{/if}}
          {{#if this.description}}<p style="color: #4a5568;">{{this.description}}</p>{{/if}}
        </div>
        {{/each}}
      </div>
      {{/if}}
    </div>

    <!-- Right Column -->
    <div class="rc-right-col">
      
      <!-- Skills Card -->
      <div class="rc-card">
        <div class="rc-section-title">
          <span>⚡</span> Skills
        </div>
        
        {{#if skills.technical.length}}
        <div style="margin-bottom: 5px;">
          <h4 style="margin-bottom: 5px; color: #666;">Technical</h4>
          <div class="rc-skills-grid">
            {{#each skills.technical}}
            <span class="rc-skill-badge">{{this}}</span>
            {{/each}}
          </div>
        </div>
        {{/if}}
        
        {{#if skills.soft.length}}
        <div style="margin-bottom: 5px;">
          <h4 style="margin-bottom: 5px; color: #666;">Soft Skills</h4>
          <div class="rc-skills-grid">
            {{#each skills.soft}}
            <span class="rc-skill-badge">{{this}}</span>
            {{/each}}
          </div>
        </div>
        {{/if}}
      </div>

      <!-- Projects Card -->
      {{#if projects.length}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>🚀</span> Projects
        </div>
        <div class="rc-project-grid">
          {{#each projects}}
          <div class="rc-project-card">
            <div class="rc-project-title">{{this.name}}</div>
            {{#if this.technologies.length}}
            <div class="rc-project-tech">
              {{#each this.technologies}}
              <span class="rc-tech-tag">{{this}}</span>
              {{/each}}
            </div>
            {{/if}}
            <p style="color: #4a5568; ">{{this.description}}</p>
            {{#if this.url}}<a href="{{this.url}}" style="color: #4158D0; text-decoration: none; margin-top: 8px; display: inline-block;" target="_blank" rel="noopener noreferrer">🔗 View Project →</a>{{/if}}
          </div>
          {{/each}}
        </div>
      </div>
      {{/if}}

      <!-- Languages Card -->
      {{#if languages.length}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>🗣️</span> Languages
        </div>
        {{#each languages}}
        <div class="rc-language-item">
          <span class="rc-language-name">{{#if this.language}}{{this.language}}{{else}}{{this}}{{/if}}</span>
          <span class="rc-language-level">{{#if this.proficiency}}{{this.proficiency}}{{else}}Fluent{{/if}}</span>
        </div>
        {{/each}}
      </div>
      {{/if}}

      <!-- Certifications Card -->
      {{#if certifications.length}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>📜</span> Certifications
        </div>
        {{#each certifications}}
        <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px dashed #e0e0e0;">
          <div style="font-weight: 600;">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
          {{#if this.issuer}}<div style=" color: #666;">{{this.issuer}}</div>{{/if}}
          {{#if this.date}}<div style=" color: #4158D0;">{{this.date}}</div>{{/if}}
          {{#if this.url}}<a href="{{this.url}}" style="color: #4158D0; text-decoration: none; font-size: 9px;" target="_blank" rel="noopener noreferrer">🔗 View Credential</a>{{/if}}
        </div>
        {{/each}}
      </div>
      {{/if}}

      <!-- Interests Card -->
      {{#if interests.length}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>🎯</span> Interests
        </div>
        <div class="rc-interests-cloud">
          {{#each interests}}
          <span class="rc-interest-item">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/if}}

      <!-- Awards Card -->
      {{#if awards.length}}
      <div class="rc-card">
        <div class="rc-section-title">
          <span>🏆</span> Awards
        </div>
        {{#each awards}}
        <div style="margin-bottom: 10px;">
          <div style="font-weight: 600;">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
          {{#if this.description}}<div style=" color: #666;">{{this.description}}</div>{{/if}}
        </div>
        {{/each}}
      </div>
      {{/if}}
    </div>
  </div>
</div>
</div>
</body>
</html>
`;
