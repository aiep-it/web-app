import { USER_ROLE } from "@/constant/authorProtect";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Next.js + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
      roleAccess: [USER_ROLE.ALL]
    },
    {
      label: "Learn Vocabulary",
      href: "/learn-vocabulary",
      roleAccess: [USER_ROLE.STUDENT]
    },
    {
      label: "My Workspace",
      href: "/my-workspace",
      roleAccess: [USER_ROLE.STUDENT]
    },
    // {
    //   label: "Pricing",
    //   href: "/pricing",
    // },
    {
      label: "Class Room",
      href: "/class-room",
      roleAccess: [USER_ROLE.STUDENT, USER_ROLE.TEACHER]
    },
    {
      label: "My Report",
      href: "/report/me",
      roleAccess: [USER_ROLE.STUDENT]
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Learn Vocabulary",
      href: "/learn-vocabulary",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
