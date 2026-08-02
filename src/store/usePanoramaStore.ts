import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Hotspot, PanoramaLine } from '../types';

interface PanoramaState {
  currentSceneId: string;
  selectedHotspot: Hotspot | null;
  autoRotate: boolean;
  isDebugMode: boolean;
  draggedHotspotId: string | null;
  hotspotOverrides: Record<string, number[]>;
  modelOverrides: Record<string, { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }>;
  floorplanTransform: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] } | null;
  draggedLinePoint: { lineId: string, pointIndex: number } | null;
  lineOverrides: Record<string, [number, number, number][]>;
  isDrawingLine: boolean;
  currentLinePoints: [number, number, number][];
  linesOverrides: Record<string, PanoramaLine[]>; // key is sceneId
  setCurrentSceneId: (id: string) => void;
  setSelectedHotspot: (hotspot: Hotspot | null) => void;
  setAutoRotate: (auto: boolean) => void;
  setIsDebugMode: (debug: boolean) => void;
  setDraggedHotspotId: (id: string | null) => void;
  updateHotspotPosition: (id: string, position: number[]) => void;
  updateModelTransform: (sceneId: string, modelId: string, transform: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }) => void;
  updateFloorplanTransform: (transform: { position: [number, number, number], rotation: [number, number, number], scale: [number, number, number] }) => void;
  setDraggedLinePoint: (data: { lineId: string, pointIndex: number } | null) => void;
  updateLinePointPosition: (lineId: string, pointIndex: number, position: [number, number, number], originalPoints: [number, number, number][]) => void;
  deleteLinePoint: (lineId: string, pointIndex: number, originalPoints: [number, number, number][]) => void;
  setIsDrawingLine: (isDrawing: boolean) => void;
  addPointToLine: (point: [number, number, number]) => void;
  undoLastPoint: () => void;
  finishLine: (sceneId: string, lineId: string) => void;
  clearCurrentLine: () => void;
}

export const usePanoramaStore = create<PanoramaState>()(
  persist(
    (set) => ({
      currentSceneId: 'scene-1',
      selectedHotspot: null,
      autoRotate: true,
      isDebugMode: false,
      draggedHotspotId: null,
      hotspotOverrides: {},
      modelOverrides: {},
      floorplanTransform: null,
      draggedLinePoint: null,
      lineOverrides: {},
      isDrawingLine: false,
      currentLinePoints: [],
      linesOverrides: {},
      setCurrentSceneId: (id) => set({ currentSceneId: id, selectedHotspot: null, currentLinePoints: [], isDrawingLine: false, draggedLinePoint: null }),
      setSelectedHotspot: (hotspot) => set({ selectedHotspot: hotspot }),
      setAutoRotate: (auto) => set({ autoRotate: auto }),
      setIsDebugMode: (debug) => set({ isDebugMode: debug, isDrawingLine: false, currentLinePoints: [] }),
      setDraggedHotspotId: (id) => set({ draggedHotspotId: id }),
      updateHotspotPosition: (id, position) => set((state) => ({
        hotspotOverrides: { ...state.hotspotOverrides, [id]: position }
      })),
      updateModelTransform: (sceneId, modelId, transform) => set((state) => ({
        modelOverrides: { ...state.modelOverrides, [`${sceneId}_${modelId}`]: transform }
      })),
      updateFloorplanTransform: (transform) => set({ floorplanTransform: transform }),
      setDraggedLinePoint: (data) => set({ draggedLinePoint: data }),
      updateLinePointPosition: (lineId, pointIndex, position, originalPoints) => set((state) => {
        if (lineId === 'current-drawing-line') {
          const newPts = [...state.currentLinePoints];
          newPts[pointIndex] = position;
          return { currentLinePoints: newPts };
        }
        const currentPoints = state.lineOverrides[lineId] ? [...state.lineOverrides[lineId]] : [...originalPoints];
        currentPoints[pointIndex] = position;
        return { lineOverrides: { ...state.lineOverrides, [lineId]: currentPoints } };
      }),
      deleteLinePoint: (lineId, pointIndex, originalPoints) => set((state) => {
        if (lineId === 'current-drawing-line') {
          const newPts = [...state.currentLinePoints];
          newPts.splice(pointIndex, 1);
          return { currentLinePoints: newPts };
        }
        const currentPoints = state.lineOverrides[lineId] ? [...state.lineOverrides[lineId]] : [...originalPoints];
        currentPoints.splice(pointIndex, 1);
        return { lineOverrides: { ...state.lineOverrides, [lineId]: currentPoints } };
      }),
      setIsDrawingLine: (isDrawing) => set({ isDrawingLine: isDrawing, currentLinePoints: [] }),
      addPointToLine: (point) => set((state) => ({ currentLinePoints: [...state.currentLinePoints, point] })),
      undoLastPoint: () => set((state) => ({ currentLinePoints: state.currentLinePoints.slice(0, -1) })),
      finishLine: (sceneId, lineId) => set((state) => {
        if (state.currentLinePoints.length < 2) return state; // Don't save single point lines
        const newLine: PanoramaLine = {
          id: lineId,
          points: state.currentLinePoints,
          animated: true,
          dashed: true
        };
        const currentOverrides = state.linesOverrides[sceneId] || [];
        return {
          linesOverrides: {
            ...state.linesOverrides,
            [sceneId]: [...currentOverrides, newLine]
          },
          currentLinePoints: []
        };
      }),
      clearCurrentLine: () => set({ currentLinePoints: [] }),
    }),
    {
      name: 'panorama-storage',
      partialize: (state) => ({ autoRotate: state.autoRotate }),
    }
  )
);
