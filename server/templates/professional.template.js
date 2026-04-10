module.exports = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{full_name}} - Professional Resume</title>

<style>
/* Reset and Base Styles - Modern Professional like second image */
.resume-professional-wrapper {
  all: initial;
  display: block;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
  line-height: 1.5;
  background: #f1f5f9;
  font-size: 10.5px;
}

.resume-professional-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* A4 Size Container - Clean white card */
.resume-professional-wrapper .rp-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
  padding: 30px 35px;
  border-radius: 16px;
}

/* Header - Modern minimal */
.resume-professional-wrapper .rp-header {
  margin-bottom: 20px;
}

.resume-professional-wrapper .rp-name {
  font-size: 36px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin-bottom: 4px;
  line-height: 1.2;
}

.resume-professional-wrapper .rp-title {
  font-size: 18px;
  font-weight: 500;
  color: #334155;
  margin-bottom: 4px;
}

.resume-professional-wrapper .rp-subtitle {
  font-size: 14px;
  color: #475569;
  margin-bottom: 16px;
  font-weight: 400;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 16px;
}

/* Contact Bar - Modern flex layout */
.resume-professional-wrapper .rp-contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 28px;
  background: #f8fafc;
  padding: 12px 18px;
  border-radius: 12px;
  margin: 8px 0 16px;
  align-items: center;
}

.resume-professional-wrapper .rp-link-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-left: auto;
}

.resume-professional-wrapper .rp-contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #1e293b;
}

.resume-professional-wrapper .rp-contact-item a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.resume-professional-wrapper .rp-contact-item a:hover {
  text-decoration: underline;
}

/* Two Column Layout - Clean grid */
.resume-professional-wrapper .rp-two-column {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  margin-top: 20px;
}

/* Left Column */
.resume-professional-wrapper .rp-left-col {
  padding-right: 5px;
}

/* Section Titles - Modern minimal */
.resume-professional-wrapper .rp-section-title {
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: #0f172a;
  margin: 20px 0 12px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 6px;
}

.resume-professional-wrapper .rp-section-title:first-of-type {
  margin-top: 0;
}

/* Summary Text */
.resume-professional-wrapper .rp-summary {
  font-size: 13px;
  line-height: 1.6;
  color: #334155;
  margin: 8px 0;
  text-align: left;
}

/* Skills - Modern tag style */
.resume-professional-wrapper .rp-skills-group {
  margin-bottom: 16px;
}

.resume-professional-wrapper .rp-skills-group h4 {
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1e293b;
}

.resume-professional-wrapper .rp-skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
}

