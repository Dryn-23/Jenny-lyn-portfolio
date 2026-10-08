/**
 * site.js — single source of truth for personal details, nav, skills and journey chapters.
 * Everything here is content, not layout. Edit freely; components read from it.
 */

export const site = {
  name: "Jenny-lyn Ibañez ",
  logo: "Jenny-lyn's Portfolio",
  role: "BSIT Student & Aspiring Developer",
  tagline: "Built with curiosity, creativity, and code.",
  location: "Bulacan, Philippines",
  year: 2026,
};

/** Sticky navigation. `id` must match the section element id. */
export const navLinks = [
  { id: 'home', label: 'Home' },
  { id: 'journey', label: 'Journey' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

/** Story chapters — rendered on the animated timeline. */
export const chapters = [
  {
    number: '01',
    title: 'Where It Started',
    paragraphs: [
      "It all began with curiosity. I wanted to know how the websites and apps I use every day actually work — where the buttons live, how data travels, why some pages feel effortless.",
      "That curiosity is why I chose BSIT. I wanted to stop being only a user of technology and start becoming someone who builds it, one small project at a time.",
    ],
    illustration: '/illustrations/where-it-started.jpg',
    illustrationAlt: 'A cozy desk by a window with a laptop, notebooks, and a potted plant',
    note: { text: 'Curiosity,\nthen code.', rotate: -6, position: 'right' },
  },
  {
    number: '02',
    title: "What I'm Learning",
    paragraphs: [
      "Right now I'm learning the fundamentals properly — clean HTML and CSS, JavaScript logic, Python, and Java. I build small things often, so the lessons actually stick.",
      "I'm also getting comfortable with the tools of the trade: Git, GitHub, and a code editor that feels like home.",
    ],
    illustration: '/illustrations/learning-desk.jpg',
    illustrationAlt: 'An illustrated laptop, notebook, mug and plants on a table',
    note: { text: 'Better skills,\nbrighter future.', rotate: 5, position: 'right' },
  },
  {
    number: '03',
    title: 'Things I Create',
    paragraphs: [
      "Every project teaches me something new. From simple pages to functional systems, I keep building because that's where the real learning happens.",
      "I'm proud of how far I've come — and genuinely excited about whatever comes next.",
    ],
    illustration: null,
    note: { text: 'Small steps,\nreal progress.', rotate: -5, position: 'left' },
    cta: { label: 'See my projects', target: 'projects' },
  },
  {
    number: '04',
    title: "What's Next?",
    paragraphs: [
      "My goal is simple to say and fun to chase: get seriously better at programming, web development, and software engineering.",
      "Next up — deeper JavaScript and React, a real backend, databases, and eventually a capstone project I'll be proud to show anyone.",
    ],
    illustration: null,
    note: { text: 'Progress,\nnot perfection.', rotate: 6, position: 'left' },
  },
];

/** Skill groups — rendered as rounded tags/cards with soft hover animations. */
export const skillGroups = [
  {
    id: 'structure',
    label: 'Structure & Styling',
    caption: 'Turning layouts into living pages.',
    icon: 'layout',
    skills: [
      { name: 'HTML', level: 'Comfortable' },
      { name: 'CSS', level: 'Comfortable' },
    ],
  },
  {
    id: 'logic',
    label: 'Language & Logic',
    caption: 'Where the problem-solving happens.',
    icon: 'code',
    skills: [
      { name: 'JavaScript', level: 'Learning' },
      { name: 'Python', level: 'Learning' },
      { name: 'Java', level: 'Learning' },
      { name: 'C#', level: 'Exploring' },
    ],
  },
  {
    id: 'build',
    label: 'Frameworks & Data',
    caption: 'Building full experiences, front to back.',
    icon: 'layers',
    skills: [
      { name: 'React', level: 'Learning' },
      { name: 'Node.js', level: 'Exploring' },
      { name: 'MongoDB', level: 'Exploring' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Workflow',
    caption: 'The everyday essentials.',
    icon: 'git',
    skills: [
      { name: 'Git', level: 'Comfortable' },
      { name: 'GitHub', level: 'Comfortable' },
    ],
  },
];

/** Everything else worth knowing — shown as a friendly side-list. */
export const softSkills = [
  'Problem Solving',
  'UI Curiosity',
  'Teamwork',
  'Documentation',
  'Responsive Design',
  'Attention to Detail',
];
