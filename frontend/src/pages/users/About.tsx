import { Target, ShieldCheck, Award, ArrowRight, Star } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#fcfcfd] min-h-screen font-sans antialiased text-slate-900">
      
      {/* HEADER: HI-TECH & MINIMAL */}
      <section className="relative py-20 bg-[#0a0a0b] overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-50"></div>
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-sm">
            <Star size={10} className="fill-current" /> Our Heritage
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            Định hình lại cách bạn <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Khám phá Thế giới
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-light">
            TravelGo không chỉ là một ứng dụng đặt tour. Chúng tôi là người đồng hành, số hóa mọi trải nghiệm để hành trình của bạn trở nên trọn vẹn và an tâm tuyệt đối.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT: ELEGANT GRID */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* LEFT: CONTENT & STATS */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <h2 className="text-xs font-bold text-blue-600 uppercase tracking-[0.3em] mb-4">Câu chuyện</h2>
              <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                Từ niềm đam mê xê dịch đến nền tảng du lịch số 1.
              </h3>
              <div className="text-[15px] text-slate-500 space-y-6 leading-relaxed">
                <p>
                  Khởi đầu từ năm 2021, chúng tôi nhận thấy sự thiếu minh bạch trong ngành du lịch truyền thống. <strong className="text-slate-800 font-semibold">TravelGo</strong> ra đời để phá vỡ các rào cản đó.
                </p>
                <p>
                  Mọi tour du lịch trên hệ thống đều trải qua quy trình kiểm duyệt khắt khe từ chất lượng xe, khách sạn đến hướng dẫn viên, giúp bạn tập trung hoàn toàn vào việc tận hưởng.
                </p>
              </div>
            </div>
            
            {/* STATS: LUXURY LOOK */}
            <div className="grid grid-cols-3 gap-4 pt-10 border-t border-slate-100">
              {[
                { v: "10K+", l: "Khách hàng" },
                { v: "500+", l: "Tours" },
                { v: "4.9/5", l: "Đánh giá" }
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{s.v}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: VALUES WITH GLASSMORPHISM CARD */}
          <div className="lg:col-span-6">
            <div className="relative p-1 bg-gradient-to-br from-slate-100 to-white rounded-[2rem] shadow-2xl shadow-slate-200/50">
              <div className="bg-white rounded-[1.8rem] p-8 space-y-6">
                {[
                  { 
                    icon: Target, 
                    t: "Sứ mệnh", 
                    d: "Kết nối hàng triệu tâm hồn yêu xê dịch với những vùng đất mới.", 
                    color: "text-blue-600", bg: "bg-blue-50" 
                  },
                  { 
                    icon: ShieldCheck, 
                    t: "An toàn tuyệt đối", 
                    d: "Bảo mật thông tin và hỗ trợ khẩn cấp trên mọi hành trình.", 
                    color: "text-emerald-600", bg: "bg-emerald-50" 
                  },
                  { 
                    icon: Award, 
                    t: "Chất lượng thượng hạng", 
                    d: "Chỉ những đối tác đạt tiêu chuẩn 4-5 sao mới có mặt tại đây.", 
                    color: "text-indigo-600", bg: "bg-indigo-50" 
                  },
                ].map((v, i) => (
                  <div key={i} className="group flex gap-5 items-start p-2 rounded-2xl hover:bg-slate-50 transition-all duration-300">
                    <div className={`p-3.5 rounded-2xl ${v.bg} ${v.color} group-hover:scale-110 transition-transform`}>
                      <v.icon size={22} strokeWidth={2.5} />
                    </div>
                    <div className="pt-1">
                      <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {v.t}
                      </h4>
                      <p className="text-[13px] text-slate-400 leading-snug">
                        {v.d}
                      </p>
                    </div>
                  </div>
                ))}
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-blue-600 transition-all shadow-lg shadow-slate-900/10 hover:shadow-blue-600/20">
                  Khám phá Tours ngay <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default About;