module.exports = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{full_name}} - Minimal Resume</title>

<style>
.resume-minimal-wrapper {
  all: initial;
  display: block;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1a1a1a;
  line-height: 1.5;
  background: #ffffff;
  font-size: 10.5px;
}

.resume-minimal-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Container - Clean and Airy */
.resume-minimal-wrapper .rm-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 35px 40px;
  box-shadow: 0 5px 20px rgba(0,0,0,0.03);
}

/* Typography - Minimal and Elegant */
.resume-minimal-wrapper .rm-name {
  font-size: 32px;
  font-weight: 400;
  letter-spacing: -0.5px;
  margin-bottom: 4px;
  color: #000000;
}

.resume-minimal-wrapper .rm-headline {
  font-size: 14px;
  font-weight: 300;
  color: #5c5c5c;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

/* Contact Bar - Subtle */
.resume-minimal-wrapper .rm-contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 30px;
  margin-bottom: 25px;
  color: #4a4a4a;
  font-size: 12px;
}

.resume-minimal-wrapper .rm-contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.resume-minimal-wrapper .rm-contact-item a {
  color: #4a4a4a;
  text-decoration: none;
  border-bottom: 1px dotted #d4d4d4;
}

.resume-minimal-wrapper .rm-contact-item a:hover {
  color: #000000;
  border-bottom-color: #999999;
}

/* Section Titles - Understated with minimal spacing */
.resume-minimal-wrapper .rm-section-title {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin: 25px 0 12px;
  color: #2c2c2c;
}

.resume-minimal-wrapper .rm-section-title:first-of-type {
  margin-top: 0;
}

/* Summary - Clean Paragraph */
.resume-minimal-wrapper .rm-summary {
  font-size: 12px;
  line-height: 1.8;
  color: #4a4a4a;
  margin-bottom: 10px;
  font-weight: 300;
}

/* Experience & Education Items */
.resume-minimal-wrapper .rm-item {
  margin-bottom: 18px;
}

.resume-minimal-wrapper .rm-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  flex-wrap: wrap;
  gap: 8px;
}

.resume-minimal-wrapper .rm-item-title {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.resume-minimal-wrapper .rm-item-company {
  font-size: 12px;
  font-weight: 400;
  color: #5c5c5c;
  margin-bottom: 2px;
}

.resume-minimal-wrapper .rm-item-date {
  font-size: 11px;
  color: #8a8a8a;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-item-location {
  font-size: 11px;
  color: #8a8a8a;
  margin-bottom: 8px;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-item-description {
  font-size: 12px;
  color: #4a4a4a;
  line-height: 1.7;
  font-weight: 300;
  margin-top: 6px;
}

/* Achievement List - Minimal Dash */
.resume-minimal-wrapper .rm-achievement-list {
  list-style: none;
  margin-top: 6px;
}

.resume-minimal-wrapper .rm-achievement-item {
  font-size: 12px;
  color: #4a4a4a;
  margin-bottom: 4px;
  padding-left: 14px;
  position: relative;
  font-weight: 300;
  line-height: 1.6;
}

.resume-minimal-wrapper .rm-achievement-item::before {
  content: '—';
  position: absolute;
  left: 0;
  color: #b0b0b0;
}

/* Skills - Minimal Separator */
.resume-minimal-wrapper .rm-skills-section {
  margin-bottom: 10px;
}

.resume-minimal-wrapper .rm-skills-category {
  margin-bottom: 16px;
}

.resume-minimal-wrapper .rm-skills-category h4 {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6a6a6a;
  margin-bottom: 8px;
}

.resume-minimal-wrapper .rm-skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 20px;
}

.resume-minimal-wrapper .rm-skill-item {
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 300;
  position: relative;
}

.resume-minimal-wrapper .rm-skill-item:not(:last-child)::after {
  content: '·';
  position: absolute;
  right: -12px;
  color: #c0c0c0;
}

/* Projects - Minimal Cards */
.resume-minimal-wrapper .rm-project-item {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f5f5f5;
}

.resume-minimal-wrapper .rm-project-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.resume-minimal-wrapper .rm-project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 4px;
  flex-wrap: wrap;
}

