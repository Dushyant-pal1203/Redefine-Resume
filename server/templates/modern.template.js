module.exports = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{full_name}} - Modern Resume</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<style>
.resume-modern-wrapper {
  all: initial;
  display: block;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1e293b;
  line-height: 1.5;
  background: #f1f5f9;
  font-size: 10.5px;
}

.resume-modern-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Container */
.resume-modern-wrapper .rm-container {
  max-width: 1000px;
  margin: 20px auto;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden;
  display: grid;
  grid-template-columns: 280px 1fr;
}

/* Sidebar Styles */
.resume-modern-wrapper .rm-sidebar {
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  color: #f1f5f9;
  padding: 30px 24px;
}

/* Profile Section */
.resume-modern-wrapper .rm-profile {
  text-align: left;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255,255,255,0.1);
}

.resume-modern-wrapper .rm-name-sidebar {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 6px;
  color: white;
  line-height: 1.2;
}

.resume-modern-wrapper .rm-title-sidebar {
  font-size: 13px;
  color: #94a3b8;
  font-weight: 400;
}

/* Contact Info in Sidebar */
.resume-modern-wrapper .rm-sidebar-section {
  margin-bottom: 25px;
}

.resume-modern-wrapper .rm-sidebar-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #818cf8;
  color: white;
  letter-spacing: 0.3px;
}

.resume-modern-wrapper .rm-contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  color: #cbd5e1;
  font-size: 12px;
  word-break: break-word;
}

.resume-modern-wrapper .rm-contact-icon {
  width: 28px;
  height: 28px;
  background: rgba(255,255,255,0.08);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #818cf8;
  font-size: 14px;
  flex-shrink: 0;
}

.resume-modern-wrapper .rm-contact-item a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px dotted transparent;
  transition: border-color 0.2s;
}

.resume-modern-wrapper .rm-contact-item a:hover {
  border-bottom-color: #818cf8;
}

/* Skills in Sidebar */
.resume-modern-wrapper .rm-skill-item {
  margin-bottom: 15px;
}

.resume-modern-wrapper .rm-skill-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #cbd5e1;
  font-size: 12px;
}

.resume-modern-wrapper .rm-skill-bar {
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.resume-modern-wrapper .rm-skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #818cf8, #c084fc);
  border-radius: 2px;
}

/* Tags (Soft Skills, Interests) */
.resume-modern-wrapper .rm-tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-modern-wrapper .rm-tag {
  padding: 4px 12px;
  background: rgba(255,255,255,0.08);
  border-radius: 20px;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 400;
  border: 1px solid rgba(255,255,255,0.05);
}

/* Languages in Sidebar */
.resume-modern-wrapper .rm-language-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 12px;
  padding-bottom: 8px;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
}

.resume-modern-wrapper .rm-language-item:last-child {
  border-bottom: none;
}

.resume-modern-wrapper .rm-language-name {
  color: #f1f5f9;
  font-weight: 500;
}

.resume-modern-wrapper .rm-language-level {
  color: #94a3b8;
  padding: 2px 8px;
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  font-size: 10px;
}

/* Certifications in Sidebar */
.resume-modern-wrapper .rm-cert-item-sidebar {
  margin-bottom: 15px;
  padding-bottom: 12px;
  border-bottom: 1px dashed rgba(255,255,255,0.1);
}

.resume-modern-wrapper .rm-cert-item-sidebar:last-child {
  border-bottom: none;
}

.resume-modern-wrapper .rm-cert-name-sidebar {
  font-size: 12px;
  font-weight: 600;
  color: white;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-cert-issuer-sidebar {
  font-size: 11px;
  color: #94a3b8;
}

/* Main Content Styles */
.resume-modern-wrapper .rm-main {
  background: white;
  padding: 30px;
}

.resume-modern-wrapper .rm-main-header {
  margin-bottom: 20px;
}

.resume-modern-wrapper .rm-main-section {
  margin-bottom: 25px;
}

.resume-modern-wrapper .rm-main-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
  position: relative;
}

.resume-modern-wrapper .rm-main-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 60px;
  height: 2px;
  background: #818cf8;
}

/* Summary */
.resume-modern-wrapper .rm-summary {
  background: #f8fafc;
  padding: 18px;
  border-radius: 12px;
  color: #334155;
  line-height: 1.7;
  font-size: 13px;
  border-left: 4px solid #818cf8;
}

/* Timeline Items */
.resume-modern-wrapper .rm-timeline-item {
  position: relative;
  padding-left: 24px;
  margin-bottom: 25px;
  border-left: 2px solid #e2e8f0;
}

.resume-modern-wrapper .rm-timeline-item:last-child {
  margin-bottom: 0;
}

