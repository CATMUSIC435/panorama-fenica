import { Floor, ProjectInfo, Scene } from '../types';

export const projectInfo: ProjectInfo = {
  name: 'Fenica Luxury Apartments',
  slogan: 'Elevate Your Lifestyle',
  location: 'District 1, Ho Chi Minh City',
  scale: '1.5 Hectares',
  totalUnits: 450,
  blocks: 2,
  handover: 'Q4 2026',
  legal: 'Freehold for locals, 50 years for foreigners',
  investor: 'Fenica Group',
};

export const mapData = [
  { id: "A-01", x: 1818, y: 1693 },
  { id: "A-02", x: 2186, y: 1697 },
  { id: "A-03", x: 2564, y: 1695 },
  { id: "A-04", x: 2958, y: 1696 },
  { id: "A-05", x: 3421, y: 1635 },
  { id: "A-06", x: 3447, y: 2340 },
  { id: "A-07", x: 3061, y: 2338 },
  { id: "A-08", x: 2675, y: 2341 },
  { id: "A-09", x: 1886, y: 2874 },
  { id: "A-10", x: 1946, y: 3252 },
  { id: "A-11", x: 1303, y: 3320 },
  { id: "A-12", x: 1312, y: 2929 },
  { id: "A-13", x: 1303, y: 2558 },
  { id: "A-14", x: 1312, y: 2171 },
  { id: "A-15", x: 1312, y: 1702 },

  { id: "B-01", x: 6525, y: 1949 },
  { id: "B-02", x: 6525, y: 1564 },
  { id: "B-03", x: 7168, y: 1490 },
  { id: "B-04", x: 7168, y: 1877 },
  { id: "B-05", x: 7168, y: 2257 },
  { id: "B-06", x: 7168, y: 2636 },
  { id: "B-07", x: 7211, y: 3012 },
  { id: "B-08", x: 6525, y: 2961 },
  { id: "B-09", x: 6139, y: 2963 },
  { id: "B-10", x: 5762, y: 2969 },
  { id: "B-11", x: 5376, y: 2969 },
  { id: "B-12", x: 4999, y: 2969 },
  { id: "B-13", x: 4879, y: 2271 },
  { id: "B-14", x: 5265, y: 2314 },
  { id: "B-15", x: 5642, y: 2319 }
];

