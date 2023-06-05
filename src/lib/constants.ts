interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
}

export const siteConfig: SiteConfig = {
  name: "Quirk",
  description:
    "Build full-stack web apps using React and Cloudflare Pages/Functions",
  url: "",
  ogImage: "",
  links: {
    twitter: "https://twitter.com/bachiitter",
    github: "https://github.com/bachiitter/quirk",
  },
};