.resume-modern-wrapper .rm-timeline-item::before {
  content: '';
  position: absolute;
  left: -7px;
  top: 0;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #818cf8;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.resume-modern-wrapper .rm-item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-modern-wrapper .rm-item-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.resume-modern-wrapper .rm-item-company {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-item-date {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

.resume-modern-wrapper .rm-item-location {
  font-size: 12px;
  color: #818cf8;
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 4px 0 8px;
}

.resume-modern-wrapper .rm-item-description {
  font-size: 13px;
  color: #475569;
  line-height: 1.6;
}

/* Achievement List */
.resume-modern-wrapper .rm-achievement-list {
  margin-top: 8px;
  list-style: none;
}

.resume-modern-wrapper .rm-achievement-item {
  font-size: 12px;
  color: #475569;
  margin-bottom: 6px;
  padding-left: 20px;
  position: relative;
  line-height: 1.6;
}

.resume-modern-wrapper .rm-achievement-item::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: #818cf8;
  font-size: 14px;
}

/* Project Items */
.resume-modern-wrapper .rm-project-item {
  background: #f8fafc;
  padding: 18px;
  border-radius: 12px;
  margin-bottom: 15px;
  border: 1px solid #e2e8f0;
  transition: transform 0.2s, box-shadow 0.2s;
}

.resume-modern-wrapper .rm-project-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(129, 140, 248, 0.2);
}

.resume-modern-wrapper .rm-project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-modern-wrapper .rm-project-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.resume-modern-wrapper .rm-project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 10px 0;
}

.resume-modern-wrapper .rm-tech-tag {
  padding: 4px 10px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
}

.resume-modern-wrapper .rm-project-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #818cf8;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  margin-top: 12px;
  border-bottom: 1px dotted transparent;
}

.resume-modern-wrapper .rm-project-link:hover {
  border-bottom-color: #818cf8;
}

/* Certification Items (Main) */
.resume-modern-wrapper .rm-cert-item {
  background: #f8fafc;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  border: 1px solid #e2e8f0;
}

.resume-modern-wrapper .rm-cert-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-cert-issuer {
  font-size: 12px;
  color: #64748b;
}

.resume-modern-wrapper .rm-cert-date {
  font-size: 12px;
  color: #4f46e5;
  background: #e0e7ff;
  padding: 4px 10px;
  border-radius: 20px;
  font-weight: 500;
}

