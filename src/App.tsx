import React, { Suspense } from 'react';
import { GlobalLoader } from './components/ui/GlobalLoader';
import { FloatingMenu } from './components/ui/FloatingMenu';
import { RightToolbar } from './components/ui/RightToolbar';
import { useUIStore } from './store/useUIStore';
import { useTransition, animated } from '@react-spring/web';
import { Leva } from 'leva';
const PanoramaViewer = React.lazy(() => import('./components/panorama/PanoramaViewer').then(m => ({ default: m.PanoramaViewer })));
const OverviewModal = React.lazy(() => import('./components/modals/OverviewModal').then(module => ({ default: module.OverviewModal })));
const FloorPlanModal = React.lazy(() => import('./components/modals/FloorPlanModal').then(module => ({ default: module.FloorPlanModal })));
const GalleryModal = React.lazy(() => import('./components/modals/GalleryModal').then(module => ({ default: module.GalleryModal })));
const MapModal = React.lazy(() => import('./components/modals/MapModal').then(module => ({ default: module.MapModal })));
const NewsModal = React.lazy(() => import('./components/modals/NewsModal').then(module => ({ default: module.NewsModal })));
const VideoModal = React.lazy(() => import('./components/modals/VideoModal').then(module => ({ default: module.VideoModal })));
const UltisModal = React.lazy(() => import('./components/modals/UltisModal').then(module => ({ default: module.UltisModal })));
const LeadForm = React.lazy(() => import('./components/ui/LeadForm').then(module => ({ default: module.LeadForm })));

function App() {
  const { activeModal } = useUIStore();
  
  const transitions = useTransition(activeModal, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    config: { tension: 300, friction: 30 }
  });

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gray-950 text-white font-sans selection:bg-gold-500/30 select-none">
      <GlobalLoader />
      
      {/* 360 Viewer Background layer */}
      <Suspense fallback={null}>
        <PanoramaViewer />
      </Suspense>

      {/* No Header */}

      {/* UI Navigation layer */}
      <FloatingMenu />
      <RightToolbar />

      {/* Modals layer - Lazy Loaded */}
      <Suspense fallback={null}>
        {transitions((style, item) => {
          if (!item) return null;
          return (
            <animated.div style={style} className="fixed inset-0 z-50 pointer-events-none">
              {item === 'overview' && <OverviewModal />}
              {item === 'floorplan' && <FloorPlanModal />}
              {item === 'video' && <VideoModal />}
              {item === 'gallery' && <GalleryModal />}
              {item === 'map' && <MapModal />}
              {item === 'news' && <NewsModal />}
              {item === 'ultis' && <UltisModal />}
            </animated.div>
          );
        })}
        <LeadForm />
      </Suspense>
      
      {/* Hide Leva globally */}
      <Leva hidden />
    </div>
  );
}

export default App;
