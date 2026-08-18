export const siteConfig = {
  /** Wordmark shown in the header and footer. Monograph uses text, never a logo image. */
  name: "tedm.dev",
  tagline: "Software development & security research",
  title: "tedm.dev - Ted Mathew dela Cruz",
  description:
    "Bug bounty writeups, software development notes, and security research by Ted Mathew dela Cruz.",
  siteUrl: "https://tedm.dev",
  authorName: "Ted Mathew dela Cruz",
  email: "tedmathewdelacruz@gmail.com",
  language: "en",
  dateLocale: "en-US",
  locale: "en_US",
  socialImage: "/og-image.png",
  /** Shown in the home sidebar "About" card. */
  about:
    "Notes on software development, bug bounty writeups, and security research.",
  /**
   * Both forms below ship enabled with an empty `action`, which makes them fully
   * interactive demos that submit nowhere: a small script confirms the submit
   * and clears the fields. Paste your provider's endpoint into `action` to send
   * real submissions, or set `enabled: false` to disable the controls outright.
   */
  newsletter: {
    enabled: false,
    action: "",
    method: "post",
    emailFieldName: "email",
    title: "Get new posts by email",
    description: "One email when something new goes up. No spam, unsubscribe anytime.",
  },
  contact: {
    enabled: true,
    action: "",
    method: "post",
    responseTime: "Replies usually go out within two business days.",
  },
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/tedmdelacruz/" },
    { label: "GitHub", href: "https://github.com/tedmdelacruz" },
  ],
};

/** Header navigation. Add or remove entries freely; the header renders them in order. */
export const navigation = [
  { label: "Archive", href: "/posts/" },
  { label: "Categories", href: "/categories/" },
  { label: "About", href: "/about/" },
];

/** Secondary navigation rendered in the footer. */
export const footerNavigation = [
  { label: "Contact", href: "/contact/" },
];
