import { useMemo, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  ExternalLink,
  Heart,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Minus,
  Plus,
  Send,
  ShieldCheck,
  TreePine,
  Users,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  getGetImpactSummaryQueryKey,
  getHealthCheckQueryKey,
  setBaseUrl,
  useGetImpactSummary,
  useHealthCheck,
  useSubmitContact,
  useSubmitNewsletter,
  useSubmitVolunteer,
} from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { siteContent, type Project, type ProjectTagKey } from '@/content/site-content';
import { siteContentEn } from '@/content/site-content.en';
import { translations, type Lang } from '@/i18n/translations';

setBaseUrl(import.meta.env.VITE_API_BASE_URL || null);

const queryClient = new QueryClient();

type ContactForm = { name: string; email: string; subject: string; message: string };
type VolunteerForm = { name: string; email: string; location: string; availability: string; message: string };
type NewsletterForm = { email: string };

const FILTER_KEYS: ('all' | ProjectTagKey)[] = ['all', 'schools', 'partnerships', 'communities', 'forests', 'coastline'];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function LanguageSwitch({ lang, setLang, className = '' }: { lang: Lang; setLang: (lang: Lang) => void; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-full border border-current/20 p-0.5 text-[.7rem] font-bold ${className}`} role="group" aria-label="Language / Langue">
      <button
        type="button"
        className={`rounded-full px-2.5 py-1 transition-colors ${lang === 'fr' ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'opacity-60'}`}
        onClick={() => setLang('fr')}
        aria-pressed={lang === 'fr'}
        data-testid="button-lang-fr"
      >
        FR
      </button>
      <button
        type="button"
        className={`rounded-full px-2.5 py-1 transition-colors ${lang === 'en' ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]' : 'opacity-60'}`}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        data-testid="button-lang-en"
      >
        EN
      </button>
    </div>
  );
}

