import { contactSchema } from "@/lib/contact-schema";
import { budgetOptions, services, timelineOptions } from "@/data/services";
import { processSteps, technologies } from "@/data/home";
import { site } from "@/config/site";

/**
 * Rule-based conversation engine for the website assistant. No external AI
 * service: it reads free text, fills in project details wherever they appear in
 * a sentence, answers common questions, and keeps asking for what is missing.
 */

export type Asking =
  | null
  | "offerStart"
  | "service"
  | "message"
  | "more"
  | "budget"
  | "timeline"
  | "name"
  | "email"
  | "confirm";

export type Lead = {
  service?: string;
  message?: string;
  /** "" means the visitor skipped it. */
  budget?: string;
  timeline?: string;
  name?: string;
  email?: string;
};

export type Brain = {
  lead: Lead;
  asking: Asking;
  turns: number;
  moreAsked: boolean;
  fails: number;
};

export type Reply = { brain: Brain; say: string[]; chips: string[]; send?: boolean };

export const initialBrain = (): Brain => ({ lead: {}, asking: null, turns: 0, moreAsked: false, fails: 0 });

export const OPENING = [
  "Hi, I'm the NMN.DEV assistant.",
  "Ask me anything about what we build, or just tell me about your project and I'll pass it to the team.",
];
export const MENU_CHIPS = ["What do you build?", "How does it work?", "How much does it cost?", "I have a project"];

/* ---------- small helpers ---------- */

const rot = <T,>(arr: T[], n: number): T => arr[n % arr.length];
const firstName = (n?: string) =>
  (n?.split(" ").filter((w) => !/^(dr|mr|mrs|ms|miss|prof|shri|smt|sir)\.?$/i.test(w))[0] ?? n?.split(" ")[0] ?? "");
