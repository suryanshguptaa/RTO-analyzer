import React, { useState, useEffect, useMemo } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { 
  ShieldCheck, Package, Truck, AlertTriangle, Upload, Search, 
  BarChart3, Box, Star, TrendingDown, Camera, MessageSquare, 
  Zap, MapPin, Loader2, Info, ChevronRight, CheckCircle2,
  RefreshCw, LayoutDashboard, ArrowRight, AlertCircle
} from 'lucide-react';

/**
 * 🚀 PRODUCTION READY: GEN-AI RTO & RETURNS INTELLIGENCE PLATFORM
 * Built with: React, Tailwind CSS, Recharts, and Google Gemini 2.5 Flash
 */

// --- CONFIGURATION ---
const GOOGLE_API_KEY = "AIzaSyALAGxz160cbT-01zqK90zj57XBLHpCIOc";
const MODEL_ID = "gemini-2.5-flash-preview-09-2025";

// --- MOCK DATA FOR VISUALIZATIONS ---
const TREND_DATA = [
  { name: 'Week 1', rto: 12, returns: 8 },
  { name: 'Week 2', rto: 19, returns: 11 },
  { name: 'Week 3', rto: 15, returns: 9 },
  { name: 'Week 4', rto: 22, returns: 14 },
];

const COURIER_DATA = [
  { id: 1, name: "Delhivery", rto: "4.2%", cost: "₹45", speed: "48h", rating: 4.8 },
  { id: 2, name: "BlueDart", rto: "2.1%", cost: "₹85", speed: "24h", rating: 4.9 },
  { id: 3, name: "Ecom Express", rto: "6.8%", cost: "₹38", speed: "72h", rating: 4.1 },
  { id: 4, name: "XpressBees", rto: "5.5%", cost: "₹42", speed: "60h", rating: 4.3 },
];

const REASONS = [
  { name: 'Packaging Damaged', value: 45, color: '#6366f1' },
  { name: 'Quality Issues', value: 25, color: '#f59e0b' },
  { name: 'Wrong Item', value: 15, color: '#10b981' },
  { name: 'Customer Rejected', value: 15, color: '#ef4444' },
];

// --- COMPONENTS ---