.resume-professional-wrapper .rp-skills-list li {
  background: #f1f5f9;
  color: #1e293b;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

/* Experience Items - Clean cards */
.resume-professional-wrapper .rp-experience-item {
  margin-bottom: 20px;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.resume-professional-wrapper .rp-item-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.resume-professional-wrapper .rp-item-company {
  font-weight: 600;
  color: #2563eb;
  font-size: 13px;
  margin-bottom: 2px;
}

.resume-professional-wrapper .rp-item-date {
  color: #64748b;
  font-size: 12px;
  font-weight: 400;
}

.resume-professional-wrapper .rp-item-location {
  color: #64748b;
  font-size: 12px;
  margin-bottom: 6px;
}

.resume-professional-wrapper .rp-item-description {
  font-size: 13px;
  color: #334155;
  margin: 6px 0;
  line-height: 1.5;
}

/* Achievement List */
.resume-professional-wrapper .rp-achievement-list {
  list-style: none;
  margin-top: 6px;
}

.resume-professional-wrapper .rp-achievement-item {
  font-size: 13px;
  margin-bottom: 4px;
  padding-left: 16px;
  position: relative;
  color: #334155;
}

.resume-professional-wrapper .rp-achievement-item::before {
  content: '•';
  position: absolute;
  left: 4px;
  color: #2563eb;
  font-weight: bold;
}

/* Projects */
.resume-professional-wrapper .rp-project-item {
  margin-bottom: 18px;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  margin-bottom: 4px;
}

.resume-professional-wrapper .rp-project-name {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.resume-professional-wrapper .rp-project-tech {
  font-size: 12px;
  color: #2563eb;
  font-weight: 500;
  margin-bottom: 6px;
}

.resume-professional-wrapper .rp-project-link {
  margin-top: 6px;
}

.resume-professional-wrapper .rp-project-link a {
  color: #2563eb;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  border-bottom: 1px dotted #94a3b8;
}

/* Education Items */
.resume-professional-wrapper .rp-education-item {
  margin-bottom: 16px;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-degree {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

.resume-professional-wrapper .rp-school {
  font-size: 13px;
  font-weight: 500;
  color: #2563eb;
  margin-bottom: 2px;
}

.resume-professional-wrapper .rp-grade {
  font-size: 12px;
  color: #475569;
  margin-top: 2px;
}

/* Certifications & Awards - Modern compact */
.resume-professional-wrapper .rp-cert-item,
.resume-professional-wrapper .rp-award-item {
  margin-bottom: 12px;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-cert-name,
.resume-professional-wrapper .rp-award-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.resume-professional-wrapper .rp-cert-issuer,
.resume-professional-wrapper .rp-award-desc {
  font-size: 12px;
  color: #475569;
  margin-top: 2px;
}

/* Languages - Clean two-column */
.resume-professional-wrapper .rp-language-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px dashed #e2e8f0;
}

.resume-professional-wrapper .rp-language-name {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.resume-professional-wrapper .rp-language-level {
  font-size: 12px;
  color: #475569;
  font-style: italic;
}

/* Interests - Pill style */
.resume-professional-wrapper .rp-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.resume-professional-wrapper .rp-interest-item {
  background: #f1f5f9;
  padding: 4px 14px;
  border-radius: 30px;
  font-size: 12px;
  color: #1e293b;
  font-weight: 500;
}

/* Publications */
.resume-professional-wrapper .rp-publication-item {
  margin-bottom: 12px;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-publication-title {
  font-size: 13px;
  font-weight: 600;
  color: #0f172a;
}

.resume-professional-wrapper .rp-publication-details {
  font-size: 12px;
  color: #475569;
  margin-top: 2px;
}

/* Volunteering */
.resume-professional-wrapper .rp-volunteer-item {
  margin-bottom: 16px;
}

.resume-professional-wrapper .rp-volunteer-org {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
}

.resume-professional-wrapper .rp-volunteer-role {
  font-size: 12px;
  color: #2563eb;
  margin-bottom: 4px;
}

/* Footer */
.resume-professional-wrapper .rp-footer {
  margin-top: 25px;
  padding-top: 15px;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  color: #64748b;
  font-size: 12px;
}

/* Print optimization */
@media print {
  .resume-professional-wrapper {
    background: white;
  }
  .resume-professional-wrapper .rp-container {
    box-shadow: none;
    padding: 15px 20px;
  }
}
</style>
</head>

<body>
<div class="resume-professional-wrapper">
<div class="rp-container">

  <!-- Header -->
  <div class="rp-header">
    <div class="rp-name">{{full_name}}</div>
    <div class="rp-title">{{#if job_title}}{{job_title}}{{else}}Full Stack Developer{{/if}}</div>
    <div class="rp-subtitle">{{#if headline}}{{headline}}{{else}}Passionate about creating efficient, scalable web applications with modern technologies{{/if}}</div>

    <!-- Contact Bar -->
    <div class="rp-contact-bar">
      {{#if email}}<span class="rp-contact-item">✉️ {{email}}</span>{{/if}}
      {{#if phone}}<span class="rp-contact-item">📱 {{phone}}</span>{{/if}}
      {{#if location}}<span class="rp-contact-item">📍 {{location}}</span>{{/if}}
      
      <div class="rp-link-bar">
        {{#if linkedin_display}}
        <span class="rp-contact-item">🔗 <a href="{{linkedin_url}}" target="_blank">{{linkedin_display}}</a></span>
        {{/if}}
        {{#if github_display}}
        <span class="rp-contact-item">💻 <a href="{{github_url}}" target="_blank">{{github_display}}</a></span>
        {{/if}}
        {{#if portfolio_display}}
        <span class="rp-contact-item">🌐 <a href="{{portfolio_url}}" target="_blank">{{portfolio_display}}</a></span>
        {{/if}}
      </div>
    </div>
  </div>

  <!-- Two Column Layout -->
  <div class="rp-two-column">
    
    <!-- LEFT COLUMN -->
    <div class="rp-left-col">
      
      <!-- Professional Summary -->
      {{#if professional_summary}}
      <div class="rp-section-title">Summary</div>
      <div class="rp-summary">{{professional_summary}}</div>
      {{/if}}

      <!-- Skills Section -->
      <div class="rp-section-title">Skills</div>
      
      <!-- Technical Skills -->
      {{#if technical_skills.length}}
      <div class="rp-skills-group">
        <h4>Technical Skills</h4>
        <ul class="rp-skills-list">
          {{#each technical_skills}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
      {{else}}
        {{#if skills.technical.length}}
        <div class="rp-skills-group">
          <h4>Technical Skills</h4>
          <ul class="rp-skills-list">
            {{#each skills.technical}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
        {{/if}}
      {{/if}}
  
      <!-- Soft Skills -->
      {{#if soft_skills.length}}
      <div class="rp-skills-group">
        <h4>Soft Skills</h4>
        <ul class="rp-skills-list">
          {{#each soft_skills}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
      {{else}}
        {{#if skills.soft.length}}
        <div class="rp-skills-group">
          <h4>Soft Skills</h4>
          <ul class="rp-skills-list">
            {{#each skills.soft}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
        {{/if}}
      {{/if}}

      <!-- Programming Languages -->
      {{#if programming_languages.length}}
      <div class="rp-skills-group">
        <h4>Programming Languages</h4>
        <ul class="rp-skills-list">
          {{#each programming_languages}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
      {{else}}
        {{#if skills.languages.length}}
        <div class="rp-skills-group">
          <h4>Programming Languages</h4>
          <ul class="rp-skills-list">
            {{#each skills.languages}}
            <li>{{this}}</li>
            {{/each}}
          </ul>
        </div>
        {{/if}}
      {{/if}}

      <!-- Languages -->
      {{#if languages.length}}
      <div class="rp-section-title">Languages</div>
      {{#each languages}}
      <div class="rp-language-item">
        <span class="rp-language-name">{{#if this.language}}{{this.language}}{{else}}{{this}}{{/if}}</span>
        <span class="rp-language-level">{{#if this.proficiency}}{{this.proficiency}}{{else}}Professional{{/if}}</span>
      </div>
      {{/each}}
      {{/if}}

      <!-- Certifications -->
      {{#if certifications.length}}
      <div class="rp-section-title">Certifications</div>
      {{#each certifications}}
      <div class="rp-cert-item">
        <div class="rp-cert-name">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
        {{#if this.issuer}}<div class="rp-cert-issuer">{{this.issuer}}</div>{{/if}}
        {{#if this.date}}<div class="rp-cert-issuer">{{this.date}}</div>{{/if}}
      </div>
      {{/each}}
      {{/if}}

      <!-- Interests -->
      {{#if interests.length}}
      <div class="rp-section-title">Interests</div>
      <div class="rp-interests">
        {{#each interests}}
        <span class="rp-interest-item">{{this}}</span>
        {{/each}}
      </div>
      {{/if}}

      <!-- Awards (if in left column) -->
      {{#if awards.length}}
      <div class="rp-section-title">Awards</div>
      {{#each awards}}
      <div class="rp-award-item">
        <div class="rp-award-name">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
        {{#if this.description}}<div class="rp-award-desc">{{this.description}}</div>{{/if}}
      </div>
      {{/each}}
      {{/if}}
    </div>

    <!-- RIGHT COLUMN -->
    <div class="rp-right-col">
      
      <!-- Experience -->
      {{#if experience.length}}
      <div class="rp-section-title">Experience</div>
      {{#each experience}}
      <div class="rp-experience-item">
        <div class="rp-item-header">
          <div class="rp-item-title">{{#if this.title}}{{this.title}}{{else}}{{this.position}}{{/if}}</div>
          {{#if this.start_date}}
          <div class="rp-item-date">{{this.start_date}} — {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}</div>
          {{/if}}
        </div>
        <div class="rp-item-company">{{this.company}}</div>
        {{#if this.location}}<div class="rp-item-location">{{this.location}}</div>{{/if}}
        {{#if this.description}}<div class="rp-item-description">{{this.description}}</div>{{/if}}
        
        {{#if this.achievements.length}}
        <ul class="rp-achievement-list">
          {{#each this.achievements}}
          <li class="rp-achievement-item">{{this}}</li>
          {{/each}}
        </ul>
        {{/if}}
      </div>
      {{/each}}
      {{/if}}

      <!-- Education -->
      {{#if education.length}}
      <div class="rp-section-title">Education</div>
      {{#each education}}
      <div class="rp-education-item">
        <div class="rp-item-header">
          <div class="rp-degree">{{this.degree}}</div>
          {{#if this.start_date}}
          <div class="rp-item-date">{{this.start_date}} — {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}</div>
          {{/if}}
        </div>
        <div class="rp-school">{{#if this.institution}}{{this.institution}}{{else}}{{this.school}}{{/if}}</div>
        {{#if this.location}}<div class="rp-item-location">{{this.location}}</div>{{/if}}
        {{#if this.grade}}<div class="rp-grade">GPA: {{this.grade}}</div>{{/if}}
      </div>
      {{/each}}
      {{/if}}

      <!-- Projects -->
      {{#if projects.length}}
      <div class="rp-section-title">Projects</div>
      {{#each projects}}
      <div class="rp-project-item">
        <div class="rp-project-header">
          <span class="rp-project-name">{{this.name}}</span>
          {{#if this.start_date}}
          <span class="rp-item-date">{{this.start_date}} — {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}</span>
          {{/if}}
        </div>
        {{#if this.technologies.length}}
        <div class="rp-project-tech">
          {{#each this.technologies}}{{#if @index}}, {{/if}}{{this}}{{/each}}
        </div>
        {{/if}}
        <div class="rp-item-description">{{this.description}}</div>
        {{#if this.url}}
        <div class="rp-project-link"><a href="{{this.url}}" target="_blank">View Project →</a></div>
        {{/if}}
      </div>
      {{/each}}
      {{/if}}

      <!-- Publications -->
      {{#if publications.length}}
      <div class="rp-section-title">Publications</div>
      {{#each publications}}
      <div class="rp-publication-item">
        <div class="rp-publication-title">{{#if this.title}}{{this.title}}{{else}}{{this}}{{/if}}</div>
        {{#if this.publisher}}<div class="rp-publication-details">{{this.publisher}}</div>{{/if}}
        {{#if this.date}}<div class="rp-publication-details">{{this.date}}</div>{{/if}}
      </div>
      {{/each}}
      {{/if}}

      <!-- Volunteering -->
      {{#if volunteering.length}}
      <div class="rp-section-title">Volunteering</div>
      {{#each volunteering}}
      <div class="rp-volunteer-item">
        <div class="rp-volunteer-org">{{#if this.organization}}{{this.organization}}{{else}}{{this}}{{/if}}</div>
        {{#if this.role}}<div class="rp-volunteer-role">{{this.role}}</div>{{/if}}
        {{#if this.description}}<div class="rp-item-description">{{this.description}}</div>{{/if}}
      </div>
      {{/each}}
      {{/if}}
    </div>
  </div>
</div>
</div>
</body>
</html>
`;