/* Awards Section */
.resume-modern-wrapper .rm-award-item {
  display: flex;
  gap: 12px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.resume-modern-wrapper .rm-award-icon {
  font-size: 20px;
  color: #818cf8;
}

.resume-modern-wrapper .rm-award-content h4 {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-award-desc {
  font-size: 12px;
  color: #475569;
  line-height: 1.6;
}

/* Publications */
.resume-modern-wrapper .rm-publication-item {
  padding: 15px;
  border-bottom: 1px solid #e2e8f0;
}

.resume-modern-wrapper .rm-publication-item:last-child {
  border-bottom: none;
}

.resume-modern-wrapper .rm-publication-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-publication-details {
  font-size: 12px;
  color: #64748b;
}

/* Volunteering */
.resume-modern-wrapper .rm-volunteer-item {
  margin-bottom: 18px;
  padding: 15px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.resume-modern-wrapper .rm-volunteer-org {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 4px;
}

.resume-modern-wrapper .rm-volunteer-role {
  font-size: 12px;
  color: #818cf8;
  font-weight: 500;
  margin-bottom: 6px;
}

/* Experience Summary Box */
.resume-modern-wrapper .rm-exp-summary {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 16px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.resume-modern-wrapper .rm-exp-number {
  font-size: 24px;
  font-weight: 700;
  color: #818cf8;
  margin-right: 8px;
}

/* Print Styles */
@media print {
  .resume-modern-wrapper {
    background: white;
  }
  .resume-modern-wrapper .rm-container {
    box-shadow: none;
    margin: 0;
  }
  .resume-modern-wrapper .rm-project-item:hover {
    transform: none;
  }
}

/* Responsive */
@media (max-width: 700px) {
  .resume-modern-wrapper .rm-container {
    grid-template-columns: 1fr;
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
      <div class="rm-title-sidebar">
        {{#if job_title}}{{job_title}}{{/if}}
        {{#if headline}} · {{headline}}{{/if}}
      </div>
    </div>

    <!-- Contact -->
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Contact</div>
      
      {{#if email}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">✉️</span>
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
          {{#if portfolio_display}}{{portfolio_display}}{{else}}Portfolio{{/if}}
        </a>
      </div>
      {{/if}}

      {{#if linkedin_url}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">🔗</span>
        <a href="{{linkedin_url}}" target="_blank" rel="noopener noreferrer">
          {{#if linkedin_display}}{{linkedin_display}}{{else}}LinkedIn{{/if}}
        </a>
      </div>
      {{/if}}

      {{#if github_url}}
      <div class="rm-contact-item">
        <span class="rm-contact-icon">💻</span>
        <a href="{{github_url}}" target="_blank" rel="noopener noreferrer">
          {{#if github_display}}{{github_display}}{{else}}GitHub{{/if}}
        </a>
      </div>
      {{/if}}
    </div>

    <!-- Technical Skills with Progress Bars -->
    {{#if technical_skills.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Technical Skills</div>
      {{#each technical_skills}}
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
    {{else}}
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
    {{/if}}

    <!-- Soft Skills as Tags -->
    {{#if soft_skills.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Soft Skills</div>
      <div class="rm-tags-container">
        {{#each soft_skills}}
        <span class="rm-tag">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{else}}
      {{#if skills.soft.length}}
      <div class="rm-sidebar-section">
        <div class="rm-sidebar-title">Soft Skills</div>
        <div class="rm-tags-container">
          {{#each skills.soft}}
          <span class="rm-tag">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/if}}
    {{/if}}

    <!-- Programming Languages -->
    {{#if programming_languages.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Programming</div>
      <div class="rm-tags-container">
        {{#each programming_languages}}
        <span class="rm-tag">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{else}}
      {{#if skills.languages.length}}
      <div class="rm-sidebar-section">
        <div class="rm-sidebar-title">Programming</div>
        <div class="rm-tags-container">
          {{#each skills.languages}}
          <span class="rm-tag">{{this}}</span>
          {{/each}}
        </div>
      </div>
      {{/if}}
    {{/if}}

    <!-- Languages -->
    {{#if languages.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Languages</div>
      {{#each languages}}
      <div class="rm-language-item">
        <span class="rm-language-name">
          {{#if this.language}}{{this.language}}{{else}}{{this}}{{/if}}
        </span>
        <span class="rm-language-level">
          {{#if this.proficiency}}{{this.proficiency}}{{else}}Professional{{/if}}
        </span>
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Interests -->
    {{#if interests.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Interests</div>
      <div class="rm-tags-container">
        {{#each interests}}
        <span class="rm-tag">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/if}}

    <!-- Certifications (Sidebar) -->
    {{#if certifications.length}}
    <div class="rm-sidebar-section">
      <div class="rm-sidebar-title">Certifications</div>
      {{#each certifications}}
      <div class="rm-cert-item-sidebar">
        <div class="rm-cert-name-sidebar">
          {{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}
        </div>
        {{#if this.issuer}}<div class="rm-cert-issuer-sidebar">{{this.issuer}}</div>{{/if}}
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
            <div class="rm-item-company">{{this.company}}</div>
          </div>
          {{#if this.start_date}}
          <div class="rm-item-date">
            {{this.start_date}} – {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}
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
            <div class="rm-item-title">{{this.degree}}</div>
            <div class="rm-item-company">{{#if this.institution}}{{this.institution}}{{else}}{{this.school}}{{/if}}</div>
          </div>
          {{#if this.start_date}}
          <div class="rm-item-date">
            {{this.start_date}} – {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}
          </div>
          {{/if}}
        </div>
        
        {{#if this.location}}
        <div class="rm-item-location">📍 {{this.location}}</div>
        {{/if}}
        
        {{#if this.grade}}
        <div style="color: #818cf8; font-size: 13px; margin: 6px 0;">{{this.grade}}</div>
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
        <div class="rm-project-header">
          <span class="rm-project-title">{{this.name}}</span>
          {{#if this.start_date}}
          <span class="rm-item-date">{{this.start_date}}{{#if this.end_date}} – {{this.end_date}}{{/if}}</span>
          {{/if}}
        </div>
        
        {{#if this.technologies.length}}
        <div class="rm-project-tech">
          {{#each this.technologies}}
          <span class="rm-tech-tag">{{this}}</span>
          {{/each}}
        </div>
        {{/if}}
        
        <div class="rm-item-description">{{this.description}}</div>
        
        {{#if this.url}}
        <a href="{{this.url}}" class="rm-project-link" target="_blank" rel="noopener noreferrer">
          View Project →
        </a>
        {{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Awards -->
    {{#if awards.length}}
    <div class="rm-main-section">
      <div class="rm-main-title">Awards</div>
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

    <!-- Certifications (Main - if not in sidebar) -->
    {{#if certifications.length}}
    {{#unless hide_certifications_main}}
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
        <div class="rm-volunteer-org">{{#if this.organization}}{{this.organization}}{{else}}{{this}}{{/if}}</div>
        {{#if this.role}}<div class="rm-volunteer-role">{{this.role}}</div>{{/if}}
        {{#if this.description}}<div class="rm-item-description">{{this.description}}</div>{{/if}}
      </div>
      {{/each}}
    </div>
    {{/if}}

    <!-- Experience Summary -->

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
