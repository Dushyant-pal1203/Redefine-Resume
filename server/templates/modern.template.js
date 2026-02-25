// templates/modern.template.js
module.exports = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{full_name}} - Professional Resume</title>

<style>
.resume-modern-wrapper {
  all: initial;
  display: block;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  color: #1e293b;
  line-height: 1.5;
  font-size: 10px;
}

.resume-modern-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Container */
.resume-modern-wrapper .rm-container {
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: grid;
  grid-template-columns: 300px 1fr;
}

/* Sidebar Styles */
.resume-modern-wrapper .rm-sidebar {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  color: #f1f5f9;
  padding: 32px 24px;
}

.resume-modern-wrapper .rm-main {
  background: white;
  padding: 32px;
}

/* Profile Section */
.resume-modern-wrapper .rm-profile {
  text-align: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid rgba(255,255,255,0.1);
}

.resume-modern-wrapper .rm-name-sidebar {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
  color: white;
  line-height: 1.2;
}

.resume-modern-wrapper .rm-title-sidebar {
  color: #94a3b8;
  margin-bottom: 10px;
}

/* Contact Info in Sidebar */
.resume-modern-wrapper .rm-contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
  color: #cbd5e1;
  word-break: break-word;
}

.resume-modern-wrapper .rm-contact-icon {
  width: 30px;
  height: 30px;
  background: rgba(255,255,255,0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #818cf8;
  flex-shrink: 0;
}

.resume-modern-wrapper .rm-contact-item a {
  color: white;
  text-decoration: none;
  font-weight: 500;
}

.resume-modern-wrapper .rm-contact-item a:hover {
  text-decoration: underline;
}

/* Sidebar Sections */
.resume-modern-wrapper .rm-sidebar-section {
  margin-bottom: 10px;
}

.resume-modern-wrapper .rm-sidebar-title {
  font-weight: 600;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 2px solid #818cf8;
  color: white;
  letter-spacing: 0.5px;
}

/* Skills in Sidebar */
.resume-modern-wrapper .rm-skill-item {
  margin-bottom: 10px;
}

.resume-modern-wrapper .rm-skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: #cbd5e1;
}

.resume-modern-wrapper .rm-skill-bar {
  height: 6px;
  background: rgba(255,255,255,0.1);
  border-radius: 3px;
  overflow: hidden;
}

.resume-modern-wrapper .rm-skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #818cf8, #c084fc);
  border-radius: 3px;
  width: 0%;
}

/* Languages in Sidebar */
.resume-modern-wrapper .rm-language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.resume-modern-wrapper .rm-language-name {
  color: #f1f5f9;
  font-weight: 500;
}

.resume-modern-wrapper .rm-language-level {
  color: #94a3b8;
  padding: 2px 8px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
}

/* Interests in Sidebar */
.resume-modern-wrapper .rm-interest-tag {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  margin: 0 6px 8px 0;
  color: #cbd5e1;
}

/* Main Content Styles */
.resume-modern-wrapper .rm-main-header {
  margin-bottom: 10px;
}

.resume-modern-wrapper .rm-main-section {
  margin-bottom: 10px;
}

.resume-modern-wrapper .rm-main-title {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 3px solid #818cf8;
  position: relative;
}

.resume-modern-wrapper .rm-main-title::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 0;
  width: 50px;
  height: 3px;
  background: #c084fc;
}

/* Summary */
.resume-modern-wrapper .rm-summary {
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  color: #334155;
  line-height: 1.7;
  margin-bottom: 10px;
  border-left: 4px solid #818cf8;
}

/* Experience & Education Items */
.resume-modern-wrapper .rm-timeline-item {
  position: relative;
  padding-left: 24px;
  margin-bottom: 10px;
  border-left: 2px solid #e2e8f0;
}

.resume-modern-wrapper .rm-timeline-item::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #818cf8;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.resume-modern-wrapper .rm-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.resume-modern-wrapper .rm-item-title {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

.resume-modern-wrapper .rm-item-subtitle {
  font-weight: 500;
  color: #475569;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-item-company {
  color: #64748b;
  font-weight: 500;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-item-date {
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
}

.resume-modern-wrapper .rm-item-location {
  color: #818cf8;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0 8px;
}

.resume-modern-wrapper .rm-item-description {
  color: #475569;
  margin-top: 10px;
  line-height: 1.6;
}

.resume-modern-wrapper .rm-achievement-list {
  margin-top: 8px;
  list-style: none;
}

.resume-modern-wrapper .rm-achievement-item {
  color: #475569;
  margin-bottom: 6px;
  padding-left: 20px;
  position: relative;
}

.resume-modern-wrapper .rm-achievement-item::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: #818cf8;
}

/* Project Items */
.resume-modern-wrapper .rm-project-item {
  background: #f8fafc;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s;
}

.resume-modern-wrapper .rm-project-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(0,0,0,0.1);
}

.resume-modern-wrapper .rm-project-title {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.resume-modern-wrapper .rm-project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 12px 0;
}

.resume-modern-wrapper .rm-tech-tag {
  padding: 4px 10px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 20px;
  font-weight: 500;
}

