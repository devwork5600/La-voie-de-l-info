import { db } from "@lvdi/database";

import {
  CreateArticleSchema,
  CreateArticleSchemaType,
} from "@/validations/article-schemas";

/**
 * Seed data uses category/subcategory slugs rather than raw ids, since ids
 * differ per database. Slugs are resolved to real ids at runtime below.
 */
type SeedArticle = Omit<
  CreateArticleSchemaType,
  "categoryId" | "subCategoryId"
> & {
  categorySlug: string;
  subCategorySlug?: string;
};

const image = (seed: string) => `https://picsum.photos/seed/${seed}/1200/800`;

const SEED_ARTICLES: SeedArticle[] = [
  {
    categorySlug: "politique",
    title: "Réforme des retraites : ce que prévoit le nouveau texte",
    media: {
      type: "IMAGE",
      url: image("reforme-retraites"),
      thumbnailUrl: image("reforme-retraites"),
      alt: "Façade de l'Assemblée nationale",
      legend: "L'Assemblée nationale examine le texte en séance publique.",
    },
    parts: [
      {
        title: "Un calendrier resserré",
        content:
          "Le gouvernement a présenté ce matin les grandes lignes d'une réforme attendue depuis plusieurs mois. Les débats à l'Assemblée doivent débuter dès la semaine prochaine, avec un vote solennel prévu avant la fin du trimestre.",
      },
      {
        title: "Les points de crispation",
        content:
          "Syndicats et oppositions dénoncent une méthode jugée précipitée, tandis que la majorité défend un texte d'équilibre. Plusieurs amendements sont déjà annoncés sur les régimes spéciaux et l'âge pivot.",
      },
    ],
  },
  {
    categorySlug: "économie",
    title: "Inflation : les prix à la consommation ralentissent enfin",
    media: {
      type: "IMAGE",
      url: image("inflation-prix"),
      thumbnailUrl: image("inflation-prix"),
      alt: "Rayons d'un supermarché avec étiquettes de prix",
      legend:
        "La hausse des prix alimentaires marque le pas pour le troisième mois consécutif.",
    },
    parts: [
      {
        content:
          "Selon les derniers chiffres publiés ce jeudi, l'inflation annuelle recule à 2,1 %, son niveau le plus bas depuis deux ans. Une accalmie portée par la baisse des prix de l'énergie et une stabilisation des coûts agricoles.",
      },
      {
        title: "Un répit pour les ménages",
        content:
          "Les économistes restent prudents quant à la durée de cette embellie, alors que plusieurs indicateurs suggèrent une reprise progressive de la consommation d'ici la fin de l'année.",
      },
    ],
  },
  {
    categorySlug: "culture",
    title: "Cannes 2026 : la sélection officielle dévoilée",
    media: {
      type: "IMAGE",
      url: image("cannes-festival"),
      thumbnailUrl: image("cannes-festival"),
      alt: "Marches du Palais des Festivals à Cannes",
      legend: "Le Palais des Festivals se prépare à accueillir sa 79e édition.",
    },
    parts: [
      {
        content:
          "Vingt films en lice pour la Palme d'or, un jury présidé par une figure du cinéma international et plusieurs premières mondiales très attendues : la programmation de cette nouvelle édition promet d'être dense.",
      },
    ],
  },
  {
    categorySlug: "high-tech",
    subCategorySlug: "ia",
    title: "Un nouveau modèle d'IA générative bat les records de rapidité",
    media: {
      type: "IMAGE",
      url: image("ia-datacenter"),
      thumbnailUrl: image("ia-datacenter"),
      alt: "Rangées de serveurs dans un centre de données",
      legend:
        "Le modèle tourne sur une infrastructure dédiée annoncée cette semaine.",
    },
    parts: [
      {
        title: "Des gains de performance notables",
        content:
          "Le nouveau modèle affiche des temps de réponse divisés par trois par rapport à la génération précédente, tout en réduisant sensiblement la consommation énergétique par requête.",
      },
      {
        content:
          "Plusieurs entreprises du secteur ont déjà annoncé son intégration dans leurs outils, une adoption rapide qui confirme l'accélération de la course à l'IA générative.",
      },
    ],
  },
  {
    categorySlug: "écologie",
    subCategorySlug: "climat",
    title: "Vague de chaleur précoce : les scientifiques s'inquiètent",
    media: {
      type: "IMAGE",
      url: image("vague-chaleur"),
      thumbnailUrl: image("vague-chaleur"),
      alt: "Thermomètre affichant une température élevée en extérieur",
      legend:
        "Les températures dépassent déjà les normales saisonnières de plusieurs degrés.",
    },
    parts: [
      {
        content:
          "Pour la troisième année consécutive, un épisode de chaleur intense touche la région dès le début du printemps. Les climatologues y voient un signal supplémentaire du dérèglement en cours.",
      },
    ],
  },
  {
    categorySlug: "sport",
    subCategorySlug: "football",
    title: "Ligue des champions : le tirage au sort des quarts de finale",
    media: {
      type: "IMAGE",
      url: image("football-stade"),
      thumbnailUrl: image("football-stade"),
      alt: "Stade de football rempli de spectateurs en soirée",
      legend:
        "Les quarts de finale se joueront en avril dans une ambiance électrique.",
    },
    parts: [
      {
        content:
          "Le tirage au sort a réservé plusieurs affiches très attendues, avec deux confrontations entre anciens finalistes. Les matchs aller se disputeront dans deux semaines.",
      },
      {
        title: "Un calendrier chargé",
        content:
          "Les clubs encore engagés devront jongler entre compétition européenne et championnat national, dans un calendrier particulièrement dense en cette fin de saison.",
      },
    ],
  },
  {
    categorySlug: "sciences",
    subCategorySlug: "espace",
    title: "Une nouvelle exoplanète potentiellement habitable détectée",
    media: {
      type: "IMAGE",
      url: image("exoplanete-espace"),
      thumbnailUrl: image("exoplanete-espace"),
      alt: "Vue d'artiste d'une exoplanète depuis l'espace",
      legend: "L'exoplanète orbite dans la zone habitable de son étoile.",
    },
    parts: [
      {
        content:
          "L'équipe internationale à l'origine de la découverte estime que la planète, située à une quarantaine d'années-lumière, pourrait présenter des conditions favorables à la présence d'eau liquide en surface.",
      },
    ],
  },
  {
    categorySlug: "société",
    subCategorySlug: "sante",
    title:
      "Pénurie de médicaments : les pharmaciens tirent la sonnette d'alarme",
    media: {
      type: "IMAGE",
      url: image("pharmacie-medicaments"),
      thumbnailUrl: image("pharmacie-medicaments"),
      alt: "Étagères de pharmacie avec boîtes de médicaments",
      legend:
        "Plusieurs traitements courants manquent depuis plusieurs semaines.",
    },
    parts: [
      {
        title: "Des ruptures qui s'installent",
        content:
          "Antibiotiques, antidouleurs, traitements chroniques : les tensions d'approvisionnement touchent désormais un nombre croissant de médicaments essentiels, obligeant les officines à multiplier les solutions de substitution.",
      },
      {
        content:
          "Les autorités sanitaires annoncent un plan de renforcement des stocks stratégiques, sans toutefois donner de calendrier précis de résorption des pénuries.",
      },
    ],
  },
  {
    categorySlug: "politique",
    title: "Élections municipales : les listes se dévoilent au compte-gouttes",
    media: {
      type: "IMAGE",
      url: image("elections-municipales"),
      thumbnailUrl: image("elections-municipales"),
      alt: "Bureau de vote avec isoloirs",
      legend:
        "Le dépôt officiel des listes s'échelonnera jusqu'à la fin du mois.",
    },
    parts: [
      {
        content:
          "À quelques mois du scrutin, les états-majors locaux affinent leurs stratégies. Plusieurs figures sortantes ont confirmé leur candidature, tandis que de nouvelles alliances se dessinent dans les grandes villes.",
      },
      {
        title: "Une campagne sous tension",
        content:
          "Les thèmes de la sécurité et du pouvoir d'achat devraient dominer les débats, dans un contexte de défiance persistante envers les institutions locales.",
      },
    ],
  },
  {
    categorySlug: "économie",
    title:
      "Le secteur du bâtiment retrouve des couleurs après deux ans de crise",
    media: {
      type: "IMAGE",
      url: image("secteur-batiment"),
      thumbnailUrl: image("secteur-batiment"),
      alt: "Chantier de construction avec grue",
      legend:
        "Les mises en chantier repartent à la hausse pour la première fois depuis 2024.",
    },
    parts: [
      {
        content:
          "Portée par la baisse des taux d'intérêt et une demande de logements toujours forte, la filière du bâtiment affiche des carnets de commandes en nette amélioration ce trimestre.",
      },
    ],
  },
  {
    categorySlug: "culture",
    subCategorySlug: "cinema",
    title: "Le cinéma d'auteur retrouve le chemin des salles obscures",
    media: {
      type: "IMAGE",
      url: image("cinema-salle-obscure"),
      thumbnailUrl: image("cinema-salle-obscure"),
      alt: "Salle de cinéma vide avant une projection",
      legend:
        "Plusieurs salles indépendantes annoncent une fréquentation en hausse.",
    },
    parts: [
      {
        title: "Un public de retour",
        content:
          "Après plusieurs saisons difficiles, les salles art et essai enregistrent un regain de fréquentation, porté par une programmation resserrée autour de quelques succès critiques.",
      },
      {
        content:
          "Les distributeurs y voient un signe encourageant pour la diversité de l'offre, à l'heure où les plateformes de streaming continuent de dominer les usages.",
      },
    ],
  },
  {
    categorySlug: "high-tech",
    subCategorySlug: "web",
    title: "Cookies et traceurs : le web s'apprête à changer de règles",
    media: {
      type: "IMAGE",
      url: image("web-navigateur"),
      thumbnailUrl: image("web-navigateur"),
      alt: "Écran d'ordinateur affichant un navigateur web",
      legend:
        "La nouvelle réglementation entrera en vigueur dès le premier trimestre.",
    },
    parts: [
      {
        content:
          "Les principaux éditeurs de navigateurs annoncent la suppression progressive des cookies tiers, une évolution qui bouleverse les pratiques de la publicité en ligne.",
      },
    ],
  },
  {
    categorySlug: "écologie",
    subCategorySlug: "biodiversite",
    title: "Le retour discret du loup dans trois nouveaux départements",
    media: {
      type: "IMAGE",
      url: image("loup-foret"),
      thumbnailUrl: image("loup-foret"),
      alt: "Loup observé en lisière de forêt",
      legend:
        "Des traces confirmées par les services de l'Office français de la biodiversité.",
    },
    parts: [
      {
        title: "Une expansion surveillée de près",
        content:
          "La présence de l'espèce est désormais confirmée dans trois départements supplémentaires, relançant le débat entre défenseurs de la biodiversité et éleveurs inquiets pour leurs troupeaux.",
      },
      {
        content:
          "Un plan d'accompagnement renforcé doit être présenté aux professionnels concernés dans les prochaines semaines.",
      },
    ],
  },
  {
    categorySlug: "société",
    subCategorySlug: "justice",
    title:
      "Réforme de la carte judiciaire : plusieurs tribunaux menacés de fermeture",
    media: {
      type: "IMAGE",
      url: image("tribunal-justice"),
      thumbnailUrl: image("tribunal-justice"),
      alt: "Façade d'un palais de justice",
      legend:
        "Une dizaine de juridictions de proximité pourraient être regroupées.",
    },
    parts: [
      {
        content:
          "Le projet de réorganisation, présenté comme une mesure de rationalisation, suscite une forte opposition des avocats et des élus locaux qui redoutent un éloignement de la justice du quotidien.",
      },
    ],
  },
  {
    categorySlug: "sciences",
    subCategorySlug: "medecine",
    title: "Un essai clinique prometteur contre une maladie rare",
    media: {
      type: "IMAGE",
      url: image("laboratoire-recherche"),
      thumbnailUrl: image("laboratoire-recherche"),
      alt: "Chercheur en laboratoire manipulant des échantillons",
      legend: "L'essai de phase 2 a été mené auprès de 120 patients.",
    },
    parts: [
      {
        title: "Des résultats encourageants",
        content:
          "Les premiers résultats montrent une réduction significative des symptômes chez la majorité des patients traités, ouvrant la voie à un essai de phase 3 dès l'an prochain.",
      },
      {
        content:
          "L'équipe de recherche reste toutefois prudente, rappelant qu'un nombre plus large de patients devra être suivi avant toute autorisation de mise sur le marché.",
      },
    ],
  },
  {
    categorySlug: "opinions",
    subCategorySlug: "editos",
    title: "Édito : la démocratie locale mérite mieux qu'un débat expédié",
    media: {
      type: "IMAGE",
      url: image("edito-democratie"),
      thumbnailUrl: image("edito-democratie"),
      alt: "Hémicycle d'un conseil municipal en séance",
      legend:
        "Le débat sur la réforme territoriale a été bouclé en une seule séance.",
    },
    parts: [
      {
        content:
          "Réduire les débats sur l'avenir des collectivités à une simple formalité de calendrier, c'est prendre le risque de désincarner un peu plus l'échelon local aux yeux des citoyens.",
      },
    ],
  },
  {
    categorySlug: "politique",
    subCategorySlug: "international",
    title:
      "Sommet climatique : un accord in extremis entre les grandes puissances",
    media: {
      type: "IMAGE",
      url: image("sommet-international"),
      thumbnailUrl: image("sommet-international"),
      alt: "Délégations réunies autour d'une table de négociation",
      legend:
        "Les discussions se sont prolongées tard dans la nuit avant l'accord final.",
    },
    parts: [
      {
        content:
          "Après trois jours de négociations tendues, les principales délégations sont parvenues à un compromis sur les objectifs de réduction des émissions, jugé insuffisant par plusieurs ONG présentes sur place.",
      },
    ],
  },
  {
    categorySlug: "politique",
    subCategorySlug: "national",
    title: "Remaniement ministériel : trois portefeuilles clés redistribués",
    media: {
      type: "IMAGE",
      url: image("remaniement-gouvernement"),
      thumbnailUrl: image("remaniement-gouvernement"),
      alt: "Façade d'un ministère avec drapeaux",
      legend:
        "La nouvelle composition du gouvernement a été annoncée en fin de matinée.",
    },
    parts: [
      {
        title: "Un rééquilibrage attendu",
        content:
          "Ce remaniement, le premier depuis plusieurs mois, vise à resserrer les rangs de la majorité à l'approche d'échéances législatives importantes.",
      },
      {
        content:
          "Les oppositions dénoncent un simple jeu de chaises musicales, sans changement de cap sur le fond des politiques menées.",
      },
    ],
  },
  {
    categorySlug: "politique",
    subCategorySlug: "elections",
    title: "Découpage électoral : la carte contestée par plusieurs élus locaux",
    media: {
      type: "IMAGE",
      url: image("decoupage-electoral"),
      thumbnailUrl: image("decoupage-electoral"),
      alt: "Carte administrative affichée lors d'une réunion publique",
      legend:
        "Le nouveau tracé des circonscriptions doit entrer en vigueur avant le prochain scrutin.",
    },
    parts: [
      {
        content:
          "Plusieurs élus dénoncent un redécoupage qui favoriserait certaines formations politiques, tandis que la commission en charge du dossier défend une méthode strictement démographique.",
      },
    ],
  },
  {
    categorySlug: "économie",
    subCategorySlug: "bourse",
    title:
      "Les marchés clôturent en forte hausse après les annonces de la banque centrale",
    media: {
      type: "IMAGE",
      url: image("bourse-marches"),
      thumbnailUrl: image("bourse-marches"),
      alt: "Écrans de cotations boursières",
      legend:
        "L'indice principal gagne plus de 2 % sur la seule séance du jour.",
    },
    parts: [
      {
        content:
          "L'annonce d'une pause dans le resserrement monétaire a déclenché un net rebond des valeurs technologiques et bancaires, portant les indices à leur plus haut niveau depuis six mois.",
      },
    ],
  },
  {
    categorySlug: "économie",
    subCategorySlug: "entreprises",
    title:
      "Une entreprise industrielle historique annonce un plan de relocalisation",
    media: {
      type: "IMAGE",
      url: image("usine-relocalisation"),
      thumbnailUrl: image("usine-relocalisation"),
      alt: "Ligne de production dans une usine",
      legend:
        "Le site doit rouvrir avec près de 300 emplois créés d'ici deux ans.",
    },
    parts: [
      {
        title: "Un signal encourageant pour le secteur",
        content:
          "Après avoir délocalisé une partie de sa production il y a une décennie, le groupe mise sur l'automatisation pour rendre son site à nouveau compétitif face à la concurrence internationale.",
      },
      {
        content:
          "Les collectivités locales, qui ont participé au financement du projet, saluent une décision perçue comme un signe de réindustrialisation du territoire.",
      },
    ],
  },
  {
    categorySlug: "économie",
    subCategorySlug: "immobilier",
    title:
      "Prix de l'immobilier : un premier recul depuis cinq ans dans les grandes métropoles",
    media: {
      type: "IMAGE",
      url: image("immobilier-ville"),
      thumbnailUrl: image("immobilier-ville"),
      alt: "Vue aérienne d'immeubles résidentiels en centre-ville",
      legend: "La baisse concerne en premier lieu les grandes agglomérations.",
    },
    parts: [
      {
        content:
          "Portée par la remontée des taux d'emprunt ces dernières années, la correction des prix s'accentue dans plusieurs grandes villes, où les volumes de transactions restent toutefois limités.",
      },
    ],
  },
  {
    categorySlug: "culture",
    subCategorySlug: "musique",
    title:
      "Un festival emblématique dévoile une programmation résolument éclectique",
    media: {
      type: "IMAGE",
      url: image("festival-musique"),
      thumbnailUrl: image("festival-musique"),
      alt: "Scène de concert avec éclairages colorés",
      legend:
        "Plus de soixante artistes se produiront sur quatre scènes durant l'événement.",
    },
    parts: [
      {
        content:
          "Entre têtes d'affiche internationales et découvertes locales, l'édition de cette année entend renouer avec la diversité qui avait fait la réputation du festival à ses débuts.",
      },
    ],
  },
  {
    categorySlug: "culture",
    subCategorySlug: "livres",
    title: "La rentrée littéraire s'annonce particulièrement dense cette année",
    media: {
      type: "IMAGE",
      url: image("rentree-litteraire"),
      thumbnailUrl: image("rentree-litteraire"),
      alt: "Piles de livres sur une table de librairie",
      legend:
        "Plus de quatre cents romans sont attendus dans les librairies d'ici octobre.",
    },
    parts: [
      {
        title: "Une profusion de premiers romans",
        content:
          "Les éditeurs misent cette année sur un nombre record de primo-romanciers, dans un contexte où le marché du livre reste fragile malgré une fréquentation stable des librairies indépendantes.",
      },
    ],
  },
  {
    categorySlug: "culture",
    subCategorySlug: "jeux-video",
    title:
      "Le jeu indépendant le plus attendu de l'année sort enfin sur consoles",
    media: {
      type: "IMAGE",
      url: image("jeu-video-console"),
      thumbnailUrl: image("jeu-video-console"),
      alt: "Manette de jeu vidéo devant un écran allumé",
      legend: "Le titre était initialement prévu pour l'année dernière.",
    },
    parts: [
      {
        content:
          "Développé par un studio de moins de dix personnes, le jeu a suscité un engouement inattendu depuis la publication de ses premières images, au point de rivaliser avec les plus grosses productions du marché.",
      },
    ],
  },
  {
    categorySlug: "culture",
    subCategorySlug: "series",
    title: "Une série culte confirme le tournage de sa saison finale",
    media: {
      type: "IMAGE",
      url: image("tournage-serie"),
      thumbnailUrl: image("tournage-serie"),
      alt: "Plateau de tournage avec caméras et projecteurs",
      legend: "Le tournage doit s'étaler sur près de huit mois.",
    },
    parts: [
      {
        content:
          "Après plusieurs saisons saluées par la critique, la production a confirmé que cette ultime salve d'épisodes clôturera définitivement l'intrigue, sans laisser de porte ouverte à un spin-off.",
      },
    ],
  },
  {
    categorySlug: "sport",
    subCategorySlug: "basketball",
    title:
      "Le club historique décroche sa qualification pour la finale continentale",
    media: {
      type: "IMAGE",
      url: image("basketball-match"),
      thumbnailUrl: image("basketball-match"),
      alt: "Match de basketball en salle comble",
      legend:
        "La rencontre s'est jouée dans les dernières secondes du temps additionnel.",
    },
    parts: [
      {
        content:
          "Menés de dix points à l'entame du dernier quart-temps, les joueurs ont renversé la rencontre grâce à une série offensive décisive, portée par un capitaine des grands soirs.",
      },
    ],
  },
  {
    categorySlug: "sport",
    subCategorySlug: "rugby",
    title: "Tournoi des Six Nations : un dernier match décisif pour le titre",
    media: {
      type: "IMAGE",
      url: image("rugby-stade"),
      thumbnailUrl: image("rugby-stade"),
      alt: "Stade de rugby rempli sous les projecteurs",
      legend:
        "Trois équipes restent encore en course pour le titre avant la dernière journée.",
    },
    parts: [
      {
        title: "Un scénario à rebondissements",
        content:
          "Les résultats de la dernière journée pourraient rebattre les cartes du classement final, dans une compétition marquée cette année par une rare densité entre les équipes.",
      },
    ],
  },
  {
    categorySlug: "sport",
    subCategorySlug: "cyclisme",
    title:
      "Le grand tour cycliste dévoile un parcours plus exigeant que jamais",
    media: {
      type: "IMAGE",
      url: image("cyclisme-montagne"),
      thumbnailUrl: image("cyclisme-montagne"),
      alt: "Peloton de cyclistes gravissant une route de montagne",
      legend: "L'édition comptera cette année cinq étapes de haute montagne.",
    },
    parts: [
      {
        content:
          "Les organisateurs promettent un tracé particulièrement sélectif, avec plusieurs ascensions inédites qui pourraient bouleverser la hiérarchie établie ces dernières saisons.",
      },
    ],
  },
  {
    categorySlug: "écologie",
    subCategorySlug: "energies",
    title: "Un nouveau parc éolien offshore mis en service au large des côtes",
    media: {
      type: "IMAGE",
      url: image("eolien-offshore"),
      thumbnailUrl: image("eolien-offshore"),
      alt: "Éoliennes offshore alignées en mer",
      legend:
        "Le parc doit couvrir la consommation électrique de près de 800 000 foyers.",
    },
    parts: [
      {
        content:
          "Après plusieurs années de retard liées à des recours administratifs, l'installation entre officiellement en service, une étape saluée par les acteurs de la filière renouvelable.",
      },
    ],
  },
  {
    categorySlug: "société",
    subCategorySlug: "education",
    title:
      "Réforme du baccalauréat : les enseignants dénoncent une précipitation",
    media: {
      type: "IMAGE",
      url: image("education-lycee"),
      thumbnailUrl: image("education-lycee"),
      alt: "Salle de classe de lycée vide",
      legend: "La réforme doit entrer en application dès la rentrée prochaine.",
    },
    parts: [
      {
        content:
          "Les syndicats enseignants réclament un report de la mise en œuvre, estimant que les établissements n'ont pas eu le temps nécessaire pour adapter leurs organisations pédagogiques.",
      },
    ],
  },
  {
    categorySlug: "opinions",
    subCategorySlug: "chroniques",
    title: "Chronique : ce que nos habitudes numériques disent de nous",
    media: {
      type: "IMAGE",
      url: image("chronique-numerique"),
      thumbnailUrl: image("chronique-numerique"),
      alt: "Personne consultant son téléphone dans la rue",
      legend:
        "Une consultation devenue quasi permanente pour une large partie de la population.",
    },
    parts: [
      {
        content:
          "À force de vouloir tout suivre en temps réel, on finit peut-être par ne plus rien regarder vraiment. Une question de rythme, plus que de technologie.",
      },
    ],
  },
];

