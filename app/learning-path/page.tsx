import Link from 'next/link';

const sites = [["DCSPD / ITPrep","https://dcspd.vercel.app/","Foundation: binary, CIDR, masks and quizzes."],["Avance MSP Skills","https://avance-professional-development.vercel.app/msp-skills","Workplace: tickets, VLANs, address planning and checks."],["DCS Professional Development","https://dcs-professional-development.vercel.app/","Scenario practice: troubleshoot and explain."],["DadLAN Control Centre","https://parris-tech-services.github.io/DadlanControlCentre/learning.html","Practical case: DadLAN #03/#07 subnet repair."]];

export default function ConnectedLearningPage() {
 return <main style={{maxWidth:1050,margin:'0 auto',padding:'36px 20px 75px'}}>
 <p><Link href="/">← Back to dashboard</Link></p>
 <h1 style={{fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:750}}>Four-app networking learning path</h1>
 <p>Learn concepts, practise MSP work, troubleshoot scenarios and review a real DadLAN case. Apps remain independent: progress and accounts are not shared.</p>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:16,marginTop:30}}>{sites.map(([name,url,desc],i)=><article key={name} style={{padding:20,border:'1px solid #8eaaa1',borderRadius:12}}><small>Step {i+1}</small><h2 style={{fontSize:'1.3rem',fontWeight:700,margin:'12px 0'}}>{name}</h2><p>{desc}</p><a href={url} target="_blank" rel="noopener noreferrer" style={{textDecoration:'underline'}}>Open app ↗</a></article>)}</div>
 <section style={{marginTop:40}}><h2 style={{fontSize:'1.6rem',fontWeight:700}}>One exercise, four perspectives</h2><p>DadLAN client network <code>10.176.176.0/24</code> and server <code>10.245.173.58</code>: can they talk directly without routing?</p><p><strong>Answer:</strong> No. Their /24 network addresses differ. Study the mask in DCSPD, write an MSP ticket in Avance, practise diagnosis in DCS, then inspect the DadLAN incident. Actual reachability also depends on routes, gateways, firewall rules and running services.</p><p><a href="https://parris-tech-services.github.io/DadlanControlCentre/learning.html" target="_blank" rel="noopener noreferrer" style={{textDecoration:'underline'}}>Open interactive DadLAN lab →</a></p></section>
 </main>;
}
