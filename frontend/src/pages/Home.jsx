import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="live-badge">
            <span className="pulse-dot"></span> Powered by OpenAI
          </div>
          <h1>
            Prepare for Your Next <br />
            <span className="gradient-text">Technical Interview</span> with AI
          </h1>
          <p className="hero-subtitle">
            Practice real-time role-specific technical interviews, receive instant granular feedback, and bridge your skill gaps to land your dream job.
          </p>
          <div className="hero-buttons">
            <button
              className="primary-btn ripple"
              onClick={() => navigate("/interview")}
            >
              Start Free Mock Interview
            </button>
            <button
              className="secondary-btn"
              onClick={() => navigate("/dashboard")}
            >
              View Dashboard
            </button>
          </div>
          <div className="hero-trust">
            <p>Trusted by candidates placed at</p>
            <div className="company-logos">
              <span className="logo-text">Google</span>
              <span className="logo-text">Microsoft</span>
              <span className="logo-text">Amazon</span>
              <span className="logo-text">Meta</span>
            </div>
          </div>
        </div>
        <div className="hero-image-container">
          <img
            src="https://illustrations.popsy.co/blue/artificial-intelligence.svg"
            alt="AI Interview Dashboard Preview"
            className="floating-img"
          />
          <div className="live-stat-overlay">
            <p className="stat-num">1,240+</p>
            <p className="stat-label">Users practicing live right now</p>
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stat-card">
          <h2 className="stat-gradient">50k+</h2>
          <p>Interviews Completed</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-gradient">60+</h2>
          <p>Tech Frameworks</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-gradient">94.8%</h2>
          <p>Placement Success</p>
        </div>
        <div className="stat-card">
          <h2 className="stat-gradient">&lt; 30s</h2>
          <p>Instant Feedback Time</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <span className="sub-title">Features</span>
          <h2>Everything you need to crack coding & system design roles</h2>
        </div>
        <div className="feature-grid">
          <div className="feature-card-premium">
            <div className="icon-wrapper">🤖</div>
            <h3>Adaptive AI Questioning</h3>
            <p>Our AI analyzes your previous answer and cross-questions you dynamically, just like a real human interviewer.</p>
          </div>
          <div className="feature-card-premium">
            <div className="icon-wrapper">📊</div>
            <h3>Granular Skill Mapping</h3>
            <p>Get broken down metrics on Problem Solving, Code Efficiency, Communication, and Technical Depth.</p>
          </div>
          <div className="feature-card-premium">
            <div className="icon-wrapper">⏱️</div>
            <h3>Real-time Coding Sandbox</h3>
            <p>Write and run your code on an embedded IDE while explaining your logic to the AI assistant.</p>
          </div>
          <div className="feature-card-premium">
            <div className="icon-wrapper">📂</div>
            <h3>Detailed History & Replays</h3>
            <p>Review full transcriptions, audio recordings, and optimized code solutions anytime to learn from mistakes.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-header">
          <span className="sub-title">Workflow</span>
          <h2>4 Simple Steps to Success</h2>
        </div>
        <div className="steps-container">
          <div className="step-item">
            <div className="step-number-bubble">01</div>
            <h3>Configure Role</h3>
            <p>Select your stack (e.g., React, Java) and seniority level (Fresher to Lead).</p>
          </div>
          <div className="step-item">
            <div className="step-number-bubble">02</div>
            <h3>Live Session</h3>
            <p>Interact via speech-to-text or chat with our interactive AI panel.</p>
          </div>
          <div className="step-item">
            <div className="step-number-bubble">03</div>
            <h3>Run & Fix Code</h3>
            <p>Solve algorithm challenges in real-time with automated edge-case test runs.</p>
          </div>
          <div className="step-item">
            <div className="step-number-bubble">04</div>
            <h3>Comprehensive Review</h3>
            <p>Receive your overall score, detailed code fixes, and standard model answers.</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header">
          <span className="sub-title">Success Stories</span>
          <h2>From Practice to Placement</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p className="review">"The follow-up questions from the AI were shockingly realistic. It felt exactly like my actual Amazon technical round!"</p>
            <div className="user-info">
              <strong>Rahul K.</strong>
              <span>Software Engineer at Amazon</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p className="review">"The instant feedback helped me fix my communication gaps. Highly recommend it to freshers looking for their first breakthrough."</p>
            <div className="user-info">
              <strong>Sneha M.</strong>
              <span>Associate Developer at TCS</span>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {[
            { q: "Is the first mock interview free?", a: "Yes! Your first full-length interview with complete feedback reports is 100% free." },
            { q: "Which programming languages are supported?", a: "We support over 20+ languages including JavaScript, Python, Java, C++, Go, and Ruby." },
            { q: "Can I use voice inputs for the interview?", a: "Absolutely. You can enable your microphone to answer questions vocally to practice your speaking clarity." }
          ].map((faq, index) => (
            <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`} onClick={() => toggleFaq(index)}>
              <div className="faq-question">
                <h3>{faq.q}</h3>
                <span>{activeFaq === index ? "−" : "+"}</span>
              </div>
              {activeFaq === index && <p className="faq-answer">{faq.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-box">
          <h2>Ready to Land Your Dream Job?</h2>
          <p>Join thousands of developers utilizing AI to eliminate interview anxiety and fast-track their tech careers.</p>
          <button
            className="primary-btn light ripple"
            onClick={() => navigate("/interview")}
          >
            Get Started Instantly
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>AI Interviewer</h3>
            <p>Elevating technical interview preparation with cutting edge Artificial Intelligence.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Platform</h4>
              <p>Features</p>
              <p>Pricing</p>
            </div>
            <div>
              <h4>Resources</h4>
              <p>Blog</p>
              <p>Supported Tech</p>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AI Interviewer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}