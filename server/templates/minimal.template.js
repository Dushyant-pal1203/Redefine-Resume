// templates/minimal.template.js
module.exports = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{full_name}} - Resume</title>

<style>
.resume-minimal-wrapper {
  all: initial;
  display: block;
  font-family: 'Helvetica Neue', 'Arial', sans-serif;
  color: #111111;
  line-height: 1.5;
  background: #ffffff;
  font-size: 10px;
}


.resume-minimal-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Main Container - Maximum Whitespace */
.resume-minimal-wrapper .rm-container {
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  padding: 30px 20px;
}

/* Typography - Clean and Simple */
.resume-minimal-wrapper .rm-name {
  font-size: 28px;
  font-weight: 500;
  letter-spacing: -1px;
  margin-bottom: 8px;
  color: #000000;
}

.resume-minimal-wrapper .rm-headline {
  font-size: 14px;
  font-weight: 300;
  color: #666666;
  margin-bottom: 15px;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 10px;
}

/* Contact Bar - Minimal */
.resume-minimal-wrapper .rm-contact-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 20px;
  color: #444444;
}

.resume-minimal-wrapper .rm-contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Section Titles - Understated */
.resume-minimal-wrapper .rm-section-title {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 15px 0 10px;
  color: #333333;
  position: relative;
}

.resume-minimal-wrapper .rm-section-title::after {
  content: '';
  display: block;
  width: 40px;
  height: 2px;
  background: #dddddd;
  margin-top: 8px;
}

/* Summary - Clean Paragraph */
.resume-minimal-wrapper .rm-summary {
  line-height: 1.8;
  color: #444444;
  margin-bottom: 15px;
  font-weight: 300;
}

/* Experience & Education Items */
.resume-minimal-wrapper .rm-item {
  margin-bottom: 15px;
}

.resume-minimal-wrapper .rm-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
  flex-wrap: wrap;
  gap: 10px;
}

.resume-minimal-wrapper .rm-item-title {
  font-size: 12px;
  font-weight: 600;
  color: #111111;
}

.resume-minimal-wrapper .rm-item-subtitle {
  font-weight: 400;
  color: #555555;
  margin-bottom: 4px;
}

.resume-minimal-wrapper .rm-item-company {
  font-weight: 400;
  color: #555555;
  margin-bottom: 4px;
}

.resume-minimal-wrapper .rm-item-date {
  color: #999999;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-item-location {
  color: #777777;
  margin-bottom: 10px;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-item-description {
  color: #444444;
  line-height: 1.7;
  font-weight: 300;
  margin-top: 8px;
}

/* Achievement List - Minimal Bullets */
.resume-minimal-wrapper .rm-achievement-list {
  list-style: none;
  margin-top: 10px;
}

.resume-minimal-wrapper .rm-achievement-item {
  color: #444444;
  margin-bottom: 6px;
  padding-left: 18px;
  position: relative;
  font-weight: 300;
  line-height: 1.6;
}

.resume-minimal-wrapper .rm-achievement-item::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #999999;
}

/* Skills - Clean Tags */
.resume-minimal-wrapper .rm-skills-section {
  margin-bottom: 30px;
}

.resume-minimal-wrapper .rm-skills-category {
  margin-bottom: 20px;
}

.resume-minimal-wrapper .rm-skills-category h4 {
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #555555;
  margin-bottom: 10px;
}

.resume-minimal-wrapper .rm-skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.resume-minimal-wrapper .rm-skill-item {
  color: #444444;
  font-weight: 300;
  position: relative;
}

.resume-minimal-wrapper .rm-skill-item:not(:last-child)::after {
  content: '·';
  margin-left: 16px;
  color: #cccccc;
}

/* Projects - Simple Cards */
.resume-minimal-wrapper .rm-project-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.resume-minimal-wrapper .rm-project-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.resume-minimal-wrapper .rm-project-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 6px;
  color: #111111;
}

.resume-minimal-wrapper .rm-project-tech {
  color: #888888;
  margin-bottom: 10px;
  font-weight: 300;
  letter-spacing: 0.3px;
}

.resume-minimal-wrapper .rm-project-description {
  color: #444444;
  line-height: 1.7;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-project-link {
  margin-top: 8px;
}

.resume-minimal-wrapper .rm-project-link a {
  color: #555555;
  text-decoration: none;
  border-bottom: 1px dotted #cccccc;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-project-link a:hover {
  color: #000000;
  border-bottom-color: #999999;
}

/* Languages - Simple Layout */
.resume-minimal-wrapper .rm-languages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 40px;
  margin-top: 10px;
}

.resume-minimal-wrapper .rm-language-item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: 6px;
  border-bottom: 1px dotted #eeeeee;
}

.resume-minimal-wrapper .rm-language-name {
  font-weight: 400;
  color: #333333;
}

.resume-minimal-wrapper .rm-language-level {
  color: #888888;
  font-weight: 300;
  font-style: italic;
}

/* Certifications - Clean List */
.resume-minimal-wrapper .rm-cert-item {
  margin-bottom: 15px;
}

.resume-minimal-wrapper .rm-cert-name {
  font-weight: 500;
  color: #333333;
  margin-bottom: 2px;
}

.resume-minimal-wrapper .rm-cert-issuer {
  color: #777777;
  font-weight: 300;
}

.resume-minimal-wrapper .rm-cert-date {
  color: #aaaaaa;
  margin-top: 2px;
  font-weight: 300;
}

/* Awards & Publications */
.resume-minimal-wrapper .rm-award-item,
.resume-minimal-wrapper .rm-publication-item {
  margin-bottom: 16px;
}

