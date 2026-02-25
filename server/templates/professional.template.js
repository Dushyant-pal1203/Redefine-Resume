// templates/professional.template.js
module.exports = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{{full_name}} - Professional Resume</title>

<style>
/* Reset and Base Styles */
.resume-professional-wrapper {
  all: initial;
  display: block;
  font-family: 'Times New Roman', 'Georgia', 'Palatino', serif;
  color: #2c3e50;
  line-height: 1.5;
  background: #f8f9fa;
  font-size: 10px;
}

.resume-professional-wrapper * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* A4 Size Container */
.resume-professional-wrapper .rp-container {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: white;
  box-shadow: 0 5px 20px rgba(0,0,0,0.1);
  padding: 1mm 5mm;
  position: relative;
  page-break-after: always;
}



/* Responsive for smaller screens */
@media screen and (max-width: 210mm) {
  .resume-professional-wrapper .rp-container {
    width: 100%;
  }
}

/* Header - Classic Layout */
.resume-professional-wrapper .rp-header {
  text-align: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 2px solid #2c3e50;
}

.resume-professional-wrapper .rp-name {
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #1a2634;
  margin-bottom: 5px;
  text-transform: uppercase;
  font-family: 'Times New Roman', serif;
  line-height: 1.2;
}

.resume-professional-wrapper .rp-title {
  font-size: 12px;
  color: #4a5568;
  margin-bottom: 2px;
  font-style: italic;
  letter-spacing: 0.5px;
}
.resume-professional-wrapper .rp-subtitle {
  color: #black;
  margin-bottom: 4px;
  // font-style: italic;
  letter-spacing: 0.5px;
}

/* Contact Bar */
.resume-professional-wrapper .rp-contact-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4mm 6mm;
  color: #4a5568;
  margin-top: 3mm;
  border-top: 1px solid #e2e8f0;
  padding-top: 3mm;
}
.resume-professional-wrapper .rp-link-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2mm;
  margin-top:5px;
}

.resume-professional-wrapper .rp-contact-item {
  display: flex;
  align-items: center;
  gap: 2mm;
}
.resume-professional-wrapper .rp-contact-item a{
  color: black;
  text-decoration: none;
  font-weight: 500;
}

/* Two Column Layout */
.resume-professional-wrapper .rp-two-column {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 6mm;
  margin-top: 4mm;
}

/* Left Column */
.resume-professional-wrapper .rp-left-col {
  border-right: 1px solid #e2e8f0;
  padding-right: 5mm;
}

/* Section Titles - Classic Style */
.resume-professional-wrapper .rp-section-title {
  font-size: 12px;
  font-weight: 700;
  margin: 6mm 0 3mm;
  color: #1a2634;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid #cbd5e0;
  padding-bottom: 1.5mm;
  font-family: 'Times New Roman', serif;
}

.resume-professional-wrapper .rp-section-title:first-of-type {
  margin-top: 0;
}

/* Contact Details */
.resume-professional-wrapper .rp-contact-details {
  margin: 3mm 0;
}

.resume-professional-wrapper .rp-contact-detail-item {
  margin-bottom: 2mm;
  display: flex;
  align-items: center;
  gap: 2mm;
}

/* Summary Text */
.resume-professional-wrapper .rp-summary {
  line-height: 1.6;
  color: #4a5568;
  margin: 3mm 0;
  text-align: justify;
}

/* Experience Items */
.resume-professional-wrapper .rp-experience-item {
  margin-bottom: 5mm;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1.5mm;
  flex-wrap: wrap;
}

.resume-professional-wrapper .rp-item-title {
  font-size: 12px;
  font-weight: 700;
  color: #2c3e50;
}

.resume-professional-wrapper .rp-item-subtitle {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1mm;
}

.resume-professional-wrapper .rp-item-company {
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 1mm;
}

.resume-professional-wrapper .rp-item-date {;
  color: #718096;
  font-style: italic;
}

.resume-professional-wrapper .rp-item-location {
  color: #718096;
  margin-bottom: 2mm;
}

.resume-professional-wrapper .rp-item-description {
  color: #4a5568;
  margin: 2mm 0;
  line-height: 1.5;
}