.resume-minimal-wrapper .rm-project-name {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a1a;
}

.resume-minimal-wrapper .rm-project-tech {
  font-size: 11px;
  color: #7a7a7a;
  margin-bottom: 6px;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-project-description {
  font-size: 12px;
  color: #4a4a4a;
  line-height: 1.7;
  font-weight: 300;
  margin-bottom: 6px;
}

.resume-minimal-wrapper .rm-project-link {
  margin-top: 4px;
}

.resume-minimal-wrapper .rm-project-link a {
  font-size: 11px;
  color: #6a6a6a;
  text-decoration: none;
  border-bottom: 1px dotted #d0d0d0;
}

/* Languages - Simple Two Column */
.resume-minimal-wrapper .rm-languages-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px 20px;
  margin-top: 8px;
}

.resume-minimal-wrapper .rm-language-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 4px;
  border-bottom: 1px dotted #eeeeee;
}

.resume-minimal-wrapper .rm-language-name {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
}

.resume-minimal-wrapper .rm-language-level {
  font-size: 11px;
  color: #8a8a8a;
  font-weight: 300;
}

/* Certifications - Clean List */
.resume-minimal-wrapper .rm-cert-item {
  margin-bottom: 12px;
}

.resume-minimal-wrapper .rm-cert-name {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 2px;
}

.resume-minimal-wrapper .rm-cert-issuer {
  font-size: 11px;
  color: #7a7a7a;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-cert-date {
  font-size: 11px;
  color: #9a9a9a;
  margin-top: 1px;
  font-weight: 300;
}

/* Awards & Publications */
.resume-minimal-wrapper .rm-award-item,
.resume-minimal-wrapper .rm-publication-item {
  margin-bottom: 12px;
}

.resume-minimal-wrapper .rm-award-name,
.resume-minimal-wrapper .rm-publication-title {
  font-size: 12px;
  font-weight: 400;
  color: #333333;
  margin-bottom: 2px;
}

.resume-minimal-wrapper .rm-award-desc,
.resume-minimal-wrapper .rm-publication-details {
  font-size: 11px;
  color: #7a7a7a;
  font-weight: 300;
  line-height: 1.6;
}

/* Volunteering */
.resume-minimal-wrapper .rm-volunteer-item {
  margin-bottom: 16px;
}

.resume-minimal-wrapper .rm-volunteer-org {
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 2px;
}

.resume-minimal-wrapper .rm-volunteer-role {
  font-size: 11px;
  color: #6a6a6a;
  font-weight: 300;
  margin-bottom: 4px;
}

/* Interests - Minimal Dots */
.resume-minimal-wrapper .rm-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 16px 24px;
  margin-top: 8px;
}

.resume-minimal-wrapper .rm-interest-item {
  font-size: 12px;
  color: #4a4a4a;
  font-weight: 300;
  position: relative;
}

.resume-minimal-wrapper .rm-interest-item::before {
  content: '·';
  position: absolute;
  left: -12px;
  color: #c0c0c0;
}

.resume-minimal-wrapper .rm-interest-item:first-child::before {
  display: none;
}

/* Footer */
.resume-minimal-wrapper .rm-footer {
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: #b0b0b0;
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.3px;
}

/* Print Styles */
@media print {
  .resume-minimal-wrapper {
    background: white;
  }
  .resume-minimal-wrapper .rm-container {
    box-shadow: none;
    padding: 20px;
  }
}

/* Selection Style */
.resume-minimal-wrapper ::selection {
  background: #f5f5f5;
  color: #000000;
}
</style>
</head>