export const mockScenes: Scene[] = [
  {
    id: 'scene-1',
    name: 'Exterior View',
    image: './assets/mat-bang-tang-360-6mb.jpg', // Using the asset provided
    hotspots: [
      { id: 'h18', type: 'info', position: [-142.60, -20.57, -29.84], title: 'Ga S12 - Metro số 01', description: '5 phút', lineHeight: 90 },
      { id: 'h6', type: 'info', position: [-104.99, -1.84, -79.13], title: 'Vincom Plaza', description: '8 phút', lineHeight: 250 },
      { id: 'h5', type: 'info', position: [-64.07, -3.08, -52.45], title: 'KCN Sóng Thần 2', description: '7 phút', lineHeight: 160 },
      { id: 'h4', type: 'info', position: [-79.18, -2.35, -69.37], title: 'ICD Sóng Thần', description: '7 phút', lineHeight: 90 },
      { id: 'h11', type: 'info', position: [-29.32, -1.89, -77.48], title: 'Lotte Mart & BVQT Becamex', description: '15 phút', lineHeight: 120 },
      { id: 'h7', type: 'info', position: [-54.91, -1.28, -51.07], title: 'KCN Đồng An', description: '10 phút', lineHeight: 200 },
      { id: 'h8', type: 'info', position: [-37.59, -1.00, -38.22], title: 'KCX Linh Trung 2', description: '15 phút', lineHeight: 300 },
      { id: 'h3', type: 'info', position: [-24.35, -2.97, -49.18], title: 'KCN VSIP 1', description: '6 phút', lineHeight: 240 },
      { id: 'h9', type: 'info', position: [3.21, -1.66, -45.41], title: 'Aeon Mall', description: '14 phút', lineHeight: 60 },
      { id: 'h10', type: 'info', position: [5.67, -1.87, -60.38], title: 'Sân Golf Sông Bé', description: '14 phút', lineHeight: 180 },
      { id: 'h1', type: 'info', position: [10.97, -5.83, -29.24], title: 'Ngã 6 An Phú', description: '3 phút', lineHeight: 100 },
      { id: 'h2', type: 'info', position: [15.46, -6.85, -39.63], title: 'Ga An Phú', description: '4 phút', lineHeight: 210 },
      { id: 'hx', type: 'info', position: [20.64, -18.22, -15.85], title: 'Fenica Sales Gallery', description: 'Ngay tại dự án', lineHeight: 160 },
      { id: 'h12', type: 'info', position: [22.99, -4.62, -38.29], title: 'BVĐK An Phú', description: '5 phút', lineHeight: 320 },
      { id: 'h13', type: 'info', position: [34.04, -3.19, -46.32], title: 'BV Columbia Asia', description: '8 phút', lineHeight: 220 },
      { id: 'h15', type: 'info', position: [63.02, -5.23, -70.59], title: 'ĐH Kinh tế - Kỹ thuật Bình Dương', description: '7 phút', lineHeight: 60 },
      { id: 'h16', type: 'info', position: [98.42, -8.05, -22.68], title: 'THCS Nguyễn Văn Trỗi & TH An Phú 1', description: '6 phút', lineHeight: 220 },
      { id: 'h19', type: 'info', position: [72.70, -5.44, 40.91], title: 'Chợ Phú An', description: '5 phút', lineHeight: 80 },
      { id: 'h20', type: 'info', position: [32.43, -7.49, 41.74], title: 'Khu Di tích & Du lịch Hố Lang', description: '2 phút', lineHeight: 160 },
      { id: 'h21', type: 'info', position: [-8.88, -3.24, 51.69], title: 'KĐT Đông Bình Dương', description: '7 phút', lineHeight: 80 },
      { id: 'h22', type: 'info', position: [-30.11, -2.99, 34.41], title: 'THCS Tân Bình', description: '4 phút', lineHeight: 100 },
      { id: 'h23', type: 'info', position: [-46.44, -1.29, 26.13], title: 'Chợ Tân Bình', description: '5 phút', lineHeight: 200 },
      { id: 'h25', type: 'info', position: [-95.73, -0.73, 19.48], title: 'KCN Tân Đông Hiệp', description: '8 phút', lineHeight: 160 },
      { id: 'h26', type: 'info', position: [-116.68, 0.30, 3.50], title: 'Làng Đại học', description: '16 phút', lineHeight: 200 },
      { id: 'h27', type: 'info', position: [-113.80, -23.57, 42.38], title: 'VÀNH ĐAI 3 TP.HCM', description: '8 LÀN XE CAO TỐC TRÊN CAO', lineHeight: 180 },
      { id: 'h28', type: 'info', position: [-133.70, -40.27, 19.07], title: 'MỸ PHƯỚC – TÂN VẠN', description: 'LỘ GIỚI 64 MÉT - 10 LÀN XE', lineHeight: 160 },
      { id: 'h29', type: 'info', position: [-70, -126.57, -70], title: 'TRẦN QUANG DIỆU', description: 'LỘ GIỚI 22 MÉT - 4 LÀN XE', lineHeight: 240 },
      { id: 'h30', type: 'info', position: [43.98, -29.12, -177.68], title: 'DT743', description: 'LỘ GIỚI 60 MÉT - 10 LÀN XE', lineHeight: 160 },
      { id: 'h31', type: 'info', position: [168.03, -31.01, -108.49], title: 'CAO TỐC TPHCM – TDM - CT', description: 'LỘ GIỚI 60 MÉT - 10 LÀN XE', lineHeight: 160 },
      { id: 'h32', type: 'info', position: [-31.34, -0.34, 33.43], title: 'Cụm công nghiệp', description: '10 phút', lineHeight: 140 },
      { id: 'h24', type: 'info', position: [-45.05, 0.00, 28.48], title: 'THPT Nguyễn Thị Minh Khai & THCS Tân Đông Hiệp B', description: '7 phút', lineHeight: 260 },
      { id: 'h33', type: 'info', position: [90.17, -11.76, -44.68], title: 'Tiểu học an Phú 3', description: '6 phút', lineHeight: 180 },
      { id: 'h34', type: 'info', position: [192.25, -13.63, 61.81], title: 'Chợ Phú phong', description: '5 phút', lineHeight: 150 },
      { id: 'h35', type: 'info', position: [200.65, -18.77, -18.77], title: 'Điện máy chợ lớn', description: '4 phút', lineHeight: 100 },
      { id: 'h36', type: 'info', position: [-86.70, -99.90, 91.24], title: 'Trường mần non Hoa Anh Đào', description: '1 phút', lineHeight: 200 },
      { id: 'h37', type: 'info', position: [191.79, -62.71, 15.78], title: 'Trường mần non Ánh Mai', description: '1 phút', lineHeight: 120 },
    ],
  },
  {
    id: 'scene-2',
    name: 'High Floor View (Level 22)',
    image: './assets/mat-bang-tang-22-360-6mb.jpg', // Using the asset provided
    hotspots: [
      {
        id: 'h3',
        type: 'scene',
        position: [-10, -5, 20],
        targetSceneId: 'scene-1',
        title: 'Go back to Exterior',
      },
    ],
  }
];

