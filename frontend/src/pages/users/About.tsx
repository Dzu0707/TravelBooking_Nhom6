import { Target, ShieldCheck, Award, ArrowRight, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#f8fafc] min-h-screen font-sans antialiased text-slate-900">
      {/* HEADER SÁNG */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-cyan-50" />
        <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="absolute -bottom-24 -right-20 w-80 h-80 rounded-full bg-indigo-100/60 blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 shadow-sm">
            <Star size={10} className="fill-current" /> Our Heritage
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Định hình lại cách bạn <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Khám phá Thế giới
            </span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            TravelGo không chỉ là ứng dụng đặt tour. Chúng tôi là người đồng hành số hóa trải nghiệm du lịch,
            giúp hành trình của bạn minh bạch, thuận tiện và an tâm hơn.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 items-center">
          {/* LEFT */}
          <div className="lg:col-span-6 space-y-10">
            <div>
              <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-[0.3em] mb-4">Câu chuyện</h2>
              <h3 className="text-3xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                Từ niềm đam mê xê dịch đến nền tảng du lịch số.
              </h3>

              <div className="text-[15px] text-slate-600 space-y-6 leading-relaxed">
                <p>
                  Từ năm 2021, chúng tôi nhận thấy người dùng cần một nền tảng du lịch
                  minh bạch hơn về giá, lịch trình và chất lượng dịch vụ.
                </p>
                <p>
                  TravelGo ra đời để chuẩn hóa quy trình đặt tour, kiểm duyệt đối tác
                  và mang lại trải nghiệm đặt dịch vụ rõ ràng, nhanh chóng, đáng tin cậy.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-200">
              {[
                { v: '10K+', l: 'Khách hàng' },
                { v: '500+', l: 'Tours' },
                { v: '4.9/5', l: 'Đánh giá' }
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="text-2xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{s.v}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[2rem] p-8 space-y-6 border border-slate-100 shadow-xl shadow-slate-200/50">
              {[
                {
                  icon: Target,
                  t: 'Sứ mệnh',
                  d: 'Kết nối người yêu du lịch với những hành trình chất lượng và đáng giá.',
                  color: 'text-blue-600',
                  bg: 'bg-blue-50'
                },
                {
                  icon: ShieldCheck,
                  t: 'An toàn',
                  d: 'Bảo mật dữ liệu người dùng và hỗ trợ nhanh khi có sự cố phát sinh.',
                  color: 'text-emerald-600',
                  bg: 'bg-emerald-50'
                },
                {
                  icon: Award,
                  t: 'Chất lượng',
                  d: 'Ưu tiên đối tác có dịch vụ ổn định, đánh giá tốt và lịch trình rõ ràng.',
                  color: 'text-indigo-600',
                  bg: 'bg-indigo-50'
                },
              ].map((v, i) => (
                <div key={i} className="group flex gap-5 items-start p-2 rounded-2xl hover:bg-slate-50 transition-all">
                  <div className={`p-3.5 rounded-2xl ${v.bg} ${v.color} group-hover:scale-110 transition-transform`}>
                    <v.icon size={22} strokeWidth={2.5} />
                  </div>
                  <div className="pt-1">
                    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {v.t}
                    </h4>
                    <p className="text-[13px] text-slate-500 leading-snug">{v.d}</p>
                  </div>
                </div>
              ))}

              <button
                onClick={() => navigate('/tours')}
                className="w-full mt-4 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
              >
                Khám phá Tours ngay <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;