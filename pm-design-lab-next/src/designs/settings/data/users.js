/** Stand-in photo cropped from the design mock. Swap in real photos per user. */
export const PLACEHOLDER_PHOTO = "/avatars/placeholder.png";
/** Users the design shows with a photo; everyone else gets initials. */
const withPhoto = new Set([
  "Las sabir",
  "Pranto Kumar",
  "Patrick Andre",
  "Rahat Kabir",
  "Adam James",
  "Anas Ahmed",
  "Jhon Doe",
]);
const joined = (lastLogin) => (lastLogin ? "22 May, 2026" : null);
/** Sample data matching the design. Replace with a real data source later. */
export const users = [
  ["Las sabir", "alice.martin@example.com", null],
  ["Sebastian", "benjamin.lee@domain.net", "19h 24m ago"],
  ["Pranto Kumar", "clara.jones@mailservice.org", null],
  ["Patrick Andre", "daniel.smith@webmail.com", "19h 24m ago"],
  ["Rahat Kabir", "emily.watson@inbox.co", null],
  ["Adam James", "frank.thomas@mailer.io", "19h 24m ago"],
  ["Ashikur Rahman", "grace.hill@postbox.net", "19h 24m ago"],
  ["Anas Ahmed", "henry.evans@fastmail.com", "19h 24m ago"],
  ["Jhon Doe", "isabella.moore@netmail.org", null],
  ["Hoblos Salah", "jackson.brown@cloudmail.co", "19h 24m ago"],
].map(([name, email, lastLogin], i) => ({
  id: String(i + 1),
  name,
  email,
  lastLogin,
  memberSince: joined(lastLogin),
  photo: withPhoto.has(name) ? PLACEHOLDER_PHOTO : undefined,
}));
/** Look up a person's photo by name (case-insensitive), e.g. for avatar stacks. */
export const photoFor = (name) => users.find((u) => u.name.toLowerCase() === name.toLowerCase())?.photo;