/* Achievement List */
.resume-professional-wrapper .rp-achievement-list {
  list-style: none;
  margin-top: 2mm;
}

.resume-professional-wrapper .rp-achievement-item {
  margin-bottom: 1.5mm;
  padding-left: 4mm;
  position: relative;
  color: #4a5568;
  line-height: 1.5;
}

.resume-professional-wrapper .rp-achievement-item::before {
  content: '•';
  position: absolute;
  left: 1mm;
  color: #2c3e50;
  font-weight: bold;
}

/* Skills Section */
.resume-professional-wrapper .rp-skills-group {
  margin-bottom: 4mm;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-skills-group h4 {
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 2mm;
  color: #2c3e50;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.resume-professional-wrapper .rp-skills-list {
  list-style: none;
}

.resume-professional-wrapper .rp-skills-list li {
  margin-bottom: 1.5mm;
  padding-left: 2px;
  position: relative;
  color: #4a5568;
}

.resume-professional-wrapper .rp-skills-list li::before {
  content: '— ';
  position: relative;
  left: 0;
  margin-right: 5px;
  color: #718096;
}

/* Projects */
.resume-professional-wrapper .rp-project-item {
  margin-bottom: 4mm;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-project-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1mm;
  flex-wrap: wrap;
}

.resume-professional-wrapper .rp-project-name {
  font-size: 12px;
  font-weight: 700;
  color: #2c3e50;
}

.resume-professional-wrapper .rp-project-tech {
  color: #718096;
  font-style: italic;
  margin-bottom: 1.5mm;
}

.resume-professional-wrapper .rp-project-link {
  margin-top: 1.5mm;
}

.resume-professional-wrapper .rp-project-link a {
  color: #6699CC;
  text-decoration: none;
   font-weight: 500;
}

/* Education Items */
.resume-professional-wrapper .rp-education-item {
  margin-bottom: 4mm;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-degree {
  font-size: 12px;
  font-weight: 700;
  color: #2c3e50;
}

.resume-professional-wrapper .rp-school {
  color: #4a5568;
  font-weight: 600;
  margin-bottom: 1mm;
}

.resume-professional-wrapper .rp-grade {
  color: #718096;
  margin-top: 1mm;
}

/* Certifications & Awards */
.resume-professional-wrapper .rp-cert-item,
.resume-professional-wrapper .rp-award-item {
  margin-bottom: 3mm;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-cert-name,
.resume-professional-wrapper .rp-award-name {
  font-weight: 600;
  color: #2c3e50;
}

.resume-professional-wrapper .rp-cert-issuer,
.resume-professional-wrapper .rp-award-desc {
  color: #718096;
  font-style: italic;
}

/* Languages */
.resume-professional-wrapper .rp-language-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2mm;
  border-bottom: 1px dotted #e2e8f0;
  padding-bottom: 1.5mm;
}

.resume-professional-wrapper .rp-language-name {
  font-weight: 600;
  color: #2c3e50;
}

.resume-professional-wrapper .rp-language-level {
  color: #718096;
  font-style: italic;
}

/* Publications */
.resume-professional-wrapper .rp-publication-item {
  margin-bottom: 3mm;
  page-break-inside: avoid;
}

.resume-professional-wrapper .rp-publication-title {
  font-size: 12px;
  font-weight: 600;
  color: #2c3e50;
  font-style: italic;
}

.resume-professional-wrapper .rp-publication-details {
  color: #718096;
}

/* Interests */
.resume-professional-wrapper .rp-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 2mm 3mm;
  margin-top: 2mm;
}

.resume-professional-wrapper .rp-interest-item {
  color: #4a5568;
  position: relative;
  padding-left: 3mm;
}

.resume-professional-wrapper .rp-interest-item::before {
  content: '▪';
  position: absolute;
  left: 0;
  color: #2c3e50;
}

/* Footer */
.resume-professional-wrapper .rp-footer {
  margin-top: 6mm;
  padding-top: 3mm;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  color: #a0aec0;
  font-style: italic;
}

/* Prevent orphans */
.resume-professional-wrapper p, 
.resume-professional-wrapper li {
  orphans: 3;
  widows: 3;
}
</style>
</head>

<body>
<div class="resume-professional-wrapper">
<div class="rp-container">

  <!-- Header -->
  <div class="rp-header">
    <div class="rp-name">{{full_name}}</div>
    <div class="rp-title">{{#if job_title}}{{job_title}}{{/if}}</div>
    <div class="rp-subtitle">{{#if headline}}{{headline}}{{/if}}</div>

    <!-- Contact Details -->
    <div class="rp-contact-bar">
      {{#if email}}<span class="rp-contact-item">✉️ {{email}}</span>{{/if}}
      {{#if phone}}<span class="rp-contact-item">📱 {{phone}}</span>{{/if}}
      {{#if location}}<span class="rp-contact-item">🌍 {{location}}</span>{{/if}}
    </div>
   
      <div class="rp-link-bar">
        {{#if portfolio_display}}
        <div class="rp-contact-item">🌐<a href="{{portfolio_url}}" target="_blank" rel="noopener noreferrer">{{portfolio_display}}</a></div>
        {{/if}}
        {{#if linkedin_display}}
        <div class="rp-contact-item">🔗<a href="{{linkedin_url}}" target="_blank" rel="noopener noreferrer">{{linkedin_display}}</a></div>
        {{/if}}
        {{#if github_display}}
        <div class="rp-contact-item">💻<a href="{{github_url}}" target="_blank" rel="noopener noreferrer">{{github_display}}</a></div>
        {{/if}}
      </div>
  </div>

  <!-- Two Column Layout -->
  <div class="rp-two-column">
    
    <!-- Left Column -->
    <div class="rp-left-col">
      
      <!-- Professional Summary -->
      {{#if professional_summary}}
      <div class="rp-section-title">Summary</div>
      <div class="rp-summary">{{professional_summary}}</div>
      {{/if}}

      <!-- Skills -->
      <div class="rp-section-title">Skills</div>
      
      {{#if skills.technical.length}}
      <div class="rp-skills-group">
        <h4>Technical</h4>
        <ul class="rp-skills-list">
          {{#each skills.technical}}
          <li>{{this}}</li>
          {{/each}}
        </ul>
      </div>
      {{/if}}
      
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
        {{#if this.date}}<div">{{this.date}}</div>{{/if}}
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
    </div>

    <!-- Right Column -->
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
        {{#if this.location}}<div style=" color: #718096;">{{this.location}}</div>{{/if}}
        {{#if this.grade}}<div class="rp-grade">GPA: {{this.grade}}</div>{{/if}}
        {{#if this.description}}<div class="rp-item-description">{{this.description}}</div>{{/if}}
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
          {{#each this.technologies}}
            {{#if @first}}{{else}}, {{/if}}{{this}}
          {{/each}}
        </div>
        {{/if}}
        <div class="rp-item-description">{{this.description}}</div>
        {{#if this.url}}
        <div class="rp-project-link"><a href="{{this.url}}" target="_blank">🔗 View Project</a></div>
        {{/if}}
      </div>
      {{/each}}
      {{/if}}

      <!-- Awards -->
      {{#if awards.length}}
      <div class="rp-section-title">Awards</div>
      {{#each awards}}
      <div class="rp-award-item">
        <div class="rp-award-name">{{#if this.name}}{{this.name}}{{else}}{{this}}{{/if}}</div>
        {{#if this.description}}<div class="rp-award-desc">{{this.description}}</div>{{/if}}
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
      <div class="rp-experience-item">
        <div class="rp-item-subtitle">{{#if this.organization}}{{this.organization}}{{else}}{{this}}{{/if}}</div>
        {{#if this.role}}<div class="rp-item-company">{{this.role}}</div>{{/if}}
        {{#if this.description}}<div class="rp-item-description">{{this.description}}</div>{{/if}}
      </div>
      {{/each}}
      {{/if}}
    </div>
  </div>

  <!-- Footer with Years of Experience -->
  {{#if years_of_experience}}
  <div class="rp-footer">
    {{years_of_experience}}+ Years of Professional Experience
  </div>
  {{/if}}
</div>
</div>
</body>
</html>
`;
