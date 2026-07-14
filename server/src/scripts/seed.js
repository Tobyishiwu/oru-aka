require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const WorkerProfile = require("../models/WorkerProfile");
const Review = require("../models/Review");

const WORKERS_DATA = [
  {
    name: "Chidi Okeke",
    phone: "+2348031234501",
    trade: "Electrician",
    tagline: "Industrial & residential wiring specialist",
    bio: "11 years rewiring homes and small factories across Enugu. I diagnose faults fast and don't leave a job until the client is satisfied.",
    skills: ["Rewiring", "Panel upgrades", "Inverter installation", "Fault diagnosis"],
    state: "Enugu",
    city: "Independence Layout",
    yearsExperience: 11,
    startingPrice: 4500,
    priceUnit: "per hour",
    verificationStatus: "verified",
    ratingAverage: 4.9,
    ratingCount: 12,
    jobsCompletedCount: 487,
    responseTimeLabel: "Under 30 mins",
  },
  {
    name: "Amara Eze",
    phone: "+2348031234502",
    trade: "Painter",
    tagline: "Interior finishes & decorative texture work",
    bio: "I specialize in clean interior finishes and texture coating. Every job comes with before/after photos.",
    skills: ["Texture coating", "Spray finishing", "Wallpaper", "Exterior weatherproofing"],
    state: "Enugu",
    city: "Trans Ekulu",
    yearsExperience: 7,
    startingPrice: 3500,
    priceUnit: "per job",
    verificationStatus: "verified",
    ratingAverage: 5.0,
    ratingCount: 9,
    jobsCompletedCount: 264,
    responseTimeLabel: "Under 1 hour",
  },
  {
    name: "Tunde Bakare",
    phone: "+2348031234503",
    trade: "Solar Installer",
    tagline: "Off-grid & hybrid solar systems",
    bio: "Certified solar installer focused on homes and small businesses tired of unreliable power.",
    skills: ["Panel sizing", "Battery banks", "Inverter config", "Grid-tie systems"],
    state: "Lagos",
    city: "Lekki Phase 1",
    yearsExperience: 9,
    startingPrice: 12000,
    priceUnit: "per job",
    verificationStatus: "verified",
    ratingAverage: 4.8,
    ratingCount: 21,
    jobsCompletedCount: 356,
    responseTimeLabel: "Under 1 hour",
  },
  {
    name: "Ngozi Umeh",
    phone: "+2348031234504",
    trade: "Carpenter",
    tagline: "Custom furniture & built-in wardrobes",
    bio: "From kitchen cabinets to full wardrobes \u2014 I build to measure and finish on schedule.",
    skills: ["Wardrobes", "Kitchen cabinets", "Doors & frames", "Furniture restoration"],
    state: "Enugu",
    city: "Achara Layout",
    yearsExperience: 6,
    startingPrice: 5000,
    priceUnit: "per job",
    verificationStatus: "verified",
    ratingAverage: 4.7,
    ratingCount: 8,
    jobsCompletedCount: 203,
    responseTimeLabel: "Under 2 hours",
  },
  {
    name: "Musa Garba",
    phone: "+2348031234505",
    trade: "Welder",
    tagline: "Gates, burglary-proof windows & metal fabrication",
    bio: "14 years welding security gates and railings across Abuja and environs.",
    skills: ["Security gates", "Window guards", "Staircase railings", "Structural welding"],
    state: "Abuja",
    city: "Kubwa",
    yearsExperience: 14,
    startingPrice: 5500,
    priceUnit: "per job",
    verificationStatus: "unverified",
    ratingAverage: 4.6,
    ratingCount: 5,
    jobsCompletedCount: 142,
    responseTimeLabel: "Under 3 hours",
  },
  {
    name: "Funke Adeyemi",
    phone: "+2348031234506",
    trade: "AC Technician",
    tagline: "Split & central AC installation, repair, servicing",
    bio: "Fast, clean AC servicing across Lagos mainland and island.",
    skills: ["Gas refill", "Split unit install", "Duct cleaning", "Compressor repair"],
    state: "Lagos",
    city: "Ikeja GRA",
    yearsExperience: 8,
    startingPrice: 6000,
    priceUnit: "per job",
    verificationStatus: "verified",
    ratingAverage: 4.9,
    ratingCount: 14,
    jobsCompletedCount: 398,
    responseTimeLabel: "Under 30 mins",
  },
  {
    name: "Ikechukwu Nwosu",
    phone: "+2348031234507",
    trade: "Plumber",
    tagline: "Borehole, plumbing fixtures & drainage systems",
    bio: "Borehole maintenance and plumbing repairs done right the first time.",
    skills: ["Borehole maintenance", "Pipe fitting", "Water heater install", "Leak detection"],
    state: "Enugu",
    city: "Uwani",
    yearsExperience: 10,
    startingPrice: 4000,
    priceUnit: "per job",
    verificationStatus: "verified",
    ratingAverage: 4.5,
    ratingCount: 6,
    jobsCompletedCount: 211,
    responseTimeLabel: "Under 1 hour",
  },
  {
    name: "Blessing Etim",
    phone: "+2348031234508",
    trade: "Tiler",
    tagline: "Floor & wall tiling, marble and granite finishing",
    bio: "Precision tiling work \u2014 floors, walls, and marble polishing.",
    skills: ["Floor tiling", "Wall cladding", "Grouting", "Marble polishing"],
    state: "Abuja",
    city: "Wuse 2",
    yearsExperience: 4,
    startingPrice: 4500,
    priceUnit: "per job",
    verificationStatus: "unverified",
    ratingAverage: 4.4,
    ratingCount: 3,
    jobsCompletedCount: 78,
    responseTimeLabel: "Under 4 hours",
  },
  {
    name: "Hauwa Suleiman",
    phone: "+2348031234509",
    trade: "Tailor",
    tagline: "Native wear, corporate outfits & alterations",
    bio: "Bespoke tailoring for native and corporate wear, with fast turnaround.",
    skills: ["Native wear", "Corporate outfits", "Alterations", "Pattern drafting"],
    state: "Abuja",
    city: "Garki",
    yearsExperience: 5,
    startingPrice: 3000,
    priceUnit: "per job",
    verificationStatus: "verified",
    ratingAverage: 4.6,
    ratingCount: 7,
    jobsCompletedCount: 167,
    responseTimeLabel: "Under 2 hours",
  },
  {
    name: "Chioma Nnaji",
    phone: "+2348031234510",
    trade: "Electrician",
    tagline: "Smart home wiring & solar-inverter integration",
    bio: "I integrate inverter systems cleanly into existing home wiring \u2014 no shortcuts.",
    skills: ["Smart wiring", "Inverter integration", "Surge protection", "Lighting design"],
    state: "Enugu",
    city: "GRA Phase 2",
    yearsExperience: 8,
    startingPrice: 5000,
    priceUnit: "per hour",
    verificationStatus: "verified",
    ratingAverage: 4.95,
    ratingCount: 18,
    jobsCompletedCount: 341,
    responseTimeLabel: "Under 30 mins",
  },
  {
    name: "Babatunde Ojo",
    phone: "+2348031234511",
    trade: "Carpenter",
    tagline: "Roofing carpentry & ceiling structures",
    bio: "Roofing and ceiling structural carpentry for residential and small commercial buildings.",
    skills: ["Roof trusses", "Ceiling framework", "Formwork", "Timber treatment"],
    state: "Lagos",
    city: "Surulere",
    yearsExperience: 12,
    startingPrice: 5500,
    priceUnit: "per job",
    verificationStatus: "unverified",
    ratingAverage: 4.5,
    ratingCount: 4,
    jobsCompletedCount: 159,
    responseTimeLabel: "Under 2 hours",
  },
  {
    name: "Emeka Obi",
    phone: "+2348031234512",
    trade: "POP Ceiling Installer",
    tagline: "Suspended ceilings & decorative cornices",
    bio: "POP ceilings, cornices, and LED cove lighting \u2014 clean finish guaranteed.",
    skills: ["Suspended ceilings", "Cornice work", "LED cove lighting", "Drywall partitioning"],
    state: "Enugu",
    city: "New Haven",
    yearsExperience: 9,
    startingPrice: 5000,
    priceUnit: "per job",
    verificationStatus: "verified",
    ratingAverage: 4.8,
    ratingCount: 10,
    jobsCompletedCount: 229,
    responseTimeLabel: "Under 1 hour",
  },
];

