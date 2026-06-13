import React, { Suspense } from 'react';
import { PanoramaViewer } from './components/panorama/PanoramaViewer';
import { FloatingMenu } from './components/ui/FloatingMenu';
import { RightToolbar } from './components/ui/RightToolbar';
import { useUIStore } from './store/useUIStore';
import { AnimatePresence } from 'framer-motion';
const DebugPanel = React.lazy(() => import('./components/panorama/DebugPanel').then(module => ({ default: module.DebugPanel })));
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

  return (
    <div className="w-screen h-screen overflow-hidden relative bg-gray-950 text-white font-sans selection:bg-gold-500/30">
      {/* 360 Viewer Background layer */}
      <PanoramaViewer />

      {/* No Header */}

      {/* UI Navigation layer */}
      <FloatingMenu />
      <RightToolbar />

      {/* Modals layer - Lazy Loaded */}
      <Suspense fallback={null}>
        <AnimatePresence mode="wait">
          {activeModal === 'overview' && <OverviewModal key="overview" />}
          {activeModal === 'floorplan' && <FloorPlanModal key="floorplan" />}
          {activeModal === 'video' && <VideoModal key="video" />}
          {activeModal === 'gallery' && <GalleryModal key="gallery" />}
          {activeModal === 'map' && <MapModal key="map" />}
          {activeModal === 'news' && <NewsModal key="news" />}
          {activeModal === 'ultis' && <UltisModal key="ultis" />}
        </AnimatePresence>
        <LeadForm />
      </Suspense>
      
      {/* Debug Layer */}
      <Suspense fallback={null}>
        <DebugPanel />
      </Suspense>
    </div>
  );
}

export default App;
