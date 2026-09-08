import { db } from "@lvdi/database";

/**
 * One-time data fix: replaces the random Picsum placeholder images on the
 * 32 demo articles (inserted by seed-articles.ts before real photos were
 * sourced) with the real, topic-matched Cloudinary URLs below. Safe to
 * re-run — articles not found by slug are skipped and reported.
 */
const IMAGE_BY_SLUG: Record<string, string> = {
  "cannes-2026-la-selection-officielle-devoilee":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884380/cannes_opjkrq.webp",
  "chronique-ce-que-nos-habitudes-numeriques-disent-de-nous":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788889140/2198213_g9ktvz.webp",
  "cookies-et-traceurs-le-web-sapprete-a-changer-de-regles":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885059/cnil-cookie_bdp4uv.png",
  "decoupage-electoral-la-carte-contestee-par-plusieurs-elus-locaux":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885666/Cartes_opdrc3.webp",
  "edito-la-democratie-locale-merite-mieux-quun-debat-expedie":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885398/democratie_ptv9zh.jpg",
  "elections-municipales-les-listes-se-devoilent-au-compte-gouttes":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1782234194/lvdl/adgrhzq6yvh7yubykrnm.jpg",
  "inflation-les-prix-a-la-consommation-ralentissent-enfin":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884380/inflation_qaig0d.jpg",
  "la-rentree-litteraire-sannonce-particulierement-dense-cette-annee":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888601/livres_xk5hoz.jpg",
  "le-cinema-dauteur-retrouve-le-chemin-des-salles-obscures":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884983/cinema-auteur_zh3gdm.webp",
  "le-club-historique-decroche-sa-qualification-pour-la-finale-continentale":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888818/club-qualification_aeqbhr.jpg",
  "le-grand-tour-cycliste-devoile-un-parcours-plus-exigeant-que-jamais":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888968/1444x920_credit-obligatoire-photo-de-david-pastor-shutterstock-15459950bj-gianmarco-garofoli-ita-de-soudal-quick-step-lors-de-la-vuelta-80e-tour-d-espagne-2025-etape-5-course-cycliste-une-etape-de-contre-la-montre-par-equipes-de-24-1-km-de-figueres_k2orjz.jpg",
  "le-jeu-independant-le-plus-attendu-de-lannee-sort-enfin-sur-consoles":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888660/jeux-video_tqkqzp.webp",
  "le-retour-discret-du-loup-dans-trois-nouveaux-departements":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885124/loup_yykmcz.webp",
  "le-secteur-du-batiment-retrouve-des-couleurs-apres-deux-ans-de-crise":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884909/nexi_eyvcpg.webp",
  "les-marches-cloturent-en-forte-hausse-apres-les-annonces-de-la-banque-centrale":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885762/marche-finacier_sfomnd.jpg",
  "ligue-des-champions-le-tirage-au-sort-des-quarts-de-finale":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1782721378/lvdl/j7uiqimfnofmirrfixaj.jpg",
  "penurie-de-medicaments-les-pharmaciens-tirent-la-sonnette-dalarme":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884769/medicaments-_ah0bqn.jpg",
  "prix-de-limmobilier-un-premier-recul-depuis-cinq-ans-dans-les-grandes-metropoles":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888422/prix-immobilier_gbxuhv.webp",
  "reforme-de-la-carte-judiciaire-plusieurs-tribunaux-menaces-de-fermeture":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885253/reforme-tribunaux_d5b4tk.jpg",
  "reforme-des-retraites-ce-que-prevoit-le-nouveau-texte":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884380/reforme-retraites_zjpjtv.jpg",
  "reforme-du-baccalaureat-les-enseignants-denoncent-une-precipitation":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788889082/reforme-bac_hez5c5.jpg",
  "remaniement-ministeriel-trois-portefeuilles-cles-redistribues":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885550/remaniment_klqglp.webp",
  "sommet-climatique-un-accord-in-extremis-entre-les-grandes-puissances":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885452/accord-climat_xreaaa.webp",
  "tournoi-des-six-nations-un-dernier-match-decisif-pour-le-titre":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888918/5-nations_ahoqvu.jpg",
  "un-essai-clinique-prometteur-contre-une-maladie-rare":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788885315/essaie-clinique_rtywre.jpg",
  "un-festival-emblematique-devoile-une-programmation-resolument-eclectique":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888487/festival-electro_ynruyc.webp",
  "un-nouveau-modele-dia-generative-bat-les-records-de-rapidite":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884505/ia1_u4uj8j.webp",
  "un-nouveau-parc-eolien-offshore-mis-en-service-au-large-des-cotes":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788889017/ge_adpszz.jpg",
  "une-entreprise-industrielle-historique-annonce-un-plan-de-relocalisation":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888346/initial-slip-francais-broussaud-textiles_agqzfq.jpg",
  "une-nouvelle-exoplanete-potentiellement-habitable-detectee":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884699/nouvelle-planete-habitable_icuq8p.jpg",
  "une-serie-culte-confirme-le-tournage-de-sa-saison-finale":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788888735/from-season-5_fwg7oh.webp",
  "vague-de-chaleur-precoce-les-scientifiques-sinquietent":
    "https://res.cloudinary.com/dvgk2wubd/image/upload/v1788884595/les-vagues-de-chaleur-precoces-inquietent-les-experts-leur-impact-pourrait-etre-plus-important-que-celui-des-canicules_ztxhl7.jpg",
};

async function main() {
  let updated = 0;
  const skipped: string[] = [];

  for (const [slug, url] of Object.entries(IMAGE_BY_SLUG)) {
    const article = await db.article.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!article) {
      skipped.push(slug);
      continue;
    }

    await db.media.update({
      where: { articleId: article.id },
      data: { url, thumbnailUrl: url },
    });

    updated++;
    console.log(`Mis à jour : ${slug}`);
  }

  console.log(
    `\n${updated} article(s) mis à jour, ${skipped.length} ignoré(s).`
  );
  if (skipped.length > 0) {
    console.log("Ignorés (slug introuvable en DB) :", skipped);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    process.exit();
  });
