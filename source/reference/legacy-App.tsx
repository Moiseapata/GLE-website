import { useState, type FormEvent } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
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
  Sprout,
  TreePine,
  Users,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

const programs = [
  { number: '01', icon: TreePine, title: 'Une École, 5 Ha de Forêt', text: 'Chaque école partenaire transforme une parcelle dégradée en salle de classe à ciel ouvert, avec les élèves au cœur du soin.' },
  { number: '02', icon: Sprout, title: 'Pépinières communautaires', text: 'Des pépinières locales font grandir des essences natives et créent des revenus de saison pour les familles.' },
  { number: '03', icon: BookOpen, title: 'Éducation par le vivant', text: 'Des outils pédagogiques en français et en langues locales reconnectent les enfants aux cycles de leur territoire.' },
  { number: '04', icon: Users, title: 'Chantiers participatifs', text: 'Habitants, enseignants et équipes techniques décident ensemble où planter, comment suivre et quoi transmettre.' },
  { number: '05', icon: Leaf, title: 'Littoral & mangroves', text: 'À Grand-Bassam et dans les villages lagunaires, nous restaurons les berges avec les communautés riveraines.' },
];

const projects = [
  { id: 'dabou', image: '/images/gli-school-forest.jpg', tag: 'Écoles', title: 'La cour devient forêt', place: 'Dabou · Sud-Comoé', text: 'Les élèves de l’école de N’Guessankro entretiennent 2 hectares de jeunes plants autour de leur classe.' },
  { id: 'korhogo', image: '/images/gli-community-nursery.jpg', tag: 'Communautés', title: 'La pépinière des mains', place: 'Korhogo · Poro', text: 'Une pépinière de 12 000 plants, portée par 34 familles, prépare la prochaine saison des pluies.' },
  { id: 'agboville', image: '/images/gli-reforestation-plot.jpg', tag: 'Forêts', title: 'Voir grandir le sol', place: 'Agboville · Agnéby-Tiassa', text: 'Sur l’ancienne parcelle agricole, les alignements d’arbres dessinent déjà un corridor vivant.' },
  { id: 'grand-bassam', image: '/images/gli-mangrove-restoration.jpg', tag: 'Littoral', title: 'Les racines de la lagune', place: 'Grand-Bassam · Sud-Comoé', text: 'Les riverains replantent des palétuviers pour ralentir l’érosion et protéger les nurseries de poissons.' },
];

const faqs = [
  { q: 'Où sont situés les projets de Green Legacy Initiative ?', a: 'Tous nos projets actifs sont en Côte d’Ivoire. Nous travaillons avec des écoles et des communautés de Dabou, Agboville, Korhogo, Grand-Bassam et d’autres territoires ivoiriens selon les partenariats locaux.' },
  { q: 'Que finance concrètement un don de 30 € ?', a: 'À titre indicatif, 30 € permettent de financer 100 arbres : la semence, le sac de pépinière, la mise en terre et les premiers suivis. Une part soutient aussi la formation des équipes locales et la mesure de survie.' },
  { q: 'Comment calculez-vous les arbres survivants ?', a: 'Les équipes de terrain recensent les parcelles à intervalles réguliers. Le taux de survie de 85 % est calculé sur les plants suivis après leur première saison sèche, et non sur une projection.' },
  { q: 'Puis-je venir participer à un chantier ?', a: 'Oui. Nous ouvrons plusieurs journées participatives par saison des pluies. Laissez-nous vos coordonnées dans le formulaire bénévole : l’équipe vous proposera une date et un projet adaptés.' },
  { q: 'Comment suivez-vous l’utilisation des dons ?', a: 'Chaque projet possède une fiche de suivi : parcelle, essence, date de plantation et taux de survie. Nous partageons un bilan annuel et les nouvelles de terrain dans notre lettre.' },
];