<body>
<div class="resume-minimal-wrapper">
<div class="rm-container">

  <!-- Header -->
  <div class="rm-name">{{full_name}}</div>
  <div class="rm-headline">{{#if job_title}}{{job_title}}{{else}}Professional{{/if}}{{#if headline}} · {{headline}}{{/if}}</div>

  <!-- Contact Bar -->
  <div class="rm-contact-bar">
    {{#if email}}<span class="rm-contact-item">✉ {{email}}</span>{{/if}}
    {{#if phone}}<span class="rm-contact-item">📱 {{phone}}</span>{{/if}}
    {{#if location}}<span class="rm-contact-item">📍 {{location}}</span>{{/if}}
    {{#if portfolio_url}}
      <span class="rm-contact-item">
        🌐 
        <a href="{{portfolio_url}}" target="_blank" rel="noopener noreferrer">
          {{#if portfolio_display}}{{portfolio_display}}{{else}}Portfolio{{/if}}
        </a>
      </span>
    {{/if}}
    {{#if linkedin_url}}
      <span class="rm-contact-item">
        🔗 
        <a href="{{linkedin_url}}" target="_blank" rel="noopener noreferrer">
          {{#if linkedin_display}}{{linkedin_display}}{{else}}LinkedIn{{/if}}
        </a>
      </span>
    {{/if}}
    {{#if github_url}}
      <span class="rm-contact-item">
        💻 
        <a href="{{github_url}}" target="_blank" rel="noopener noreferrer">
          {{#if github_display}}{{github_display}}{{else}}GitHub{{/if}}
        </a>
      </span>
    {{/if}}
  </div>

  <!-- Professional Summary -->
  {{#if professional_summary}}
  <div class="rm-section-title">About</div>
  <div class="rm-summary">{{professional_summary}}</div>
  {{/if}}

  <!-- Experience -->
  {{#if experience.length}}
  <div class="rm-section-title">Experience</div>
  {{#each experience}}
  <div class="rm-item">
    <div class="rm-item-header">
      <span class="rm-item-title">{{#if this.title}}{{this.title}}{{else}}{{this.position}}{{/if}}</span>
      {{#if this.start_date}}
      <span class="rm-item-date">{{this.start_date}} – {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}</span>
      {{/if}}
    </div>
    <div class="rm-item-company">{{this.company}}</div>
    {{#if this.location}}<div class="rm-item-location">{{this.location}}</div>{{/if}}
    {{#if this.description}}<div class="rm-item-description">{{this.description}}</div>{{/if}}
    
    {{#if this.achievements.length}}
    <ul class="rm-achievement-list">
      {{#each this.achievements}}
      <li class="rm-achievement-item">{{this}}</li>
      {{/each}}
    </ul>
    {{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Education -->
  {{#if education.length}}
  <div class="rm-section-title">Education</div>
  {{#each education}}
  <div class="rm-item">
    <div class="rm-item-header">
      <span class="rm-item-title">{{this.degree}}</span>
      {{#if this.start_date}}
      <span class="rm-item-date">{{this.start_date}} – {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}</span>
      {{/if}}
    </div>
    <div class="rm-item-company">{{#if this.institution}}{{this.institution}}{{else}}{{this.school}}{{/if}}</div>
    {{#if this.location}}<div class="rm-item-location">{{this.location}}</div>{{/if}}
    {{#if this.grade}}<div style="font-size: 11px; color: #7a7a7a; margin: 2px 0;">{{this.grade}}</div>{{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Skills -->
  {{#if technical_skills.length}}
  <div class="rm-section-title">Skills</div>
  <div class="rm-skills-section">
    <div class="rm-skills-category">
      <h4>Technical Skills</h4>
      <div class="rm-skills-grid">
        {{#each technical_skills}}
        <span class="rm-skill-item">{{this}}</span>
        {{/each}}
      </div>
    </div>
  {{else}}
    {{#if skills.technical.length}}
    <div class="rm-section-title">Skills</div>
    <div class="rm-skills-section">
      <div class="rm-skills-category">
        <h4>Technical Skills</h4>
        <div class="rm-skills-grid">
          {{#each skills.technical}}
          <span class="rm-skill-item">{{this}}</span>
          {{/each}}
        </div>
      </div>
    {{/if}}
  {{/if}}
  
  {{#if soft_skills.length}}
    <div class="rm-skills-category">
      <h4>Soft Skills</h4>
      <div class="rm-skills-grid">
        {{#each soft_skills}}
        <span class="rm-skill-item">{{this}}</span>
        {{/each}}
      </div>
    </div>
  {{else}}
    {{#if skills.soft.length}}
    <div class="rm-skills-category">
      <h4>Soft Skills</h4>
      <div class="rm-skills-grid">
        {{#each skills.soft}}
        <span class="rm-skill-item">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/if}}
  {{/if}}
  
  {{#if programming_languages.length}}
    <div class="rm-skills-category">
      <h4>Programming Languages</h4>
      <div class="rm-skills-grid">
        {{#each programming_languages}}
        <span class="rm-skill-item">{{this}}</span>
        {{/each}}
      </div>
    </div>
  {{else}}
    {{#if skills.languages.length}}
    <div class="rm-skills-category">
      <h4>Programming Languages</h4>
      <div class="rm-skills-grid">
        {{#each skills.languages}}
        <span class="rm-skill-item">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/if}}
  {{/if}}
  </div>

  <!-- Projects -->
  {{#if projects.length}}
  <div class="rm-section-title">Projects</div>
  {{#each projects}}
  <div class="rm-project-item">
    <div class="rm-project-header">
      <span class="rm-project-name">{{this.name}}</span>
      {{#if this.start_date}}
      <span class="rm-item-date">{{this.start_date}}{{#if this.end_date}} – {{this.end_date}}{{/if}}</span>
      {{/if}}
    </div>
    {{#if this.technologies.length}}
    <div class="rm-project-tech">
      {{#each this.technologies}}{{#if @index}} · {{/if}}{{this}}{{/each}}
    </div>
    {{/if}}
    <div class="rm-project-description">{{this.description}}</div>
    {{#if this.url}}
    <div class="rm-project-link"><a href="{{this.url}}" target="_blank" rel="noopener noreferrer">View Project →</a></div>
    {{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Languages -->
  {{#if languages.length}}
  <div class="rm-section-title">Languages</div>
  <div class="rm-languages-grid">
    {{#each languages}}
    <div class="rm-language-item">
      <span class="rm-language-name">{{#if this.language}}{{this.language}}{{else}}{{this}}{{/if}}</span>
      <span class="rm-language-level">{{#if this.proficiency}}{{this.proficiency}}{{else}}Professional{{/if}}</span>
    </div>
    {{/each}}
  </div>
  {{/if}}

  <!-- Certifications -->
  {{#if certifications.length}}
  <div class="rm-section-title">Certifications</div>
  {{#each certifications}}
  <div class="rm-cert-item">
    <div class="rm-cert-name">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
    {{#if this.issuer}}<div class="rm-cert-issuer">{{this.issuer}}</div>{{/if}}
    {{#if this.date}}<div class="rm-cert-date">{{this.date}}</div>{{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Awards -->
  {{#if awards.length}}
  <div class="rm-section-title">Awards</div>
  {{#each awards}}
  <div class="rm-award-item">
    <div class="rm-award-name">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
    {{#if this.description}}<div class="rm-award-desc">{{this.description}}</div>{{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Publications -->
  {{#if publications.length}}
  <div class="rm-section-title">Publications</div>
  {{#each publications}}
  <div class="rm-publication-item">
    <div class="rm-publication-title">{{#if this.title}}{{this.title}}{{else}}{{this}}{{/if}}</div>
    {{#if this.publisher}}<div class="rm-publication-details">{{this.publisher}}</div>{{/if}}
    {{#if this.date}}<div class="rm-publication-details">{{this.date}}</div>{{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Volunteering -->
  {{#if volunteering.length}}
  <div class="rm-section-title">Volunteering</div>
  {{#each volunteering}}
  <div class="rm-volunteer-item">
    <div class="rm-volunteer-org">{{#if this.organization}}{{this.organization}}{{else}}{{this}}{{/if}}</div>
    {{#if this.role}}<div class="rm-volunteer-role">{{this.role}}</div>{{/if}}
    {{#if this.description}}<div class="rm-item-description">{{this.description}}</div>{{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Interests -->
  {{#if interests.length}}
  <div class="rm-section-title">Interests</div>
  <div class="rm-interests">
    {{#each interests}}
    <span class="rm-interest-item">{{this}}</span>
    {{/each}}
  </div>
  {{/if}}
</div>
</div>
</body>
</html>
`;
