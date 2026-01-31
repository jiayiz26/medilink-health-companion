
export interface InsurancePlan {
    id: string;
    name: string;
}

export interface InsuranceCarrier {
    id: string;
    name: string;
    plans: InsurancePlan[];
}

export interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
}

export interface Doctor {
    id: string;
    name: string;
    specialty: string;
    rating: number;
    reviews: Review[]; // specific reviews
    reviewCount: number;
    distance: string;
    address: string;
    zipCode: string; // for filtering
    nextAvailable: string; // e.g. "Today at 2:30 PM"
    slots: string[]; // ["2:30 PM", "3:00 PM", "4:15 PM"]
    avatar: string;
    insurancePlans: string[]; // Plan IDs
    badges: string[]; // e.g. "Highly Rated", "Waitlist Available"
}

export const insuranceCarriers: InsuranceCarrier[] = [
    {
        id: "aetna",
        name: "Aetna",
        plans: [
            { id: "aetna-hmo", name: "HMO Basic" },
            { id: "aetna-ppo", name: "PPO Choice" },
            { id: "aetna-pos", name: "Managed Choice POS Open Access" },
            { id: "aetna-medicare", name: "Medicare Advantage" }
        ]
    },
    {
        id: "bluecross",
        name: "BlueCross BlueShield",
        plans: [
            { id: "bcbs-blue-choice", name: "Blue Choice PPO" },
            { id: "bcbs-hmo", name: "HMO Blue" },
            { id: "bcbs-federal", name: "Federal Employee Program" }
        ]
    },
    {
        id: "cigna",
        name: "Cigna",
        plans: [
            { id: "cigna-connect", name: "Connect Network" },
            { id: "cigna-ppo", name: "PPO" },
            { id: "cigna-local", name: "LocalPlus" }
        ]
    },
    {
        id: "united",
        name: "UnitedHealthcare",
        plans: [
            { id: "uhc-choice", name: "Choice Plus" },
            { id: "uhc-nav", name: "Navigate HMO" },
            { id: "uhc-nexus", name: "NexusACO" }
        ]
    }
];

export const symptomSpecialtyMap: Record<string, string> = {
    "toothache": "Dentist",
    "cavity": "Dentist",
    "cleaning": "Dentist",
    "back pain": "Orthopedist",
    "sciatica": "Orthopedist",
    "anxiety": "Psychiatrist",
    "depression": "Psychiatrist",
    "acne": "Dermatologist",
    "rash": "Dermatologist",
    "skin check": "Dermatologist",
    "checkup": "Primary Care Doctor",
    "physical": "Primary Care Doctor",
    "flu": "Primary Care Doctor",
    "eye exam": "Opthamologist",
    "glasses": "Optometrist"
};

export const commonSearches = [
    "Primary Care Doctor",
    "Dermatologist",
    "Dentist",
    "Orthopedist",
    "Psychiatrist",
    "OB-GYN",
    "Eye Doctor",
    "Ear, Nose & Throat"
];