const money = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 });
const decimal = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 1 });

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const [filter, setFilter] = useState('Tous');
  const [amount, setAmount] = useState(30);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [volunteerSent, setVolunteerSent] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);
  const filteredProjects = filter === 'Tous' ? projects : projects.filter((project) => project.tag === filter);
  const trees = Math.round(amount / 0.3);
  const co2 = trees * 22;

  const handleForm = (event: FormEvent<HTMLFormElement>, setSent: (value: boolean) => void) => {
    event.preventDefault();
    setSent(true);
    event.currentTarget.reset();
  };

  const navItems = [
    ['Notre action', 'action'],
    ['Programmes', 'programmes'],
    ['Sur le terrain', 'terrain'],
    ['Agir', 'don'],
    ['Journal', 'journal'],
  ];

  return (
    <div className="page-shell noise">
      <header className="fixed top-0 z-40 w-full border-b border-[hsl(var(--border)/.65)] transition-all duration-300 header-scrolled">
        <div className="section-wrap flex h-[72px] items-center justify-between">
          <button className="flex items-center gap-3 text-left" onClick={() => scrollToId('accueil')} data-testid="button-logo" aria-label="Revenir à l'accueil">
            <img src="/images/gli-logo.jpeg" alt="Logo officiel de Green Legacy Initiative" className="h-10 w-10 rounded-full object-cover ring-1 ring-[hsl(var(--primary)/.14)]" />
            <span className="leading-none">
              <span className="block font-bold tracking-[-.03em] text-[hsl(var(--primary))]">GREEN LEGACY</span>
              <span className="mt-1 block text-[.58rem] font-semibold uppercase tracking-[.16em] text-[hsl(var(--muted-foreground))]">ONG basée à Genève · terrain ivoirien</span>
            </span>
          </button>
          <nav className="hidden items-center gap-7 md:flex" aria-label="Navigation principale">
            {navItems.map(([label, id]) => <button key={id} className="nav-link" onClick={() => scrollToId(id)} data-testid={`link-nav-${id}`}>{label}</button>)}
          </nav>
          <div className="hidden md:block">
            <button className="btn-primary" onClick={() => scrollToId('don')} data-testid="button-header-donate">Soutenir un projet <ArrowUpRight size={16} /></button>
          </div>
          <button className="rounded-full p-2 text-[hsl(var(--primary))] md:hidden" aria-label={navOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onClick={() => setNavOpen(!navOpen)} data-testid="button-mobile-menu">
            {navOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {navOpen && <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--background))] px-6 py-5 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map(([label, id]) => <button key={id} className="nav-link text-left" onClick={() => { scrollToId(id); setNavOpen(false); }} data-testid={`link-mobile-nav-${id}`}>{label}</button>)}
            <button className="btn-primary mt-2 w-full" onClick={() => { scrollToId('don'); setNavOpen(false); }} data-testid="button-mobile-donate">Soutenir un projet <ArrowUpRight size={16} /></button>
          </nav>
        </div>}
      </header>

      <main>
        <section id="accueil" className="relative overflow-hidden bg-[hsl(var(--primary))] pt-[72px] text-[hsl(var(--primary-foreground))]">
          <div className="absolute -right-24 top-16 h-72 w-72 rounded-full border border-[hsl(var(--accent)/.25)] hero-orb" />
          <div className="absolute -right-8 top-28 h-44 w-44 rounded-full border border-[hsl(var(--accent)/.22)]" />
          <div className="section-wrap grid min-h-[680px] items-center gap-12 py-16 lg:grid-cols-[1.02fr_.98fr] lg:py-24">
            <div className="relative z-10">
              <div className="reveal mb-7 flex items-center gap-3 text-[hsl(var(--accent))]"><span className="h-px w-9 bg-[hsl(var(--accent))]" /><span className="eyebrow">ONG basée à Genève · 2026</span></div>
              <h1 className="display reveal reveal-delay-1 max-w-[700px] text-[clamp(3.4rem,7.5vw,7.2rem)] leading-[.88] tracking-[-.065em]">Un engagement local,<br /><span className="text-[hsl(var(--accent))]">une portée internationale.</span></h1>
              <p className="reveal reveal-delay-2 mt-8 max-w-[540px] text-lg leading-relaxed text-[hsl(var(--primary-foreground)/.72)]">Depuis Genève, Green Legacy Initiative relie partenaires, écoles et communautés pour faire grandir des forêts et des solutions durables, avec la Côte d’Ivoire comme premier terrain d’action.</p>
              <div className="reveal reveal-delay-3 mt-9 flex flex-wrap items-center gap-4">
                <button className="btn-primary" onClick={() => scrollToId('don')} data-testid="button-hero-donate">Planter l’avenir <ArrowDownRight size={17} /></button>
                <button className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-[hsl(var(--primary-foreground)/.75)] transition-colors hover:text-[hsl(var(--accent))]" onClick={() => scrollToId('action')} data-testid="button-hero-discover">Découvrir notre méthode <ArrowDownRight size={16} /></button>
              </div>
              <div className="mt-16 grid max-w-[550px] grid-cols-3 gap-5">
                <div><div className="display text-3xl font-semibold">77,75</div><div className="mt-1 text-xs text-[hsl(var(--primary-foreground)/.55)]">hectares reboisés</div></div>
                <div className="hero-stat"><div className="display text-3xl font-semibold">23</div><div className="mt-1 text-xs text-[hsl(var(--primary-foreground)/.55)]">écoles partenaires</div></div>
                <div className="hero-stat"><div className="display text-3xl font-semibold">85 %</div><div className="mt-1 text-xs text-[hsl(var(--primary-foreground)/.55)]">de survie des plants</div></div>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[530px] lg:ml-auto">
              <div className="image-frame aspect-[.9] rotate-[2deg] border-[10px] border-[hsl(var(--primary-foreground)/.08)] shadow-2xl shadow-black/20"><img src="/images/gli-forest-canopy.jpg" alt="Canopée dense d'une forêt ivoirienne" /></div>
              <div className="absolute -bottom-5 -left-5 max-w-[220px] rounded-2xl bg-[hsl(var(--accent))] p-5 text-[hsl(var(--accent-foreground))] shadow-xl">
                <div className="mb-5 flex items-center justify-between"><MapPin size={18} /><span className="eyebrow !text-[hsl(var(--accent-foreground))]">Côte d’Ivoire</span></div>
                <p className="display text-xl leading-tight">« La forêt n’est jamais loin quand on la plante ensemble. »</p>
                <p className="mt-3 text-xs font-semibold opacity-70">— Awa, animatrice terrain</p>
              </div>
            </div>
          </div>
          <div className="section-wrap flex items-center justify-between border-t border-[hsl(var(--primary-foreground)/.16)] py-5 text-xs text-[hsl(var(--primary-foreground)/.54)]"><span>Abidjan · Agboville · Dabou · Korhogo · Grand-Bassam</span><span className="hidden items-center gap-2 md:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-[hsl(var(--accent))]" /> Données de suivi mises à jour chaque saison</span></div>
        </section>

        <section id="action" className="section-pad paper-grid bg-[hsl(var(--background))]">
          <div className="section-wrap grid items-start gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow mb-4">Pourquoi nous existons</p>
              <h2 className="display max-w-[410px] text-5xl leading-[.97] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">Replanter, c’est transmettre.</h2>
              <p className="mt-6 max-w-[380px] text-[hsl(var(--muted-foreground))] leading-relaxed">La déforestation se mesure en hectares. La réparation, elle, se construit dans les gestes quotidiens : une graine choisie, une classe qui s’engage, une communauté qui veille.</p>
              <button className="btn-secondary mt-7" onClick={() => scrollToId('terrain')} data-testid="button-action-field-notes">Voir nos traces de terrain <ArrowDownRight size={16} /></button>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="image-frame aspect-[.9] md:mt-20"><img src="/images/gli-school-forest.jpg" alt="Élèves plantant des arbres dans la cour de leur école" /></div>
              <div className="md:pt-4">
                <span className="display text-7xl font-semibold text-[hsl(var(--accent))]">18 400</span>
                <p className="mt-1 text-sm font-bold uppercase tracking-[.12em] text-[hsl(var(--primary))]">arbres plantés ensemble</p>
                <div className="my-8 h-px bg-[hsl(var(--border))]" />
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">Notre travail commence par l’écoute. Les essences sont choisies avec les habitants, les parcelles sont cartographiées et les arbres sont suivis après la photo du jour de plantation.</p>
                <div className="mt-8 flex items-start gap-3"><ShieldCheck className="mt-0.5 shrink-0 text-[hsl(var(--primary))]" size={19} /><p className="text-sm font-semibold leading-relaxed text-[hsl(var(--primary))]">Des résultats documentés, des histoires racontées sans détour.</p></div>
              </div>
            </div>
          </div>
        </section>

        <section id="programmes" className="section-pad bg-[hsl(var(--background))]">
          <div className="section-wrap">
            <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div><p className="eyebrow mb-4">Notre façon de faire</p><h2 className="display max-w-[620px] text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">Cinq chemins vers<br /><span className="text-[hsl(var(--accent))]">une forêt vivante.</span></h2></div>
              <p className="max-w-[290px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Du premier plant au suivi de survie, chaque programme relie nature, transmission et autonomie locale.</p>
            </div>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-5">
              {programs.map((program) => { const Icon = program.icon; return <article className="program-card" key={program.number} data-testid={`card-program-${program.number}`}><div className="mb-8 flex items-start justify-between"><span className="program-number">{program.number}</span><Icon size={25} strokeWidth={1.5} className="text-[hsl(var(--primary))]" /></div><h3 className="display text-2xl leading-tight text-[hsl(var(--primary))]">{program.title}</h3><p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{program.text}</p></article>; })}
            </div>
          </div>
        </section>

        <section id="terrain" className="section-pad bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]">
          <div className="section-wrap">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow !text-[hsl(var(--accent))] mb-4">Carnet de terrain</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] md:text-6xl">Les parcelles ont<br /><span className="text-[hsl(var(--accent))]">une adresse.</span></h2></div><p className="max-w-[330px] text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.65)]">Des projets réels, en Côte d’Ivoire. Pas de carte vague : chaque image correspond à une équipe, une école ou un village.</p></div>
            <div className="mt-10 flex flex-wrap gap-2">{['Tous', 'Écoles', 'Communautés', 'Forêts', 'Littoral'].map((item) => <button key={item} className={`filter-btn ${filter === item ? 'active' : ''} border-[hsl(var(--primary-foreground)/.22)] text-[hsl(var(--primary-foreground)/.68)]`} onClick={() => setFilter(item)} data-testid={`button-filter-${item.toLowerCase()}`}>{item}</button>)}</div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {filteredProjects.map((project) => <article className="project-card bg-[hsl(var(--primary-foreground)/.08)] border-[hsl(var(--primary-foreground)/.12)]" key={project.id} data-testid={`card-project-${project.id}`}><div className="project-img"><img src={project.image} alt={project.title} /></div><div className="p-5"><div className="flex items-center justify-between gap-3"><span className="eyebrow !text-[hsl(var(--accent))]">{project.tag}</span><span className="text-xs text-[hsl(var(--primary-foreground)/.5)]">{project.place}</span></div><h3 className="display mt-3 text-2xl">{project.title}</h3><p className="mt-2 text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.64)]">{project.text}</p><button className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--accent))]" onClick={() => scrollToId('don')} data-testid={`button-project-support-${project.id}`}>Soutenir ce terrain <ArrowUpRight size={14} /></button></div></article>)}
            </div>
            <div className="mt-12 flex items-center gap-3 text-sm text-[hsl(var(--primary-foreground)/.55)]"><MapPin size={16} className="text-[hsl(var(--accent))]" /> 100 % des projets présentés ici sont en Côte d’Ivoire.</div>
          </div>
        </section>

        <section id="don" className="section-pad paper-grid bg-[hsl(var(--background))]">
          <div className="section-wrap grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
            <div><p className="eyebrow mb-4">Faire grandir une forêt</p><h2 className="display text-5xl leading-[.95] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">Chaque geste<br />laisse une trace.</h2><p className="mt-6 max-w-[420px] leading-relaxed text-[hsl(var(--muted-foreground))]">Notre modèle est simple à comprendre, parce que la confiance commence par la clarté. Explorez l’impact indicatif de votre don.</p><div className="mt-9 grid max-w-[420px] gap-3 text-sm text-[hsl(var(--foreground)/.72)]"><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--accent)/.23)] text-[hsl(var(--primary))]"><Check size={15} /></span>0,30 € par arbre planté</div><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--accent)/.23)] text-[hsl(var(--primary))]"><Check size={15} /></span>22 kg de CO₂ captés par arbre / an</div><div className="flex items-center gap-3"><span className="flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(var(--accent)/.23)] text-[hsl(var(--primary))]"><Check size={15} /></span>Suivi de survie après chaque saison sèche</div></div></div>
            <div className="rounded-[1.5rem] bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))] shadow-xl shadow-[hsl(var(--primary)/.16)] md:p-10" data-testid="calculator-donation">
              <div className="flex items-start justify-between gap-5"><div><p className="eyebrow !text-[hsl(var(--accent))]">Calculateur d’impact</p><p className="mt-3 text-sm text-[hsl(var(--primary-foreground)/.65)]">Votre contribution</p></div><span className="rounded-full border border-[hsl(var(--primary-foreground)/.2)] px-3 py-1 text-xs text-[hsl(var(--primary-foreground)/.62)]">simulation</span></div>
              <div className="mt-5 flex items-end justify-between"><span className="display text-6xl font-semibold text-[hsl(var(--accent))]" data-testid="text-donation-amount">{money.format(amount)} €</span><div className="flex gap-1"><button onClick={() => setAmount(Math.max(5, amount - 5))} className="rounded-full border border-[hsl(var(--primary-foreground)/.25)] p-2 hover:bg-[hsl(var(--primary-foreground)/.1)]" aria-label="Diminuer le don" data-testid="button-decrease-donation"><Minus size={15} /></button><button onClick={() => setAmount(Math.min(250, amount + 5))} className="rounded-full border border-[hsl(var(--primary-foreground)/.25)] p-2 hover:bg-[hsl(var(--primary-foreground)/.1)]" aria-label="Augmenter le don" data-testid="button-increase-donation"><Plus size={15} /></button></div></div>
              <input className="mt-7 w-full accent-[hsl(var(--accent))]" type="range" min="5" max="250" step="5" value={amount} onChange={(event) => setAmount(Number(event.target.value))} aria-label="Montant du don" data-testid="input-donation-slider" />
              <div className="mt-3 flex justify-between text-xs text-[hsl(var(--primary-foreground)/.48)]"><span>5 €</span><span>250 €</span></div>
              <div className="my-8 h-px bg-[hsl(var(--primary-foreground)/.16)]" />
              <div className="grid grid-cols-2 gap-4"><div className="rounded-xl bg-[hsl(var(--primary-foreground)/.08)] p-4"><TreePine size={18} className="mb-4 text-[hsl(var(--accent))]" /><span className="display block text-3xl font-semibold" data-testid="text-calculated-trees">{money.format(trees)}</span><span className="text-xs text-[hsl(var(--primary-foreground)/.56)]">arbres plantés</span></div><div className="rounded-xl bg-[hsl(var(--primary-foreground)/.08)] p-4"><Leaf size={18} className="mb-4 text-[hsl(var(--accent))]" /><span className="display block text-3xl font-semibold" data-testid="text-calculated-co2">{decimal.format(co2)} kg</span><span className="text-xs text-[hsl(var(--primary-foreground)/.56)]">CO₂ / an, indicatif</span></div></div>
              <button className="btn-primary mt-7 w-full" onClick={() => scrollToId('contact')} data-testid="button-donate-now">Je veux contribuer <Heart size={16} /></button>
              <p className="mt-3 text-center text-[.68rem] text-[hsl(var(--primary-foreground)/.46)]">Le paiement sécurisé sera proposé lors de la prochaine étape.</p>
            </div>
          </div>
        </section>

        <section id="journal" className="section-pad bg-[hsl(var(--secondary))]">
          <div className="section-wrap"><div className="flex items-end justify-between gap-5"><div><p className="eyebrow mb-4">Le journal</p><h2 className="display text-5xl leading-[.95] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">Nouvelles du<br /><span className="text-[hsl(var(--accent))]">vivant.</span></h2></div><button className="btn-secondary hidden md:inline-flex" onClick={() => scrollToId('newsletter')} data-testid="button-journal-newsletter">Recevoir les nouvelles <Mail size={15} /></button></div>
            <div className="mt-12 grid gap-6 md:grid-cols-[1.18fr_.82fr_.82fr]">
               <article className="group overflow-hidden rounded-2xl bg-[hsl(var(--background))]"><div className="image-frame aspect-[1.55]"><img src="/images/gli-reforestation-plot.jpg" alt="Parcelle de reboisement vue depuis les airs" /></div><div className="p-6"><div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"><CalendarDays size={14} /> 18 juin 2026 · Récit</div><h3 className="display mt-4 text-3xl leading-tight text-[hsl(var(--primary))]">Le jour où la parcelle a changé de couleur</h3><p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">À Agboville, les premières pluies font apparaître le dessin patient de la régénération.</p><button className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]" onClick={() => scrollToId('contact')} data-testid="button-read-story">Lire le carnet <ArrowUpRight size={14} /></button></div></article>
              <article className="rounded-2xl bg-[hsl(var(--primary))] p-6 text-[hsl(var(--primary-foreground))]"><span className="eyebrow !text-[hsl(var(--accent))]">Chiffre du mois</span><span className="display mt-12 block text-7xl text-[hsl(var(--accent))]">85 %</span><h3 className="display mt-3 text-2xl">des plants passent leur première saison sèche.</h3><p className="mt-5 text-sm leading-relaxed text-[hsl(var(--primary-foreground)/.62)]">Nous mesurons ce qui compte pour améliorer la prochaine parcelle, pas pour embellir le bilan.</p></article>
              <article className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-6"><span className="eyebrow">À lire avec une classe</span><h3 className="display mt-16 text-3xl leading-tight text-[hsl(var(--primary))]">Le petit guide des arbres de chez nous</h3><p className="mt-4 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">Reconnaître une essence, comprendre son rôle, raconter sa saison.</p><button className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-[hsl(var(--primary))]" onClick={() => scrollToId('contact')} data-testid="button-download-guide">Demander le guide <ExternalLink size={14} /></button></article>
            </div>
          </div>
        </section>

        <section id="contact" className="section-pad bg-[hsl(var(--background))]">
          <div className="section-wrap grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
             <div><p className="eyebrow mb-4">Passer à l’action</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">Votre place<br />est ici.</h2><p className="mt-6 max-w-[380px] leading-relaxed text-[hsl(var(--muted-foreground))]">Un projet, une question, une envie de retrousser vos manches ? Écrivez-nous. Notre coordination relie Genève et Abidjan, au plus près des équipes et des territoires.</p><div className="mt-8 flex items-center gap-3 text-sm font-semibold text-[hsl(var(--primary))]"><MapPin size={18} className="text-[hsl(var(--accent))]" /> Genève · Abidjan</div></div>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]"><Users size={19} /></span><h3 className="display text-2xl text-[hsl(var(--primary))]">Devenir bénévole</h3></div>{volunteerSent ? <div className="rounded-xl bg-[hsl(145 39% 48% / .14)] p-5 text-sm leading-relaxed text-[hsl(var(--primary))]" aria-live="polite" data-testid="status-volunteer-success"><Check className="mb-3" size={20} />Merci, votre envie est bien arrivée. L’équipe terrain vous répondra sous peu.</div> : <form onSubmit={(event) => handleForm(event, setVolunteerSent)}><label className="form-label" htmlFor="volunteer-name">Votre prénom</label><input id="volunteer-name" className="form-field mb-4" required placeholder="Aminata" data-testid="input-volunteer-name" /><label className="form-label" htmlFor="volunteer-email">Votre email</label><input id="volunteer-email" type="email" className="form-field mb-4" required placeholder="vous@exemple.ci" data-testid="input-volunteer-email" /><button className="btn-primary w-full" type="submit" data-testid="button-submit-volunteer">Rejoindre l’équipe <ArrowUpRight size={15} /></button></form>}</div>
              <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6"><div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--accent)/.2)] text-[hsl(var(--primary))]"><Send size={18} /></span><h3 className="display text-2xl text-[hsl(var(--primary))]">Nous écrire</h3></div>{contactSent ? <div className="rounded-xl bg-[hsl(145 39% 48% / .14)] p-5 text-sm leading-relaxed text-[hsl(var(--primary))]" aria-live="polite" data-testid="status-contact-success"><Check className="mb-3" size={20} />Message reçu. Merci de prendre part à cette conversation.</div> : <form onSubmit={(event) => handleForm(event, setContactSent)}><label className="form-label" htmlFor="contact-email">Votre email</label><input id="contact-email" type="email" className="form-field mb-4" required placeholder="vous@exemple.ci" data-testid="input-contact-email" /><label className="form-label" htmlFor="contact-message">Votre message</label><textarea id="contact-message" className="form-field mb-4 min-h-[94px] resize-none" required placeholder="Je souhaite en savoir plus…" data-testid="input-contact-message" /><button className="btn-primary w-full" type="submit" data-testid="button-submit-contact">Envoyer le message <Send size={15} /></button></form>}</div>
            </div>
          </div>
        </section>

        <section id="faq" className="section-pad bg-[hsl(var(--secondary))]">
          <div className="section-wrap grid gap-12 lg:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow mb-4">Questions fréquentes</p><h2 className="display text-5xl leading-[.96] tracking-[-.05em] text-[hsl(var(--primary))] md:text-6xl">Parlons<br />clair.</h2><p className="mt-6 max-w-[310px] text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">La transparence n’est pas une page à part. C’est la manière dont nous travaillons.</p></div><div>{faqs.map((faq, index) => <div className="faq-row" key={faq.q}><button className="faq-trigger" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index} data-testid={`button-faq-${index}`}><span>{faq.q}</span><span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--border))] transition-transform ${openFaq === index ? 'rotate-180 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : ''}`}>{openFaq === index ? <Minus size={14} /> : <ChevronDown size={14} />}</span></button>{openFaq === index && <p className="faq-answer" data-testid={`text-faq-answer-${index}`}>{faq.a}</p>}</div>)}</div></div>
        </section>
      </main>

      <footer id="newsletter" className="bg-[hsl(var(--primary))] py-14 text-[hsl(var(--primary-foreground))]">
        <div className="section-wrap">
           <div className="grid gap-10 border-b border-[hsl(var(--primary-foreground)/.16)] pb-12 md:grid-cols-[1fr_1fr] md:items-end"><div><div className="flex items-center gap-3"><img src="/images/gli-logo.jpeg" alt="Logo officiel de Green Legacy Initiative" className="h-10 w-10 rounded-full object-cover" /><span className="font-bold tracking-[-.03em]">GREEN LEGACY</span></div><h2 className="display mt-7 max-w-[510px] text-4xl leading-tight md:text-5xl">Une lettre, de vraies nouvelles du terrain.</h2></div><div>{newsletterSent ? <div className="flex items-center gap-3 rounded-xl bg-[hsl(var(--primary-foreground)/.1)] p-4 text-sm" aria-live="polite" data-testid="status-newsletter-success"><Check size={18} className="text-[hsl(var(--accent))]" />Vous êtes inscrit·e. À bientôt depuis la forêt.</div> : <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(event) => handleForm(event, setNewsletterSent)}><label className="sr-only" htmlFor="newsletter-email">Votre adresse email</label><input id="newsletter-email" className="form-field flex-1 border-[hsl(var(--primary-foreground)/.2)] bg-[hsl(var(--primary-foreground)/.08)] text-[hsl(var(--primary-foreground))] placeholder:text-[hsl(var(--primary-foreground)/.45)]" type="email" required placeholder="Votre adresse email" data-testid="input-newsletter-email" /><button className="btn-primary" type="submit" data-testid="button-submit-newsletter">S’inscrire <Mail size={15} /></button></form>}<p className="mt-3 text-xs text-[hsl(var(--primary-foreground)/.45)]">Un récit par mois. Jamais de bruit, toujours du concret.</p></div></div>
          <div className="grid gap-8 py-10 sm:grid-cols-3"><div><p className="eyebrow !text-[hsl(var(--accent))]">Explorer</p><div className="mt-4 flex flex-col gap-3"><button className="footer-link text-left" onClick={() => scrollToId('action')} data-testid="link-footer-action">Notre action</button><button className="footer-link text-left" onClick={() => scrollToId('programmes')} data-testid="link-footer-programs">Nos programmes</button><button className="footer-link text-left" onClick={() => scrollToId('terrain')} data-testid="link-footer-terrain">Carnet de terrain</button></div></div><div><p className="eyebrow !text-[hsl(var(--accent))]">Agir</p><div className="mt-4 flex flex-col gap-3"><button className="footer-link text-left" onClick={() => scrollToId('don')} data-testid="link-footer-donate">Faire un don</button><button className="footer-link text-left" onClick={() => scrollToId('contact')} data-testid="link-footer-volunteer">Devenir bénévole</button><button className="footer-link text-left" onClick={() => scrollToId('faq')} data-testid="link-footer-faq">Questions fréquentes</button></div></div><div><p className="eyebrow !text-[hsl(var(--accent))]">Nous trouver</p><div className="mt-4 flex flex-col gap-3 text-sm text-[hsl(var(--primary-foreground)/.65)]"><span>Abidjan, Côte d’Ivoire</span><span>bonjour@greenlegacy.ci</span><span>Instagram · LinkedIn</span></div></div></div>
           <div className="flex flex-col justify-between gap-3 border-t border-[hsl(var(--primary-foreground)/.16)] pt-6 text-xs text-[hsl(var(--primary-foreground)/.42)] md:flex-row"><span>© 2026 Green Legacy Initiative. Une forêt se construit ensemble.</span><span>ONG basée à Genève · actions de terrain en Côte d’Ivoire.</span></div>
        </div>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <ErrorBoundary resetKey={location}><Router /></ErrorBoundary>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;