.resume-modern-wrapper .rm-project-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #818cf8;
  text-decoration: none;
  margin-top: 10px;
}

.resume-modern-wrapper .rm-project-link:hover {
  text-decoration: underline;
}

/* Certification Items */
.resume-modern-wrapper .rm-cert-item {
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.resume-modern-wrapper .rm-cert-info h4 {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-cert-issuer {
  color: #64748b;
}

.resume-modern-wrapper .rm-cert-date {
  color: #818cf8;
  background: #e0e7ff;
  padding: 4px 8px;
  border-radius: 20px;
}

/* Awards Section */
.resume-modern-wrapper .rm-award-item {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
}

.resume-modern-wrapper .rm-award-icon {
  font-size: 14px;
}

.resume-modern-wrapper .rm-award-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-award-desc {
  color: #475569;
}

/* Publications */
.resume-modern-wrapper .rm-publication-item {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.resume-modern-wrapper .rm-publication-title {
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-publication-details {
  color: #64748b;
}

/* Volunteering */
.resume-modern-wrapper .rm-volunteer-item {
  margin-bottom: 10px;
}

/* Print Styles */
@media print {
  .resume-modern-wrapper {
    background: white;
    padding: 0;
  }
}
</style>
</head>

<body>
<div class="resume-modern-wrapper">
<div class="rm-container">

  <!-- Sidebar -->
  <div class="rm-sidebar">
    <!-- Profile -->
    <div class="rm-profile">
      <div class="rm-name-sidebar">{{full_name}}</div>
      <div class="rm-title-sidebar">{{#if job_title}}{{job_title}}{{/if}}{{#if headline}} | {{headline}}{{/if}}</div>
    </div>

    <!-- Contact -->
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Contact</div>
      
      {{#if email}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">📧</span>
        <span>{{email}}</span>
      </div>
      {{/if}}
      
      {{#if phone}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">📱</span>
        <span>{{phone}}</span>
      </div>
      {{/if}}
      
      {{#if location}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">📍</span>
        <span>{{location}}</span>
      </div>
      {{/if}}

      {{#if portfolio_url}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">🌐</span>
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
      </div>
      {{/if}}

      {{#if linkedin_url}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">🔗</span>
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
      </div>
      {{/if}}

      {{#if github_url}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">💻</span>
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
      </div>
      {{/if}}
    </div>

    <!-- Technical Skills -->
    {{#if skills.technical.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Technical Skills</div>
      {{#each skills.technical}}
      <div class="rm-skill-item">
        <div class="rm-skill-header">
          <span>{{this}}</span>
          <span>80%</span>
        </div>
        <div class="rm-skill-bar">
          <div class="rm-skill-progress" style="width: 80%"></div>
        </div>
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Soft Skills -->
    {{#if skills.soft.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Soft Skills</div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        {{#each skills.soft}}
        <span class="rm-interest-tag">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/if}}

    <!-- Languages -->
    {{#if languages.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Languages</div>
      {{#each languages}}
      <div class="rm-language-item">
        <span class="rm-language-name">{{#if this.language}}{{this.language}}{{else}}{{this}}{{/if}}</span>
        <span class="rm-language-level">{{#if this.proficiency}}{{this.proficiency}}{{else}}Fluent{{/if}}</span>
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Interests -->
    {{#if interests.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Interests</div>
      <div>
        {{#each interests}}
        <span class="rm-interest-tag">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/if}}

    <!-- Certifications (in sidebar if space) -->
    {{#if certifications.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Certifications</div>
      {{#each certifications}}
      <div style="margin-bottom: 10px;">
        <div style="font-weight: 600; color: white;">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
        {{#if this.issuer}}<div style="color: #94a3b8;">{{this.issuer}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}
  </div>

  <!-- Main Content -->
  <div class="rm-main">

    <!-- Professional Summary -->
    {{#if professional_summary}}
    <div class="rm-main-section">
      <div class="rm-main-title">Professional Summary</div>
      <div class="rm-summary">
        {{professional_summary}}
      </div>
    </div>
    {{/if}}

    <!-- Work Experience -->
    {{#if experience.length}}
    <div class="rm-main-section">
      <div class="rm-main-title">Work Experience</div>
      {{#each experience}}
      <div class="rm-timeline-item">
        <div class="rm-item-header">
          <div>
            <div class="rm-item-title">{{#if this.title}}{{this.title}}{{else}}{{this.position}}{{/if}}</div>
            <div class="rm-item-company">{{#if this.company}}{{this.company}}{{/if}}</div>
          </div>
          {{#if this.start_date}}
          <div class="rm-item-date">
            {{this.start_date}} - {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}
          </div>
          {{/if}}
        </div>
        
        {{#if this.location}}
        <div class="rm-item-location">📍 {{this.location}}</div>
        {{/if}}
        
        {{#if this.description}}
        <div class="rm-item-description">{{this.description}}</div>
        {{/if}}
        
        {{#if this.achievements.length}}
        <ul class="rm-achievement-list">
          {{#each this.achievements}}
          <li class="rm-achievement-item">{{this}}</li>
          {{/each}}
        </ul>
        {{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Education -->
    {{#if education.length}}
    <div class="rm-main-section">
      <div class="rm-main-title">Education</div>
      {{#each education}}
      <div class="rm-timeline-item">
        <div class="rm-item-header">
          <div>
            <div class="rm-item-title">{{#if this.degree}}{{this.degree}}{{/if}}</div>
            <div class="rm-item-company">{{#if this.institution}}{{this.institution}}{{else}}{{this.school}}{{/if}}</div>
          </div>
          {{#if this.start_date}}
          <div class="rm-item-date">
            {{this.start_date}} - {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}
          </div>
          {{/if}}
        </div>
        
        {{#if this.location}}
        <div class="rm-item-location">📍 {{this.location}}</div>
        {{/if}}
        
        {{#if this.grade}}
        <div style="color: #818cf8; margin: 4px 0;">Grade: {{this.grade}}</div>
        {{/if}}
        
        {{#if this.description}}
        <div class="rm-item-description">{{this.description}}</div>
        {{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Projects -->
    {{#if projects.length}}
    <div class="rm-main-section">
      <div class="rm-main-title">Projects</div>
      {{#each projects}}
      <div class="rm-project-item">
        <div class="rm-project-title">{{#if this.name}}{{this.name}}{{/if}}</div>
        
        {{#if this.technologies.length}}
        <div class="rm-project-tech">
          {{#each this.technologies}}
          <span class="rm-tech-tag">{{this}}</span>
          {{/each}}
        </div>
        {{/if}}
        
        {{#if this.description}}
        <div class="rm-item-description">{{this.description}}</div>
        {{/if}}
        
        {{#if this.start_date}}
        <div style="color: #64748b; margin: 8px 0;">
          {{this.start_date}} - {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}
        </div>
        {{/if}}
        
        {{#if this.url}}
        <a href="{{this.url}}" class="rm-project-link" target="_blank" rel="noopener noreferrer">🔗 View Project</a>
        {{/if}}
        
        {{#if this.highlights.length}}
        <ul class="rm-achievement-list" style="margin-top: 10px;">
          {{#each this.highlights}}
          <li class="rm-achievement-item">{{this}}</li>
          {{/each}}
        </ul>
        {{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Awards & Achievements -->
    {{#if awards.length}}
    <div class="rm-main-section">
      <div class="rm-main-title">Awards & Achievements</div>
      {{#each awards}}
      <div class="rm-award-item">
        <div class="rm-award-icon">🏆</div>
        <div class="rm-award-content">
          <h4>{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</h4>
          {{#if this.description}}<div class="rm-award-desc">{{this.description}}</div>{{/if}}
        </div>
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Certifications (if not shown in sidebar) -->
    {{#if certifications.length}}
    {{#unless sidebar_certifications}}
    <div class="rm-main-section">
      <div class="rm-main-title">Certifications</div>
      {{#each certifications}}
      <div class="rm-cert-item">
        <div class="rm-cert-info">
          <h4>{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</h4>
          {{#if this.issuer}}<div class="rm-cert-issuer">{{this.issuer}}</div>{{/if}}
        </div>
        {{#if this.date}}<span class="rm-cert-date">{{this.date}}</span>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/unless}}
    {{/if}}

    <!-- Publications -->
    {{#if publications.length}}
    <div class="rm-main-section">
      <div class="rm-main-title">Publications</div>
      {{#each publications}}
      <div class="rm-publication-item">
        <div class="rm-publication-title">{{#if this.title}}{{this.title}}{{else}}{{this}}{{/if}}</div>
        {{#if this.publisher}}<div class="rm-publication-details">{{this.publisher}}</div>{{/if}}
        {{#if this.date}}<div class="rm-publication-details">{{this.date}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Volunteering -->
    {{#if volunteering.length}}
    <div class="rm-main-section">
      <div class="rm-main-title">Volunteering</div>
      {{#each volunteering}}
      <div class="rm-volunteer-item">
        <div class="rm-item-title">{{#if this.organization}}{{this.organization}}{{else}}{{this}}{{/if}}</div>
        {{#if this.role}}<div class="rm-item-company">{{this.role}}</div>{{/if}}
        {{#if this.description}}<div class="rm-item-description">{{this.description}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Years of Experience Summary -->
    {{#if years_of_experience}}
    <div class="rm-main-section">
      <div class="rm-main-title">Experience Summary</div>
      <div style="background: #f8fafc; padding: 16px; border-radius: 12px; text-align: center;">
        <span style="font-weight: 700; color: #818cf8;">{{years_of_experience}}+</span>
        <span style="color: #475569; margin-left: 8px;">Years of Professional Experience</span>
      </div>
    </div>
    {{/if}}

    <!-- Custom Sections -->
    {{#if parsed_sections}}
    {{#each parsed_sections}}
    <div class="rm-main-section">
      <div class="rm-main-title">{{@key}}</div>
      <div class="rm-item-description">{{this}}</div>
    </div>
    {{/each}}
    {{/if}}
  </div>
</div>
</div>
</body>
</html>
`;
