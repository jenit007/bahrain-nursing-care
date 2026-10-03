const STORAGE_KEY = "bahrain_nursing_requests";
const STAFF_STORAGE_KEY = "bahrain_nursing_staff";
const JOB_APPLICATIONS_KEY = "noorAlAfiyaJobApplications";

// Default sample staff roster for Bahrain Home Health Care WLL
const INITIAL_STAFF = [
  {
    id: "STF-101",
    name: "Nurse Layla Al-Mansoor",
    role: "Registered Senior Nurse",
    specialization: "Elderly & Post-Op Care",
    phone: "+973 3912 8844",
    cpr: "910244821",
    status: "Available",
    assignedCount: 4,
    avatarColor: "#0066cc",
  },
  {
    id: "STF-102",
    name: "Nurse Maryam Ahmed",
    role: "Pediatric Care Specialist",
    specialization: "Newborn & Children Care",
    phone: "+973 3655 7711",
    cpr: "940833190",
    status: "On Duty",
    assignedCount: 6,
    avatarColor: "#0284c7",
  },
  {
    id: "STF-103",
    name: "Caregiver Hassan Salman",
    role: "Palliative & Physical Caregiver",
    specialization: "Mobility & Vital Monitoring",
    phone: "+973 3422 9900",
    cpr: "880566311",
    status: "Available",
    assignedCount: 3,
    avatarColor: "#0d9488",
  },
  {
    id: "STF-104",
    name: "Nurse Fatima Al-Bahraini",
    role: "Clinical Home Care Specialist",
    specialization: "Patient & ICU Step-Down Care",
    phone: "+973 3811 4455",
    cpr: "920788244",
    status: "On Duty",
    assignedCount: 5,
    avatarColor: "#7c3aed",
  },
  {
    id: "STF-105",
    name: "Caregiver Zahra Ebrahim",
    role: "Maternal & Newborn Caregiver",
    specialization: "Postpartum & Infant Care",
    phone: "+973 3390 1122",
    cpr: "951122344",
    status: "Available",
    assignedCount: 2,
    avatarColor: "#ec4899",
  },
];

// Sample initial job applications submitted by staff/candidates
const INITIAL_JOB_APPLICATIONS = [
  {
    id: "JOB-88219401",
    fullName: "Nurse Reem Al-Hassan",
    email: "reem.hassan@domain.bh",
    phone: "+973 3988 7744",
    governorate: "Capital Governorate",
    address: "Building 21, Flat 3, Manama",
    position: "Registered Nurse",
    experience: "3–5 years",
    qualification: "BSN (Bachelor of Science in Nursing)",
    licenseNumber: "NHRA-RN-9921",
    availability: "Immediately",
    message: "Experienced in post-operative senior care and daily vital monitoring. Seeking full-time home visits position in Capital governorate.",
    cvFileName: "Nurse_Reem_AlHassan_CV.pdf",
    certificationFileName: "NHRA_Nursing_License.pdf",
    status: "Application Received",
    submittedAt: "2026-10-03T07:15:00.000Z",
  },
  {
    id: "JOB-88219402",
    fullName: "Amira Al-Sheddi",
    email: "amira.sheddi@domain.bh",
    phone: "+973 3612 0099",
    governorate: "Southern Governorate",
    address: "Villa 14, Riffa Views",
    position: "Newborn Care Specialist",
    experience: "6–10 years",
    qualification: "Maternal & Infant Care Certification",
    licenseNumber: "NHRA-NC-1044",
    availability: "Within 2 weeks",
    message: "Specialized in night-time infant care, breastfeeding assistance and newborn routine management.",
    cvFileName: "Amira_Sheddi_NewbornCare.docx",
    certificationFileName: "Pediatric_Care_Cert.pdf",
    status: "Under Review",
    submittedAt: "2026-10-02T16:40:00.000Z",
  },
];

