import {
  BookOpen,
  Leaf,
  Sprout,
  TreePine,
  Users,
} from 'lucide-react';
import type { Program, Project, TeamMember } from './site-content';

const solibraFieldStoryEn =
  'With our partner SOLIBRA, for its 70th anniversary, Green Legacy Initiative organized a reforestation drive followed by sustainable-development education with students from Mondoukro in Toumodi and Samoukaha in Dianra, restoring 5 hectares alongside the lessons.';

const yamoussoukroFieldStoryEn =
  'At the Arts and Culture in Schools Festival in Yamoussoukro, Green Legacy Initiative supplied the saplings used to reforest 1 hectare at the Résidentiel school group.';

export const siteContentEn = {
  team: [
    { name: 'Colonel Apata Nicolas', role: 'Project lead for the "One school, 5 hectares of forest" program · Colonel of the Eaux et Forêts (Water and Forestry Corps)' },
  ] satisfies TeamMember[],
  brand: {
    name: 'Green Legacy Initiative',
    strapline: 'Geneva-based NGO · Ivorian ground operations',
    email: 'ongreenlegacy.intitiative@gmail.com',
    locations: 'Abidjan · Agboville · Dabou · Korhogo · Grand-Bassam',
  },
  hero: {
    eyebrow: 'Geneva-based NGO · 2026 season',
    title: 'A local commitment, an international reach.',
    body: 'From Geneva, Green Legacy Initiative connects partners, schools and communities to grow forests and lasting solutions, with Côte d’Ivoire as its first ground of action.',
    quote: 'The forest is never far when we plant it together.',
    quoteBy: 'Awa, field coordinator',
  },
  programs: [
    { number: '01', icon: TreePine, title: 'One school, 5 hectares of forest', text: 'Every partner school turns a degraded plot into an open-air classroom, with students at the heart of the care it takes.' },
    { number: '02', icon: Sprout, title: 'Community nurseries', text: 'Local nurseries grow native species and create seasonal income for families.' },
    { number: '03', icon: BookOpen, title: 'Education through nature', text: 'Teaching tools in French and local languages reconnect children to the cycles of their land.' },
    { number: '04', icon: Users, title: 'Participatory work days', text: 'Residents, teachers and technical teams decide together where to plant, how to monitor, and what to pass on.' },
    { number: '05', icon: Leaf, title: 'Coastline & mangroves', text: 'In Grand-Bassam and lagoon-side villages, we restore shorelines with the communities who live along them.' },
  ] satisfies Program[],
  projects: [
    { id: 'solibra-groupe', image: '/images/gle-solibra-groupe.jpg', tagKey: 'partnerships', tag: 'Partnerships', title: 'A monitored planting', place: 'Samoukaha · Dianra', text: solibraFieldStoryEn },
    { id: 'solibra-planting', image: '/images/gle-solibra-planting.jpg', tagKey: 'partnerships', tag: 'Partnerships', title: 'Sustainable development education', place: 'Toumodi & Dianra', text: solibraFieldStoryEn },
    { id: 'festival-yamoussoukro-groupe', image: '/images/gle-festival-yamoussoukro-groupe.jpg', tagKey: 'schools', tag: 'Schools', title: 'A hectare for learning', place: 'Yamoussoukro · Résidentiel school group', text: yamoussoukroFieldStoryEn },
    { id: 'festival-yamoussoukro-plantation', image: '/images/gle-festival-yamoussoukro-plantation.jpg', tagKey: 'schools', tag: 'Schools', title: 'The schoolyard becomes a forest', place: 'Yamoussoukro · Résidentiel school group', text: yamoussoukroFieldStoryEn },
    { id: 'festival-officiels', image: '/images/gle-festival-officiels.jpg', tagKey: 'schools', tag: 'Schools', title: 'The school festival’s saplings', place: 'Yamoussoukro · Résidentiel school group', text: yamoussoukroFieldStoryEn },
    { id: 'festival-ceremonie', image: '/images/gle-festival-ceremonie.jpg', tagKey: 'schools', tag: 'Schools', title: 'A hectare for learning', place: 'Yamoussoukro · Résidentiel school group', text: yamoussoukroFieldStoryEn },
    { id: 'dabou', image: '/images/gli-school-forest.jpg', tagKey: 'schools', tag: 'Schools', title: 'The schoolyard becomes a forest', place: 'Dabou · Sud-Comoé', text: 'Students at the N’Guessankro school maintain 2 hectares of young saplings around their classroom.' },
    { id: 'korhogo', image: '/images/gli-community-nursery.jpg', tagKey: 'communities', tag: 'Communities', title: 'The nursery of many hands', place: 'Korhogo · Poro', text: 'A nursery of 12,000 saplings, run by 34 families, gets ready for the next rainy season.' },
    { id: 'agboville', image: '/images/gli-reforestation-plot.jpg', tagKey: 'forests', tag: 'Forests', title: 'Watching the soil come back to life', place: 'Agboville · Agnéby-Tiassa', text: 'On a former farm plot, rows of trees already trace a living corridor.' },
    { id: 'grand-bassam', image: '/images/gli-mangrove-restoration.jpg', tagKey: 'coastline', tag: 'Coastline', title: 'The lagoon’s roots', place: 'Grand-Bassam · Sud-Comoé', text: 'Residents replant mangroves to slow erosion and protect fish nurseries.' },
  ] satisfies Project[],
  faqs: [
    { q: 'Where are Green Legacy Initiative’s projects located?', a: 'All of our active projects are in Côte d’Ivoire. We work with schools and communities in Dabou, Agboville, Korhogo, Grand-Bassam and other Ivorian areas, depending on local partnerships.' },
    { q: 'What does a €30 donation actually fund?', a: 'As a guide, €30 funds 100 trees: the seed, the nursery bag, planting and initial monitoring. Part of it also supports training local teams and measuring survival rates.' },
    { q: 'How do you calculate surviving trees?', a: 'Field teams survey the plots at regular intervals. The survival rate is calculated on saplings tracked after their first dry season, not on a projection.' },
    { q: 'Can I come and take part in a work day?', a: 'Yes. We open several participatory days each rainy season. Leave us your details in the volunteer form and our team will suggest a date and a project that fits.' },
    { q: 'How do you track how donations are used?', a: 'Every project has a tracking sheet: plot, species, planting date and survival rate. We share an annual report and field news in our newsletter.' },
    { q: 'Can I get a tax receipt for my donation?', a: 'We’re currently working on making this available. Contact us directly if you need one, and we’ll follow up once the process is formalized.' },
    { q: 'Can I give on a recurring basis instead of a one-time gift?', a: 'Not yet through our online donation page, but the option is coming soon. In the meantime, write to us and we’ll set up a recurring donation with you directly.' },
  ],
};