function Home() {
  const [lang, setLang] = useState<Lang>('fr');
  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | ProjectTagKey>('all');
  const [amount, setAmount] = useState(30);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const t = translations[lang];
  const content = lang === 'fr' ? siteContent : siteContentEn;

  const money = useMemo(() => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 0 }), [lang]);
  const decimal = useMemo(() => new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { maximumFractionDigits: 1 }), [lang]);

  const impact = useGetImpactSummary({
    query: { queryKey: getGetImpactSummaryQueryKey(), staleTime: 60_000 },
  });
  const health = useHealthCheck({
    query: { queryKey: getHealthCheckQueryKey(), staleTime: 300_000, retry: 1 },
  });
  const contact = useSubmitContact();
  const volunteer = useSubmitVolunteer();
  const newsletter = useSubmitNewsletter();
  const [contactSent, setContactSent] = useState<string | null>(null);
  const [volunteerSent, setVolunteerSent] = useState<string | null>(null);
  const [newsletterSent, setNewsletterSent] = useState<string | null>(null);

  const contactForm = useForm<ContactForm>({ defaultValues: { name: '', email: '', subject: '', message: '' } });
  const volunteerForm = useForm<VolunteerForm>({ defaultValues: { name: '', email: '', location: '', availability: '', message: '' } });
  const newsletterForm = useForm<NewsletterForm>({ defaultValues: { email: '' } });

  const fieldError = (errors: Record<string, { message?: string } | undefined>, key: string) => errors[key]?.message ?? t.contact.requiredError;

  const filteredProjects = useMemo<Project[]>(
    () => (filter === 'all' ? content.projects : content.projects.filter((project) => project.tagKey === filter)),
    [filter, content],
  );
  const trees = Math.round(amount / 0.3);
  const co2 = trees * 22;
  const impactValue = impact.data;
  const heroStats = [
    { value: impactValue ? decimal.format(impactValue.hectaresRestored) : (lang === 'fr' ? '77,8' : '77.8'), label: t.hero.statLabels.hectares },
    { value: impactValue ? money.format(impactValue.schoolsEngaged) : '23', label: t.hero.statLabels.schools },
    { value: impactValue ? `${decimal.format(impactValue.survivalRate)} %` : '85 %', label: t.hero.statLabels.survival },
  ];

  const navItems = t.nav;

  const submitContact = (values: ContactForm) => {
    setContactSent(null);
    contact.mutate({ data: values }, {
      onSuccess: (receipt) => { setContactSent(receipt.message); contactForm.reset(); },
      onError: () => setContactSent(t.contact.form.error),
    });
  };
  const submitVolunteer = (values: VolunteerForm) => {
    setVolunteerSent(null);
    volunteer.mutate({ data: { ...values, message: values.message || null } }, {
      onSuccess: (receipt) => { setVolunteerSent(receipt.message); volunteerForm.reset(); },
      onError: () => setVolunteerSent(t.contact.volunteer.error),
    });
  };
  const submitNewsletter = (values: NewsletterForm) => {
    setNewsletterSent(null);
    newsletter.mutate({ data: values }, {
      onSuccess: (receipt) => { setNewsletterSent(receipt.message); newsletterForm.reset(); },
      onError: () => setNewsletterSent(t.footer.newsletterError),
    });
  };

  return (
    <div className="page-shell noise">
      <header className="header-scrolled fixed top-0 z-40 w-full border-b border-[hsl(var(--border)/.65)]">
        <div className="section-wrap flex h-[72px] items-center justify-between">
          <button className="flex items-center gap-3 text-left" onClick={() => scrollToId('accueil')} data-testid="button-logo" aria-label={t.header.backHome}>
            <img src="/images/gli-logo.jpeg" alt="Logo officiel de Green Legacy Initiative" className="h-10 w-10 rounded-full object-cover ring-1 ring-[hsl(var(--primary)/.14)]" data-testid="img-logo" />
            <span className="leading-none"><span className="block font-bold tracking-[-.03em] text-[hsl(var(--primary))]">GREEN LEGACY INITIATIVE</span><span className="mt-1 block text-[.58rem] font-semibold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">{content.brand.strapline}</span></span>
          </button>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
            {navItems.map(([label, id]) => <button key={id} className="nav-link" onClick={() => scrollToId(id)} data-testid={`link-nav-${id}`}>{label}</button>)}
          </nav>
          <div className="hidden items-center gap-4 md:flex">
            <LanguageSwitch lang={lang} setLang={setLang} className="text-[hsl(var(--primary))]" />
            <button className="btn-primary" onClick={() => scrollToId('don')} data-testid="button-header-donate">{t.header.donate} <ArrowUpRight size={16} /></button>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitch lang={lang} setLang={setLang} className="text-[hsl(var(--primary))]" />
            <button className="rounded-full p-2 text-[hsl(var(--primary))]" aria-label={navOpen ? t.header.closeMenu : t.header.openMenu} onClick={() => setNavOpen(!navOpen)} data-testid="button-mobile-menu">{navOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        {navOpen && <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-5 md:hidden"><nav className="flex flex-col gap-4">{navItems.map(([label, id]) => <button key={id} className="nav-link text-left" onClick={() => { scrollToId(id); setNavOpen(false); }} data-testid={`link-mobile-nav-${id}`}>{label}</button>)}<button className="btn-primary mt-2 w-full" onClick={() => { scrollToId('don'); setNavOpen(false); }} data-testid="button-mobile-donate">{t.header.donate} <ArrowUpRight size={16} /></button></nav></div>}
      </header>

      <main>
        <section id="accueil" className="relative overflow-hidden bg-[hsl(var(--primary))] pt-[72px] text-[hsl(var(--primary-foreground))]">
          <div className="absolute -right-24 top-16 h-72 w-72 rounded-full border border-[hsl(var(--accent)/.25)] hero-orb" /><div className="absolute -right-8 top-28 h-44 w-44 rounded-full border border-[hsl(var(--accent)/.22)]" />
          <div className="section-wrap grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
            <div className="relative z-10"><div className="reveal mb-7 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-9 bg-[hsl(var(--accent))]" /><span className="eyebrow">{content.hero.eyebrow}</span></div>
              <h1 className="display reveal max-w-[700px] text-[clamp(3.4rem,7.5vw,7.2rem)] leading-[.88] tracking-[-.065em]">{content.hero.title.split(', ').map((line, index) => <span className={index === 1 ? 'block text-[hsl(var(--accent))]' : 'block'} key={line}>{index === 1 ? `${line}` : `${line},`}</span>)}</h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-[540px] text-lg leading-relaxed text-[hsl(var(--primary-foreground)/.72)]">{content.hero.body}</p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-4"><button className="btn-primary" onClick={() => scrollToId('don')} data-testid="button-hero-donate">{t.hero.donate} <ArrowDownRight size={17} /></button><button className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--primary-foreground)/.75)] transition-colors hover:text-[hsl(var(--accent))]" onClick={() => scrollToId('action')} data-testid="button-hero-discover">{t.hero.discover} <ArrowDownRight size={16} /></button></div>
              <div className="mt-16 grid max-w-[550px] grid-cols-3 gap-5">{heroStats.map((stat, index) => <div className={index > 0 ? 'hero-stat' : ''} key={stat.label}><div className="display text-3xl font-semibold" data-testid={`text-hero-stat-${index}`}>{stat.value}</div><div className="mt-1 text-xs text-[hsl(var(--primary-foreground)/.55)]">{stat.label}</div></div>)}</div>
              {impact.isError && <p className="mt-4 text-xs text-[hsl(var(--accent))]" data-testid="status-impact-error">{t.hero.impactError}</p>}
            </div>
            <div className="relative mx-auto w-full max-w-[530px] lg:ml-auto"><div className="image-frame aspect-[.9] rotate-[2deg] border-[10px] border-[hsl(var(--primary-foreground)/.08)] shadow-2xl shadow-black/20"><img src="/images/gle-solibra-mondoukro.jpg" alt="Élèves et équipes réunis lors du reboisement de Mondoukro" data-testid="img-hero-forest" /></div><div className="absolute -bottom-5 -left-5 max-w-[220px] rounded-2xl bg-[hsl(var(--accent))] p-5 text-[hsl(var(--accent-foreground))] shadow-xl"><div className="mb-5 flex items-center justify-between"><MapPin size={18} /><span className="eyebrow !text-[hsl(var(--accent-foreground))]">{t.hero.photoTag}</span></div><p className="display text-xl leading-tight">« {content.hero.quote} »</p><p className="mt-3 text-xs font-semibold opacity-70">— {content.hero.quoteBy}</p></div></div>
          </div>
          <div className="section-wrap flex items-center justify-between border-t border-[hsl(var(--primary-foreground)/.16)] py-5 text-xs text-[hsl(var(--primary-foreground)/.54)]"><span>{content.brand.locations}</span><span className="hidden items-center gap-2 md:flex"><span className={`h-2 w-2 rounded-full ${health.isError ? 'bg-[hsl(var(--accent)/.45)]' : 'animate-pulse bg-[hsl(var(--accent))]'}`} /> {t.hero.updateNote}</span></div>
        </section>

        <section id="action" className="section-pad paper-grid bg-[hsl(var(--background))]"><div className="section-wrap grid items-start gap-12 lg:grid-cols-[.72fr_1.28fr]"><div className="lg:sticky lg:top-28"><p className="eyebrow mb-4">{t.action.eyebrow}</p><h2 className="display max-w-[410px] text-5xl leading-[.97] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.action.title}</h2><p className="mt-6 max-w-[380px] text-[hsl(var(--muted-foreground))] leading-relaxed">{t.action.body}</p><button className="btn-secondary mt-7" onClick={() => scrollToId('terrain')} data-testid="button-action-field-notes">{t.action.cta} <ArrowDownRight size={16} /></button></div><div className="grid gap-8 md:grid-cols-2"><div className="image-frame aspect-[.9] md:mt-20"><img src="/images/gle-solibra-samoukaha.jpg" alt="Élèves et équipes lors du reboisement de Samoukaha avec SOLIBRA" data-testid="img-action-school" /></div><div className="md:pt-4"><span className="display text-7xl font-semibold text-[hsl(var(--accent))]" data-testid="text-trees-summary">{impactValue ? money.format(impactValue.treesPlanted) : (lang === 'fr' ? '18 400' : '18,400')}</span><p className="mt-1 text-sm font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">{t.action.treesLabel}</p><div className="my-8 h-px bg-[hsl(var(--border))]" /><p className="text-[hsl(var(--muted-foreground))] leading-relaxed">{t.action.body2}</p><div className="mt-8 flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" size={19} /><p className="text-sm font-semibold leading-relaxed text-[hsl(var(--primary))]">{t.action.note}</p></div></div></div></div></section>

        <section id="impact" className="section-pad bg-[hsl(var(--secondary))]"><div className="section-wrap"><div className="mx-auto max-w-[620px] text-center"><p className="eyebrow mb-4 justify-center">{t.impact.eyebrow}</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.impact.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.impact.titleLine2}</span></h2><p className="mt-6 leading-relaxed text-[hsl(var(--muted-foreground))]">{t.impact.body}</p></div><div className="mt-12 grid grid-cols-2 gap-6 lg:grid-cols-4">{[
          { value: impactValue ? money.format(impactValue.treesPlanted) : (lang === 'fr' ? '18 400' : '18,400'), label: t.impact.stats[0].label },
          { value: impactValue ? decimal.format(impactValue.hectaresRestored) : (lang === 'fr' ? '77,8' : '77.8'), label: t.impact.stats[1].label },
          { value: impactValue ? money.format(impactValue.schoolsEngaged) : '23', label: t.impact.stats[2].label },
          { value: impactValue ? `${decimal.format(impactValue.survivalRate)} %` : '85 %', label: t.impact.stats[3].label },
        ].map((stat) => <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-center" key={stat.label}><span className="display block text-4xl font-semibold text-[hsl(var(--primary))] md:text-5xl">{stat.value}</span><span className="mt-2 block text-xs uppercase tracking-[.08em] text-[hsl(var(--muted-foreground))]">{stat.label}</span></div>)}</div><p className="mx-auto mt-8 max-w-[420px] text-center text-xs text-[hsl(var(--muted-foreground))]">{t.impact.methodNote}</p></div></section>

        <section id="vision" className="section-pad bg-[hsl(var(--secondary))]"><div className="section-wrap grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow mb-4">{t.vision.eyebrow}</p><h2 className="display max-w-[420px] text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.vision.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.vision.titleLine2}</span></h2><p className="mt-6 max-w-[380px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{t.vision.body}</p></div><div className="grid gap-4 sm:grid-cols-2"><p className="sm:col-span-2 text-sm font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">{t.vision.objectivesLabel}</p>{t.vision.objectives.map((item) => <div className="flex items-start gap-3 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5" key={item} data-testid={`card-objective-${item}`}><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--accent)/.23)] text-[hsl(var(--primary))]"><Check size={15} /></span><p className="text-sm font-semibold leading-relaxed text-[hsl(var(--primary))]">{item}</p></div>)}</div></div></section>

        <section id="programmes" className="section-pad bg-[hsl(var(--background))]"><div className="section-wrap"><div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="eyebrow mb-4">{t.programmes.eyebrow}</p><h2 className="display max-w-[620px] text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.programmes.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.programmes.titleLine2}</span></h2></div><p className="max-w-[290px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{t.programmes.body}</p></div><div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-5">{content.programs.map((program) => { const Icon = program.icon; return <article className="program-card" key={program.number} data-testid={`card-program-${program.number}`}><div className="mb-8 flex items-start justify-between"><span className="program-number">{program.number}</span><Icon size={25} strokeWidth={1.5} className="text-[hsl(var(--primary))]" /></div><h3 className="display text-2xl leading-tight text-[hsl(var(--primary))]">{program.title}</h3><p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{program.text}</p></article>; })}</div></div></section>

      <section id="terrain" className="section-pad bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]"><div className="section-wrap"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow mb-4 !text-[hsl(var(--accent))]">{t.terrain.eyebrow}</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] md:text-6xl">{t.terrain.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.terrain.titleLine2}</span></h2></div><p className="max-w-[330px] text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.65)]">{t.terrain.body}</p></div><div className="mt-10 flex flex-wrap gap-2">{FILTER_KEYS.map((key, index) => <button key={key} className={`filter-btn ${filter === key ? 'active' : ''} border-[hsl(var(--primary-foreground)/.22)] text-[hsl(var(--primary-foreground)/.68)]`} onClick={() => setFilter(key)} data-testid={`button-filter-${key}`}>{t.terrain.filters[index]}</button>)}</div><div className="mt-8 grid gap-5 md:grid-cols-2">{filteredProjects.map((project) => <article className="project-card border-[hsl(var(--primary-foreground)/.12)] bg-[hsl(var(--primary-foreground)/.08)]" key={project.id} data-testid={`card-project-${project.id}`}><div className="project-img"><img src={project.image} alt={project.title} data-testid={`img-project-${project.id}`} /></div><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="eyebrow !text-[hsl(var(--accent))]">{project.tag}</span><span className="text-xs text-[hsl(var(--primary-foreground)/.5)]">{project.place}</span></div><h3 className="display mt-3 text-2xl">{project.title}</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.64)]">{project.text}</p><button className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--accent))]" onClick={() => scrollToId('don')} data-testid={`button-project-support-${project.id}`}>{t.terrain.support} <ArrowUpRight size={14} /></button></div></article>)}</div><div className="mt-12 flex items-center gap-3 text-sm text-[hsl(var(--primary-foreground)/.55)]"><MapPin size={16} className="text-[hsl(var(--accent))]" /> {t.terrain.footnote}</div></div></section>

        <section id="prochaines" className="section-pad bg-[hsl(var(--background))]"><div className="section-wrap"><div className="max-w-[560px]"><p className="eyebrow mb-4">{t.prochaines.eyebrow}</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.prochaines.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.prochaines.titleLine2}</span></h2><p className="mt-6 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{t.prochaines.body}</p></div><div className="mt-10 rounded-2xl border border-dashed border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 text-sm text-[hsl(var(--muted-foreground))]">{t.prochaines.placeholder}</div><button className="btn-secondary mt-7" onClick={() => scrollToId('newsletter')} data-testid="button-prochaines-newsletter">{t.prochaines.cta} <Mail size={15} /></button></div></section>

        <section id="pourquoi" className="section-pad bg-[hsl(var(--secondary))]"><div className="section-wrap"><div className="max-w-[560px]"><p className="eyebrow mb-4">{t.pourquoi.eyebrow}</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.pourquoi.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.pourquoi.titleLine2}</span></h2></div><div className="mt-12 grid gap-5 sm:grid-cols-2">{t.pourquoi.cards.map((card) => <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6" key={card.title}><h3 className="display text-xl text-[hsl(var(--primary))]">{card.title}</h3><p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{card.text}</p></div>)}</div></div></section>

        <section id="equipe" className="section-pad bg-[hsl(var(--background))]"><div className="section-wrap"><div className="max-w-[560px]"><p className="eyebrow mb-4">{t.equipe.eyebrow}</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.equipe.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.equipe.titleLine2}</span></h2></div><div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{content.team.map((member) => <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6" key={member.name}><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]"><ShieldCheck size={20} /></span><h3 className="display mt-5 text-xl text-[hsl(var(--primary))]">{member.name}</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{member.role}</p></div>)}</div></div></section>

        <section id="don" className="section-pad paper-grid bg-[hsl(var(--background))]"><div className="section-wrap"><div className="mx-auto max-w-[720px] text-center"><p className="eyebrow mb-4 justify-center">{t.don.donBecomes.eyebrow}</p><h2 className="display text-4xl leading-[.98] tracking-[-.04em] text-[hsl(var(--primary))] md:text-5xl">{t.don.donBecomes.title}</h2><p className="mt-5 leading-relaxed text-[hsl(var(--muted-foreground))]">{t.don.donBecomes.intro}</p></div><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">{t.don.donBecomes.items.map((item) => <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5" key={item.title}><h3 className="text-sm font-bold text-[hsl(var(--primary))]">{item.title}</h3><p className="mt-2 text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{item.text}</p></div>)}</div><p className="mx-auto mt-8 max-w-[560px] text-center text-xs leading-relaxed text-[hsl(var(--muted-foreground))]">{t.don.donBecomes.note}</p></div></section>

        <section id="don" className="section-pad paper-grid bg-[hsl(var(--background))]"><div className="section-wrap grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow mb-4">{t.don.eyebrow}</p><h2 className="display text-5xl leading-[.95] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.don.titleLine1}<br />{t.don.titleLine2}</h2><p className="mt-6 max-w-[420px] leading-relaxed text-[hsl(var(--muted-foreground))]">{t.don.body}</p><div className="mt-9 grid max-w-[420px] gap-3 text-sm text-[hsl(var(--foreground)/.72)]">{t.don.bullets.map((item) => <div className="flex items-center gap-3" key={item}><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--accent)/.23)] text-[hsl(var(--primary))]"><Check size={15} /></span>{item}</div>)}</div></div><div className="rounded-[1.5rem] bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] shadow-xl shadow-[hsl(var(--primary)/.16)] md:p-10" data-testid="calculator-donation"><div className="flex items-start justify-between gap-5"><div><p className="eyebrow !text-[hsl(var(--accent))]">{t.don.calcEyebrow}</p><p className="mt-3 text-sm text-[hsl(var(--primary-foreground)/.65)]">{t.don.calcSubtitle}</p></div><span className="rounded-full border border-[hsl(var(--primary-foreground)/.2)] px-3 py-1 text-xs text-[hsl(var(--primary-foreground)/.62)]">{t.don.simulation}</span></div><div className="mt-5 flex items-end justify-between"><span className="display text-6xl font-semibold text-[hsl(var(--accent))]" data-testid="text-donation-amount">{money.format(amount)} €</span><div className="flex gap-1"><button onClick={() => setAmount(Math.max(5, amount - 5))} className="rounded-full border border-[hsl(var(--primary-foreground)/.25)] p-2 hover:bg-[hsl(var(--primary-foreground)/.1)]" aria-label={t.don.decrease} data-testid="button-decrease-donation"><Minus size={15} /></button><button onClick={() => setAmount(Math.min(250, amount + 5))} className="rounded-full border border-[hsl(var(--primary-foreground)/.25)] p-2 hover:bg-[hsl(var(--primary-foreground)/.1)]" aria-label={t.don.increase} data-testid="button-increase-donation"><Plus size={15} /></button></div></div><input className="mt-7 w-full accent-[hsl(var(--accent))]" type="range" min="5" max="250" step="5" value={amount} onChange={(event) => setAmount(Number(event.target.value))} aria-label={t.don.slider} data-testid="input-donation-slider" /><div className="mt-3 flex justify-between text-xs text-[hsl(var(--primary-foreground)/.48)]"><span>{t.don.min}</span><span>{t.don.max}</span></div><div className="my-8 h-px bg-[hsl(var(--primary-foreground)/.16)]" /><div className="grid grid-cols-2 gap-4"><div className="rounded-xl bg-[hsl(var(--primary-foreground)/.08)] p-4"><TreePine size={18} className="mb-4 text-[hsl(var(--accent))]" /><span className="display block text-3xl font-semibold" data-testid="text-calculated-trees">{money.format(trees)}</span><span className="text-xs text-[hsl(var(--primary-foreground)/.56)]">{t.don.treesPlanted}</span></div><div className="rounded-xl bg-[hsl(var(--primary-foreground)/.08)] p-4"><Leaf size={18} className="mb-4 text-[hsl(var(--accent))]" /><span className="display block text-3xl font-semibold" data-testid="text-calculated-co2">{decimal.format(co2)} kg</span><span className="text-xs text-[hsl(var(--primary-foreground)/.56)]">{t.don.co2Label}</span></div></div><button className="btn-primary mt-7 w-full" onClick={() => { const target = impactValue?.donationUrl; if (target) window.open(target, '_blank', 'noopener,noreferrer'); else scrollToId('contact'); }} data-testid="button-donate-now">{t.don.cta} <Heart size={16} /></button><p className="mt-3 text-center text-[.68rem] text-[hsl(var(--primary-foreground)/.46)]">{t.don.note}</p></div></div></section>

      <section id="journal" className="section-pad bg-[hsl(var(--secondary))]"><div className="section-wrap"><div className="flex items-end justify-between gap-5"><div><p className="eyebrow mb-4">{t.journal.eyebrow}</p><h2 className="display text-5xl leading-[.95] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.journal.titleLine1}<br /><span className="text-[hsl(var(--accent))]">{t.journal.titleLine2}</span></h2></div><button className="btn-secondary hidden md:inline-flex" onClick={() => scrollToId('newsletter')} data-testid="button-journal-newsletter">{t.journal.newsletterCta} <Mail size={15} /></button></div><div className="mt-12 grid gap-6 md:grid-cols-[1.18fr_.82fr_.82fr]"><article className="group overflow-hidden rounded-2xl bg-[hsl(var(--background))]"><div className="image-frame aspect-[1.55]"><img src="/images/gle-solibra-plantation.jpg" alt="Plantation suivie avec les élèves lors du partenariat SOLIBRA" data-testid="img-journal-plot" /></div><div className="p-6"><div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"><CalendarDays size={14} /> {t.journal.story1.date}</div><h3 className="display mt-4 text-3xl leading-tight text-[hsl(var(--primary))]">{t.journal.story1.title}</h3><p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{t.journal.story1.text}</p><button className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]" onClick={() => scrollToId('contact')} data-testid="button-read-story">{t.journal.story1.cta} <ArrowUpRight size={14} /></button></div></article><article className="rounded-2xl bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))]"><span className="eyebrow !text-[hsl(var(--accent))]">{t.journal.figureOfMonth}</span><span className="display mt-12 block text-7xl text-[hsl(var(--accent))]" data-testid="text-journal-survival">{impactValue ? `${decimal.format(impactValue.survivalRate)} %` : '85 %'}</span><h3 className="display mt-3 text-2xl">{t.journal.survivalNote}</h3><p className="mt-5 text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.62)]">{t.journal.survivalBody}</p></article><article className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6"><span className="eyebrow">{t.journal.story3.eyebrow}</span><h3 className="display mt-16 text-3xl leading-tight text-[hsl(var(--primary))]">{t.journal.story3.title}</h3><p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{t.journal.story3.text}</p><button className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]" onClick={() => scrollToId('contact')} data-testid="button-download-guide">{t.journal.story3.cta} <ExternalLink size={14} /></button></article></div></div></section>

        <section id="contact" className="section-pad bg-[hsl(var(--background))]"><div className="section-wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="eyebrow mb-4">{t.contact.eyebrow}</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.contact.titleLine1}<br />{t.contact.titleLine2}</h2><p className="mt-6 max-w-[380px] leading-relaxed text-[hsl(var(--muted-foreground))]">{t.contact.body}</p><div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[hsl(var(--primary))]"><MapPin size={18} className="text-[hsl(var(--accent))]" /> {t.contact.locations}</div></div><div className="grid gap-5 md:grid-cols-2"><div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]"><Users size={19} /></span><h3 className="display text-2xl text-[hsl(var(--primary))]">{t.contact.volunteer.title}</h3></div>{volunteerSent ? <StatusMessage message={volunteerSent} success={!volunteer.isError} testId="status-volunteer-result" onReset={() => setVolunteerSent(null)} t={t} /> : <form onSubmit={volunteerForm.handleSubmit(submitVolunteer)} noValidate><label className="form-label" htmlFor="volunteer-name">{t.contact.volunteer.firstName}</label><input id="volunteer-name" className="form-field mb-1" placeholder={t.contact.volunteer.firstNamePlaceholder} {...volunteerForm.register('name', { required: true, minLength: 2 })} data-testid="input-volunteer-name" />{volunteerForm.formState.errors.name && <ErrorText>{fieldError(volunteerForm.formState.errors, 'name')}</ErrorText>}<label className="form-label mt-3" htmlFor="volunteer-email">{t.contact.volunteer.email}</label><input id="volunteer-email" type="email" className="form-field mb-1" placeholder={t.contact.volunteer.emailPlaceholder} {...volunteerForm.register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} data-testid="input-volunteer-email" />{volunteerForm.formState.errors.email && <ErrorText>{t.contact.form.emailError}</ErrorText>}<label className="form-label mt-3" htmlFor="volunteer-location">{t.contact.volunteer.city}</label><input id="volunteer-location" className="form-field mb-1" placeholder={t.contact.volunteer.cityPlaceholder} {...volunteerForm.register('location', { required: true, minLength: 2 })} data-testid="input-volunteer-location" />{volunteerForm.formState.errors.location && <ErrorText>{t.contact.volunteer.cityError}</ErrorText>}<label className="form-label mt-3" htmlFor="volunteer-availability">{t.contact.volunteer.availability}</label><input id="volunteer-availability" className="form-field mb-1" placeholder={t.contact.volunteer.availabilityPlaceholder} {...volunteerForm.register('availability', { required: true, minLength: 2 })} data-testid="input-volunteer-availability" /><label className="form-label mt-3" htmlFor="volunteer-message">{t.contact.volunteer.message} <span className="font-normal opacity-60">{t.contact.volunteer.optional}</span></label><textarea id="volunteer-message" className="form-field mb-4 min-h-[86px] resize-none" placeholder={t.contact.volunteer.messagePlaceholder} {...volunteerForm.register('message')} data-testid="input-volunteer-message" /><button className="btn-primary w-full" type="submit" disabled={volunteer.isPending} data-testid="button-submit-volunteer">{volunteer.isPending ? t.contact.volunteer.submitting : t.contact.volunteer.submit} {!volunteer.isPending && <ArrowUpRight size={15} />}</button></form>}</div>
          <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]"><Send size={18} /></span><h3 className="display text-2xl text-[hsl(var(--primary))]">{t.contact.form.title}</h3></div>{contactSent ? <StatusMessage message={contactSent} success={!contact.isError} testId="status-contact-result" onReset={() => setContactSent(null)} t={t} /> : <form onSubmit={contactForm.handleSubmit(submitContact)} noValidate><label className="form-label" htmlFor="contact-name">{t.contact.form.name}</label><input id="contact-name" className="form-field mb-1" placeholder={t.contact.form.namePlaceholder} {...contactForm.register('name', { required: true, minLength: 2 })} data-testid="input-contact-name" />{contactForm.formState.errors.name && <ErrorText>{t.contact.form.nameError}</ErrorText>}<label className="form-label mt-3" htmlFor="contact-email">{t.contact.form.email}</label><input id="contact-email" type="email" className="form-field mb-1" placeholder={t.contact.form.emailPlaceholder} {...contactForm.register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} data-testid="input-contact-email" />{contactForm.formState.errors.email && <ErrorText>{t.contact.form.emailError}</ErrorText>}<label className="form-label mt-3" htmlFor="contact-subject">{t.contact.form.subject}</label><input id="contact-subject" className="form-field mb-1" placeholder={t.contact.form.subjectPlaceholder} {...contactForm.register('subject', { required: true, minLength: 2 })} data-testid="input-contact-subject" /><label className="form-label mt-3" htmlFor="contact-message">{t.contact.form.message}</label><textarea id="contact-message" className="form-field mb-4 min-h-[104px] resize-none" required placeholder={t.contact.form.messagePlaceholder} {...contactForm.register('message', { required: true, minLength: 10 })} data-testid="input-contact-message" />{contactForm.formState.errors.message && <ErrorText>{t.contact.form.messageError}</ErrorText>}<button className="btn-primary w-full" type="submit" disabled={contact.isPending} data-testid="button-submit-contact">{contact.isPending ? t.contact.form.submitting : t.contact.form.submit} {!contact.isPending && <Send size={15} />}</button></form>}</div></div></div></section>

        <section id="faq" className="section-pad bg-[hsl(var(--secondary))]"><div className="section-wrap grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow mb-4">{t.faq.eyebrow}</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">{t.faq.titleLine1}<br />{t.faq.titleLine2}</h2><p className="mt-6 max-w-[310px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{t.faq.body}</p></div><div>{content.faqs.map((faq, index) => <div className="faq-row" key={faq.q}><button className="faq-trigger" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} data-testid={`button-faq-${index}`}><span>{faq.q}</span><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border))] transition-transform ${openFaq === index ? 'rotate-180 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>{openFaq === index ? <Minus size={14} /> : <ChevronDown size={14} />}</span></button>{openFaq === index && <p className="faq-answer" data-testid={`text-faq-answer-${index}`}>{faq.a}</p>}</div>)}</div></div></section>
        <section className="section-pad bg-[hsl(var(--primary))] text-center text-[hsl(var(--primary-foreground))]"><div className="section-wrap max-w-[640px]"><h2 className="display text-4xl leading-[1.05] tracking-[-.04em] md:text-5xl">{t.heritage.title}</h2><div className="mx-auto mt-6 max-w-[480px] space-y-2 text-[hsl(var(--primary-foreground)/.72)]">{t.heritage.lines.map((line) => <p key={line}>{line}</p>)}</div><p className="display mt-8 text-2xl text-[hsl(var(--accent))]">{t.heritage.sub}</p><div className="mt-8 flex flex-wrap items-center justify-center gap-4"><button className="btn-primary" onClick={() => scrollToId('don')} data-testid="button-heritage-donate">{t.heritage.donate} <Heart size={16} /></button><button className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--primary-foreground)/.75)] transition-colors hover:text-[hsl(var(--accent))]" onClick={() => scrollToId('contact')} data-testid="button-heritage-other">{t.heritage.other}</button></div></div></section>
      </main>

      <footer id="newsletter" className="bg-[hsl(var(--primary))] py-14 text-[hsl(var(--primary-foreground))]"><div className="section-wrap"><div className="grid gap-10 border-b border-[hsl(var(--primary-foreground)/.16)] pb-12 md:grid-cols-[1fr_1fr] md:items-end"><div><div className="flex items-center gap-3"><img src="/images/gli-logo.jpeg" alt="Logo officiel de Green Legacy Initiative" className="h-10 w-10 rounded-full object-cover" /><span className="font-bold tracking-[-.03em]">GREEN LEGACY INITIATIVE</span></div><h2 className="display mt-7 max-w-[510px] text-4xl leading-tight md:text-5xl">{t.footer.newsletterTitle}</h2></div><div>{newsletterSent ? <StatusMessage message={newsletterSent} success={!newsletter.isError} testId="status-newsletter-result" onReset={() => setNewsletterSent(null)} t={t} /> : <form className="flex flex-col gap-3 sm:flex-row" onSubmit={newsletterForm.handleSubmit(submitNewsletter)} noValidate><label className="sr-only" htmlFor="newsletter-email">{t.footer.emailLabel}</label><input id="newsletter-email" className="form-field flex-1 border-[hsl(var(--primary-foreground)/.2)] bg-[hsl(var(--primary-foreground)/.08)] text-[hsl(var(--primary-foreground))] placeholder:text-[hsl(var(--primary-foreground)/.45)]" type="email" required placeholder={t.footer.emailPlaceholder} {...newsletterForm.register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} data-testid="input-newsletter-email" /><button className="btn-primary" type="submit" disabled={newsletter.isPending} data-testid="button-submit-newsletter">{newsletter.isPending ? t.footer.subscribing : t.footer.subscribe} {!newsletter.isPending && <Mail size={15} />}</button></form>}{newsletterForm.formState.errors.email && <ErrorText>{t.contact.form.emailError}</ErrorText>}<p className="mt-3 text-xs text-[hsl(var(--primary-foreground)/.45)]">{t.footer.newsletterNote}</p></div></div><div className="grid gap-8 py-10 sm:grid-cols-3"><div><p className="eyebrow !text-[hsl(var(--accent))]">{t.footer.explore}</p><div className="mt-4 flex flex-col gap-3"><button className="footer-link text-left" onClick={() => scrollToId('action')} data-testid="link-footer-action">{t.footer.exploreLinks[0]}</button><button className="footer-link text-left" onClick={() => scrollToId('programmes')} data-testid="link-footer-programs">{t.footer.exploreLinks[1]}</button><button className="footer-link text-left" onClick={() => scrollToId('terrain')} data-testid="link-footer-terrain">{t.footer.exploreLinks[2]}</button></div></div><div><p className="eyebrow !text-[hsl(var(--accent))]">{t.footer.act}</p><div className="mt-4 flex flex-col gap-3"><button className="footer-link text-left" onClick={() => scrollToId('don')} data-testid="link-footer-donate">{t.footer.actLinks[0]}</button><button className="footer-link text-left" onClick={() => scrollToId('contact')} data-testid="link-footer-volunteer">{t.footer.actLinks[1]}</button><button className="footer-link text-left" onClick={() => scrollToId('faq')} data-testid="link-footer-faq">{t.footer.actLinks[2]}</button></div></div><div><p className="eyebrow !text-[hsl(var(--accent))]">{t.footer.findUs}</p><div className="mt-4 flex flex-col gap-3 text-sm text-[hsl(var(--primary-foreground)/.65)]"><span>Chemin des Mines 2, 1202 Genève, Suisse</span><span>{t.footer.secondAddress}</span><span data-testid="text-contact-email">{impactValue?.contactEmail ?? content.brand.email}</span><span>+41 77 981 05 21 · +225 01 02 79 83 70</span></div></div></div><div className="flex flex-col justify-between gap-3 border-t border-[hsl(var(--primary-foreground)/.16)] pt-6 text-xs text-[hsl(var(--primary-foreground)/.42)] md:flex-row"><span>{t.footer.copyright}</span><span>{t.footer.tagline}</span></div></div></footer>
    </div>
  );
}

function ErrorText({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-xs text-[hsl(var(--destructive))]" role="alert">{children}</p>;
}

function StatusMessage({ message, success, testId, onReset, t }: { message: string; success: boolean; testId: string; onReset: () => void; t: (typeof translations)['fr'] }) {
  return <div className={`rounded-xl p-5 text-sm leading-relaxed ${success ? 'status-success' : 'status-error'}`} aria-live="polite" data-testid={testId}><div className="flex items-start gap-3">{success ? <Check size={20} /> : <X size={20} />}<span>{message}</span></div><button className="mt-4 text-xs font-bold underline underline-offset-4" onClick={onReset} data-testid={`${testId}-retry`}>{success ? t.contact.statusAnother : t.contact.statusRetry}</button></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function App() {
  const [location] = useLocation();
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary resetKey={location}><Router /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;
