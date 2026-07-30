import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { TiltCard } from "@/components/unlumen-ui/tilt-card";

const ProcessStep = ({ step, index, numSteps, processScroll }: { step: { title: string, desc: string }, index: number, numSteps: number, processScroll: MotionValue<number> }) => {
  const stepSize = 1 / numSteps;
  const start = index * stepSize;
  const peak = start + stepSize / 2;
  const end = start + stepSize;

  // Dramatic focus effect: Blur out, scale up, fade in
  const opacity = useTransform(processScroll, [start, peak, end], [0, 1, 0]);
  const y = useTransform(processScroll, [start, peak, end], [80, 0, -80]);
  const scale = useTransform(processScroll, [start, peak, end], [0.85, 1, 0.85]);
  const filter = useTransform(processScroll, [start, peak, end], ["blur(20px)", "blur(0px)", "blur(20px)"]);

  return (
    <motion.div 
      style={{ 
        position: 'absolute', 
        opacity, 
        y, 
        scale,
        filter,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        textAlign: 'center',
        width: '100%'
      }}
    >
      <span style={{ 
        fontWeight: 900, 
        fontSize: '2.5rem', 
        marginBottom: '1rem', 
        letterSpacing: '0.1em',
        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        0{index + 1}
      </span>
      <h3 style={{ fontSize: '4.5rem', fontWeight: 900, marginBottom: '2rem', letterSpacing: '-0.04em', lineHeight: 1, color: '#0f172a' }}>
        {step.title}
      </h3>
      <p style={{ color: '#475569', fontSize: '1.75rem', lineHeight: 1.5, maxWidth: '700px', margin: '0 auto', fontWeight: 500 }}>
        {step.desc}
      </p>
    </motion.div>
  );
};

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
      <div id="process" ref={processRef} style={{ position: 'relative', height: '400vh', zIndex: 10, background: '#ffffff' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4rem', overflow: 'hidden' }}>
          
          {/* Subtle background glow that pulses */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(59,130,246,0.03) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {stepsData.map((step, index) => (
              <ProcessStep 
                key={index} 
                step={step} 
                index={index} 
                numSteps={stepsData.length} 
                processScroll={processScroll} 
              />
            ))}
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
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>AI-Driven Routing</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Speed is a necessity. Our platform instantly analyzes QR scans and leverages smart routing to ping the exact on-duty technician nearest to your block, turning downtime into uptime.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div style={{ width: '64px', height: '64px', marginBottom: '2rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Tamper-Proof Verification</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>Accountability is built-in. Every repair requires student confirmation before it's marked complete. Immutable ledgers ensure staff logs and SLA timers can never be artificially altered.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <div style={{ width: '64px', height: '64px', marginBottom: '2rem' }}>
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 800 }}>Automated Escalation</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>From the student portal to the Dean's dashboard, everyone shares a single source of truth. Time-triggered escalations ensure ignored requests instantly bypass low-level queues.</p>
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
