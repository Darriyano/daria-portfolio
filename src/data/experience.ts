export interface Milestone { id: string; title: string; desktop: [number, number]; mobile: [number, number]; side: 'left' | 'right'; noteHeading?: string; details?: string }
// Verbatim headings and descriptions from the dedicated note collection 233:13455.
export const experienceNotes: Record<string, { noteHeading: string; details: string }> = {
  // Additional current desktop note, adjacent to the collection: 236:745.
  future: { noteHeading: 'I CAN’T PREDICT IT,\nBUT...', details: 'I hope to work internationally as a designer and earn a master’s degree or a PhD. I’d love people to play my games and use my interfaces every day!' },
  school: { noteHeading: 'PHYSICS & MATHS\nHIGH SCHOOL NO. 146', details: 'I passed a two-stage entrance exam, studied maths and physics, and took part in school hackathons and olympiads in maths, English and literature' },
  bachelor: { noteHeading: 'INNOPOLIS UNIVERSITY:\nDATA SCIENCE & AI', details: 'I studied tuition-free after passing entrance exams, earned a 4.2+ GPA and a diploma in AI, UX and game development, and served as a university ambassador and representative' },
  development: { noteHeading: 'PERSONAL\nDEVELOPMENT', details: 'Research, startup collaborations and hackathons helped me find my path: UX/UI design, combining my interest in human psychology with design' },
  industrial: { noteHeading: 'PRODUCT DESIGNER\nAT SEVERSTAL', details: 'I joined one of the largest metals companies in the CIS and grew from a junior to a mid-level product designer in two years' },
  gamedev: { noteHeading: '2D ARTIST\nIN GAME DEVELOPMENT', details: 'I turned a hobby into a second job with a Moscow studio. Our games were featured at Tokyo Game Show, and I’m now creating my own game' },
  internship: { noteHeading: 'DESIGN INTERN\nAT TEN.LAB', details: 'After winning a local hackathon, I joined Ten.lab, a VR company in Perm, as a design intern while finishing school and preparing for university' },
  hackathons: { noteHeading: 'UNIVERSITY TEAM\n& HACKATHONS', details: 'As a React frontend developer, I competed with my university team in T1, InnoGlobalHack and SberHack, winning prizes for our solutions' },
  horizons: { noteHeading: 'WHO AM I?\nJUST A GIRL', details: 'I enjoy travelling, photography and sport. Learning Italian. In my spare time, I create and sell illustrations and support animal shelters and children with illnesses.' },
  speaker: { noteHeading: 'PITERUX\nREGULAR SPEAKER', details: 'I share my professional experience at industry meetups and hope to grow my personal brand' },
}
export const milestones: Milestone[] = [
  { id: 'school', title: 'HIGH SCHOOL\n(2023)', desktop: [251, 173], mobile: [199.5, 237.5], side: 'left' },
  { id: 'bachelor', title: 'BACHELOR DEGREE\n(2023–2027)', desktop: [512, 136], mobile: [217, 433.14], side: 'left' },
  { id: 'industrial', title: 'INDUSTRIAL EXPERIENCE\n(2024–NOW)', desktop: [881, 243], mobile: [140.55, 677.5], side: 'right' },
  { id: 'development', title: 'PERSONAL\nDEVELOPMENT', desktop: [686, 282], mobile: [161.74, 875.5], side: 'left' },
  { id: 'gamedev', title: 'GAME DEV 2D ARTIST\n(2025–NOW)', desktop: [1110, 360], mobile: [98.18, 1107.5], side: 'right' },
  { id: 'future', title: 'FUTURE…', desktop: [1373, 250], mobile: [158.05, 1373.5], side: 'right' },
]
export const experienceAnnotations: Milestone[] = [
  { id: 'internship', title: 'FIRST INTERNSHIP\n(2022)', desktop: [20, 104], mobile: [166, 80], side: 'left' },
  { id: 'hackathons', title: 'HACKATHONS\nAS A FRONTEND DEV (2023-2024)', desktop: [335, 17], mobile: [188, 575], side: 'left' },
  { id: 'horizons', title: 'BROADENING HORIZONS', desktop: [1021, 43], mobile: [0, 550], side: 'left' },
  { id: 'speaker', title: 'PROFESSIONAL\nSPEAKER SKILLS (2025-NOW)', desktop: [674, 395], mobile: [163, 990], side: 'left' },
]
// Exact vector geometry read from Figma; desktop and mobile paths are independent.
export const desktopPath = 'M 0 266 C 47.0613 236.8873 73.4466 220.5649 120.5079 191.4522 L 250.8935 37.2739 L 511.6647 0 L 685.5122 145.707 L 881.0906 106.7389 L 1110.2532 223.6433 L 1373 113.5159'
export const mobilePath = 'M 109 10 L 199.4995 237.5 L 217 433.1431 L 140.5522 677.5 L 161.7364 875.5 L 98.1837 1107.5 L 158.0522 1373.5'
