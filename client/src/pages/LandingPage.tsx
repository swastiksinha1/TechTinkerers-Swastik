import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { TiltCard } from "@/components/unlumen-ui/tilt-card";

const ProcessStep = ({ step, index, numSteps, processScroll }: { step: { title: string, desc: string }, index: number, numSteps: number, processScroll: MotionValue<number> }) => {
  const stepSize = 1 / numSteps;
  const peak = (index + 0.5) * stepSize;
  // Widen the start and end by 2 stepSizes so 3 items (N-1, N, N+1) are visible at once
  const start = peak - (2 * stepSize);
  const end = peak + (2 * stepSize);

  // Smooth overlap using mapping functions to avoid Framer Motion WAAPI out-of-bounds offset crashes
  const opacity = useTransform(processScroll, (v) => {
    if (v <= start || v >= end) return 0.2;
    if (v <= peak) return 0.2 + 0.8 * ((v - start) / (peak - start));
    return 1 - 0.8 * ((v - peak) / (end - peak));
  });

  const y = useTransform(processScroll, (v) => {
    if (v <= start) return 300;
    if (v >= end) return -300;
    if (v <= peak) return 300 - 300 * ((v - start) / (peak - start));
    return -300 * ((v - peak) / (end - peak));
  });

  const scale = useTransform(processScroll, (v) => {
    if (v <= start || v >= end) return 0.85;
    if (v <= peak) return 0.85 + 0.15 * ((v - start) / (peak - start));
    return 1 - 0.15 * ((v - peak) / (end - peak));
  });

  const filter = useTransform(processScroll, (v) => {
    if (v <= start || v >= end) return "blur(3px)";
    if (v <= peak) {
      const b = 3 - 3 * ((v - start) / (peak - start));
      return `blur(${b}px)`;
    }
    const b = 3 * ((v - peak) / (end - peak));
    return `blur(${b}px)`;
  });

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
        fontSize: '2rem', 
        marginBottom: '1rem', 
        letterSpacing: '0.1em',
        background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        0{index + 1}
      </span>
      <h3 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-0.04em', lineHeight: 1, color: '#0f172a' }}>
        {step.title}
      </h3>
      <p style={{ color: '#475569', fontSize: '1.25rem', lineHeight: 1.5, maxWidth: '600px', margin: '0 auto', fontWeight: 500 }}>
        {step.desc}
      </p>
    </motion.div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);


  const { scrollYProgress: processScroll } = useScroll({
    target: processRef,
    offset: ["start start", "end end"]
  });

  // Hero animations removed (unused)

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
      
      {/* 1. Hero Section (Premium White) */}
      <div 
        style={{ 
          height: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '2rem 4rem', 
          position: 'relative', 
          zIndex: 10,
          background: '#ffffff',
        }}
      >
        <nav style={{ display: 'flex', justifySelf: 'start', justifyContent: 'space-between', padding: '1rem 0', background: 'transparent', border: 'none', position: 'static' }}>
          <div style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.05em', color: '#0f172a' }}>CAMPUSTRIAGE</div>
          <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
            <a href="#process" style={{ color: '#475569', textDecoration: 'none', fontWeight: 600, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#475569'}>Our Process</a>
            <button onClick={() => navigate('/portal')} style={{ background: '#0f172a', color: 'white', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '999px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px 0 rgba(0,0,0,0.15)' }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(0,0,0,0.1)' }}>Request Help</button>
          </div>
        </nav>

        <motion.div 
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
          }}
        >

          <motion.h1 
            variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(10px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
            whileHover={{ scale: 1.02, textShadow: '0px 15px 40px rgba(15, 23, 42, 0.25)' }}
            style={{ fontSize: 'clamp(5rem, 15vw, 13rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, color: '#020617', marginBottom: '3rem', maxWidth: '100%', cursor: 'default' }}
          >
            From issue<br />to resolution.
          </motion.h1>

          <motion.p 
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#475569', maxWidth: '800px', margin: '0 auto', lineHeight: 1.4, fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            AI-driven speed. Expert triage.<br/>
            We mobilize verified technicians to protect your campus.
          </motion.p>

          <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '3rem', marginTop: '5rem', color: '#94a3b8', fontSize: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#0f172a' }}>01.</span> Report Instantly
            </div>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#0f172a' }}>02.</span> Smart AI Routing
            </div>
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: '#0f172a' }}>03.</span> Track Live Progress
            </div>
          </motion.div>

          <motion.div 
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 1, delay: 1 } } }}
            style={{ marginTop: 'auto', marginBottom: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: '#94a3b8', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.15em', fontWeight: 700 }}
          >
            <span>Scroll to discover</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>↓</motion.div>
          </motion.div>
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
            <TiltCard
              title="AI-Driven Routing"
              description="Speed is a necessity. Our platform instantly analyzes QR scans and leverages smart routing to ping the exact on-duty technician nearest to your block, turning downtime into uptime."
              className="bg-black text-white border-none justify-center items-center text-center p-8 h-auto min-h-[300px]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
            <TiltCard
              title="Tamper-Proof Verification"
              description="Accountability is built-in. Every repair requires student confirmation before it's marked complete. Immutable ledgers ensure staff logs and SLA timers can never be artificially altered."
              className="bg-black text-white border-none justify-center items-center text-center p-8 h-auto min-h-[300px]"
            />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}>
            <TiltCard
              title="Automated Escalation"
              description="From the student portal to the Dean's dashboard, everyone shares a single source of truth. Time-triggered escalations ensure ignored requests instantly bypass low-level queues."
              className="bg-black text-white border-none justify-center items-center text-center p-8 h-auto min-h-[300px]"
            />
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
