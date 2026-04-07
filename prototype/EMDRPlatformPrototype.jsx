// EMDR Platform Interactive Prototype
// Full working React component: BLS engine, assessments, 8-phase protocol flow
// See CLAUDE.md for architecture specification

import { useState, useEffect, useRef, useCallback } from "react";

const PHASES = [
  { id: 1, name: "History & Planning", icon: "📋", description: "Gather trauma history, identify target memories, assess readiness" },
  { id: 2, name: "Preparation", icon: "🛡️", description: "Build coping strategies, explain EMDR process, establish safety" },
  { id: 3, name: "Assessment", icon: "🎯", description: "Identify target memory, negative/positive cognitions, baseline SUD & VOC" },
  { id: 4, name: "Desensitization", icon: "👁️", description: "Bilateral stimulation while processing target memory" },
  { id: 5, name: "Installation", icon: "💡", description: "Strengthen positive cognition with bilateral stimulation" },
  { id: 6, name: "Body Scan", icon: "🧘", description: "Scan for residual physical tension related to the target" },
  { id: 7, name: "Closure", icon: "🌅", description: "Stabilize, contain unfinished material, debrief" },
  { id: 8, name: "Reevaluation", icon: "🔄", description: "Review progress, check SUD/VOC stability, plan next targets" },
];

const BLS_PRESETS = {
  standard: { speed: 1.2, size: 28, color: "#60a5fa", shape: "circle", path: "linear" },
  slow: { speed: 2.0, size: 34, color: "#34d399", shape: "circle", path: "linear" },
  fast: { speed: 0.7, size: 22, color: "#a78bfa", shape: "circle", path: "linear" },
  gentle: { speed: 1.8, size: 40, color: "#fbbf24", shape: "butterfly", path: "arc" },
};

// Audio Engine - Web Audio API bilateral stereo panning
function useAudioBLS(enabled, speed, volume, toneType) {
  const ctxRef = useRef(null);
  const pannerRef = useRef(null);
  const sourceRef = useRef(null);
  const animRef = useRef(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      if (ctxRef.current) { ctxRef.current.close(); ctxRef.current = null; }
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    ctxRef.current = ctx;
    const panner = ctx.createStereoPanner();
    pannerRef.current = panner;
    const gainNode = ctx.createGain();
    gainNode.gain.value = volume;

    const source = ctx.createOscillator();
    source.type = toneType === "click" ? "sine" : toneType;
    source.frequency.value = toneType === "click" ? 800 : 440;
    source.connect(gainNode);
    gainNode.connect(panner);
    panner.connect(ctx.destination);
    source.start();
    sourceRef.current = source;
    startTimeRef.current = ctx.currentTime;

    const animate = () => {
      if (!ctxRef.current) return;
      const elapsed = ctxRef.current.currentTime - startTimeRef.current;
      const cycle = (elapsed % speed) / speed;
      const pan = Math.sin(cycle * Math.PI * 2);
      if (pannerRef.current) pannerRef.current.pan.value = pan;
      if (toneType === "click") {
        const isClick = ((cycle * 2) % 1) < 0.05;
        gainNode.gain.value = isClick ? volume : 0;
      }
      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (sourceRef.current) { try { sourceRef.current.stop(); } catch(e){} }
      if (ctxRef.current) { try { ctxRef.current.close(); } catch(e){} }
      ctxRef.current = null;
    };
  }, [enabled, speed, volume, toneType]);
}