export const mockFloors: Floor[] = [
  {
    id: 'floor-1',
    name: 'Tầng 3 - 7',
    image: './assets/images/plans/mau-mat-bang-tang-03.png',
    units: [
      { code: 'A-01', type: '1 PN+', builtUpArea: 49.46, carpetArea: 45.48, direction: 'East', view: 'River View', status: 'available', price: '$250,000', polygon: "M 10 10 L 40 10 L 40 40 L 10 40 Z" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-02', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'South', view: 'City View', status: 'sold', price: '$350,000', polygon: "M 50 10 L 80 10 L 80 40 L 50 40 Z" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-03', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'booking', price: '$180,000', polygon: "M 10 50 L 40 50 L 40 80 L 10 80 Z" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-04', type: '2 PN', builtUpArea: 48.82, carpetArea: 45.54, direction: 'North', view: 'City View', status: 'available', price: '$180,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-05', type: '2 PN', builtUpArea: 66.06, carpetArea: 60.40, direction: 'North East', view: 'City View', status: 'available', price: '$450,000', polygon: "" , room3dImage: './assets/images/room3d/2pn.png' },
      { code: 'A-06', type: '1 PN+', builtUpArea: 49.99, carpetArea: 45.25, direction: 'North West', view: 'City View', status: 'available', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-07', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.16, direction: 'West', view: 'Internal Park', status: 'available', price: '$250,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-08', type: '1 PN+', builtUpArea: 48.90, carpetArea: 45.25, direction: 'South', view: 'City View', status: 'booking', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-09', type: '1 PN', builtUpArea: 43.09, carpetArea: 39.26, direction: 'South West', view: 'City View', status: 'sold', price: '$180,000', polygon: "" , room3dImage: './assets/images/room3d/1pn.png' },
      { code: 'A-10', type: '1 PN+ góc', builtUpArea: 50.48, carpetArea: 45.90, direction: 'West', view: 'Internal Park', status: 'available', price: '$265,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+goc.png' },
      { code: 'A-11', type: '1 PN+ góc', builtUpArea: 49.99, carpetArea: 45.45, direction: 'North West', view: 'City View', status: 'booking', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+goc.png' },
      { code: 'A-12', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'North', view: 'City View', status: 'available', price: '$255,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-13', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'East', view: 'River View', status: 'available', price: '$255,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-14', type: '1 PN+', builtUpArea: 49.24, carpetArea: 45.74, direction: 'South', view: 'City View', status: 'available', price: '$258,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'A-15', type: '2 PN', builtUpArea: 66.31, carpetArea: 60.09, direction: 'South East', view: 'River View', status: 'sold', price: '$460,000', polygon: "" , room3dImage: './assets/images/room3d/2pn.png' },
      { code: 'B-01', type: '1 PN', builtUpArea: 43.09, carpetArea: 39.24, direction: 'South East', view: 'River View', status: 'available', price: '$180,000', polygon: "" , room3dImage: './assets/images/room3d/1pn.png' },
      { code: 'B-02', type: '1 PN', builtUpArea: 50.41, carpetArea: 45.80, direction: 'East', view: 'River View', status: 'available', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+goc.png' },
      { code: 'B-03', type: '1 PN+ góc', builtUpArea: 49.99, carpetArea: 45.45, direction: 'East', view: 'River View', status: 'booking', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+goc.png' },
      { code: 'B-04', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'East', view: 'River View', status: 'available', price: '$255,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-05', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'East', view: 'River View', status: 'available', price: '$255,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-06', type: '1 PN+', builtUpArea: 49.24, carpetArea: 46.03, direction: 'North', view: 'City View', status: 'available', price: '$258,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-07', type: '2 PN loại 2', builtUpArea: 66.31, carpetArea: 60.32, direction: 'North East', view: 'City View', status: 'sold', price: '$460,000', polygon: "" , room3dImage: './assets/images/room3d/2pn-v2.png' },
      { code: 'B-08', type: '1 PN+', builtUpArea: 49.46, carpetArea: 45.48, direction: 'West', view: 'Internal Park', status: 'available', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-09', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'available', price: '$255,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-10', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'available', price: '$255,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-11', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.54, direction: 'West', view: 'Internal Park', status: 'booking', price: '$255,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-12', type: '1 PN+', builtUpArea: 49.94, carpetArea: 45.37, direction: 'West', view: 'Internal Park', status: 'sold', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-13', type: '2 PN', builtUpArea: 66.32, carpetArea: 60.23, direction: 'South West', view: 'City View', status: 'available', price: '$460,000', polygon: "" , room3dImage: './assets/images/room3d/2pn.png' },
      { code: 'B-14', type: '1 PN+', builtUpArea: 48.82, carpetArea: 45.19, direction: 'South West', view: 'City View', status: 'available', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
      { code: 'B-15', type: '1 PN+', builtUpArea: 48.91, carpetArea: 45.25, direction: 'South West', view: 'City View', status: 'booking', price: '$260,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+.png' },
    ]
  },
  {
    id: 'floor-2',
    name: 'Tầng 8 - 12A',
    image: './assets/images/plans/mau-mat-bang-tang-04.png',
    isUpdating: true,
    units: [
      { code: 'A-2201', type: 'Penthouse', area: 250.0, direction: 'East', view: 'River & City', status: 'available', price: '$1,200,000', polygon: "M 20 20 L 80 20 L 80 80 L 20 80 Z" , room3dImage: './assets/images/room3d/1pn+goc.png' },
    ]
  },
  {
    id: 'floor-3',
    name: 'Tầng 14 - 21',
    image: './assets/images/plans/mau-mat-bang-tang-05.png',
    isUpdating: true,
    units: [
      { code: 'B-01', type: '2 Bedroom', area: 78.0, direction: 'North', view: 'City View', status: 'available', price: '$260,000', polygon: "M 15 15 L 45 15 L 45 45 L 15 45 Z" , room3dImage: './assets/images/room3d/2pn-v2.png' },
    ]
  },
  {
    id: 'floor-4',
    name: 'Tầng 22',
    image: './assets/images/plans/mau-mat-bang-tang-06.png',
    isUpdating: true,
    units: [
      { code: 'B-2101', type: '3 Bedroom', area: 120.0, direction: 'South', view: 'River View', status: 'booking', price: '$450,000', polygon: "" , room3dImage: './assets/images/room3d/1pn+goc.png' },
    ]
  }
];