const CLIENTS_DATA = [
  { name: "Obinna Eze", phone: "+2348021234601", state: "Enugu", city: "Independence Layout" },
  { name: "Adaeze Williams", phone: "+2348021234602", state: "Lagos", city: "Ikeja" },
  { name: "Yusuf Mohammed", phone: "+2348021234603", state: "Abuja", city: "Wuse" },
];

async function seed() {
  await connectDB();
  console.log("Connected. Clearing existing data...");

  await Promise.all([
    User.deleteMany({}),
    WorkerProfile.deleteMany({}),
    Review.deleteMany({}),
  ]);

  console.log("Seeding admin account...");
  await User.create({
    name: "Oru Aka Admin",
    phone: "+2348000000000",
    email: process.env.ADMIN_EMAIL || "admin@oruaka.ng",
    password: process.env.ADMIN_PASSWORD || "ChangeThisPassword123!",
    role: "admin",
    state: "Lagos",
    phoneVerified: true,
  });

  console.log("Seeding clients...");
  const clients = [];
  for (const c of CLIENTS_DATA) {
    const user = await User.create({
      ...c,
      password: "password123",
      role: "client",
      phoneVerified: true,
    });
    clients.push(user);
  }

  console.log("Seeding workers...");
  const workerProfiles = [];
  for (const w of WORKERS_DATA) {
    const user = await User.create({
      name: w.name,
      phone: w.phone,
      password: "password123",
      role: "worker",
      state: w.state,
      city: w.city,
      phoneVerified: true,
      avatarUrl: "",
    });

    const profile = await WorkerProfile.create({
      user: user._id,
      trade: w.trade,
      tagline: w.tagline,
      bio: w.bio,
      skills: w.skills,
      state: w.state,
      city: w.city,
      yearsExperience: w.yearsExperience,
      startingPrice: w.startingPrice,
      priceUnit: w.priceUnit,
      verificationStatus: w.verificationStatus,
      verifiedAt: w.verificationStatus === "verified" ? new Date() : null,
      ratingAverage: w.ratingAverage,
      ratingCount: w.ratingCount,
      jobsCompletedCount: w.jobsCompletedCount,
      responseTimeLabel: w.responseTimeLabel,
      isBoosted: false,
    });

    workerProfiles.push(profile);
  }

  console.log("Seeding a few sample reviews...");
  await Review.create({
    worker: workerProfiles[0]._id,
    client: clients[0]._id,
    rating: 5,
    comment: "Fixed my wiring fault in under an hour. Very professional.",
  });
  await Review.create({
    worker: workerProfiles[2]._id,
    client: clients[1]._id,
    rating: 5,
    comment: "Solar setup has been flawless for 3 months now.",
  });

  console.log("\nSeed complete:");
  console.log(`  Admin login \u2014 phone: +2348000000000, password: ${process.env.ADMIN_PASSWORD || "ChangeThisPassword123!"}`);
  console.log(`  ${workerProfiles.length} worker profiles created (password123 for all seeded accounts)`);
  console.log(`  ${clients.length} client accounts created (password123 for all seeded accounts)`);

  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
