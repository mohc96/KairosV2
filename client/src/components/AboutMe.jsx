import React, { useState } from 'react';
import { User, ChevronDown, Mail, X } from 'lucide-react';
import '../styles/AboutMe.css';

export default function AboutMe() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [form, setForm] = useState({
    years: '',
    skills: '',
    endorsements: '',
  });
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedEmails, setInvitedEmails] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: handle form submission logic
  };

  const handleInviteEmailChange = (e) => {
    setInviteEmail(e.target.value);
  };

  const handleInviteEmailKeyPress = (e) => {
    if (e.key === 'Enter' && inviteEmail.trim()) {
      e.preventDefault();
      const email = inviteEmail.trim();
      if (isValidEmail(email) && !invitedEmails.includes(email)) {
        setInvitedEmails([...invitedEmails, email]);
        setInviteEmail('');
      }
    }
  };

  const removeInvitedEmail = (emailToRemove) => {
    setInvitedEmails(invitedEmails.filter(email => email !== emailToRemove));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    if (invitedEmails.length > 0) {
      // TODO: handle invitation submission logic
      console.log('Inviting emails:', invitedEmails);
      setInvitedEmails([]);
    }
  };

  return (
    <div className="aboutme-card-outer">
      <div className="aboutme-card-inner">
        <div className="aboutme-header-row" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="aboutme-header-icon"><User /></div>
          <div className="aboutme-header-texts">
            <div className="aboutme-title">About Me</div>
            <div className="aboutme-subtitle">Tell us about yourself</div>
          </div>
          <ChevronDown className={`aboutme-chevron ${isExpanded ? 'aboutme-chevron-rotated' : ''}`} />
        </div>
        {isExpanded && (
          <>
            <form className="aboutme-form" onSubmit={handleSubmit}>
              <label className="aboutme-form-label">
                What have you been doing over the past several years?
                <input
                  type="text"
                  name="years"
                  className="aboutme-form-input"
                  value={form.years}
                  onChange={handleChange}
                  placeholder="Enter your answer"
                  autoComplete="off"
                />
              </label>
              <label className="aboutme-form-label">
                What skills have you acquired?
                <input
                  type="text"
                  name="skills"
                  className="aboutme-form-input"
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="Enter your answer"
                  autoComplete="off"
                />
              </label>
              <label className="aboutme-form-label">
                Do you have any special "endorsements"?
                <input
                  type="text"
                  name="endorsements"
                  className="aboutme-form-input"
                  value={form.endorsements}
                  onChange={handleChange}
                  placeholder="Enter your answer"
                  autoComplete="off"
                />
              </label>
              <button type="submit" className="aboutme-form-submit">
                <svg className="aboutme-form-submit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5L21 12 10.5 4.5v5.25L3 9.75v4.5l7.5 0v5.25z" />
                </svg>
                Submit
              </button>
            </form>

            {/* Invite Others Section */}
            <div className="aboutme-invite-section">
              <div className="aboutme-invite-header">
                <Mail className="aboutme-invite-icon" />
                <div className="aboutme-invite-texts">
                  <div className="aboutme-invite-title">Invite others?</div>
                  <div className="aboutme-invite-subtitle">Invite outside organizational individuals to upload resume/credential information</div>
                </div>
              </div>
              
              <div className="aboutme-invite-container">
                <div className="aboutme-invite-input-wrapper">
                  {invitedEmails.map((email, index) => (
                    <div key={index} className="aboutme-email-tile">
                      <span className="aboutme-email-text">{email}</span>
                      <button
                        type="button"
                        className="aboutme-email-remove"
                        onClick={() => removeInvitedEmail(email)}
                      >
                        <X className="aboutme-email-remove-icon" />
                      </button>
                    </div>
                  ))}
                  <input
                    type="email"
                    className="aboutme-invite-input"
                    value={inviteEmail}
                    onChange={handleInviteEmailChange}
                    onKeyPress={handleInviteEmailKeyPress}
                    placeholder={invitedEmails.length === 0 ? "Enter email address" : ""}
                    autoComplete="off"
                  />
                </div>
                
                {invitedEmails.length > 0 && (
                  <button 
                    type="button" 
                    className="aboutme-invite-submit"
                    onClick={handleInviteSubmit}
                  >
                    <Mail className="aboutme-invite-submit-icon" />
                    Send Invitations
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 