// BLS Visual Canvas - Canvas API with GPU-accelerated rendering
function BLSCanvas({ running, speed, size, color, shape, path, bgColor }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const startRef = useRef(Date.now());

  useEffect(() => { if (!running) startRef.current = Date.now(); }, [running]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      if (!running) {
        ctx.fillStyle = color + "44";
        ctx.beginPath(); ctx.arc(w/2, h/2, size*0.8, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = "#ffffff66"; ctx.font = "16px system-ui"; ctx.textAlign = "center";
        ctx.fillText("Press Start to begin bilateral stimulation", w/2, h/2 + size + 30);
        animRef.current = requestAnimationFrame(draw);
        return;
      }

      const elapsed = (Date.now() - startRef.current) / 1000;
      const cycle = (elapsed % speed) / speed;
      const t = Math.sin(cycle * Math.PI * 2) * 0.5 + 0.5;
      const margin = size + 40;
      let x, y;

      if (path === "linear") { x = margin + t*(w-margin*2); y = h/2; }
      else if (path === "arc") { x = margin + t*(w-margin*2); y = h/2 - Math.sin(t*Math.PI)*60; }
      else { const a = cycle*Math.PI*2; x = w/2 + Math.sin(a)*(w/2-margin); y = h/2 + Math.sin(a*2)*40; }

      // Trail effect
      for (let i = 0; i < 8; i++) {
        const tt = Math.max(0, t - i*0.015);
        let tx, ty;
        if (path === "linear") { tx = margin + tt*(w-margin*2); ty = h/2; }
        else if (path === "arc") { tx = margin + tt*(w-margin*2); ty = h/2 - Math.sin(tt*Math.PI)*60; }
        else { const ta = Math.max(0,cycle-i*0.015)*Math.PI*2; tx = w/2+Math.sin(ta)*(w/2-margin); ty = h/2+Math.sin(ta*2)*40; }
        ctx.fillStyle = color + Math.floor((1-i/8)*0.15*255).toString(16).padStart(2,"0");
        ctx.beginPath(); ctx.arc(tx, ty, size*(1-i/8*0.3), 0, Math.PI*2); ctx.fill();
      }

      // Glow
      const grad = ctx.createRadialGradient(x,y,0,x,y,size*3);
      grad.addColorStop(0, color+"33"); grad.addColorStop(1, color+"00");
      ctx.fillStyle = grad; ctx.beginPath(); ctx.arc(x,y,size*3,0,Math.PI*2); ctx.fill();

      // Main shape
      ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 20;
      if (shape === "circle") { ctx.beginPath(); ctx.arc(x,y,size,0,Math.PI*2); ctx.fill(); }
      else if (shape === "diamond") { ctx.beginPath(); ctx.moveTo(x,y-size); ctx.lineTo(x+size,y); ctx.lineTo(x,y+size); ctx.lineTo(x-size,y); ctx.closePath(); ctx.fill(); }
      else if (shape === "butterfly") { ctx.beginPath(); for(let a=0;a<=Math.PI*2;a+=0.01){const r=size*(Math.sin(2*a)*0.5+0.8);const bx=x+r*Math.cos(a);const by=y+r*Math.sin(a);a===0?ctx.moveTo(bx,by):ctx.lineTo(bx,by);} ctx.closePath(); ctx.fill(); }
      else if (shape === "star") { ctx.beginPath(); for(let i=0;i<10;i++){const a=(i*Math.PI)/5-Math.PI/2;const r=i%2===0?size:size*0.5;const sx=x+r*Math.cos(a);const sy=y+r*Math.sin(a);i===0?ctx.moveTo(sx,sy):ctx.lineTo(sx,sy);} ctx.closePath(); ctx.fill(); }
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff44"; ctx.beginPath(); ctx.arc(x-size*0.25,y-size*0.25,size*0.3,0,Math.PI*2); ctx.fill();

      animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, [running, speed, size, color, shape, path, bgColor]);

  return <canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block",borderRadius:"12px"}} />;
}

// SUD Scale (0-10) - Subjective Units of Disturbance
function SUDScale({ value, onChange, label }) {
  const getColor = (v) => v<=2?"#34d399":v<=4?"#86efac":v<=6?"#fbbf24":v<=8?"#f97316":"#ef4444";
  const labels = ["No distress","Minimal","Mild","Mild-Mod","Moderate","Moderate","Mod-High","High","Very High","Severe","Worst possible"];
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{color:"#94a3b8",fontSize:13,fontWeight:600}}>{label||"SUD (Subjective Units of Disturbance)"}</span>
        <span style={{color:getColor(value),fontWeight:700,fontSize:18}}>{value}</span>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:6}}>
        {Array.from({length:11},(_,i)=>(
          <button key={i} onClick={()=>onChange(i)} style={{
            flex:1,height:36,border:"none",borderRadius:6,cursor:"pointer",
            background:i===value?getColor(i):i<=value?getColor(i)+"44":"#1e293b",
            color:i===value?"#0f172a":"#64748b",fontWeight:i===value?700:500,fontSize:13,
            transition:"all 0.2s",transform:i===value?"scale(1.1)":"scale(1)"
          }}>{i}</button>
        ))}
      </div>
      <div style={{textAlign:"center",color:getColor(value),fontSize:12,fontWeight:500}}>{labels[value]}</div>
    </div>
  );
}

// VOC Scale (1-7) - Validity of Cognition
function VOCScale({ value, onChange, label }) {
  const getColor = (v) => v<=2?"#ef4444":v<=4?"#fbbf24":v<=5?"#86efac":"#34d399";
  const labels = ["","Completely false","Mostly false","Somewhat false","Neutral","Somewhat true","Mostly true","Completely true"];
  return (
    <div style={{marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
        <span style={{color:"#94a3b8",fontSize:13,fontWeight:600}}>{label||"VOC (Validity of Cognition)"}</span>
        <span style={{color:getColor(value),fontWeight:700,fontSize:18}}>{value}</span>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:6}}>
        {Array.from({length:7},(_,i)=>(
          <button key={i+1} onClick={()=>onChange(i+1)} style={{
            flex:1,height:36,border:"none",borderRadius:6,cursor:"pointer",
            background:(i+1)===value?getColor(i+1):(i+1)<=value?getColor(i+1)+"44":"#1e293b",
            color:(i+1)===value?"#0f172a":"#64748b",fontWeight:(i+1)===value?700:500,fontSize:13,
            transition:"all 0.2s",transform:(i+1)===value?"scale(1.1)":"scale(1)"
          }}>{i+1}</button>
        ))}
      </div>
      <div style={{textAlign:"center",color:getColor(value),fontSize:12,fontWeight:500}}>{labels[value]}</div>
    </div>
  );
}