async function main() {
  const author = await db.user.findFirst({
    where: { role: { in: ["AUTHOR", "ADMIN"] } },
  });

  if (!author) {
    throw new Error(
      "Aucun utilisateur AUTHOR ou ADMIN trouvé : impossible d'assigner les articles seedés."
    );
  }

  for (const seed of SEED_ARTICLES) {
    const category = await db.category.findUnique({
      where: { slug: seed.categorySlug },
    });

    if (!category) {
      console.warn(
        `Catégorie introuvable, article ignoré : ${seed.categorySlug}`
      );
      continue;
    }

    let subCategoryId = "";
    if (seed.subCategorySlug) {
      const subCategory = await db.category.findUnique({
        where: { slug: seed.subCategorySlug },
      });
      if (subCategory) subCategoryId = subCategory.id;
    }

    const data: CreateArticleSchemaType = {
      title: seed.title,
      categoryId: category.id,
      subCategoryId,
      media: seed.media,
      parts: seed.parts,
    };

    const validated = CreateArticleSchema.parse(data);

    const slug = validated.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const finalCategoryId =
      validated.subCategoryId && validated.subCategoryId !== ""
        ? validated.subCategoryId
        : validated.categoryId;

    const existing = await db.article.findUnique({ where: { slug } });
    if (existing) {
      console.log(`Déjà présent, ignoré : ${slug}`);
      continue;
    }

    await db.article.create({
      data: {
        title: validated.title,
        slug,
        authorId: author.id,
        categoryId: finalCategoryId,
        published: true,
        publishedAt: new Date(),
        media: {
          create: {
            type: validated.media.type,
            url: validated.media.url,
            thumbnailUrl: validated.media.thumbnailUrl,
            alt: validated.media.alt,
            legend: validated.media.legend,
          },
        },
        parts: {
          create: validated.parts.map((part, index) => ({
            title: part.title || null,
            content: part.content,
            order: index,
          })),
        },
      },
    });

    console.log(`Créé : ${slug}`);
  }

  console.log("Seed terminé.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    process.exit();
  });