.resume-minimal-wrapper .rm-award-name,
.resume-minimal-wrapper .rm-publication-title {
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 2px;
}

.resume-minimal-wrapper .rm-award-desc,
.resume-minimal-wrapper .rm-publication-details {
  color: #777777;
  font-weight: 300;
  line-height: 1.6;
}

/* Volunteering */
.resume-minimal-wrapper .rm-volunteer-item {
  margin-bottom: 20px;
}

.resume-minimal-wrapper .rm-volunteer-org {
  font-size: 12px;
  font-weight: 500;
  color: #333333;
  margin-bottom: 2px;
}

.resume-minimal-wrapper .rm-volunteer-role {
  color: #666666;
  font-weight: 300;
  margin-bottom: 4px;
}

/* Interests - Simple Tags */
.resume-minimal-wrapper .rm-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 10px;
}

.resume-minimal-wrapper .rm-interest-item {
  color: #555555;
  font-weight: 300;
  position: relative;
}

.resume-minimal-wrapper .rm-interest-item::before {
  content: '·';
  position: absolute;
  left: -12px;
  color: #cccccc;
}

.resume-minimal-wrapper .rm-interest-item:first-child::before {
  display: none;
}

/* Divider Line */
.resume-minimal-wrapper .rm-divider {
  height: 1px;
  background: #f0f0f0;
  margin: 30px 0;
}

/* Footer */
.resume-minimal-wrapper .rm-footer {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  color: #aaaaaa;
  font-weight: 300;
  letter-spacing: 0.5px;
}

/* Print Styles */
@media print {
  .resume-modern-wrapper {
    background: white;
    padding: 0;
  }
}

/* Selection Style */
.resume-minimal-wrapper ::selection {
  background: #f0f0f0;
  color: #000000;
}

/* Links */
.resume-minimal-wrapper a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px dotted #dddddd;
}

.resume-minimal-wrapper a:hover {
  border-bottom-color: #999999;
}
</style>
</head>

<body>
<div class="resume-minimal-wrapper">
<div class="rm-container">

  <!-- Header -->
  <div class="rm-name">{{full_name}}</div>
  <div class="rm-headline">{{job_title}}{{#if headline}} · {{headline}}{{/if}}</div>

  <!-- Contact Bar -->
  <div class="rm-contact-bar">
    {{#if email}}<span class="rm-contact-item">✉ {{email}}</span>{{/if}}
    {{#if phone}}<span class="rm-contact-item">📱 {{phone}}</span>{{/if}}
    {{#if location}}<span class="rm-contact-item">📍 {{location}}</span>{{/if}}
  </div>
  <div class="rm-contact-bar">
    {{#if portfolio_url}}
      <span class="rm-contact-item">
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
      <span class="rm-contact-item">
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
      <span class="rm-contact-item">
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
    {{#if this.grade}}<div style="font-size: 14px; color: #777777; margin: 4px 0;">{{this.grade}}</div>{{/if}}
    {{#if this.description}}<div class="rm-item-description">{{this.description}}</div>{{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Skills -->
  {{#if skills.technical.length}}
  <div class="rm-section-title">Skills</div>
  <div class="rm-skills-section">
    {{#if skills.technical.length}}
    <div class="rm-skills-category">
      <h4>Technical</h4>
      <div class="rm-skills-grid">
        {{#each skills.technical}}
        <span class="rm-skill-item">{{this}}</span>
        {{/each}}
      </div>
    </div>
    {{/if}}
    
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
  </div>
  {{/if}}

  <!-- Projects -->
  {{#if projects.length}}
  <div class="rm-section-title">Projects</div>
  {{#each projects}}
  <div class="rm-project-item">
    <div class="rm-project-name">{{this.name}}</div>
    {{#if this.technologies.length}}
    <div class="rm-project-tech">
      {{#each this.technologies}}
        {{#if @first}}{{else}} · {{/if}}{{this}}
      {{/each}}
    </div>
    {{/if}}
    <div class="rm-project-description">{{this.description}}</div>
    {{#if this.url}}
    <div class="rm-project-link"><a href="{{this.url}}" style="color: #4158D0; text-decoration: none; margin-top: 8px; display: inline-block;" target="_blank" rel="noopener noreferrer">🔗 View Project →</a></div>
    {{/if}}
    {{#if this.start_date}}
    <div style="font-size: 13px; color: #aaaaaa; margin-top: 6px;">
      {{this.start_date}} – {{#if this.current}}Present{{else}}{{this.end_date}}{{/if}}
    </div>
    {{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Languages Section -->
  {{#if languages.length}}
  <div class="rm-section-title">Languages</div>
  <div class="rm-languages-grid">
    {{#each languages}}
    <div class="rm-language-item">
      <span class="rm-language-name">{{#if this.language}}{{this.language}}{{else}}{{this}}{{/if}}</span>
      <span class="rm-language-level">{{#if this.proficiency}}{{this.proficiency}}{{else}}Fluent{{/if}}</span>
    </div>
    {{/each}}
  </div>
  {{/if}}

  <!-- Certifications Section -->
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

  <!-- Awards Section -->
  {{#if awards.length}}
  <div class="rm-section-title">Awards</div>
  {{#each awards}}
  <div class="rm-award-item">
    <div class="rm-award-name">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
    {{#if this.description}}<div class="rm-award-desc">{{this.description}}</div>{{/if}}
  </div>
  {{/each}}
  {{/if}}

  <!-- Publications Section -->
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

  <!-- Footer with Years of Experience -->
  {{#if years_of_experience}}
  <div class="rm-footer">
    {{years_of_experience}}+ years of professional experience
  </div>
  {{/if}}
</div>
</div>
</body>
</html>
`;
