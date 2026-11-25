export type PhoneNumber = {
  id: string;
  number: string;
  label: string;
  routedTo: string;
  type: NumberType;
  active: boolean;
};

export type NumberType = "Mobile" | "Landline";

/** Sample data matching the design. Replace with a real data source later. */
export const phoneNumbers: PhoneNumber[] = [
  { id: "1", number: "+45 29 47 58 63", label: "Main Sales", routedTo: "Sales", type: "Landline", active: true },
  { id: "2", number: "+45 31 82 74 19", label: "Main Customer support", routedTo: "Customer support", type: "Mobile", active: false },
  { id: "3", number: "+45 40 56 23 87", label: "Las Sabir Main", routedTo: "Las Sabir", type: "Landline", active: true },
  { id: "4", number: "+45 22 91 45 30", label: "Voicemail Only", routedTo: "Voicemail", type: "Mobile", active: false },
  { id: "5", number: "+45 38 67 12 54", label: "Prantos’ Main", routedTo: "Pranto Kumar", type: "Landline", active: true },
  { id: "6", number: "+45 27 84 39 61", label: "Main Customer support", routedTo: "Customer support", type: "Mobile", active: false },
  { id: "7", number: "+45 33 19 72 48", label: "Patricks’ Main", routedTo: "Patrick Andre", type: "Landline", active: true },
  { id: "8", number: "+45 26 53 80 17", label: "Voicemail V2", routedTo: "Voicemail", type: "Mobile", active: false },
  { id: "9", number: "+45 35 68 41 29", label: "Anams’ Personal", routedTo: "Anam", type: "Landline", active: true },
  { id: "10", number: "+45 30 72 56 84", label: "New number", routedTo: "--", type: "Mobile", active: false },
];

export type AvailableNumber = {
  id: string;
  number: string;
  type: NumberType;
  /** Monthly price in DKK. */
  price: number;
};

/** Numbers offered in the "Add new number" popup. Replace with the provider's inventory later. */
export const availableNumbers: AvailableNumber[] = (
  [
    ["+45 41 26 88 03", "Mobile"],
    ["+45 41 26 88 14", "Mobile"],
    ["+45 41 26 88 27", "Mobile"],
    ["+45 41 26 88 35", "Mobile"],
    ["+45 32 14 60 02", "Landline"],
    ["+45 41 26 88 49", "Mobile"],
    ["+45 32 14 60 18", "Landline"],
    ["+45 41 26 88 56", "Mobile"],
    ["+45 41 26 88 71", "Mobile"],
    ["+45 32 14 60 29", "Landline"],
  ] as const
).map(([number, type], i) => ({ id: `available-${i + 1}`, number, type, price: 8 }));
