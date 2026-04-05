-- ==========================================
-- RESET DATABASE (SAFE RESET)
-- ==========================================

TRUNCATE
transactions_log,
donation_requests,
shortage_predictions,
blood_inventory,
donors,
hospitals,
blockchain_blocks
RESTART IDENTITY CASCADE;



-- ==========================================
-- HOSPITALS TABLE
-- ==========================================

INSERT INTO hospitals
(name, zone, type, address, latitude, longitude, contact_phone, contact_email, bed_capacity, blood_bank_license, is_active)
VALUES
('Gandhi Hospital','Secunderabad','Government','Musheerabad, Secunderabad',17.3850,78.4867,'+91-40-27505566','gandhi@tghospitals.gov.in',1200,'TS-BB-001',true),

('Osmania General Hospital','Old City','Government','Afzalgunj, Hyderabad',17.3616,78.4747,'+91-40-24600146','osmania@tghospitals.gov.in',1000,'TS-BB-002',true),

('NIMS','Punjagutta','Government','Punjagutta, Hyderabad',17.4239,78.4478,'+91-40-23489000','nims@nimshyd.gov.in',1500,'TS-BB-003',true),

('Apollo Hospital','Jubilee Hills','Private','Jubilee Hills, Hyderabad',17.4156,78.4075,'+91-40-23607777','info@apollohyd.com',800,'TS-BB-004',true),

('KIMS Hospital','Secunderabad','Private','Minister Road, Secunderabad',17.4399,78.4983,'+91-40-44885000','info@kimshospitals.com',700,'TS-BB-005',true),

('Yashoda Hospital','Somajiguda','Private','Somajiguda, Hyderabad',17.4239,78.4561,'+91-40-45674567','info@yashodahospitals.com',600,'TS-BB-006',true),

('Care Hospitals','Banjara Hills','Private','Banjara Hills, Hyderabad',17.4156,78.4347,'+91-40-30418888','info@carehospitals.com',500,'TS-BB-007',true),

('Continental Hospital','Gachibowli','Private','Gachibowli, Hyderabad',17.4225,78.3583,'+91-40-67001000','info@continentalhospitals.com',450,'TS-BB-008',true),

('Basavatarakam Cancer Hospital','Banjara Hills','Specialty','Banjara Hills, Hyderabad',17.4167,78.4375,'+91-40-23551235','info@basavatarakam.org',300,'TS-BB-009',true),

('MediCiti Hospital','Secretariat','Private','Secretariat Road, Hyderabad',17.4050,78.4706,'+91-40-23220022','info@medicitihospital.in',350,'TS-BB-010',true);



-- ==========================================
-- DONORS (UPDATED)
-- ==========================================

INSERT INTO donors
(name,blood_group,zone,location,age,gender,phone,email,health_issues,last_donation_date,total_donations,is_eligible,is_active)
VALUES

('Ravi Kumar','O+','Kukatpally','Hyderabad',32,'Male','9876543210','ravi@email.com','', '2025-11-15',8,true,true),

('Priya Sharma','A+','Gachibowli','Hyderabad',28,'Female','9876543211','priya@email.com','', '2025-10-20',5,true,true),

('Mohammed Irfan','B+','Tolichowki','Hyderabad',35,'Male','9876543212','irfan@email.com','asthma','2025-09-10',12,false,true),

('Suresh Reddy','O-','Ameerpet','Hyderabad',40,'Male','9876543214','suresh@email.com','', '2025-08-22',15,true,true),

('Fatima Begum','A-','Old City','Hyderabad',30,'Female','9876543215','fatima@email.com','low bp','2025-12-01',4,false,true),

('Venkat Rao','B-','Miyapur','Hyderabad',50,'Male','9876543216','venkat@email.com','diabetes','2025-07-18',20,false,true),

('Anitha Kumari','AB-','LB Nagar','Hyderabad',27,'Female','9876543217','anitha@email.com','', '2025-11-30',6,true,true),

('Rajesh Gupta','O+','Begumpet','Hyderabad',38,'Male','9876543218','rajesh@email.com','', '2026-01-10',9,true,true),

('Swathi Naidu','A+','Madhapur','Hyderabad',25,'Female','9876543219','swathi@email.com','', '2025-10-05',7,true,true),

('Arjun Reddy','B+','Kondapur','Hyderabad',33,'Male','9876543220','arjun@email.com','', '2025-12-15',11,true,true);



-- ==========================================
-- BLOOD INVENTORY GENERATOR
-- ==========================================

DO $$

DECLARE
  hosp RECORD;
  bg TEXT;
  blood_groups TEXT[] := ARRAY['A+','A-','B+','B-','AB+','AB-','O+','O-'];
  units INT;

BEGIN

FOR hosp IN SELECT id FROM hospitals LOOP

FOREACH bg IN ARRAY blood_groups LOOP

IF bg IN ('O-','AB-','B-') THEN
  units := floor(random()*8)::INT + 2;

ELSIF bg='A-' THEN
  units := floor(random()*15)::INT + 5;

ELSE
  units := floor(random()*40)::INT + 10;

END IF;

INSERT INTO blood_inventory
(hospital_id,blood_group,units_available,units_reserved,last_restocked_at,expiry_date)

VALUES
(hosp.id,bg,units,floor(random()*3)::INT,NOW(),CURRENT_DATE + 90);

END LOOP;

END LOOP;

END $$;