// Initial realistic sample requests for Bahrain
const INITIAL_REQUESTS = [
  {
    id: "REQ-17182901",
    service: "Elder Care",
    name: "Jassim Al-Khalifa",
    email: "jassim.k@domain.bh",
    phone: "+973 3944 1122",
    condition: "Post-stroke recovery, mobility support and daily medication management.",
    shift: "Day Shift (8 AM - 4 PM)",
    shiftOther: "",
    preferredDate: "2026-10-05",
    notes: "Requires gentle assistance with physical therapy exercises twice daily.",
    address: {
      flatNo: "12B",
      buildingNo: "450",
      area: "Seef District",
      governorate: "Capital Governorate",
    },
    status: "Staff Appointed",
    assignedStaffId: "STF-101",
    assignedStaffName: "Nurse Layla Al-Mansoor",
    assignedStaffRole: "Registered Senior Nurse",
    urgency: "High",
    createdAt: "2026-10-02T09:30:00.000Z",
  },
  {
    id: "REQ-17182902",
    service: "Newborn Care",
    name: "Noora Al-Zayani",
    email: "noora.z@domain.bh",
    phone: "+973 3611 9988",
    condition: "Postpartum mother care and infant night feeding assistance.",
    shift: "Night Shift (10 PM - 6 AM)",
    shiftOther: "",
    preferredDate: "2026-10-04",
    notes: "Twins baby care support required.",
    address: {
      flatNo: " Villa 8",
      buildingNo: "892",
      area: "Riffa",
      governorate: "Southern Governorate",
    },
    status: "Verified",
    assignedStaffId: null,
    assignedStaffName: null,
    assignedStaffRole: null,
    urgency: "Normal",
    createdAt: "2026-10-02T14:15:00.000Z",
  },
  {
    id: "REQ-17182903",
    service: "Patient Care",
    name: "Tariq Mahmood",
    email: "tariq.m@domain.bh",
    phone: "+973 3488 2233",
    condition: "Diabetic wound dressing and blood pressure monitoring.",
    shift: "Full Time (24 Hours)",
    shiftOther: "",
    preferredDate: "2026-10-03",
    notes: "Sterile dressing supplies available at home.",
    address: {
      flatNo: " Flat 41",
      buildingNo: "120",
      area: "Amwaj Islands",
      governorate: "Muharraq Governorate",
    },
    status: "Pending Verification",
    assignedStaffId: null,
    assignedStaffName: null,
    assignedStaffRole: null,
    urgency: "Urgent",
    createdAt: "2026-10-03T08:00:00.000Z",
  },
  {
    id: "REQ-17182904",
    service: "Children Care",
    name: "Sara Al-Doseri",
    email: "sara.d@domain.bh",
    phone: "+973 3311 4477",
    condition: "Pediatric special assistance during recovery from fever.",
    shift: "Evening Shift (4 PM - 10 PM)",
    shiftOther: "",
    preferredDate: "2026-10-06",
    notes: "Child is 6 years old, needs pediatric caregiver supervision.",
    address: {
      flatNo: " Villa 22",
      buildingNo: "305",
      area: "Saar",
      governorate: "Northern Governorate",
    },
    status: "Completed",
    assignedStaffId: "STF-102",
    assignedStaffName: "Nurse Maryam Ahmed",
    assignedStaffRole: "Pediatric Care Specialist",
    urgency: "Normal",
    createdAt: "2026-09-30T11:20:00.000Z",
  },
];

// Helper to initialize default data if empty
export const seedSampleDataIfEmpty = (force = false) => {
  const existingReqs = localStorage.getItem(STORAGE_KEY);
  if (!existingReqs || force) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_REQUESTS));
  }

  const existingStaff = localStorage.getItem(STAFF_STORAGE_KEY);
  if (!existingStaff || force) {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
  }

  const existingJobs = localStorage.getItem(JOB_APPLICATIONS_KEY);
  if (!existingJobs || force) {
    localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(INITIAL_JOB_APPLICATIONS));
  }
};

// Auto seed on import if missing
seedSampleDataIfEmpty(false);

export const getRequests = () => {
  const storedRequests = localStorage.getItem(STORAGE_KEY);
  if (!storedRequests) {
    seedSampleDataIfEmpty(true);
    return INITIAL_REQUESTS;
  }
  try {
    const parsed = JSON.parse(storedRequests);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveRequests = (requests) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};

export const addRequest = (request) => {
  const requests = getRequests();

  const newRequest = {
    ...request,
    id: `REQ-${Math.floor(10000000 + Math.random() * 90000000)}`,
    status: request.status || "Pending Verification",
    createdAt: new Date().toISOString(),
    assignedStaffId: request.assignedStaffId || null,
    assignedStaffName: request.assignedStaffName || null,
    assignedStaffRole: request.assignedStaffRole || null,
    urgency: request.urgency || "Normal",
  };

  saveRequests([...requests, newRequest]);
  window.dispatchEvent(new Event("storage"));
  return newRequest;
};

export const updateRequestStatus = (requestId, status) => {
  const requests = getRequests();
  const updatedRequests = requests.map((req) =>
    req.id === requestId ? { ...req, status } : req
  );
  saveRequests(updatedRequests);
  window.dispatchEvent(new Event("storage"));
  return updatedRequests;
};

export const assignStaffToRequest = (requestId, staffId, staffName, staffRole) => {
  const requests = getRequests();
  const updatedRequests = requests.map((req) => {
    if (req.id === requestId) {
      return {
        ...req,
        assignedStaffId: staffId,
        assignedStaffName: staffName,
        assignedStaffRole: staffRole,
        status: req.status === "Pending Verification" || req.status === "Verified" ? "Staff Appointed" : req.status,
      };
    }
    return req;
  });
  saveRequests(updatedRequests);
  window.dispatchEvent(new Event("storage"));
  return updatedRequests;
};

export const deleteRequest = (requestId) => {
  const requests = getRequests();
  const filtered = requests.filter((req) => req.id !== requestId);
  saveRequests(filtered);
  window.dispatchEvent(new Event("storage"));
  return filtered;
};

export const getLatestRequest = () => {
  const requests = getRequests();
  if (requests.length === 0) return null;
  return requests[requests.length - 1];
};

// Staff Roster Utilities
export const getStaffRoster = () => {
  const stored = localStorage.getItem(STAFF_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(INITIAL_STAFF));
    return INITIAL_STAFF;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return INITIAL_STAFF;
  }
};