function SessionTimer({ running, startTime }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setElapsed(Math.floor((Date.now()-startTime)/1000)), 1000);
    return () => clearInterval(interval);
  }, [running, startTime]);
  const mins = Math.floor(elapsed/60), secs = elapsed%60;
  return <span style={{fontVariantNumeric:"tabular-nums"}}>{String(mins).padStart(2,"0")}:{String(secs).padStart(2,"0")}</span>;
}

// NOTE: This is a condensed version for the repository.
// The full interactive prototype with all views (Dashboard, Session, Assessment)
// and the complete PCL-5 questionnaire is available in the outputs folder.
// Run the prototype locally or view the full source to see all features.

export default function EMDRPlatform() {
  const [view, setView] = useState("dashboard");
  const [currentPhase, setCurrentPhase] = useState(0);
  const [blsRunning, setBlsRunning] = useState(false);
  const [blsSpeed, setBlsSpeed] = useState(1.2);
  const [blsSize, setBlsSize] = useState(28);
  const [blsColor, setBlsColor] = useState("#60a5fa");
  const [blsShape, setBlsShape] = useState("circle");
  const [blsPath, setBlsPath] = useState("linear");
  const [blsBg, setBlsBg] = useState("#0f172a");
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);
  const [audioTone, setAudioTone] = useState("sine");
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionStart, setSessionStart] = useState(null);
  const [setCount, setSetCount] = useState(0);
  const [sud, setSud] = useState(5);
  const [voc, setVoc] = useState(3);
  const [sudHistory, setSudHistory] = useState([]);
  const [vocHistory, setVocHistory] = useState([]);

  useAudioBLS(audioEnabled && blsRunning, blsSpeed, audioVolume, audioTone);

  const startSession = () => { setSessionActive(true); setSessionStart(Date.now()); setSetCount(0); setSudHistory([]); setVocHistory([]); setCurrentPhase(0); setView("session"); };

  const styles = {
    app: { background:"#0a0f1a", minHeight:"100vh", color:"#e2e8f0", fontFamily:"'Inter',system-ui,sans-serif" },
    header: { background:"linear-gradient(135deg,#0f172a,#1e1b4b)", borderBottom:"1px solid #1e293b", padding:"16px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" },
    card: { background:"#111827", borderRadius:16, border:"1px solid #1e293b", padding:24, marginBottom:20 },
    btn: (v) => ({ padding:"10px 20px", borderRadius:10, border:"none", cursor:"pointer", fontSize:14, fontWeight:600, transition:"all 0.2s",
      ...(v==="primary"?{background:"linear-gradient(135deg,#2563eb,#7c3aed)",color:"#fff"}:
         v==="success"?{background:"linear-gradient(135deg,#059669,#34d399)",color:"#fff"}:
         v==="danger"?{background:"linear-gradient(135deg,#dc2626,#ef4444)",color:"#fff"}:
         {background:"#1e293b",color:"#94a3b8"}) }),
    navBtn: (a) => ({ padding:"8px 16px", borderRadius:8, border:"none", cursor:"pointer", fontSize:13, fontWeight:600, background:a?"#2563eb":"transparent", color:a?"#fff":"#94a3b8" }),
  };

  return (
    <div style={styles.app}>
      <div style={styles.header}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{width:36,height:36,borderRadius:10,background:"linear-gradient(135deg,#2563eb,#7c3aed)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👁️</div>
          <div><div style={{fontWeight:700,fontSize:16}}>EMDR Platform</div><div style={{color:"#64748b",fontSize:11}}>Autonomous Therapy System v0.1</div></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <button style={styles.navBtn(view==="dashboard")} onClick={()=>setView("dashboard")}>Dashboard</button>
          <button style={styles.navBtn(view==="session")} onClick={()=>setView("session")}>Session</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:24}}>
        {view === "dashboard" && (
          <>
            <div style={{textAlign:"center",padding:"40px 0 30px"}}>
              <h1 style={{fontSize:32,fontWeight:700,marginBottom:8,background:"linear-gradient(135deg,#60a5fa,#a78bfa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>EMDR Therapy Platform</h1>
              <p style={{color:"#94a3b8",fontSize:16}}>Autonomous bilateral stimulation therapy with adaptive protocol guidance</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:16,marginBottom:32}}>
              <div style={{...styles.card,cursor:"pointer",border:"1px solid #2563eb44"}} onClick={startSession}>
                <div style={{fontSize:32,marginBottom:12}}>🧠</div>
                <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>New Session</h3>
                <p style={{color:"#94a3b8",fontSize:14}}>Start a full EMDR therapy session with guided protocol flow.</p>
              </div>
              <div style={{...styles.card,cursor:"pointer"}} onClick={()=>setView("session")}>
                <div style={{fontSize:32,marginBottom:12}}>👁️</div>
                <h3 style={{fontSize:18,fontWeight:700,marginBottom:8}}>BLS Sandbox</h3>
                <p style={{color:"#94a3b8",fontSize:14}}>Explore bilateral stimulation parameters.</p>
              </div>
            </div>
            <div style={styles.card}>
              <h3 style={{fontSize:16,fontWeight:700,marginBottom:16,color:"#94a3b8"}}>8-Phase EMDR Protocol</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",gap:12}}>
                {PHASES.map(p=>(
                  <div key={p.id} style={{background:"#0f172a",borderRadius:10,padding:14,border:"1px solid #1e293b"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                      <span style={{fontSize:18}}>{p.icon}</span>
                      <span style={{fontWeight:700,fontSize:14}}>Phase {p.id}</span>
                      <span style={{color:"#64748b",fontSize:13}}>{p.name}</span>
                    </div>
                    <p style={{color:"#94a3b8",fontSize:12,lineHeight:1.5,margin:0}}>{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === "session" && (
          <>
            <div style={{display:"flex",gap:4,marginBottom:24,overflowX:"auto"}}>
              {PHASES.map((p,i)=>(
                <div key={p.id} onClick={()=>setCurrentPhase(i)} style={{
                  padding:"8px 14px",borderRadius:20,cursor:"pointer",whiteSpace:"nowrap",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,
                  border:i===currentPhase?"2px solid #60a5fa":"1px solid #1e293b",
                  background:i<currentPhase?"#1e3a5f":i===currentPhase?"#172554":"#111827",
                  color:i===currentPhase?"#60a5fa":i<currentPhase?"#60a5fa88":"#64748b"
                }}><span>{p.icon}</span><span>P{p.id}: {p.name}</span></div>
              ))}
            </div>

            <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
              {[["Session Time","#60a5fa",sessionActive?<SessionTimer running={sessionActive} startTime={sessionStart}/>:"00:00"],
                ["BLS Sets","#60a5fa",setCount],["Current SUD",sud<=3?"#34d399":sud<=6?"#fbbf24":"#ef4444",sud],
                ["Current VOC",voc>=5?"#34d399":voc>=3?"#fbbf24":"#ef4444",voc],["Phase","#a78bfa",`${currentPhase+1}/8`]
              ].map(([label,color,val],i)=>(
                <div key={i} style={{background:"#0f172a",borderRadius:12,border:"1px solid #1e293b",padding:16,textAlign:"center",flex:1,minWidth:120}}>
                  <div style={{color:"#64748b",fontSize:11,fontWeight:600,textTransform:"uppercase",marginBottom:4}}>{label}</div>
                  <div style={{color,fontSize:22,fontWeight:700}}>{val}</div>
                </div>
              ))}
            </div>

            <div style={{background:"#0f172a",borderRadius:16,border:"1px solid #1e293b",height:300,marginBottom:20,overflow:"hidden"}}>
              <BLSCanvas running={blsRunning} speed={blsSpeed} size={blsSize} color={blsColor} shape={blsShape} path={blsPath} bgColor={blsBg} />
            </div>

            <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
              {!blsRunning
                ? <button style={styles.btn("success")} onClick={()=>{setBlsRunning(true);setSetCount(c=>c+1);}}>▶ Start BLS Set</button>
                : <button style={styles.btn("danger")} onClick={()=>setBlsRunning(false)}>⏸ Stop</button>}
              <button style={styles.btn("ghost")} onClick={()=>{setSudHistory(h=>[...h,{value:sud,time:new Date().toLocaleTimeString(),set:setCount}]);setVocHistory(h=>[...h,{value:voc,time:new Date().toLocaleTimeString(),set:setCount}]);}}>📊 Record SUD/VOC</button>
              {currentPhase<7&&<button style={styles.btn("primary")} onClick={()=>setCurrentPhase(c=>c+1)}>Next Phase →</button>}
            </div>

            <div style={styles.card}>
              <SUDScale value={sud} onChange={setSud} />
              <VOCScale value={voc} onChange={setVoc} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
