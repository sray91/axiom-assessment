-- Sample technologies data
INSERT INTO technologies (name, pillar, description, vendor_examples) VALUES
('Predictive Maintenance', 'Asset Management', 'Uses machine learning to predict equipment failures before they occur, reducing unplanned downtime.', ARRAY['Augury', 'Senseye', 'PTC ThingWorx']),
('Manufacturing Execution System (MES)', 'Process', 'Tracks and documents the transformation of raw materials to finished goods, improving traceability and production visibility.', ARRAY['Siemens Opcenter', 'Rockwell Automation FactoryTalk', 'GE Digital Proficy']),
('Digital Performance Management', 'Organization', 'Visualizes KPIs and production metrics in real-time dashboards, enabling quicker decision making.', ARRAY['Datadog', 'Tulip', 'Drishti']),
('Augmented Reality Work Instructions', 'People', 'Provides step-by-step visual guidance overlaid on actual equipment, reducing training time and errors.', ARRAY['PTC Vuforia', 'Scope AR', 'Microsoft HoloLens']),
('Automated Quality Inspection', 'Quality', 'Uses computer vision and AI to inspect products for defects with higher accuracy than manual inspection.', ARRAY['Cognex', 'Instrumental', 'Landing AI']),
('Digital Twin', 'Asset Management', 'Creates virtual models of physical assets to simulate and optimize operations.', ARRAY['Siemens Teamcenter', 'ANSYS Twin Builder', 'Azure Digital Twins']),
('Industrial IoT Platform', 'Technology', 'Connects machines and sensors to provide real-time monitoring and analytics.', ARRAY['AWS IoT', 'Microsoft Azure IoT', 'Google Cloud IoT']),
('Robotic Process Automation', 'Process', 'Automates repetitive tasks to increase throughput and consistency.', ARRAY['UiPath', 'Automation Anywhere', 'Blue Prism']),
('Energy Management System', 'Sustainability', 'Monitors and optimizes energy consumption to reduce costs and environmental impact.', ARRAY['Schneider EcoStruxure', 'Siemens SIMATIC Energy Manager', 'ABB Ability']),
('Cybersecurity Platform', 'Technology', 'Protects manufacturing systems from digital threats and ensures operational continuity.', ARRAY['Darktrace', 'CyberX', 'Nozomi Networks']);

-- Sample demo assessments
INSERT INTO organizations (id, name) VALUES 
('11111111-1111-1111-1111-111111111111', 'Acme Manufacturing');

INSERT INTO assessments (
  id, 
  user_id, 
  org_id, 
  priorities, 
  maturity, 
  fin_inputs, 
  results
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  NULL, -- Demo user, no auth user attached
  '11111111-1111-1111-1111-111111111111',
  '{"ranking": ["Cost", "Quality", "Safety", "Delivery", "Sustainability", "Flexibility"]}',
  '{"Process": 2, "Asset": 3, "People": 1, "Technology": 2, "Organization": 3, "Quality": 2, "Delivery": 3, "Sustainability": 1}',
  '{"production_hours": 5000, "downtime_hours": 500, "downtime_cost_per_hour": 2000, "scrap_cost": 750000, "energy_spend": 1000000}',
  '{"roadmap": [
    {"timeframe": "0-12 months", "technologies": ["Predictive Maintenance", "Digital Performance Management"]},
    {"timeframe": "12-24 months", "technologies": ["Manufacturing Execution System (MES)", "Energy Management System"]},
    {"timeframe": "24-36 months", "technologies": ["Digital Twin", "Automated Quality Inspection"]}
  ], "headlineBenefits": {"downtime_reduction": 15, "scrap_reduction": 8, "energy_savings": 6}, "paybackMonths": 14, "assumptions": "Based on industry averages for similar manufacturing operations."}'
); 