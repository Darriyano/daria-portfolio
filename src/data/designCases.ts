import { assetUrl } from '../utils/assetUrl'
import type { PortfolioProject } from '../types/portfolio'

// Current desktop text and media; explicit frame numbering defines slide order.
export const designCases = [
  {
    "id": "allforms",
    "projectId": "allforms",
    "sourceNodeId": "160:2746",
    "slideOrder": "03.1",
    "title": "AllForms (2026)",
    "category": "product-design",
    "contributions": [
      {
        "label": "The brief",
        "text": "An internal corporate product created to replace external services such as AhaSlides with an in-house solution tailored to company needs"
      },
      {
        "label": "My approach",
        "text": "I conducted 10 interviews with teams across the company to identify recurring needs, workflows and constraints, then translated the findings into a solution built around the platform’s existing UI kit"
      },
      {
        "label": "What I delivered",
        "text": "Research synthesis and production-ready Figma prototypes based on Ant Design, including design tokens, company-specific themes, responsive states and edge cases"
      }
    ],
    "previewMedia": [
      {
        "src": assetUrl("/assets/43e9b.png"),
        "alt": "AllForms (2026) — laptop mockup",
        "type": "image"
      }
    ],
    "presentationVariant": "desktop-mockup",
    "responsivePresentation": {
      "tablet": "desktop-mockup",
      "mobile": "desktop-mockup"
    },
    "laptopScreen": assetUrl("/assets/allforms-2026-screen.png")
  },
  {
    "id": "minigarden",
    "projectId": "minigarden",
    "sourceNodeId": "160:2554",
    "slideOrder": "03.2",
    "title": "MiniGarden (2025)",
    "category": "product-design",
    "contributions": [
      {
        "label": "The brief",
        "text": "A brief from a Russian startup to design a mobile product that brings gardeners together in one community and helps them exchange knowledge and experience"
      },
      {
        "label": "My approach",
        "text": "I researched the target audience and their needs, reviewed competing and adjacent products, and used those findings to define the visual direction and key user flows before prototyping"
      },
      {
        "label": "What I delivered",
        "text": "Key mobile flows, light and dark logo versions, Figma design tokens and a reusable local design system prepared for development"
      }
    ],
    "previewMedia": [
      {
        "src": assetUrl("/assets/5d80f.png"),
        "alt": "MiniGarden (2025) — first app screen in iPhone mockup",
        "type": "image"
      },
      {
        "src": assetUrl("/assets/43f2e.png"),
        "alt": "MiniGarden (2025) — second app screen in iPhone mockup",
        "type": "image"
      }
    ],
    "presentationVariant": "mobile-mockups",
    "responsivePresentation": {
      "tablet": "mobile-mockups",
      "mobile": "mobile-mockups"
    },
    "phoneScreens": true
  },
  {
    "id": "vk-hackathon",
    "projectId": "vk-hackathon",
    "sourceNodeId": "224:921",
    "slideOrder": "03.3",
    "title": "VK HACKATHON (2025)",
    "category": "product-design",
    "contributions": [
      {
        "label": "The brief",
        "text": "A brief from VKontakte to design a platform for IT teams to track employees’ skills, professional development and social interactions"
      },
      {
        "label": "My approach",
        "text": "Working within a 3–4 hour design window, I clarified the product concept, prioritised the core flows and built the interface using VK’s existing components, typography and visual language"
      },
      {
        "label": "What I delivered",
        "text": "I designed the key product flows and screens and implemented them as a React prototype. Our team finished in third place"
      }
    ],
    "previewMedia": [
      {
        "src": assetUrl("/assets/43e9b.png"),
        "alt": "VK HACKATHON (2025) — laptop mockup",
        "type": "image"
      }
    ],
    "presentationVariant": "desktop-mockup",
    "responsivePresentation": {
      "tablet": "desktop-mockup",
      "mobile": "desktop-mockup"
    },
    "laptopScreen": assetUrl("/assets/vk-hackathon-screen.png")
  },
  {
    "id": "matematch",
    "projectId": "matematch",
    "sourceNodeId": "224:813",
    "slideOrder": "03.4",
    "title": "MateMatch (2024)",
    "category": "product-design",
    "contributions": [
      {
        "label": "The brief",
        "text": "A mobile product concept designed to help university students find compatible roommates based on preferences and lifestyle — a matching experience inspired by dating apps"
      },
      {
        "label": "My approach",
        "text": "I explored roommate-matching and social products, analysed common interaction patterns, developed a shared visual direction and translated the concept into the core matching and profile flows"
      },
      {
        "label": "What I delivered",
        "text": "Interactive Figma prototypes and reusable components covering the key states of the matching and profile experience"
      }
    ],
    "previewMedia": [
      {
        "src": assetUrl("/assets/86c2e.png"),
        "alt": "MateMatch (2024) — first app screen in iPhone mockup",
        "type": "image"
      },
      {
        "src": assetUrl("/assets/43c89.png"),
        "alt": "MateMatch (2024) — second app screen in iPhone mockup",
        "type": "image"
      }
    ],
    "presentationVariant": "mobile-mockups",
    "responsivePresentation": {
      "tablet": "mobile-mockups",
      "mobile": "mobile-mockups"
    },
    "phoneScreens": true
  },
  {
    "id": "vita",
    "projectId": "vita",
    "sourceNodeId": "224:985",
    "slideOrder": "03.5",
    "title": "Vita (2024)",
    "category": "product-design",
    "contributions": [
      {
        "label": "The brief",
        "text": "A brief from a small university startup to design a mobile tracking app with an integrated AI assistant"
      },
      {
        "label": "My approach",
        "text": "I explored existing tracking and AI-assisted products, analysed common interaction patterns and used those insights to define the visual direction and core mobile flows"
      },
      {
        "label": "What I delivered",
        "text": "Figma prototypes, reusable components covering the main interface states, and a distinctive visual language spanning both the tracking and AI-assistant experiences"
      }
    ],
    "previewMedia": [
      {
        "src": assetUrl("/assets/2a915.png"),
        "alt": "Vita (2024) — first app screen in iPhone mockup",
        "type": "image"
      },
      {
        "src": assetUrl("/assets/c6356.png"),
        "alt": "Vita (2024) — second app screen in iPhone mockup",
        "type": "image"
      }
    ],
    "presentationVariant": "mobile-mockups",
    "responsivePresentation": {
      "tablet": "mobile-mockups",
      "mobile": "mobile-mockups"
    },
    "phoneScreens": true
  }
] satisfies PortfolioProject[]