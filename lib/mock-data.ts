export const dashboardStats = {
  totalPatients: 48,
  thisMonth: 12,

  internationalPatients: 18,

  followupAlerts: 6,
  overdueFollowups: 2,

  paymentsCleared: 37,
  pendingPayments: 11,
};

export const patients = [
  {
    id: "CHC-12345",
    name: "Sara Ahmed",
    phone: "+251911111111",
    pt: "local",
    treat: "IVF / Assisted Reproduction",
    payStatus: "Fully Paid",
    nationality: "Ethiopia",
    gender: "Female",
    dob: "1997-05-12",
    regDate: "2026-07-10",
    // 🔴 OVERDUE: Scheduled a few days ago
    fu1: { date: "2026-07-14", note: "Post-transfer baseline blood work evaluation" },
    // 🟡 SOON: Scheduled for early next week
    fu2: { date: "2026-07-21", note: "Ultrasound monitoring scan" },
    fu3: { date: "", note: "" },
    fu4: { date: "", note: "" }
  },

  {
    id: "CHC-12346",
    name: "Maria Johnson",
    phone: "+155555555",
    pt: "international",
    treat: "Egg Freezing / Cryopreservation",
    payStatus: "Pending",
    nationality: "USA",
    gender: "Female",
    dob: "1991-03-20",
    regDate: "2026-07-09",
    // 🟢 TODAY: Triggers the active alert slot today
    fu1: { date: "2026-07-17", note: "Hormone level check & medication adjustments" },
    fu2: { date: "", note: "" },
    fu3: { date: "", note: "" },
    fu4: { date: "", note: "" }
  },

  {
    id: "CHC-12347",
    name: "Daniel Bekele",
    phone: "+251922222222",
    pt: "local",
    treat: "Cardiac Surgery / Cardiology",
    payStatus: "Insurance Covered",
    nationality: "Ethiopia",
    gender: "Male",
    dob: "1985-09-15",
    regDate: "2026-07-05",
    // 🔴 OVERDUE: Missed review deadline
    fu1: { date: "2026-07-12", note: "Post-op ECG review" },
    // 🟡 SOON: Scheduled later this week
    fu2: { date: "2026-07-20", note: "Stitch removal & status evaluation" },
    fu3: { date: "", note: "" },
    fu4: { date: "", note: "" }
  },
];