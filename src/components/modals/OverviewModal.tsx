import React from 'react';
import { Modal } from '../ui/Modal';
import { GlassCard } from '../ui/GlassCard';
import { Home, Plus, BedDouble } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OverviewModal: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Modal title={t('overview.title')} maxWidth="max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 h-full p-2">
        
        {/* Left Column */}
        <div className="flex flex-col gap-5">
          {/* VỊ TRÍ */}
          <GlassCard>
            <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3">Vị trí</p>
            <p className="text-primary text-lg font-medium leading-relaxed">
              Đường Trần Quang Diệu, Phường Tân Đông Hiệp,<br />Thành phố Hồ Chí Minh
            </p>
          </GlassCard>

          {/* TỔNG DIỆN TÍCH */}
          <GlassCard>
            <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3">Tổng diện tích</p>
            <div className="flex items-baseline gap-2">
              <span className="text-accent text-6xl font-serif tracking-tight drop-shadow-sm">5.537</span>
              <span className="text-primary text-xl font-serif">m²</span>
            </div>
          </GlassCard>

          {/* QUY MÔ */}
          <GlassCard>
            <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3">Quy mô</p>
            <p className="text-primary text-lg font-medium leading-relaxed">
              2 block, 2 tầng hầm & 2 tầng TTTM
            </p>
          </GlassCard>

          {/* CHIỀU CAO */}
          <GlassCard>
            <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3">Chiều cao</p>
            <div className="flex items-baseline gap-2">
              <span className="text-accent text-5xl font-serif tracking-tight drop-shadow-sm">02</span>
              <span className="text-secondary text-base font-medium">tháp cao</span>
              <span className="text-accent text-5xl font-serif tracking-tight drop-shadow-sm ml-2">22</span>
              <span className="text-secondary text-base font-medium">tầng</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-5">
          {/* CHỦ ĐẦU TƯ */}
          <GlassCard>
            <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3">Chủ đầu tư</p>
            <p className="text-primary text-lg font-medium leading-relaxed">
              CT TNHH Đầu tư dự án Phượng Hoàng
            </p>
          </GlassCard>

          {/* PHÁP LÝ SỞ HỮU */}
          <GlassCard>
            <p className="text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-3">Pháp lý sở hữu</p>
            <p className="text-primary text-lg font-medium leading-relaxed">
              Sở hữu lâu dài
            </p>
          </GlassCard>

          {/* TỔNG SỐ CĂN HỘ */}
          <GlassCard className="md:!p-8 flex-1 border-accent/20">
            <p className="text-accent text-xs font-bold tracking-[0.2em] uppercase mb-4">Tổng số căn hộ</p>
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-accent text-7xl font-serif tracking-tight drop-shadow-sm">579</span>
              <span className="text-primary text-xl font-serif uppercase tracking-widest">Căn</span>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between bg-white/40 border border-white/60 rounded-2xl p-4 transition-all duration-300 hover:bg-white/60 hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <Home className="w-5 h-5 text-accent" strokeWidth={2} />
                  </div>
                  <span className="text-primary font-semibold text-base">1 Phòng ngủ</span>
                </div>
                <span className="text-primary font-bold text-lg">43.08 m²</span>
              </div>

              <div className="flex items-center justify-between bg-white/40 border border-white/60 rounded-2xl p-4 transition-all duration-300 hover:bg-white/60 hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <Plus className="w-5 h-5 text-accent" strokeWidth={2} />
                  </div>
                  <span className="text-primary font-semibold text-base">1 Phòng ngủ + 1</span>
                </div>
                <span className="text-primary font-bold text-lg">49.46 – 50.48 m²</span>
              </div>

              <div className="flex items-center justify-between bg-white/40 border border-white/60 rounded-2xl p-4 transition-all duration-300 hover:bg-white/60 hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <BedDouble className="w-5 h-5 text-accent" strokeWidth={2} />
                  </div>
                  <span className="text-primary font-semibold text-base">2 Phòng ngủ</span>
                </div>
                <span className="text-primary font-bold text-lg">66.31 m²</span>
              </div>

              <div className="flex items-center justify-between bg-white/40 border border-white/60 rounded-2xl p-4 transition-all duration-300 hover:bg-white/60 hover:shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-accent/10 rounded-xl">
                    <BedDouble className="w-5 h-5 text-accent" strokeWidth={2} />
                  </div>
                  <span className="text-primary font-semibold text-base">3 Phòng ngủ</span>
                </div>
                <span className="text-primary font-bold text-lg">99.01 m²</span>
              </div>
            </div>
          </GlassCard>
        </div>

      </div>
    </Modal>
  );
};
