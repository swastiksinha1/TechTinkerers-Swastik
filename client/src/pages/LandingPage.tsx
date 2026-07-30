import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TiltCard } from "@/components/unlumen-ui/tilt-card";

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Hero animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.05], [0, -100]);

  // Steps active state based on scroll
  // Changing opacity from 0 to 1 to 0 so they don't overlap, 
  // and tightening the ranges so they don't bleed into each other
  const step1Active = useTransform(scrollYProgress, [0.00, 0.10, 0.20], [0, 1, 0]);
  const step2Active = useTransform(scrollYProgress, [0.15, 0.25, 0.35], [0, 1, 0]);
  const step3Active = useTransform(scrollYProgress, [0.30, 0.40, 0.50], [0, 1, 0]);
  const step4Active = useTransform(scrollYProgress, [0.45, 0.55, 0.65], [0, 1, 0]);
  const step5Active = useTransform(scrollYProgress, [0.60, 0.70, 0.80], [0, 1, 0]);
  const step6Active = useTransform(scrollYProgress, [0.75, 0.85, 0.95], [0, 1, 0]);

  // The red glowing path drawing animation
  // Segmented to match the story
  const pathLength1 = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]); // Scan to Routing
  const pathLength2 = useTransform(scrollYProgress, [0.25, 0.45], [0, 1]); // Routing to Tech
  const pathLength3 = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]); // Escalation paths
  const pathLength4 = useTransform(scrollYProgress, [0.65, 0.85], [0, 1]); // Student Verification Loop
  const pathLength5 = useTransform(scrollYProgress, [0.85, 0.95], [0, 1]); // Ledger save

  return (
    <div ref={containerRef} style={{ background: 'var(--bg-color)', position: 'relative' }}>
      
      {/* 1. Hero Section */}
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem 4rem', position: 'relative', zIndex: 10 }}>
        <nav style={{ display: 'flex', justifySelf: 'start', justifyContent: 'space-between', padding: '1rem 0', background: 'transparent', border: 'none', position: 'static' }}>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.05em' }}>CAMPUSTRIAGE</div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <a href="#process" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem', textTransform: 'uppercase' }}>Our Process</a>
            <button onClick={() => navigate('/portal')} style={{ background: 'var(--text-primary)', color: 'white', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>REQUEST HELP</button>
          </div>
        </nav>

        <motion.div style={{ opacity: heroOpacity, y: heroY, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          <h1 className="mega-heading" style={{ marginBottom: '2rem' }}>
            From issue<br />to resolution.
          </h1>
          <p style={{ fontSize: '1.5rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: 1.4 }}>
            AI-driven speed. Expert triage. <br/>
            We mobilize verified technicians to protect your campus.
          </p>
          <div style={{ marginTop: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em', fontWeight: 600 }}>
            <span>Scroll to discover our process</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.div>
          </div>
        </motion.div>
      </div>

      {/* 2. Sticky Scroll Section with Isometric Story */}
      {/* Increased height to 700vh to fit 6 steps comfortably */}
      <div id="process" style={{ position: 'relative', height: '700vh', zIndex: 10 }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', padding: '0 4rem', overflow: 'hidden' }}>
          
          {/* Left: Sticky Steps */}
          <div style={{ flex: '0 0 40%' }}>
            
            {/* The steps container must have absolute position elements so they overlap,
                and fade in/out in the exact same spot, because 6 steps won't fit in a single vertical flexbox visually. */}
            <div style={{ position: 'relative', height: '50vh', display: 'flex', alignItems: 'center' }}>
              
              <motion.div style={{ opacity: step1Active, position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-color)' }}>01</span>
                <div>
                  <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Scan and Report</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '400px' }}>
                    A student sees a broken fixture, scans a QR sticker on the wall, takes a quick photo, and hits send.
                  </p>
                </div>
              </motion.div>

              <motion.div style={{ opacity: step2Active, position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-color)' }}>02</span>
                <div>
                  <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Instant Routing</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '400px' }}>
                    The system looks at <em>where</em> the QR code is and <em>what</em> the problem is, then automatically routes the ticket to the exact technician on duty.
                  </p>
                </div>
              </motion.div>

              <motion.div style={{ opacity: step3Active, position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-color)' }}>03</span>
                <div>
                  <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Countdown Starts</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '400px' }}>
                    A timer starts immediately (e.g., 24 hours for a standard repair). Everyone can see how much time is left on the clock.
                  </p>
                </div>
              </motion.div>

              <motion.div style={{ opacity: step4Active, position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-color)' }}>04</span>
                <div>
                  <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Automatic Escalation</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '400px' }}>
                    If the technician doesn't fix it before time runs out, the ticket automatically alerts the Hostel Warden. If ignored, it jumps to the Dean.
                  </p>
                </div>
              </motion.div>

              <motion.div style={{ opacity: step5Active, position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-color)' }}>05</span>
                <div>
                  <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Student Verification</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '400px' }}>
                    The technician cannot mark the ticket as "Done" on their own. The student who reported it has to confirm and rate the fix first.
                  </p>
                </div>
              </motion.div>

              <motion.div style={{ opacity: step6Active, position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary-color)' }}>06</span>
                <div>
                  <h3 className="section-heading" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Tamper-Proof Proof</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6, maxWidth: '400px' }}>
                    Every single update is saved permanently so staff can't change dates or fake completion times to look good.
                  </p>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Right: Isometric Campus Story */}
          <div style={{ flex: '0 0 60%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            
            {/* The Isometric 3D Background */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: 'url(/isometric_campus.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.8, filter: 'contrast(1.1) brightness(1.05)' }}></div>

            {/* Overlay SVG for the glowing red route tracing */}
            <svg width="100%" height="100%" viewBox="0 0 1000 1000" style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
              
              {/* Step 1: Scan and Report -> Issue sent to system */}
              <motion.path
                d="M 200 400 L 400 500 L 500 450"
                fill="transparent"
                stroke="#ff4b4b"
                strokeWidth="6"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: pathLength1, filter: 'drop-shadow(0 0 12px rgba(255, 75, 75, 0.8))' }}
              />
              
              {/* Step 2: Instant Routing (Splitting data paths) */}
              <motion.path
                d="M 500 450 L 550 475 L 650 425 M 500 450 L 530 435 L 630 385 M 500 450 L 470 435 L 570 385"
                fill="transparent"
                stroke="#ff4b4b"
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: pathLength2, filter: 'drop-shadow(0 0 8px rgba(255, 75, 75, 0.8))' }}
              />

              {/* Step 3 & 4: Countdown & Escalation (Paths moving upward/outward like alarms) */}
              <motion.path
                d="M 650 425 L 750 375 L 800 400 M 630 385 L 730 335 L 780 360 M 570 385 L 670 335 L 720 360"
                fill="transparent"
                stroke="#f59e0b" // Orange/Warning color for escalation
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: pathLength3, filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.8))' }}
              />

              {/* Step 5: Verification (Paths looping back to origin) */}
              <motion.path
                d="M 800 400 L 700 550 L 400 700 L 300 650"
                fill="transparent"
                stroke="#10b981" // Green color for verification
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: pathLength4, filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.8))' }}
              />

              {/* Step 6: Tamper-Proof Proof (Connecting to a central block/ledger) */}
              <motion.path
                d="M 300 650 L 400 750 L 500 700 L 550 725 L 500 750 L 450 725 Z" // Drawing a little block
                fill="transparent"
                stroke="#3b82f6" // Blue color for ledger
                strokeWidth="4"
                strokeLinejoin="round"
                strokeLinecap="round"
                style={{ pathLength: pathLength5, filter: 'drop-shadow(0 0 10px rgba(59, 130, 246, 0.8))' }}
              />

            </svg>

            {/* Glowing nodes at intersections */}
            <motion.div style={{ opacity: pathLength1, position: 'absolute', top: '45%', left: '50%', width: '12px', height: '12px', background: 'white', border: '3px solid #ff4b4b', borderRadius: '50%', boxShadow: '0 0 20px #ff4b4b' }} />
            <motion.div style={{ opacity: pathLength4, position: 'absolute', top: '65%', left: '30%', width: '12px', height: '12px', background: 'white', border: '3px solid #10b981', borderRadius: '50%', boxShadow: '0 0 20px #10b981' }} />

          </div>
        </div>
      </div>

      {/* 3. Grid Section */}
      <div style={{ padding: '8rem 4rem', background: 'var(--surface-color)', position: 'relative', zIndex: 10 }}>
        <h2 className="section-heading" style={{ marginBottom: '4rem', maxWidth: '800px' }}>
          Designed for today's campus operations.
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ width: '64px', height: '64px', marginBottom: '2rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Rapid Activation</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>We believe speed is a skill. Our platform uses machine learning to turn reporting into instant logistics, deploying a precisely matched workforce the moment demand strikes.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div style={{ width: '64px', height: '64px', marginBottom: '2rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Rigorous Selection</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Geography is a core metric. Our engine uses AI to find and contact qualified talent within defined radii, securing top local contractors first.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div style={{ width: '64px', height: '64px', marginBottom: '2rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>100% Verified</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>We use a Zero-Trust verification model with secure API integrations to run automated background checks, blocking dispatch access until fully cleared.</p>
          </motion.div>
        </div>
      </div>

      {/* 4. Massive Footer */}
      <div style={{ background: '#020617', color: 'white', padding: '8rem 4rem 2rem', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
        <h2 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '4rem', letterSpacing: '-0.02em', maxWidth: '800px' }}>
          Staff your campus with fast response, and crews you can rely on.
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', padding: '2rem 0', marginBottom: '4rem' }}>
          <div onClick={() => navigate('/portal')} style={{ cursor: 'pointer' }}>
            <TiltCard
              title="Student Portal"
              description="Report an issue directly to the maintenance team using AI Triage."
              price="Quick"
              badgeLabel="Active"
              imageSrc="/isometric_campus.png"
            />
          </div>
          <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <TiltCard
              title="Technician Dashboard"
              description="View your assigned tasks, confirm fixes, and track your SLA."
              price="Pro"
              badgeLabel="Secure"
              imageSrc="/isometric_campus.png"
            />
          </div>
          <div onClick={() => navigate('/map')} style={{ cursor: 'pointer' }}>
            <TiltCard
              title="Campus Map"
              description="See real-time analytics and live issues across the entire campus."
              price="Live"
              badgeLabel="Analytics"
              imageSrc="/isometric_campus.png"
            />
          </div>
        </div>

        <div style={{ fontSize: '15vw', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.8, color: '#f8fafc', marginBottom: '2rem', textAlign: 'center' }}>
          TRIAGE
        </div>
        
      </div>

    </div>
  );
};

export default LandingPage;
