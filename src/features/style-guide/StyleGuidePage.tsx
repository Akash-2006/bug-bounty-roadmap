import { Bookmark, Loader2, Search } from "lucide-react";

import { DifficultyPill } from "@/components/common/difficulty-pill";
import { Kbd } from "@/components/common/kbd";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Section, Swatch } from "@/features/style-guide/components/section";
import type { DifficultyLevel } from "@/core/schemas/base";

const semanticColors = [
  { name: "background", className: "bg-background", fg: "text-foreground" },
  { name: "card", className: "bg-card", fg: "text-card-foreground" },
  { name: "primary", className: "bg-primary", fg: "text-primary-foreground" },
  {
    name: "secondary",
    className: "bg-secondary",
    fg: "text-secondary-foreground",
  },
  { name: "accent", className: "bg-accent", fg: "text-accent-foreground" },
  { name: "muted", className: "bg-muted", fg: "text-muted-foreground" },
  { name: "success", className: "bg-success", fg: "text-success-foreground" },
  { name: "warning", className: "bg-warning", fg: "text-warning-foreground" },
  { name: "info", className: "bg-info", fg: "text-info-foreground" },
  {
    name: "destructive",
    className: "bg-destructive",
    fg: "text-destructive-foreground",
  },
];

const difficultyColors: { name: string; className: string }[] = [
  { name: "beginner", className: "bg-difficulty-beginner" },
  { name: "intermediate", className: "bg-difficulty-intermediate" },
  { name: "advanced", className: "bg-difficulty-advanced" },
  { name: "expert", className: "bg-difficulty-expert" },
];

const uiTypeScale = [
  { label: "Display / 4xl", className: "text-4xl font-bold" },
  { label: "Heading / 2xl", className: "text-2xl font-semibold" },
  { label: "Title / lg", className: "text-lg font-semibold" },
  { label: "Body / base", className: "text-base" },
  { label: "Small / sm", className: "text-sm text-muted-foreground" },
  { label: "Caption / xs", className: "text-xs text-muted-foreground" },
];

const spacing = [1, 2, 3, 4, 6, 8, 12, 16];
const difficulties: DifficultyLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
  "expert",
];

export function StyleGuidePage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="secondary">Dev only</Badge>
          <h1 className="text-3xl font-bold tracking-tight">
            Design System & Component Playground
          </h1>
          <p className="text-sm text-muted-foreground">
            The living reference for tokens, typography, and components. Toggle
            the theme to verify both palettes.
          </p>
        </div>
        <ThemeToggle />
      </header>

      {/* COLORS */}
      <Section
        id="colors"
        title="Color — semantic tokens"
        description="Roles, not raw values. Every color is an HSL CSS variable themed for light and dark."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {semanticColors.map((c) => (
            <Swatch
              key={c.name}
              name={c.name}
              className={c.className}
              foreground={c.fg}
            />
          ))}
        </div>
      </Section>

      {/* DIFFICULTY */}
      <Section
        id="difficulty"
        title="Difficulty scale"
        description="Domain-semantic tokens used by lessons and filters."
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {difficultyColors.map((c) => (
            <Swatch
              key={c.name}
              name={c.name}
              className={c.className}
              foreground="text-white"
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {difficulties.map((d) => (
            <DifficultyPill key={d} difficulty={d} />
          ))}
        </div>
      </Section>

      {/* TYPOGRAPHY — UI */}
      <Section
        id="type-ui"
        title="Typography — App UI (Inter)"
        description="Compact, functional scale for the product chrome."
      >
        <div className="space-y-3">
          {uiTypeScale.map((t) => (
            <div key={t.label} className="flex items-baseline gap-4">
              <span className="w-32 shrink-0 text-xs text-muted-foreground">
                {t.label}
              </span>
              <span className={t.className}>The quick brown fox</span>
            </div>
          ))}
        </div>
      </Section>

      {/* TYPOGRAPHY — Reading */}
      <Section
        id="type-reading"
        title="Typography — Reading (Lora, serif)"
        description="A deliberately separate system for long-form lesson prose: serif, wide leading, capped measure."
      >
        <div className="reading rounded-lg border bg-card p-6">
          <h2>Anatomy of an HTTP Request</h2>
          <p>
            Every web attack begins with a single HTTP request. Before you can
            break a request, you have to understand it completely — the method,
            the path, the headers, and the body.
          </p>
          <p>
            The <code>id=1337</code> parameter is a textbook access-control
            candidate. Reading typography optimizes for comfort over long
            sessions, distinct from the dense UI type scale.
          </p>
          <blockquote>
            Treat every parameter, header, and cookie as untrusted input the
            server might trust.
          </blockquote>
        </div>
      </Section>

      {/* SPACING & RADIUS */}
      <Section
        id="spacing"
        title="Spacing & radius"
        description="4px base scale; radii derive from a single --radius token."
      >
        <div className="flex flex-wrap items-end gap-4">
          {spacing.map((s) => (
            <div key={s} className="flex flex-col items-center gap-1">
              <div
                className="rounded bg-primary"
                style={{ width: s * 4, height: s * 4 }}
              />
              <span className="text-[10px] text-muted-foreground">{s}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 pt-2">
          {["rounded-sm", "rounded-md", "rounded-lg", "rounded-full"].map(
            (r) => (
              <div key={r} className="flex flex-col items-center gap-1">
                <div className={`size-14 border bg-secondary ${r}`} />
                <span className="text-[10px] text-muted-foreground">{r}</span>
              </div>
            ),
          )}
        </div>
      </Section>

      {/* ELEVATION */}
      <Section
        id="elevation"
        title="Elevation"
        description="Three shadow tiers plus a glass blur for sticky surfaces."
      >
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {["shadow-sm", "shadow-md", "shadow-lg"].map((s) => (
            <div
              key={s}
              className={`flex h-20 items-center justify-center rounded-lg bg-card text-xs text-muted-foreground ${s}`}
            >
              {s}
            </div>
          ))}
          <div className="glass flex h-20 items-center justify-center rounded-lg border text-xs text-muted-foreground">
            glass
          </div>
        </div>
      </Section>

      {/* BUTTONS */}
      <Section
        id="buttons"
        title="Buttons"
        description="All variants and sizes, with icon and loading states."
      >
        <div className="flex flex-wrap gap-3">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button>Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon" aria-label="Bookmark">
            <Bookmark />
          </Button>
          <Button disabled>
            <Loader2 className="animate-spin" /> Loading
          </Button>
        </div>
      </Section>

      {/* BADGES */}
      <Section id="badges" title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      {/* FORMS */}
      <Section id="forms" title="Form controls">
        <div className="grid max-w-sm gap-2">
          <Label htmlFor="sg-input">Curriculum name</Label>
          <Input id="sg-input" placeholder="e.g. Bug Bounty" />
        </div>
      </Section>

      {/* FEEDBACK */}
      <Section id="feedback" title="Feedback & data">
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Progress</span>
            <Progress value={62} />
          </div>
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Search">
                  <Search />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Search (tooltip)</TooltipContent>
            </Tooltip>
            <Kbd keys={["⌘", "K"]} />
            <Separator orientation="vertical" className="h-6" />
            <Kbd keys={["g", "d"]} />
          </div>
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Skeleton</span>
            <div className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </div>
      </Section>

      {/* CARDS */}
      <Section id="cards" title="Cards">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Broken Access Control</CardTitle>
            <CardDescription>Module · 3 weeks · 12 lessons</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            <DifficultyPill difficulty="intermediate" />
            <Badge variant="secondary">OWASP</Badge>
          </CardContent>
        </Card>
      </Section>
    </div>
  );
}
