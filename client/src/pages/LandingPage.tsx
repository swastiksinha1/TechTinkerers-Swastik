import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { TiltCard } from "@/components/unlumen-ui/tilt-card";

import { HoverFeatureCards, type HoverFeatureCard } from "@/components/unlumen-ui/hover-feature-cards";

const featureItems: HoverFeatureCard[] = [
  {
    name: "AI-Driven Routing",
    description: "Our platform instantly analyzes QR scans and leverages smart routing to ping the exact on-duty technician nearest to your block.",
    img: "/isometric_campus.png",
    imgClassName: "absolute -bottom-20 left-1/2 -translate-x-1/2 object-cover opacity-60 mix-blend-multiply dark:mix-blend-lighten",
    imgWidth: 400,
    containerClassName: "h-full rounded-3xl",
    fadeBottom: true,
  },
  {
    name: "Tamper-Proof Verification",
    description: "Every repair requires student confirmation. Immutable ledgers ensure staff logs and SLA timers can never be artificially altered.",
    img: "/isometric_campus.png",
    imgClassName: "absolute -bottom-20 left-1/2 -translate-x-1/2 object-cover opacity-60 mix-blend-multiply dark:mix-blend-lighten",
    imgWidth: 400,
    containerClassName: "h-full rounded-3xl",
    fadeBottom: true,
  },
  {
    name: "Automated Escalation",
    description: "From the student portal to the Dean's dashboard, everyone shares a single source of truth. Ignored requests instantly escalate.",
    img: "/isometric_campus.png",
    imgClassName: "absolute -bottom-20 left-1/2 -translate-x-1/2 object-cover opacity-60 mix-blend-multiply dark:mix-blend-lighten",
    imgWidth: 400,
    containerClassName: "h-full rounded-3xl",
    fadeBottom: true,
  }
];

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

      {/* 3. Features Section: Hover Feature Cards */}
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
        
        <HoverFeatureCards
          items={featureItems}
          className="grid-cols-1 md:grid-cols-3 max-w-[1200px]"
          renderLink={(href, children) => <a href={href}>{children}</a>}
        />
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
