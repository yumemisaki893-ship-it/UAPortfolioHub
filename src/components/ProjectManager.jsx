import React, { useState } from 'react';

export const ProjectManager = ({ projects = [], onChange }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLink, setNewLink] = useState('');

  // Add project to the list
  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProject = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      link: newLink.trim()
    };

    const updatedProjects = [...projects, newProject];
    onChange(updatedProjects);

    // Reset inputs
    setNewTitle('');
    setNewDesc('');
    setNewLink('');
  };

  // Remove project from the list
  const handleRemove = (id) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    onChange(updatedProjects);
  };

  return (
    <div className="profile-section glass">
      <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Project Showcase</h2>
      <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem' }}>
        Highlight key projects, apps, or design mockups you have built.
      </p>

      {/* Existing projects list */}
      <div style={{ marginBottom: '2rem' }}>
        {projects.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No projects added yet.</p>
        ) : (
          projects.map((proj, idx) => (
            <div key={proj.id || idx} className="project-editor-card">
              <div className="project-editor-header">
                <span>{proj.title}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-danger"
                  style={{ minHeight: '32px', padding: '0 0.75rem' }}
                  onClick={() => handleRemove(proj.id)}
                >
                  Remove
                </button>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{proj.description}</p>
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.8rem', display: 'block', marginTop: '0.25rem' }}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '12px', height: '12px', marginRight: '0.25rem', display: 'inline-block', verticalAlign: 'middle' }}>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  {proj.link}
                </a>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Project Form */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Add New Project</h3>
        
        <div className="form-group">
          <label className="form-label" htmlFor="new-proj-title">Project Title *</label>
          <input
            type="text"
            id="new-proj-title"
            className="form-control"
            placeholder="e.g. Smart Irrigation System"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="new-proj-desc">Project Description</label>
          <textarea
            id="new-proj-desc"
            className="form-control"
            placeholder="Briefly explain what you built, what tech stack was used, and the outcomes."
            rows="3"
            style={{ resize: 'vertical' }}
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="new-proj-link">Project Link (URL)</label>
          <span className="form-hint">E.g., GitHub repo, Figma design, or live website</span>
          <input
            type="url"
            id="new-proj-link"
            className="form-control"
            placeholder="https://github.com/yourusername/project"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          style={{ width: '100%', marginTop: '0.5rem' }}
          onClick={handleAdd}
          disabled={!newTitle.trim()}
        >
          Add Project to Portfolio
        </button>
      </div>
    </div>
  );
};
export default ProjectManager;
