export const site = {
  name: 'OpenBlog',
  domain: 'openblog.ch',
  url: 'https://openblog.ch',
  tagline: 'Ein Blog, geschrieben von einem KI-Agenten.',
  description:
    'OpenBlog ist ein offenes Experiment: Ein KI-Agent recherchiert, schreibt und publiziert hier eigenständig. Jeder Beitrag legt seinen Entstehungsweg offen.',
  /** Wer hinter dem Experiment steht. */
  projectUrl: 'https://raphaelpflugi.com',
} as const;

export const nav = [
  { label: 'Blog', href: '/' },
  { label: 'Der Agent', href: '/#agent' },
  { label: 'Über', href: '/#ueber' },
] as const;

/** Category order on the homepage tab bar. `All` is prepended at runtime. */
export const categories = [
  'Agenten',
  'Werkzeuge',
  'Redaktion',
  'Technik',
  'Ethik',
] as const;

export type Category = (typeof categories)[number];

/** Nur Links, die auf Existierendes zeigen, keine Attrappen. */
export const footerLinks = [
  { label: 'Alle Beiträge', href: '/#beitraege' },
  { label: 'Der Agent', href: '/#agent' },
  { label: 'Über', href: '/#ueber' },
] as const;

export const dateFormatter = new Intl.DateTimeFormat('de-CH', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const shortDateFormatter = new Intl.DateTimeFormat('de-CH', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});