const titleCase = (s: string) =>
  s.toLowerCase().replace(/(^|[\s.'-])([a-z])/g, (_, a: string, b: string) => a + b.toUpperCase());
const messageOk = (s: string) => contactSchema.shape.message.safeParse(s).success;

const RE = {
  yes: /^\s*(y|yes|yeah|yep|yup|yea|sure|ok|okay|ofc|of course|please do|go ahead|send( it)?( now)?|confirm|looks good|correct|that'?s right|sounds good|perfect|do it|yes please|try again|retry)\b/i,
  no: /^\s*(n|no|nope|nah|not (now|yet)|change|edit|wait|wrong|incorrect|actually)\b/i,
  skip: /^\s*(skip|pass|none|not sure|don'?t know|dont know|no idea|later|n\/?a|prefer not|rather not|no budget|not decided|undecided|decide later)\b/i,
  nothingMore: /^\s*(no|nope|nah|nothing( else| more)?|that'?s (all|it)|that is (all|it)|all good|none|skip|done)\b/i,
  greet: /^\s*(hi+|hello+|hey+|heya|yo|namaste|hola|good (morning|afternoon|evening))\b/i,
  start:
    /\b(start (a |my |the )?project|get started|let'?s (start|begin|build|talk)|hire (you|nmn)|work with (you|nmn)|want to (build|make|create|develop|start|get|order)|i (want|need|would like|'d like|wanna)|need (a|an|some|help)|looking (for|to)|can you (build|make|create|develop|design)|build (me|us|a|an)|make (me|us) (a|an)|interested in|planning (to|a|an)|i have a (project|idea))\b/i,
  projecty: /\b(want|need|build|make|create|develop|looking|planning|launch|my (business|startup|company|shop|store|brand|idea|clinic|gym|restaurant))\b/i,
};

/* ---------- field extraction ---------- */

const SERVICE_ORDER: [string, RegExp][] = [
  ["saas-development", /\b(saas|subscription (app|product|platform)|multi-?tenant|mvp|startup (product|app))\b/i],
  ["ecommerce-development", /\b(e-?commerce|online (store|shop)|web ?shop|shopify|woocommerce|sell (my )?(products|items|goods)( online)?|sell online)\b/i],
  ["api-automation", /\b(apis?|automation|automate|integrations?|webhooks?|workflows?|bots?|scraper|scraping|zapier)\b/i],
  ["custom-software", /\b(custom software|internal tool|crm|erp|management (system|software)|inventory|billing software|desktop (app|software))\b/i],
  ["web-applications", /\b(web ?app(lication)?s?|dashboard|portal|booking (system|app|site|website)|admin panel|platform)\b/i],
  ["website-development", /\b(web ?sites?|landing pages?|portfolio (site|website)|business (site|website)|redesign|brochure|company (site|website))\b/i],
];

function detectService(text: string): string | undefined {
  for (const [slug, re] of SERVICE_ORDER) {
    if (re.test(text)) return services.find((s) => s.slug === slug)?.formValue;
  }
  return undefined;
}

function serviceFromAnswer(text: string): string | undefined {
  const t = text.trim().toLowerCase();
  const exact = services.find((s) => s.title.toLowerCase() === t || s.formValue.toLowerCase() === t);
  if (exact) return exact.formValue;
  const found = detectService(text);
  if (found) return found;
  if (/\b(shop|store|sell|selling|products?)\b/i.test(text)) return services.find((s) => s.slug === "ecommerce-development")?.formValue;
  if (/\b(site|page|blog)\b/i.test(text)) return services.find((s) => s.slug === "website-development")?.formValue;
  if (/\b(app|application|software|system|tool)\b/i.test(text)) return services.find((s) => s.slug === "web-applications")?.formValue;
  if (/\b(other|something else|not sure|don'?t know|dunno|different|none of)\b/i.test(text)) return "Other";
  return undefined;
}

const WORD_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  fifteen: 15, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90,
};
const wordsToDigits = (t: string) =>
  t.replace(
    /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[ -](one|two|three|four|five|six|seven|eight|nine)\b|\b(one|two|three|four|five|six|seven|eight|nine|ten|fifteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/g,
    (_m, tens: string | undefined, ones: string | undefined, single: string | undefined) =>
      String(tens ? WORD_NUM[tens] + WORD_NUM[ones as string] : WORD_NUM[single as string]),
  );

function bucketBudget(inr: number): string {
  if (inr < 10000) return budgetOptions[0];
  if (inr <= 25000) return budgetOptions[1];
  if (inr <= 50000) return budgetOptions[2];
  if (inr <= 100000) return budgetOptions[3];
  return budgetOptions[4];
}

function parseBudget(raw: string, force: boolean): string | undefined {
  const t = wordsToDigits(raw.toLowerCase());
  const hasWord = /\bbudget\b/.test(t);
  if (/\b(not (sure|decided)|don'?t know|no idea|flexible|open to suggestions|undecided|tbd)\b/.test(t) && (force || hasWord)) {
    return "Not decided";
  }
  const re = /(₹|rs\.?|inr|\$|usd)?\s*(\d[\d,]*(?:\.\d+)?)\s*(k|thousand|lakhs?|lacs?|crores?|cr)?\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const cur = m[1];
    const unit = m[3];
    if (!cur && !unit && !force && !hasWord) continue;
    let v = parseFloat(m[2].replace(/,/g, ""));
    if (Number.isNaN(v)) continue;
    if (unit) {
      v *= /^(k|thousand)$/.test(unit) ? 1e3 : /^(lakh|lac)/.test(unit) ? 1e5 : 1e7;
    } else if (v < 1000 && !cur) {
      continue; // a bare small number is not a budget
    }
    if (cur === "$" || cur === "usd") v *= 85;
    return bucketBudget(v);
  }
  return undefined;
}

function parseTimeline(raw: string, force: boolean): string | undefined {
  const t = wordsToDigits(raw.toLowerCase());
  if (/\b(asap|urgent(ly)?|immediately|right away|as soon as possible|this week|few days|tomorrow)\b/.test(t)) {
    return timelineOptions[0];
  }
  if (/\b(this month|next month|within a month|in a month)\b/.test(t)) return timelineOptions[1];
  if (/\b(next year|few months|several months|six months|6 months)\b/.test(t)) return timelineOptions[3];
  if (/\bcouple of months\b/.test(t)) return timelineOptions[2];
  const m = t.match(/(\d+)\s*(?:-|–|to)?\s*(\d+)?\s*(day|week|month)s?\b/);
  if (m) {
    const n = parseInt(m[2] ?? m[1], 10);
    const days = m[3] === "day" ? n : m[3] === "week" ? n * 7 : n * 30;
    if (days <= 30) return timelineOptions[1];
    if (days <= 95) return timelineOptions[2];
    return timelineOptions[3];
  }
  if (/\b(flexible|no rush|no hurry|whenever|not urgent|open)\b/.test(t) && (force || /timeline|deadline/.test(t))) {
    return timelineOptions[4];
  }
  return undefined;
}

const NAME_STOP = new Set([
  "looking", "interested", "planning", "here", "from", "building", "want", "need", "trying", "just", "also", "not", "so",
  "a", "an", "the", "working", "going", "thinking", "currently", "owner", "founder", "developer", "student", "new", "sure",
  "ok", "okay", "fine", "good", "great", "happy", "glad", "wondering", "curious", "in", "at", "with", "using", "based",
  "running", "starting", "and", "but", "&", "for", "to", "done", "ready", "wanting", "hoping", "asking",
  "yes", "no", "skip", "hi", "hello", "hey", "asap", "urgent", "later", "flexible", "none", "maybe", "idk", "nothing", "what", "why", "how", "when", "where", "who", "can", "do", "does", "price", "cost",
]);

function cleanName(words: string[]): string | undefined {
  const out: string[] = [];
  for (const w of words) {
    if (NAME_STOP.has(w.toLowerCase())) break;
    out.push(w);
    if (out.length === 3) break;
  }
  if (!out.length) return undefined;
  const name = titleCase(out.join(" ").replace(/[^A-Za-z.'\- ]/g, "").trim());
  return name.length >= 2 ? name : undefined;
}

function extractName(text: string, force: boolean): string | undefined {
  const t = text.trim();
  if (force) {
    const stripped = t
      .replace(/^(?:my name(?: is|'s)?|i am|i'm|im|this is|call me|name(?: is|:)|it'?s|myself)\s+/i, "")
      .replace(/[.!,]+$/, "");
    if (/@|\d/.test(stripped) || stripped.split(/\s+/).length > 4) return undefined;
    return cleanName(stripped.split(/\s+/));
  }
  const strong = t.match(/\b(?:my name(?: is|'s)?|call me|name(?: is|:)|myself)\s+([A-Za-z][A-Za-z.'-]*(?:\s+[A-Za-z][A-Za-z.'-]*){0,2})/i);
  if (strong) return cleanName(strong[1].split(/\s+/));
  const soft = t.match(/\b(?:[Ii] am|[Ii]'m|[Ii]m|[Tt]his is|[Ii]t'?s)\s+([A-Z][A-Za-z.'-]*(?:\s+[A-Z][A-Za-z.'-]*){0,2})/);
  if (soft) return cleanName(soft[1].split(/\s+/));
  return undefined;
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

/* ---------- knowledge ---------- */

const serviceList = () => services.map((s) => `• ${s.title}: ${s.summary}`).join("\n");
const stackList = () => technologies.map((x) => x.name).join(", ");
const serviceDetail = (slug: string): string[] => {
  const s = services.find((x) => x.slug === slug);
  if (!s) return [];
  return [
    `${s.title}: ${s.overview}`,
    `What that covers: ${s.capabilities.slice(0, 4).join("; ")}.\nTechnologies: ${s.technologies.join(", ")}.`,
  ];
};

type Faq = { id?: string; re: RegExp; answer: (b: Brain) => string[]; chips?: string[] };

const FAQS: Faq[] = [
  {
    re: /(are you|r u) (a )?(real|human|bot|robot|ai|person|machine)|talking to (a )?(human|person|bot|robot)|who (are|r) you|your name/i,
    answer: () => [
      "I'm an automated assistant for NMN.DEV, so not a person, but I can answer most questions and pass your details to the team.",
      "They read everything sent through here and reply by email.",
    ],
  },
  {
    re: /how are you|how'?s it going|how r u|what'?s up|wassup/i,
    answer: () => ["Doing well, thanks for asking. What are you looking to build?"],
  },
  {
    re: /\b(thanks|thank you|thx|thankyou|appreciate it)\b/i,
    answer: (b) => [rot(["You're welcome.", "Happy to help.", "Anytime."], b.turns) + " Anything else you'd like to know?"],
  },
  {
    id: "bye",
    re: /^\s*(bye|goodbye|see you|cya|ok bye|that'?s all|nothing else|no thanks|i'?m good)\b/i,
    answer: () => ["Thanks for stopping by. If you want to talk later, I'm right here."],
    chips: [],
  },
  {
    re: /\b(mobile apps?|android|ios|iphone|flutter|react native|app store|play store)\b/i,
    answer: () => [
      "Our work is focused on the web: websites, web applications, e-commerce, SaaS and automation. A native mobile app isn't one of our listed services.",
      "If you'd like a web app that works well on phones, though, that's something we do. Tell me what you have in mind and the team can say what fits.",
    ],
    chips: ["I have a project"],
  },
  {
    re: /\b(price|pricing|cost|how much|charges?|rates?|quote|quotation|fees?|afford|cheap|expensive)\b/i,
    answer: () => [
      "Every project is scoped individually, so I can't give you a fixed price list. What you ask for decides the cost: pages, features, integrations and how fast you need it.",
      "If you tell me about your project, the team will review it and come back with a quote. You can share a rough budget too, so they suggest something realistic.",
    ],
    chips: ["I have a project", "How long does it take?"],
  },
  {
    re: /\b(how long|how many (weeks|months|days)|turnaround|delivery time|time (does|will|would) it take|how fast|how soon)\b/i,
    answer: () => [
      "It depends on the scope. A focused website is quicker than a custom platform with accounts and payments.",
      "The team confirms a realistic schedule after reading your brief, and you can tell me when you need it so they plan around it.",
    ],
    chips: ["I have a project", "How does it work?"],
  },
  {
    re: /\b(process|how (do|does) (you|it|this) work|how do we (start|begin)|steps|how it works|methodology|how do you (build|work))\b/i,
    answer: () => [
      "We work in five steps:\n" + processSteps.map((s) => `${s.number}. ${s.title}: ${s.body}`).join("\n"),
      "Want to start with the first one? Tell me about your project.",
    ],
    chips: ["I have a project", "What do you build?"],
  },
  {
    re: /\b(tech(nolog(y|ies))?|stack|framework|language|react|next\.?js|node|python|database|postgres|mongo|wordpress|php|laravel|django)\b/i,
    answer: () => [
      `We mainly build with ${stackList()}.`,
      "If you need something specific, mention it when you describe your project and the team will tell you if it's a good fit.",
    ],
    chips: ["I have a project"],
  },
  {
    re: /\b(portfolio|past work|previous (work|projects)|case stud(y|ies)|your clients|projects you('?ve| have) (done|built)|samples?|references?|show me (your )?work|examples? of (your|past))\b/i,
    answer: () => [
      "We're a young studio and don't have a long client list to show yet, and I'd rather be upfront than overstate it.",
      "What I can do is walk you through how we'd approach your project, and the team can share relevant details when they reply.",
    ],
    chips: ["I have a project", "How does it work?"],
  },
  {
    re: /\b(maintenance|support|after (the )?(launch|delivery|going live)|amc|updates after)\b/i,
    answer: () => [
      "Yes. Support is part of how we work: the last step of our process is launching, optimizing and supporting your product, and website maintenance and technical support are listed under Website Development.",
    ],
    chips: ["I have a project"],
  },
  {
    re: /\b(hosting|domain|deploy(ment)?|server)\b/i,
    answer: () => [
      "Websites are deployed to your hosting as part of the handover. If you're not sure about hosting or a domain yet, mention that in your brief and the team will advise.",
    ],
    chips: ["I have a project"],
  },
  {
    re: /\bseo\b/i,
    answer: () => [
      "Technical SEO is built into our website work: structure, speed, metadata and analytics setup.",
      "I can't promise anything about rankings or ongoing SEO campaigns, since that isn't one of our listed services.",
    ],
    chips: ["I have a project"],
  },
  {
    re: /\b(payments?|razorpay|stripe|gateway|upi|checkout)\b/i,
    answer: () => [
      "Payments and third-party service integrations are part of our E-commerce Development work. The team can confirm which gateway suits your project once they've seen your brief.",
    ],
    chips: ["I have a project"],
  },
  {
    re: /\b(where (are|r) you|location|office|your address|which city|which country)\b/i,
    answer: () => [
      site.contact.location
        ? `We're based in ${site.contact.location}.`
        : "We don't list a public office address. The team can share more details when they reply to you.",
    ],
    chips: ["I have a project"],
  },
  {
    re: /\b(contact (you|the team|info|details)?|talk to (a )?(human|person|someone|the team|a developer)|speak (to|with)|call (you|me)|phone number|whatsapp|email (id|address)|reach you)\b/i,
    answer: () => {
      const lines = [
        "The quickest way is to share your details here: the team reads every message and replies by email. You can also use the contact page at /contact.",
      ];
      const bits = [site.contact.email, site.contact.phone].filter(Boolean);
      if (bits.length) lines.push(`You can also reach them at ${bits.join(" or ")}.`);
      return lines;
    },
    chips: ["I have a project"],
  },
  {
    re: /\b(who is nmn|about (nmn|you(r (company|studio|team))?)|tell me about (nmn|yourself|your (company|studio|team))|what is nmn)\b/i,
    answer: () => [
      "NMN.DEV is an independent software development studio. We design and build high-performance websites, custom software, web applications, SaaS products and automation.",
      "Our approach is simple: understand the problem first, design with purpose, and engineer it to scale.",
    ],
    chips: ["What do you build?", "How does it work?"],
  },
  {
    id: "services",
    re: /(what (do|can) you (do|build|make|offer|develop|provide)|your services|what services|what you (do|build|offer)|services (do )?you|what do you build|do you (do|build|make) )/i,
    answer: () => ["Here's what we build:\n" + serviceList(), "Want details on any of these, or do you have a project in mind?"],
    chips: ["I have a project", ...services.slice(0, 3).map((s) => s.title)],
  },
  {
    re: /\b(help|options|menu|what can i ask|what can you do)\b/i,
    answer: () => [
      "I can tell you what we build, how we work and how pricing and timelines work, or take your project details and send them to the team.",
    ],
    chips: MENU_CHIPS,
  },
];

const matchFaq = (text: string): Faq | undefined => FAQS.find((f) => f.re.test(text));

/* ---------- prompts ---------- */

const messagePrompt = (service?: string) => {
  const s = services.find((x) => x.formValue === service)?.slug;
  switch (s) {
    case "website-development":
      return "Tell me about the business, and what you want the website to help visitors do.";
    case "custom-software":
      return "What process or problem should it solve, and who on your team will use it?";
    case "web-applications":
      return "What should the app let people do, and who are the users?";
    case "ecommerce-development":
      return "What will you be selling, and do you already have your products and branding ready?";
    case "saas-development":
      return "What's the product idea, and who is it for?";
    case "api-automation":
      return "Which tools or systems should it connect, and what should happen automatically?";
    default:
      return "Tell me what you have in mind, in a few sentences.";
  }
};

const ACK = ["Got it.", "Nice.", "Okay, noted.", "Perfect.", "Thanks."];

function summary(L: Lead): string {
  return [
    "Here's what I have:",
    `• Name: ${L.name}`,
    `• Email: ${L.email}`,
    `• Service: ${L.service}`,
    `• Budget: ${L.budget || "Not specified"}`,
    `• Timeline: ${L.timeline || "Not specified"}`,
    `• Project: ${L.message}`,
  ].join("\n");
}

/** Decide the next question, set b.asking, push the prompt, return suggested chips. */
function advance(b: Brain, say: string[]): string[] {
  const L = b.lead;
  const serviceChips = [...services.map((s) => s.formValue), "Other"];

  if (!L.service) {
    b.asking = "service";
    say.push("Which of these is closest to what you need?");
    return serviceChips;
  }
  if (!L.message) {
    b.asking = "message";
    say.push(messagePrompt(L.service));
    return [];
  }
  if (!b.moreAsked) {
    b.moreAsked = true;
    if (L.message.length < 80) {
      b.asking = "more";
      say.push("Anything else worth knowing, like features you want, pages, or sites you like? Or say \"that's all\".");
      return ["That's all"];
    }
  }
  if (L.budget === undefined) {
    b.asking = "budget";
    say.push("Do you have a rough budget in mind? Pick a range, type a number like 50k, or say skip.");
    return [...budgetOptions, "Skip"];
  }
  if (L.timeline === undefined) {
    b.asking = "timeline";
    say.push("When would you like it ready?");
    return [...timelineOptions, "Skip"];
  }
  if (!L.name) {
    b.asking = "name";
    say.push("Great, nearly done. What's your name?");
    return [];
  }
  if (!L.email) {
    b.asking = "email";
    say.push("What's the best email for the team to reach you on?");
    return [];
  }
  b.asking = "confirm";
  say.push(summary(L), "Shall I send this to the team?");
  return ["Yes, send it", "Change something"];
}

/** Repeat the pending question after answering a side question. */
function reask(b: Brain, say: string[], prefix = true): string[] {
  switch (b.asking) {
    case "more":
      say.push("Anything else to add to your project? Or say \"that's all\".");
      return ["That's all"];
    case "confirm":
      say.push("Shall I send your details to the team?");
      return ["Yes, send it", "Change something"];
    case "offerStart":
      say.push("Would you like to tell me about your project?");
      return ["Yes, let's start", "Not now"];
    case null:
      return MENU_CHIPS;
    default: {
      if (prefix) say.push("Back to your project:");
      return advance({ ...b }, say);
    }
  }
}

/* ---------- main entry ---------- */

export function respond(prev: Brain, raw: string): Reply {
  const text = raw.trim().slice(0, 2000);
  const b: Brain = { ...prev, lead: { ...prev.lead }, turns: prev.turns + 1 };
  const say: string[] = [];
  const L = b.lead;
  const confirming = b.asking === "confirm";
  const faq = matchFaq(text);
  const isQuestion = /\?\s*$/.test(text) || /^\s*(what|how|why|do|does|can|could|is|are|will|where|who|which|when)\b/i.test(text);

  const faqNow =
    faq && (isQuestion || text.length < 25) && !(faq.id === "bye" && b.asking !== null) ? faq : undefined;

  /* Pull out anything we can recognise, wherever it appears. */
  const email = text.match(EMAIL_RE)?.[0];
  if (email) L.email = email;

  const askBudget = b.asking === "budget";
  const askTime = b.asking === "timeline";
  const bud = budgetOptions.find((o) => o.toLowerCase() === text.toLowerCase()) ?? parseBudget(text, askBudget);
  if (bud && (L.budget === undefined || L.budget === "" || confirming || askBudget)) L.budget = bud;
  const tl = timelineOptions.find((o) => o.toLowerCase() === text.toLowerCase()) ?? parseTimeline(text, askTime);
  if (tl && (L.timeline === undefined || L.timeline === "" || confirming || askTime)) L.timeline = tl;

  const askName = b.asking === "name";
  const nm = askName && (matchFaq(text) || /\?/.test(text)) ? undefined : extractName(text, askName);
  if (nm && (!L.name || confirming || askName)) L.name = nm;

  const svc = b.asking === "service" ? serviceFromAnswer(text) : detectService(text);
  const infoish = /\b(tell me (more )?about|know (more )?about|learn (more )?about|what (is|are)|details|information|do you (do|build|make|offer)|can you (explain|tell))\b/i.test(text);
  const needVerb = RE.start.test(text) && !(svc && infoish);

  /** A long statement given while we asked something else: keep it as extra project detail. */
  const absorb = (): Reply | null => {
    if (text.length >= 30 && !isQuestion && !email) {
      L.message = `${L.message ?? ""}\n${text}`.trim().slice(0, 4900);
      say.push("Noted, I've added that to your project details.");
      return { brain: b, say, chips: reask(b, say, false) };
    }
    return null;
  };
  const skipLike = (x: string) => RE.skip.test(x) || /^\s*(no|nope|nah)\b/i.test(x);

  /* ---- currently collecting a detail ---- */
  switch (b.asking) {
    case "service": {
      if (svc) {
        L.service = svc;
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift(rot(ACK, b.turns));
        return { brain: b, say, chips };
      }
      if (faqNow) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      b.fails++;
      if (b.fails >= 2) {
        L.service = "Other";
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift("No problem, I'll note it as something custom.");
        return { brain: b, say, chips };
      }
      say.push("I couldn't match that to one of our services. Pick the closest one, or choose Other.");
      return { brain: b, say, chips: [...services.map((s) => s.formValue), "Other"] };
    }

    case "message": {
      const projectLike = needVerb || RE.projecty.test(text) || svc !== undefined;
      if (faqNow && !projectLike && text.length < 120) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      if (!messageOk(text)) {
        say.push("A little more detail would help the team. Even two or three sentences is plenty.");
        return { brain: b, say, chips: [] };
      }
      L.message = text;
      if (svc && !L.service) L.service = svc;
      if (text.length >= 80) b.moreAsked = true;
      const chips = advance(b, say);
      say.unshift(rot(ACK, b.turns));
      return { brain: b, say, chips };
    }

    case "more": {
      if (faqNow) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      if (!RE.nothingMore.test(text) && !email && !bud && !tl && !nm) {
        L.message = `${L.message}\n${text}`.slice(0, 4900);
      }
      const chips = advance(b, say);
      say.unshift(rot(ACK, b.turns));
      return { brain: b, say, chips };
    }

    case "budget": {
      if (skipLike(text) && !bud) {
        L.budget = "";
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift("No problem, we can sort that out later.");
        return { brain: b, say, chips };
      }
      const exact = budgetOptions.find((o) => o.toLowerCase() === text.toLowerCase());
      if (exact) L.budget = exact;
      if (L.budget !== undefined) {
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift(rot(ACK, b.turns));
        return { brain: b, say, chips };
      }
      if (faqNow) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      const ab1 = absorb();
      if (ab1) return ab1;
      b.fails++;
      if (b.fails >= 2) {
        L.budget = "";
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift("That's fine, I'll leave the budget open for the team to discuss with you.");
        return { brain: b, say, chips };
      }
      say.push("I couldn't read that as an amount. Pick a range, type something like 50k or 1 lakh, or say skip.");
      return { brain: b, say, chips: [...budgetOptions, "Skip"] };
    }

    case "timeline": {
      if (skipLike(text) && !tl) {
        L.timeline = "";
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift("No problem.");
        return { brain: b, say, chips };
      }
      const exact = timelineOptions.find((o) => o.toLowerCase() === text.toLowerCase());
      if (exact) L.timeline = exact;
      if (L.timeline !== undefined) {
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift(rot(ACK, b.turns));
        return { brain: b, say, chips };
      }
      if (faqNow) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      const ab2 = absorb();
      if (ab2) return ab2;
      b.fails++;
      if (b.fails >= 2) {
        L.timeline = "";
        b.fails = 0;
        const chips = advance(b, say);
        say.unshift("That's fine, the team can agree dates with you.");
        return { brain: b, say, chips };
      }
      say.push("I didn't catch the timing. Pick one below, or say something like \"in 2 months\", or skip.");
      return { brain: b, say, chips: [...timelineOptions, "Skip"] };
    }

    case "name": {
      if (L.name) {
        const chips = advance(b, say);
        say.unshift(rot(["Nice to meet you", "Good to meet you", "Thanks"], b.turns) + `, ${firstName(L.name)}.`);
        return { brain: b, say, chips };
      }
      if (faqNow) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      const ab3 = absorb();
      if (ab3) return ab3;
      say.push("What should I call you? Just a first and last name is fine.");
      return { brain: b, say, chips: [] };
    }

    case "email": {
      if (email && contactSchema.shape.email.safeParse(email).success) {
        const chips = advance(b, say);
        return { brain: b, say, chips };
      }
      if (faqNow) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      const ab4 = absorb();
      if (ab4) return ab4;
      say.push("That doesn't look like an email address. Could you check it? It should look like name@example.com.");
      return { brain: b, say, chips: [] };
    }

    case "confirm": {
      if (RE.yes.test(text) && !email) {
        return { brain: { ...b, asking: null }, say: ["On it, sending now."], chips: [], send: true };
      }
      if (faqNow) {
        say.push(...faqNow.answer(b));
        return { brain: b, say, chips: reask(b, say) };
      }
      const changed = Boolean(email || bud || tl || nm || svc);
      if (svc) L.service = svc;
      if (!changed && !RE.no.test(text) && text.length >= 20 && !isQuestion) {
        L.message = text;
        say.push("Updated the description.", summary(L), "Shall I send it?");
        return { brain: b, say, chips: ["Yes, send it", "Change something"] };
      }
      if (changed) {
        say.push("Updated.", summary(L), "Shall I send it?");
        return { brain: b, say, chips: ["Yes, send it", "Change something"] };
      }
      say.push(
        "Sure. Tell me what to change, for example \"email is name@example.com\", \"budget 50k\", \"my name is Asha\", or type a new description.",
      );
      return { brain: b, say, chips: [] };
    }

    case "offerStart": {
      if (RE.yes.test(text) || /let'?s start|i have a project/i.test(text)) {
        const chips = advance(b, say);
        say.unshift("Great.");
        return { brain: b, say, chips };
      }
      if (RE.no.test(text) || /not now|later/i.test(text)) {
        b.asking = null;
        return { brain: b, say: ["No problem. Ask me anything else, or come back when you're ready."], chips: MENU_CHIPS };
      }
      b.asking = null; // fall through to normal handling
      break;
    }
  }

  /* ---- free conversation ---- */

  // A question that isn't about starting a project: answer it first.
  // (A question about one specific service gets that service's detail further down.)
  if (faq && !(needVerb && !/\b(price|pricing|cost|how much)\b/i.test(text)) && !(faq.id === "services" && svc)) {
    say.push(...faq.answer(b));
    if (faq.chips && faq.chips.length === 0) return { brain: b, say, chips: [] };
    return { brain: b, say, chips: faq.chips ?? MENU_CHIPS };
  }

  // Greeting
  if (RE.greet.test(text) && text.length <= 40 && !svc) {
    say.push(rot(["Hi there! What can I help you with?", "Hello! Are you looking to build something, or just exploring?", "Hey! How can I help?"], b.turns));
    return { brain: b, say, chips: MENU_CHIPS };
  }

  // The visitor wants to start (or described a project outright)
  const describesProject = text.length >= 30 && RE.projecty.test(text) && !isQuestion && !(svc && infoish);
  if (needVerb || describesProject || (svc && !isQuestion && text.length >= 25)) {
    if (svc) L.service = svc;
    if (messageOk(text) && (needVerb || describesProject) && text.length >= 25) L.message = text;
    const chips = advance(b, say);
    const lead = svc
      ? rot([
          `A ${svc.toLowerCase()} project, great.`,
          "Sounds good, I can help with that.",
          "Nice, that's what we do.",
        ], b.turns)
      : rot(["Happy to help with that.", "Great, let's get it started."], b.turns);
    say.unshift(lead);
    return { brain: b, say, chips };
  }

  // Asking about one service
  if (svc && svc !== "Other") {
    const slug = services.find((s) => s.formValue === svc)?.slug ?? "";
    L.service = svc;
    b.asking = "offerStart";
    say.push(...serviceDetail(slug), "Would you like to tell me about your project?");
    return { brain: b, say, chips: ["Yes, let's start", "Not now", ...services.filter((s) => s.formValue !== svc).slice(0, 2).map((s) => s.title)] };
  }

  // Service titles typed from chips ("Website Development")
  const byTitle = services.find((s) => s.title.toLowerCase() === text.toLowerCase());
  if (byTitle) {
    L.service = byTitle.formValue;
    b.asking = "offerStart";
    say.push(...serviceDetail(byTitle.slug), "Would you like to tell me about your project?");
    return { brain: b, say, chips: ["Yes, let's start", "Not now"] };
  }

  // Short acknowledgements
  if (/^\s*(ok|okay|cool|nice|great|hmm+|alright|fine|good|k|oh|i see|got it|awesome|wow)\W*$/i.test(text)) {
    say.push(rot(["Glad that helps. Want to hear about a specific service, or tell me about your project?", "Anything else you'd like to know?"], b.turns));
    return { brain: b, say, chips: MENU_CHIPS };
  }

  say.push(
    "I'm not sure I followed that. I can tell you what we build, how we work, or take your project details and pass them to the team. What would be useful?",
  );
  return { brain: b, say, chips: MENU_CHIPS };
}

/** Called by the widget once the enquiry has been posted. */
export function afterSend(prev: Brain, result: { ok: boolean; error?: string }): Reply {
  const b: Brain = { ...prev, lead: { ...prev.lead } };
  if (result.ok) {
    const first = firstName(b.lead.name);
    const email = b.lead.email;
    const fresh = initialBrain();
    fresh.turns = b.turns;
    return {
      brain: fresh,
      say: [
        `Done. Thanks ${first}, your details are with the team and they'll reply to ${email} soon.`,
        "Is there anything else I can help you with?",
      ],
      chips: ["What do you build?", "How does it work?"],
    };
  }
  b.asking = "confirm";
  return {
    brain: b,
    say: [
      `${result.error ?? "Something went wrong."} Your details are still here, so you can try again, or use the contact page at /contact.`,
    ],
    chips: ["Try again"],
  };
}