// Helper to generate fake slots
const today = new Date();
const formatTime = (hour: number, minute: number) => {
    const d = new Date();
    d.setHours(hour, minute, 0, 0);
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const extendedMockDoctors: Doctor[] = [
    {
        id: "dr-1",
        name: "Jennifer Lee",
        specialty: "Primary Care Doctor",
        rating: 4.92,
        reviewCount: 428,
        reviews: [
            { id: "r1", author: "Sarah M.", rating: 5, date: "2 days ago", comment: "Dr. Lee is fantastic!", verified: true }
        ],
        distance: "0.5 mi",
        address: "123 Medical Ctr Dr, Suite 100",
        zipCode: "10001",
        nextAvailable: "Today",
        slots: ["10:00 AM", "11:30 AM", "2:00 PM", "3:15 PM"],
        avatar: "",
        insurancePlans: ["aetna-ppo", "aetna-hmo", "bcbs-blue-choice", "uhc-choice"],
        badges: ["Top Rated", "Rapid Response"]
    },
    {
        id: "dr-2",
        name: "Robert Kim",
        specialty: "Dermatologist",
        rating: 4.88,
        reviewCount: 356,
        reviews: [],
        distance: "1.1 mi",
        address: "450 Broadway Ave",
        zipCode: "10002",
        nextAvailable: "Tomorrow",
        slots: ["9:00 AM", "9:30 AM", "10:00 AM"],
        avatar: "",
        insurancePlans: ["aetna-pos", "cigna-connect", "bcbs-hmo"],
        badges: ["Waitlist Available"]
    },
    {
        id: "dr-3",
        name: "Maria Garcia",
        specialty: "Primary Care Doctor",
        rating: 4.95,
        reviewCount: 890,
        reviews: [],
        distance: "1.8 mi",
        address: "789 Health Blvd",
        zipCode: "10001",
        nextAvailable: "Today",
        slots: ["1:15 PM", "4:00 PM"],
        avatar: "",
        insurancePlans: ["uhc-nexus", "aetna-hmo", "cigna-ppo", "bcbs-federal"],
        badges: ["Highly Recommended"]
    },
    {
        id: "dr-4",
        name: "David Thompson",
        specialty: "Orthopedist",
        rating: 4.75,
        reviewCount: 204,
        reviews: [],
        distance: "2.3 mi",
        address: "55 Bone & Joint Ln",
        zipCode: "10003",
        nextAvailable: "Feb 12",
        slots: ["11:00 AM", "2:30 PM"],
        avatar: "",
        insurancePlans: ["aetna-ppo", "bcbs-blue-choice", "cigna-local"],
        badges: []
    },
    {
        id: "dr-5",
        name: "Emily Chen",
        specialty: "Dentist",
        rating: 4.99,
        reviewCount: 1022,
        reviews: [],
        distance: "0.8 mi",
        address: "99 Smile Way",
        zipCode: "10001",
        nextAvailable: "Today",
        slots: ["8:30 AM", "12:00 PM", "12:30 PM", "5:00 PM"],
        avatar: "",
        insurancePlans: ["aetna-ppo", "cigna-ppo", "uhc-choice", "bcbs-blue-choice"],
        badges: ["Top 1% Provider"]
    },
    {
        id: "dr-6",
        name: "James Wilson",
        specialty: "Psychiatrist",
        rating: 4.80,
        reviewCount: 156,
        reviews: [],
        distance: "3.2 mi",
        address: "880 Mindful Path",
        zipCode: "10004",
        nextAvailable: "Feb 15",
        slots: [],
        avatar: "",
        insurancePlans: ["bcbs-hmo", "uhc-nav", "aetna-pos"],
        badges: ["Telehealth Only"]
    },
    {
        id: "dr-7",
        name: "Sarah Patel",
        specialty: "OB-GYN",
        rating: 4.90,
        reviewCount: 445,
        reviews: [],
        distance: "1.5 mi",
        address: "202 Women's Health Dr",
        zipCode: "10002",
        nextAvailable: "Tomorrow",
        slots: ["10:15 AM", "11:45 AM"],
        avatar: "",
        insurancePlans: ["aetna-hmo", "bcbs-blue-choice", "cigna-connect"],
        badges: []
    },
    {
        id: "dr-8",
        name: "Michael Ross",
        specialty: "Chiropractor",
        rating: 4.65,
        reviewCount: 89,
        reviews: [],
        distance: "0.9 mi",
        address: "10 Spine St",
        zipCode: "10001",
        nextAvailable: "Today",
        slots: ["3:00 PM", "3:30 PM", "4:00 PM"],
        avatar: "",
        insurancePlans: ["cigna-local", "uhc-choice"],
        badges: []
    },
    {
        id: "dr-9",
        name: "Elena Rodriguez",
        specialty: "Opthamologist",
        rating: 4.95,
        reviewCount: 112,
        reviews: [],
        distance: "1.0 mi",
        address: "50 Vision Way, Suite 200",
        zipCode: "10002",
        nextAvailable: "Tomorrow",
        slots: ["10:00 AM", "1:30 PM", "3:00 PM"],
        avatar: "",
        insurancePlans: ["aetna-ppo", "bcbs-blue-choice", "uhc-choice", "cigna-ppo"],
        badges: ["Top Eye Doctor"]
    },
    {
        id: "dr-10",
        name: "Alan Grant",
        specialty: "Pediatrician",
        rating: 4.98,
        reviewCount: 654,
        reviews: [],
        distance: "2.5 mi",
        address: "100 Kid Care Ln",
        zipCode: "10005",
        nextAvailable: "Today",
        slots: ["9:00 AM", "11:15 AM", "4:00 PM"],
        avatar: "",
        insurancePlans: ["aetna-hmo", "bcbs-hmo", "united-choice"],
        badges: ["Family Favorite"]
    },
    {
        id: "dr-11",
        name: "William Chen",
        specialty: "Dentist",
        rating: 4.82,
        reviewCount: 330,
        reviews: [],
        distance: "0.4 mi",
        address: "123 Smile Blvd",
        zipCode: "10001",
        nextAvailable: "Today",
        slots: ["2:00 PM", "2:30 PM", "3:30 PM"],
        avatar: "",
        insurancePlans: ["aetna-ppo", "cigna-local", "uhc-nav"],
        badges: []
    },
    {
        id: "dr-12",
        name: "Lisa Cuddy",
        specialty: "Primary Care Doctor",
        rating: 4.78,
        reviewCount: 412,
        reviews: [],
        distance: "1.6 mi",
        address: "555 Wellness Ave",
        zipCode: "10003",
        nextAvailable: "Feb 10",
        slots: ["8:30 AM", "9:00 AM"],
        avatar: "",
        insurancePlans: ["bcbs-federal", "cigna-connect", "aetna-medicare"],
        badges: []
    },
    {
        id: "dr-13",
        name: "Sarah Connor",
        specialty: "Cardiologist",
        rating: 4.91,
        reviewCount: 189,
        reviews: [],
        distance: "3.5 mi",
        address: "77 Heartbeat Rd",
        zipCode: "10006",
        nextAvailable: "Feb 14",
        slots: ["10:00 AM", "11:30 AM"],
        avatar: "",
        insurancePlans: ["aetna-ppo", "bcbs-blue-choice", "uhc-nexus"],
        badges: ["Renowned Specialist"]
    }
];
