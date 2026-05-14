import React, { useState } from 'react';
import { ChevronLeft, CheckCircle2, Circle, Sparkles, Cloud, FileText, Crown } from 'lucide-react';

interface PurchasePageProps {
  onBack: () => void;
}

interface PurchasePlan {
  id: number;
  title: string;
  price: string;
  period: string;
  credits: string;
  creditsPeriod: string;
  tag?: string;
}

export const PurchasePage: React.FC<PurchasePageProps> = ({ onBack }) => {
  const plans: PurchasePlan[] = [
    {
      id: 0,
      title: '录咖高级会员(包周)',
      price: '49',
      period: '/周',
      credits: '300',
      creditsPeriod: '/周',
    },
    {
      id: 1,
      title: '录咖基础会员(年度)',
      price: '196',
      period: '/年',
      credits: '3000',
      creditsPeriod: '/年',
    },
    {
      id: 2,
      title: '录咖高级会员(年度)',
      price: '249',
      period: '/年',
      credits: '6000',
      creditsPeriod: '/年',
    },
    {
      id: 3,
      title: '录咖商业会员(年度)',
      price: '780',
      period: '/年',
      credits: '24000',
      creditsPeriod: '/年',
    },
  ];

  const [selectedPlan, setSelectedPlan] = useState(2);
  const [agreed, setAgreed] = useState(false);

  const currentPlan = plans.find((plan) => plan.id === selectedPlan) ?? plans[0];

  return (
    <div className="relative flex h-full w-full flex-col overflow-y-auto bg-[#12121A] text-white custom-scrollbar">
      <div className="relative z-10 flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-400 transition-colors hover:text-white">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium">解锁会员权益</h1>
        <button className="text-[13px] text-gray-400 transition-colors hover:text-white">
          恢复购买
        </button>
      </div>

      <div className="relative z-10 flex flex-col gap-6 px-5 pb-8">
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-[#1C1C1E] p-5 shadow-lg">
          <div className="pointer-events-none absolute top-0 left-1/2 h-8 w-3/4 -translate-x-1/2 bg-[#F5C882] opacity-20 blur-[40px]" />

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F5C882]/20">
                <Sparkles size={14} className="text-[#F5C882]" />
              </div>
              <span className="text-[14px] text-gray-200">
                <span className="font-medium text-[#F5C882]">{currentPlan.credits}</span>
                <span className="ml-1">算粒</span>
                <span className="text-gray-400">{currentPlan.creditsPeriod}</span>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
                <Cloud size={14} className="text-[#D4A373]" />
              </div>
              <span className="text-[14px] text-gray-200">
                <span className="mr-1 font-medium text-[#D4A373]">10GB</span>
                云存储空间
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
                <FileText size={14} className="text-[#D4A373]" />
              </div>
              <span className="text-[14px] text-gray-200">存储文件数无限制</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/5">
                <Crown size={14} className="text-[#D4A373]" />
              </div>
              <span className="text-[14px] text-gray-200">同时享有录屏和轻编辑客户端VIP</span>
            </div>
          </div>

          <div className="mt-4 text-right">
            <button className="text-[12px] text-gray-500 transition-colors hover:text-gray-300">
              权益说明&gt;
            </button>
          </div>
        </div>

        <div className="mt-2 flex flex-col gap-3">
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all duration-300 ${
                  isSelected
                    ? 'border-[#F5C882] bg-[#2A241A] shadow-[0_0_15px_rgba(245,200,130,0.15)]'
                    : 'border-white/5 bg-[#1C1C1E] hover:border-white/20'
                }`}
              >
                {plan.tag && (
                  <div className="absolute -top-3 right-0 rounded-bl-xl rounded-tr-xl bg-gradient-to-r from-[#FF3366] to-[#FF6B6B] px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                    {plan.tag}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {isSelected ? (
                    <CheckCircle2 size={20} className="text-[#F5C882]" fill="#F5C882" stroke="#2A241A" />
                  ) : (
                    <Circle size={20} className="text-gray-600" />
                  )}

                  <span className={`text-[15px] font-medium ${isSelected ? 'text-[#F5C882]' : 'text-gray-200'}`}>
                    {plan.title}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className={`text-[14px] ${isSelected ? 'text-[#F5C882]' : 'text-gray-400'}`}>¥</span>
                  <span className={`text-[24px] font-bold ${isSelected ? 'text-[#F5C882]' : 'text-gray-200'}`}>
                    {plan.price}
                  </span>
                  <span className="text-[12px] text-gray-500">{plan.period}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-col items-center gap-4">
          <button className="w-full rounded-full bg-gradient-to-r from-[#FAD9A1] to-[#E5B859] py-3.5 text-[16px] font-bold text-[#5A3A00] shadow-[0_4px_15px_rgba(229,184,89,0.3)] transition-opacity hover:opacity-90 active:scale-[0.98]">
            确认协议并购买
          </button>

          <div className="text-[11px] text-gray-500">
            ¥{currentPlan.price}
            {currentPlan.period}自动续费，可随时取消
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setAgreed((value) => !value)}
              className="flex h-4 w-4 items-center justify-center rounded border border-gray-500"
            >
              {agreed && <CheckCircle2 size={12} className="text-gray-400" />}
            </button>
            <span className="text-[11px] text-gray-400">
              我已阅读并同意 <span className="cursor-pointer text-[#D4A373]">《会员协议》</span>{' '}
              <span className="cursor-pointer text-[#D4A373]">《隐私政策》</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