const Card = ({ children, title, icon: Icon, className = "" }) => (
  <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 ${className}`}>
    <div className="flex items-center justify-between mb-8">
      <h3 className="text-slate-900 font-black text-xl flex items-center gap-3">
        {Icon && <div className="p-2.5 bg-indigo-50 rounded-xl"><Icon className="w-5 h-5 text-indigo-600" /></div>}
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const App = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [rcaResult, setRcaResult] = useState(null);
  const [pincode, setPincode] = useState('');
  const [showCouriers, setShowCouriers] = useState(false);

  // --- AI ENGINE (GEMINI 2.5 FLASH) ---

  const callGemini = async (prompt, imageBase64 = null) => {
    setLoading(true);
    setError(null);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GOOGLE_API_KEY}`;
    
    const parts = [{ text: prompt }];
    if (imageBase64) {
      parts.push({ inlineData: { mimeType: "image/png", data: imageBase64 } });
    }

    const payload = {
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            item: { type: "string" },
            rto_rate: { type: "string" },
            return_rate: { type: "string" },
            risks: { type: "array", items: { type: "string" } },
            packaging_advice: { type: "string" },
            root_cause: { type: "string" },
            actions: { type: "array", items: { type: "string" } }
          }
        }
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("API Connection Failed");
      const data = await response.json();
      return JSON.parse(data.candidates[0].content.parts[0].text);
    } catch (err) {
      setError("AI Service Timeout. Please check your connection or API key.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleImageAnalysis = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result.split(',')[1];
      const result = await callGemini(
        "Analyze this product image. Identify the item, predict its global RTO% and Return%, list 3 logistics risks, and suggest 1 specific packaging fix.",
        base64
      );
      setScanResult(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDiagnostic = async () => {
    const result = await callGemini(
      "Current Logistics Data: 45% Packaging Damaged, 25% Quality Issues. Perform a Root Cause Analysis (RCA) and provide a 3-step action plan to reduce losses next month."
    );
    setRcaResult(result);
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-72 bg-white border-r border-slate-200 flex flex-col z-50">
        <div className="p-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-100">
            <ShieldCheck className="text-white w-7 h-7" />
          </div>
          <span className="font-black text-2xl hidden md:block tracking-tighter">GEN-RTO</span>
        </div>

        <nav className="flex-1 px-6 mt-12 space-y-3">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Analytics Hub' },
            { id: 'scan', icon: Camera, label: 'AI Product Scan' },
            { id: 'logistics', icon: Truck, label: 'Courier Matching' },
            { id: 'fixes', icon: Zap, label: 'Smart Fixes' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.5rem] transition-all duration-300 ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-100 translate-x-1' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="hidden md:block font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Intelligence Online</span>
          </div>
        </div>
      </aside>

      {/* Main UI Area */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 pb-32">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-700 font-bold animate-in slide-in-from-top-4">
            <AlertCircle className="w-5 h-5" /> {error}
          </div>
        )}

        {/* Dynamic Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 underline decoration-indigo-200 decoration-8 underline-offset-4">Command Center</h1>
            <p className="text-slate-500 mt-2 font-medium">Predicting and preventing e-commerce logistics failure through Generative AI.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all">Export Report</button>
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-transform active:scale-95 flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Live Mode
            </button>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Avg RTO Rate', val: '14.2%', sub: '↓ 2.1% (Success)', color: 'text-red-500', icon: Package },
                { label: 'Return Rate', val: '8.5%', sub: '↑ 0.4% (Warning)', color: 'text-orange-500', icon: TrendingDown },
                { label: 'Revenue Saved', val: '₹42,300', sub: 'Last 30 Days', color: 'text-indigo-600', icon: Star },
                { label: 'SLA Score', val: '98/100', sub: 'Excellent', color: 'text-green-500', icon: CheckCircle2 },
              ].map((kpi, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-xl transition-all duration-500">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{kpi.label}</p>
                    <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                      <kpi.icon className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <h2 className={`text-3xl font-black ${kpi.color}`}>{kpi.val}</h2>
                  <p className="text-[10px] font-bold mt-2 text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-md">{kpi.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <Card title="Returns vs RTO Trends" icon={TrendingDown} className="lg:col-span-2">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={TREND_DATA}>
                      <defs>
                        <linearGradient id="colorRto" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                      <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)', fontWeight: 800}} />
                      <Area type="monotone" dataKey="rto" stroke="#6366f1" strokeWidth={5} fillOpacity={1} fill="url(#colorRto)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card title="Root Causes (AI)" icon={Info}>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={REASONS} innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                        {REASONS.map((entry, index) => <Cell key={index} fill={entry.color} cornerRadius={10} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-4 mt-6">
                  {REASONS.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: r.color}} />
                        <span className="font-bold text-slate-600">{r.name}</span>
                      </div>
                      <span className="font-black text-slate-900">{r.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in zoom-in-95 duration-500">
            <div className="bg-white p-16 rounded-[3rem] border-2 border-dashed border-slate-200 text-center relative overflow-hidden group">
               <div className="relative z-10">
                <div className="w-24 h-24 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-inner transition-transform group-hover:scale-110">
                  <Camera className="w-10 h-10 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900">Visual Product Analysis</h2>
                <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium leading-relaxed">
                  Upload a photo to predict global RTO benchmarks and detect structural logistics risks.
                </p>
                <input type="file" id="scan-upload" className="hidden" accept="image/*" onChange={handleImageAnalysis} />
                <label 
                  htmlFor="scan-upload"
                  className="mt-10 inline-flex items-center gap-4 px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black cursor-pointer hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100 active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Upload className="w-5 h-5" />}
                  {loading ? "AI is Thinking..." : "Upload Product Image"}
                </label>
               </div>
            </div>

            {scanResult && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-10 duration-700">
                <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">AI Detection</p>
                    <h3 className="text-3xl font-black text-slate-900 capitalize">{scanResult.item}</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mt-10">
                    <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 text-center">
                      <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Global RTO</p>
                      <p className="text-3xl font-black text-red-600">{scanResult.rto_rate}</p>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-[2rem] border border-orange-100 text-center">
                      <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Return Risk</p>
                      <p className="text-3xl font-black text-orange-600">{scanResult.return_rate}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-10 rounded-[2.5rem] shadow-2xl">
                  <h4 className="font-black text-xl mb-6 flex items-center gap-3">
                    <AlertTriangle className="text-orange-400 w-6 h-6" /> Logistics Risks
                  </h4>
                  <div className="space-y-4">
                    {scanResult.risks.map((risk, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0 mt-1 text-[10px] font-black">{i+1}</div>
                        <p className="text-slate-300 text-sm font-bold leading-relaxed">{risk}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/10 text-xs italic font-medium leading-relaxed text-indigo-200">
                    💡 <strong>Packaging Tip:</strong> {scanResult.packaging_advice}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500">
            <Card title="Geo-Spatial Courier Matching" icon={Truck}>
              <div className="flex flex-col md:flex-row gap-4 mb-10">
                <div className="flex-1 relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Enter Delivery Pincode (e.g., 400001)"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-black text-slate-800 placeholder:text-slate-300"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setShowCouriers(true)}
                  className="px-10 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-transform active:scale-95"
                >
                  Locate Partner
                </button>
              </div>

              {showCouriers && (
                <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 animate-in slide-in-from-bottom-4">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                        <th className="px-8 py-6">Partner</th>
                        <th className="px-8 py-6">Success Rate</th>
                        <th className="px-8 py-6">Pricing</th>
                        <th className="px-8 py-6 text-right">Match Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {COURIER_DATA.map((c, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-7">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400 text-xs">{c.name[0]}</div>
                              <span className="font-black text-slate-800 tracking-tight">{c.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-7"><span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-black">{100 - parseFloat(c.rto)}%</span></td>
                          <td className="px-8 py-7 text-xs font-bold text-slate-500 italic">{c.cost}</td>
                          <td className="px-8 py-7 text-right">
                            <div className="flex items-center justify-end gap-1.5 text-indigo-600 font-black">
                              <Star className="w-4 h-4 fill-indigo-600" /> {c.rating}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'fixes' && (
          <div className="max-w-4xl mx-auto space-y-10 animate-in slide-in-from-right-10 duration-500">
             <div className="bg-indigo-600 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                <div className="relative z-10">
                  <h2 className="text-4xl font-black mb-4 italic">Actionable Intelligence</h2>
                  <p className="text-indigo-100 max-w-lg mb-10 font-medium leading-relaxed text-lg">
                    Automatically diagnose return logs to determine if the issue is packaging, quality, or courier handling.
                  </p>
                  <button 
                    onClick={handleDiagnostic}
                    className="flex items-center gap-4 px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black hover:bg-indigo-50 transition-all shadow-xl shadow-indigo-800/20 active:scale-95"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Zap className="w-5 h-5 fill-indigo-600" />}
                    {loading ? "Running Diagnostic..." : "Run AI Root Cause Analysis"}
                  </button>
                </div>
             </div>

             {rcaResult && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in zoom-in-95">
                  <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2">Detected Root Cause</h4>
                      <p className="text-xl font-bold text-slate-800 leading-relaxed italic">"{rcaResult.root_cause}"</p>
                    </div>
                    <div className="mt-10 p-5 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle2 className="text-green-600" /></div>
                      <div>
                        <p className="text-[10px] font-black text-green-400 uppercase tracking-widest">Potential Savings</p>
                        <p className="text-xl font-black text-green-700">₹24,500 / month</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-4">AI Action Plan</h4>
                    {rcaResult.actions.map((act, i) => (
                      <div key={i} className="flex items-center gap-5 p-6 bg-white border border-slate-100 rounded-[2rem] hover:border-indigo-200 transition-colors shadow-sm group">
                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors">{i+1}</div>
                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{act}</p>
                        <ArrowRight className="w-4 h-4 text-slate-200 ml-auto group-hover:text-indigo-400 transition-colors" />
                      </div>
                    ))}
                  </div>
               </div>
             )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;