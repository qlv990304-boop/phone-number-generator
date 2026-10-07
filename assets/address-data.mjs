export const DATASET_VERSION = "2026-10-07";

// City/state/ZIP presets only. No real street, resident, or mailbox data.
export const LOCATIONS = Object.freeze([
  { id: "los-angeles", city: "Los Angeles", state: "CA", stateName: "California", postalCode: "90012", source: "https://clerk.lacity.gov/contact-us" },
  { id: "seattle", city: "Seattle", state: "WA", stateName: "Washington", postalCode: "98104", source: "https://www.seattle.gov/council/meetings/visiting-city-hall" },
  { id: "philadelphia", city: "Philadelphia", state: "PA", stateName: "Pennsylvania", postalCode: "19107", source: "https://www.phila.gov/departments/philly311/" },
  { id: "birmingham", city: "Birmingham", state: "AL", stateName: "Alabama", postalCode: "35203", source: "https://www.birminghamal.gov/contact-city-birmingham" },
  { id: "nashville", city: "Nashville", state: "TN", stateName: "Tennessee", postalCode: "37201", source: "https://www.nashville.gov/departments/metro-clerk/contact-us" }
].map(Object.freeze));

export const STREETS = Object.freeze([
  "Example Laurel St", "Example Cedar Ave", "Example Harbor Rd", "Example Valley Dr",
  "Test Maple Ln", "Sample Oak Ct", "Demo Willow Way", "Example Juniper Pl"
]);