export const saveStaffRoster = (staffList) => {
  localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(staffList));
};

export const addStaffMember = (staffData) => {
  const roster = getStaffRoster();
  const newStaff = {
    ...staffData,
    id: `STF-${Math.floor(100 + Math.random() * 900)}`,
    status: staffData.status || "Available",
    assignedCount: 0,
    avatarColor: staffData.avatarColor || "#0066cc",
  };
  const updated = [...roster, newStaff];
  saveStaffRoster(updated);
  window.dispatchEvent(new Event("storage"));
  return updated;
};

export const toggleStaffStatus = (staffId) => {
  const roster = getStaffRoster();
  const updated = roster.map((s) => {
    if (s.id === staffId) {
      const nextStatus = s.status === "Available" ? "On Duty" : s.status === "On Duty" ? "Off Duty" : "Available";
      return { ...s, status: nextStatus };
    }
    return s;
  });
  saveStaffRoster(updated);
  window.dispatchEvent(new Event("storage"));
  return updated;
};

// Job Applications Utilities
export const getJobApplications = () => {
  const stored = localStorage.getItem(JOB_APPLICATIONS_KEY);
  if (!stored) {
    localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(INITIAL_JOB_APPLICATIONS));
    return INITIAL_JOB_APPLICATIONS;
  }
  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return INITIAL_JOB_APPLICATIONS;
  }
};

export const saveJobApplications = (applications) => {
  localStorage.setItem(JOB_APPLICATIONS_KEY, JSON.stringify(applications));
};

export const addJobApplication = (appData) => {
  const apps = getJobApplications();
  const newApp = {
    ...appData,
    id: appData.id || `JOB-${Math.floor(10000000 + Math.random() * 90000000)}`,
    status: appData.status || "Application Received",
    submittedAt: appData.submittedAt || new Date().toISOString(),
  };

  const updated = [newApp, ...apps];
  saveJobApplications(updated);
  window.dispatchEvent(new Event("storage"));
  return newApp;
};

export const updateJobApplicationStatus = (appId, status) => {
  const apps = getJobApplications();
  const updated = apps.map((app) =>
    app.id === appId ? { ...app, status } : app
  );
  saveJobApplications(updated);
  window.dispatchEvent(new Event("storage"));
  return updated;
};

export const hireJobApplicant = (appId, roleOverride, specializationOverride) => {
  const apps = getJobApplications();
  const targetApp = apps.find((a) => a.id === appId);

  if (!targetApp) return null;

  // 1. Create new staff member in roster
  const staffRole = roleOverride || targetApp.position || "Registered Nurse";
  const specialization = specializationOverride || `${targetApp.qualification || "Healthcare Specialist"} (${targetApp.experience || "Experienced"})`;

  addStaffMember({
    name: targetApp.fullName,
    role: staffRole,
    specialization: specialization,
    phone: targetApp.phone,
    cpr: targetApp.licenseNumber || `CPR-${Math.floor(80000000 + Math.random() * 10000000)}`,
    status: "Available",
    avatarColor: "#0284c7",
  });

  // 2. Mark job application as Hired
  const updatedApps = apps.map((a) =>
    a.id === appId ? { ...a, status: "Hired / Added to Roster" } : a
  );
  saveJobApplications(updatedApps);
  window.dispatchEvent(new Event("storage"));

  return targetApp;
};

export const deleteJobApplication = (appId) => {
  const apps = getJobApplications();
  const filtered = apps.filter((a) => a.id !== appId);
  saveJobApplications(filtered);
  window.dispatchEvent(new Event("storage"));
  return filtered;
};