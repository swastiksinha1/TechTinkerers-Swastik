import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TiltCard } from "@/components/unlumen-ui/tilt-card";

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { scrollYProgress: processScroll } = useScroll({
    target: processRef,
    offset: ["start start", "end end"]
  });

  // Hero animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.05], [0, -100]);

  const stepsData = [
    { title: "Scan and Report", desc: "A student sees a broken fixture, scans a QR sticker on the wall, takes a quick photo, and hits send." },
    { title: "Instant Routing", desc: "The system looks at where the QR code is and what the problem is, then automatically routes the ticket to the exact technician on duty." },
    { title: "Countdown Starts", desc: "A timer starts immediately (e.g., 24 hours for a standard repair). Everyone can see how much time is left on the clock." },
    { title: "Automatic Escalation", desc: "If the technician doesn't fix it before time runs out, the ticket automatically alerts the Hostel Warden. If ignored, it jumps to the Dean." },
    { title: "Student Verification", desc: "The technician cannot mark the ticket as \"Done\" on their own. The student who reported it has to confirm and rate the fix first." },
    { title: "Tamper-Proof Proof", desc: "Every single update is saved permanently so staff can't change dates or fake completion times to look good." },
  ];

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

      {/* 2. Sticky Scroll Section: Vercel Snap Text Style */}
      <div id="process" ref={processRef} style={{ position: 'relative', height: '600vh', zIndex: 10, background: '#ffffff' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4rem', overflow: 'hidden' }}>
          
          <div style={{ position: 'relative', width: '100%', maxWidth: '900px', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {stepsData.map((step, index) => {
              const numSteps = stepsData.length;
              const stepSize = 1 / numSteps;
              const start = index * stepSize;
              const peak = start + stepSize / 2;
              const end = start + stepSize;

              // The opacity peaks at the center of the step's scroll range, and fades out by the edges
              const opacity = useTransform(processScroll, [start, peak, end], [0, 1, 0]);
              // The text drifts up slightly as you scroll down
              const y = useTransform(processScroll, [start, peak, end], [40, 0, -40]);
              const scale = useTransform(processScroll, [start, peak, end], [0.95, 1, 0.95]);

              return (
                <motion.div 
                  key={index}
                  style={{ 
                    position: 'absolute', 
                    opacity, 
                    y, 
                    scale,
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    textAlign: 'center' 
                  }}
                >
                  <span style={{ fontWeight: 800, fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                    0{index + 1}
                  </span>
                  <h3 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1.1, color: '#0f172a' }}>
                    {step.title}
                  </h3>
                  <p style={{ color: '#475569', fontSize: '1.5rem', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>

      {/* 3. Features Section: Animated Grid */}
      <div style={{ padding: '8rem 4rem', background: 'var(--surface-color)', position: 'relative', zIndex: 10, color: 'var(--text-primary)' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: '800px', marginBottom: '5rem' }}
        >
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Engineered for modern campuses.
          </h2>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            CampusTriage isn't just a ticketing system. It's an intelligent ecosystem designed to enforce accountability and drastically reduce resolution times across hostels and academic blocks.
          </p>
        </motion.div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {/* Card 1: AI Routing */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }} 
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', transition: { duration: 0.2 } }}
            style={{ 
              background: 'var(--bg-color)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '24px', 
              padding: '3rem 2.5rem',
              cursor: 'default',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ width: '56px', height: '56px', marginBottom: '2rem', color: '#0ea5e9', background: '#e0f2fe', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>AI-Driven Routing</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Speed is a necessity. Our platform instantly analyzes QR scans and leverages smart routing to ping the exact on-duty technician nearest to your block, turning downtime into uptime.
            </p>
          </motion.div>

          {/* Card 2: Tamper Proof */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }} 
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', transition: { duration: 0.2 } }}
            style={{ 
              background: 'var(--bg-color)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '24px', 
              padding: '3rem 2.5rem',
              cursor: 'default',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ width: '56px', height: '56px', marginBottom: '2rem', color: '#10b981', background: '#d1fae5', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Tamper-Proof Verification</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              Accountability is built-in. Every repair requires student confirmation before it's marked complete. Immutable ledgers ensure staff logs and SLA timers can never be artificially altered.
            </p>
          </motion.div>

          {/* Card 3: Visibility */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-50px" }} 
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -8, boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)', transition: { duration: 0.2 } }}
            style={{ 
              background: 'var(--bg-color)', 
              border: '1px solid var(--border-color)', 
              borderRadius: '24px', 
              padding: '3rem 2.5rem',
              cursor: 'default',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)'
            }}
          >
            <div style={{ width: '56px', height: '56px', marginBottom: '2rem', color: '#f59e0b', background: '#fef3c7', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>Automated Escalation</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '1.05rem' }}>
              From the student portal to the Dean's dashboard, everyone shares a single source of truth. Time-triggered escalations ensure ignored requests instantly bypass low-level queues.
            </p>
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
