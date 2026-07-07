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
          "Le gouvernement a présenté ce matin les grandes lignes d'une réforme attendue depuis plusieurs mois, au terme de semaines de tractations discrètes avec les partenaires sociaux. Les débats à l'Assemblée doivent débuter dès la semaine prochaine, avec un vote solennel prévu avant la fin du trimestre, un calendrier que l'exécutif juge indispensable pour tenir ses engagements budgétaires. Plusieurs ministres se sont relayés toute la matinée pour défendre un texte présenté comme équilibré, tandis que les présidents de groupe parlementaire recevaient déjà les premières moutures des amendements attendus dans les prochains jours.",
      },
      {
        title: "Les points de crispation",
        content:
          "Syndicats et oppositions dénoncent une méthode jugée précipitée, tandis que la majorité défend un texte d'équilibre censé garantir la pérennité du système sans remettre en cause ses fondements. Plusieurs amendements sont déjà annoncés sur les régimes spéciaux et l'âge pivot, deux sujets qui avaient déjà provoqué de vives tensions lors des précédentes tentatives de réforme. Les principales centrales syndicales ont prévenu qu'elles ne excluaient pas d'appeler à une mobilisation si le texte n'évoluait pas sensiblement d'ici la fin des débats parlementaires, tout en réclamant l'ouverture immédiate de nouvelles concertations sectorielles.",
      },
      {
        title: "Vers un compromis ?",
        content:
          "Plusieurs groupes parlementaires évoquent des marges de négociation sur le calendrier de mise en œuvre, estimant qu'un étalement plus progressif pourrait désamorcer une partie de la contestation sans dénaturer l'esprit du texte. Le gouvernement se dit ouvert à des ajustements, sans toucher aux paramètres centraux du texte, une position que plusieurs observateurs jugent habile pour éviter un blocage total tout en préservant l'essentiel de sa réforme. Des consultations informelles se poursuivent en coulisses avec les groupes charnières, dont le soutien pourrait s'avérer décisif lors du vote final.",
      },
      {
        title: "Les prochaines étapes du débat",
        content:
          "Le texte doit désormais être examiné en commission avant son passage en séance publique, une phase durant laquelle plusieurs centaines d'amendements sont déjà attendus de toutes parts. Les débats promettent d'être longs, certains élus évoquant déjà la possibilité d'un examen prolongé sur plusieurs semaines si aucun accord de méthode n'est trouvé entre les groupes. En cas de blocage persistant à l'Assemblée, le gouvernement n'exclut pas de recourir à des outils constitutionnels permettant d'accélérer l'adoption du texte, une option qui attiserait toutefois davantage la colère de l'opposition.",
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
          "Selon les derniers chiffres publiés ce jeudi par l'institut national de la statistique, l'inflation annuelle recule à 2,1 %, son niveau le plus bas depuis deux ans, confirmant une tendance amorcée au début du printemps. Cette accalmie est portée par la baisse des prix de l'énergie, en repli de près de 6 % sur un an, et par une stabilisation des coûts agricoles après plusieurs saisons marquées par des récoltes irrégulières. Les analystes soulignent que ce ralentissement, s'il se confirme dans les prochains mois, pourrait redonner des marges de manœuvre significatives à la politique monétaire.",
      },
      {
        title: "Un répit pour les ménages",
        content:
          "Les économistes restent prudents quant à la durée de cette embellie, alors que plusieurs indicateurs suggèrent une reprise progressive de la consommation d'ici la fin de l'année, notamment dans les secteurs de l'équipement du foyer et des loisirs. Les enquêtes de confiance menées auprès des ménages montrent une amélioration sensible du moral, même si une large majorité des personnes interrogées continue de déclarer arbitrer ses achats en fonction des prix. Les associations de consommateurs appellent toutefois à ne pas crier victoire trop vite, rappelant que certains postes de dépense restent nettement supérieurs à leur niveau d'avant la crise.",
      },
      {
        title: "Des disparités selon les secteurs",
        content:
          "Si les prix de l'alimentaire et de l'énergie reculent nettement, les services continuent d'afficher une hausse plus soutenue, portée par les coûts salariaux dans plusieurs branches à forte intensité de main-d'œuvre comme la restauration ou les services à la personne. Cette divergence illustre la complexité du reflux inflationniste, qui ne se traduit pas de manière homogène dans le panier de consommation des ménages. Plusieurs fédérations professionnelles réclament désormais un allègement des charges pour limiter la répercussion de ces hausses sur les prix finaux, estimant que la pression sur les marges devient difficilement soutenable dans certains secteurs.",
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
          "Vingt films en lice pour la Palme d'or, un jury présidé par une figure du cinéma international et plusieurs premières mondiales très attendues : la programmation de cette nouvelle édition promet d'être particulièrement dense, selon les organisateurs qui ont présenté la sélection lors d'une conférence de presse à Paris. Plusieurs œuvres attendues depuis des mois figurent enfin au programme, aux côtés de projets tenus secrets jusqu'à la dernière minute pour préserver l'effet de surprise auprès du public et de la critique internationale.",
      },
      {
        title: "Des habitués et de nouveaux venus",
        content:
          "Aux côtés de plusieurs cinéastes déjà primés par le passé, dont certains reviennent sur la Croisette pour la troisième ou quatrième fois, la sélection fait la part belle à une nouvelle génération de réalisateurs venus d'Amérique du Sud et d'Asie. Cette diversité géographique, saluée par plusieurs critiques dès l'annonce de la sélection, s'inscrit dans une volonté affichée par la direction du festival d'élargir les horizons de la compétition officielle après plusieurs années jugées trop centrées sur les cinématographies européennes et nord-américaines.",
      },
      {
        title: "Un dispositif de sécurité renforcé",
        content:
          "Face à l'affluence croissante enregistrée ces dernières années, les organisateurs annoncent un renforcement des contrôles d'accès et une extension des zones réservées au public sur la Croisette, en concertation avec les autorités locales. Ce dispositif, déployé dès les premiers jours du festival, doit permettre de fluidifier la circulation autour du Palais tout en garantissant la sécurité des célébrités et des professionnels accrédités, dans un contexte de mobilisation policière accrue lors des grands événements internationaux.",
      },
      {
        title: "Une compétition parallèle très suivie",
        content:
          "Au-delà de la sélection officielle, la Semaine de la critique et la Quinzaine des cinéastes dévoileront elles aussi leurs propres programmations dans les prochains jours, souvent considérées comme des révélateurs de talents avant leur consécration en compétition officielle. Plusieurs professionnels du secteur estiment que ces sections parallèles sont devenues, au fil des éditions, un baromètre au moins aussi fiable que la compétition principale pour repérer les cinéastes qui marqueront le cinéma mondial dans la décennie à venir.",
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
          "Le nouveau modèle affiche des temps de réponse divisés par trois par rapport à la génération précédente, tout en réduisant sensiblement la consommation énergétique par requête, selon les données publiées par l'entreprise à l'origine du projet. Ces gains seraient le fruit d'une refonte complète de l'architecture interne du modèle, associée à des optimisations matérielles spécifiquement conçues pour ce cas d'usage. Les premiers benchmarks indépendants, menés par plusieurs laboratoires universitaires, semblent confirmer ces annonces, même si certains chercheurs appellent à des tests plus approfondis avant de tirer des conclusions définitives.",
      },
      {
        content:
          "Plusieurs entreprises du secteur ont déjà annoncé son intégration dans leurs outils, une adoption rapide qui confirme l'accélération de la course à l'IA générative observée depuis le début de l'année. Des géants du logiciel aux jeunes pousses spécialisées, l'ensemble de l'écosystème semble vouloir capitaliser sur ces avancées pour proposer des services plus réactifs à leurs utilisateurs finaux, quitte à revoir en profondeur leurs propres feuilles de route technologiques dans les mois qui viennent.",
      },
      {
        title: "Des interrogations sur les coûts d'entraînement",
        content:
          "Si les gains d'inférence sont salués, plusieurs chercheurs rappellent que les coûts de développement de ces modèles restent considérables et concentrés entre quelques acteurs disposant des infrastructures nécessaires. Cette concentration soulève des questions sur l'accès équitable à ces technologies pour les acteurs plus modestes, qui peinent à suivre le rythme d'investissement des géants du secteur. Plusieurs voix appellent à une mutualisation accrue des ressources de calcul, notamment via des consortiums académiques, pour éviter que l'innovation ne devienne l'apanage exclusif d'une poignée d'entreprises.",
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
          "Pour la troisième année consécutive, un épisode de chaleur intense touche la région dès le début du printemps, bien avant les épisodes caniculaires habituellement observés en plein cœur de l'été. Les climatologues y voient un signal supplémentaire du dérèglement en cours, s'inquiétant particulièrement de la précocité et de la répétition de ce type d'événements ces dernières années. Plusieurs stations locales rapportent des sols déjà anormalement secs pour la saison, ce qui pourrait aggraver les tensions sur la ressource en eau dans les mois à venir.",
      },
      {
        title: "Des records battus dès le mois de mars",
        content:
          "Plusieurs stations météorologiques ont enregistré des températures supérieures de six à huit degrés aux normales saisonnières, un écart jugé préoccupant à une période habituellement tempérée de l'année. Certains records locaux, établis il y a plusieurs décennies, ont été battus de plusieurs degrés en quelques jours seulement, un phénomène que les services météorologiques qualifient d'exceptionnel par son ampleur et sa durée. Les prévisionnistes n'excluent pas que cet épisode se prolonge encore plusieurs jours avant un retour progressif à des valeurs plus conformes à la saison.",
      },
      {
        title: "Des mesures de précaution anticipées",
        content:
          "Les autorités sanitaires appellent à la vigilance auprès des personnes âgées et des travailleurs en extérieur, et envisagent d'avancer le déclenchement du plan canicule cette année, habituellement activé à la mi-juin. Des points d'eau et des salles climatisées pourraient être ouverts au public dans plusieurs communes dès la semaine prochaine si les températures se maintenaient à ce niveau. Les services agricoles, de leur côté, redoutent un stress hydrique précoce pour certaines cultures sensibles, ce qui pourrait peser sur les rendements de la saison si aucune précipitation significative n'intervient rapidement.",
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
          "Le tirage au sort a réservé plusieurs affiches très attendues, avec deux confrontations entre anciens finalistes qui promettent un spectacle de haut niveau dès les matchs aller. Les matchs aller se disputeront dans deux semaines, dans des stades qui affichent déjà complet pour la plupart des rencontres au programme. Les supporters des clubs qualifiés se préparent à un déplacement massif, les agences de voyages spécialisées rapportant une demande en forte hausse pour les billets combinés transport et places de match.",
      },
      {
        title: "Un calendrier chargé",
        content:
          "Les clubs encore engagés devront jongler entre compétition européenne et championnat national, dans un calendrier particulièrement dense en cette fin de saison où chaque match compte double pour les objectifs sportifs et financiers des différentes équipes. Plusieurs entraîneurs ont déjà annoncé vouloir faire tourner leur effectif lors des rencontres nationales les moins décisives, quitte à froisser une partie de leurs supporters, afin de préserver leurs cadres pour les échéances européennes jugées prioritaires par les directions sportives.",
      },
      {
        title: "Les favoris sous pression",
        content:
          "Les deux tenants du titre partagé se retrouvent dans la même moitié de tableau, ce qui garantit une élimination précoce de l'un des grands favoris de la compétition avant même les demi-finales. Cette configuration inattendue relance totalement le suspense autour du sacre final, plusieurs observateurs estimant que la voie est désormais plus dégagée que prévu pour les autres prétendants encore en lice. Les bookmakers ont d'ailleurs revu leurs pronostics à la baisse pour les deux favoris concernés dans les heures qui ont suivi l'annonce du tirage.",
      },
      {
        title: "Des retrouvailles chargées d'histoire",
        content:
          "Deux des affiches tirées au sort opposent des clubs qui s'étaient déjà croisés à plusieurs reprises lors d'éditions précédentes, parfois dans des circonstances mémorables restées gravées dans la mémoire des supporters. Ces retrouvailles suscitent déjà une intense couverture médiatique dans les pays concernés, où la presse sportive multiplie les rappels historiques et les analyses tactiques en amont des premières confrontations, attendues comme des sommets du football européen.",
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
          "L'équipe internationale à l'origine de la découverte estime que la planète, située à une quarantaine d'années-lumière de la Terre, pourrait présenter des conditions favorables à la présence d'eau liquide en surface, un critère central dans la recherche de mondes potentiellement habitables. Les premières simulations climatiques suggèrent une température de surface compatible avec cette hypothèse, bien que de nombreuses inconnues subsistent encore sur la composition exacte de son atmosphère et sur l'activité de son étoile hôte.",
      },
      {
        title: "Une détection rendue possible par un nouvel instrument",
        content:
          "C'est grâce à un spectromètre de nouvelle génération que les chercheurs ont pu analyser la composition de l'atmosphère de la planète avec une précision inédite, en observant la lumière filtrée par celle-ci lors de son passage devant son étoile. Cette technique, affinée au fil des dernières années, permet désormais de détecter des traces de vapeur d'eau ou d'autres composés chimiques à des distances qui semblaient hors de portée il y a encore une décennie, ouvrant la voie à une nouvelle génération de découvertes.",
      },
      {
        title: "Des observations complémentaires attendues",
        content:
          "Un temps d'observation supplémentaire a déjà été accordé à l'équipe pour confirmer ces premiers résultats, dont la publication complète est attendue dans les prochains mois dans une revue scientifique à comité de lecture. Plusieurs équipes concurrentes à travers le monde ont d'ores et déjà manifesté leur intérêt pour reproduire ces observations de manière indépendante, une étape jugée indispensable avant toute conclusion définitive sur le potentiel réellement habitable de cette exoplanète.",
      },
      {
        title: "Un enjeu qui dépasse la seule communauté scientifique",
        content:
          "Au-delà du cercle restreint des astrophysiciens, cette annonce suscite un vif intérêt du grand public, régulièrement fasciné par la perspective de découvrir des mondes susceptibles d'abriter la vie. Plusieurs agences spatiales évoquent déjà la possibilité d'orienter de futures missions d'observation vers cette région du ciel, dans l'espoir d'affiner encore la compréhension de ce système planétaire situé à une distance qui, à l'échelle cosmique, reste relativement proche de notre propre système solaire.",
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
          "Antibiotiques, antidouleurs, traitements chroniques : les tensions d'approvisionnement touchent désormais un nombre croissant de médicaments essentiels, obligeant les officines à multiplier les solutions de substitution pour continuer à servir leurs patients. Certaines pharmacies rapportent devoir contacter jusqu'à une dizaine de confrères avant de trouver une référence disponible, une situation qui n'était jusqu'ici observée que pour des molécules très spécifiques et qui touche aujourd'hui des traitements du quotidien utilisés par des millions de patients chaque année.",
      },
      {
        content:
          "Les autorités sanitaires annoncent un plan de renforcement des stocks stratégiques, sans toutefois donner de calendrier précis de résorption des pénuries, ce qui alimente l'inquiétude des professionnels de santé confrontés quotidiennement à ces difficultés. Plusieurs laboratoires pointent des difficultés d'approvisionnement en matières premières, souvent produites hors d'Europe, comme l'une des causes structurelles de ces tensions récurrentes qui ne semblent plus se limiter aux périodes de forte demande saisonnière.",
      },
      {
        title: "Les pharmaciens en première ligne",
        content:
          "Sur le terrain, les équipes officinales décrivent des journées rythmées par les appels aux confrères et les recherches de références équivalentes, au détriment du temps consacré aux patients et aux autres missions de conseil qui incombent à la profession. Plusieurs syndicats professionnels réclament un assouplissement temporaire des règles de substitution, qui permettrait aux pharmaciens de proposer plus facilement des alternatives thérapeutiques sans devoir systématiquement recontacter le médecin prescripteur, une démarche jugée chronophage dans le contexte actuel.",
      },
      {
        title: "Une prise de conscience politique encore timide",
        content:
          "Plusieurs parlementaires ont récemment interpellé le gouvernement sur cette question, réclamant une relocalisation partielle de la production de certains médicaments jugés stratégiques pour réduire la dépendance aux importations lointaines. Ces annonces restent pour l'instant peu suivies d'effets concrets selon les représentants de la profession, qui appellent à des mesures d'urgence immédiates plutôt qu'à des réformes structurelles dont les effets ne se feraient sentir que dans plusieurs années.",
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
          "À quelques mois du scrutin, les états-majors locaux affinent leurs stratégies dans une ambiance de tractations parfois tendues entre alliés de circonstance et rivaux historiques. Plusieurs figures sortantes ont confirmé leur candidature, tandis que de nouvelles alliances se dessinent dans les grandes villes, parfois au prix de ruptures spectaculaires avec des partenaires de la mandature précédente qui n'ont pas manqué de faire réagir la classe politique locale.",
      },
      {
        title: "Une campagne sous tension",
        content:
          "Les thèmes de la sécurité et du pouvoir d'achat devraient dominer les débats, dans un contexte de défiance persistante envers les institutions locales que plusieurs enquêtes d'opinion continuent de mesurer depuis les précédents scrutins. Les candidats multiplient déjà les déplacements de terrain et les réunions publiques pour tenter de renouer le contact avec des électeurs jugés de plus en plus volatils, quand ils ne se détournent pas purement et simplement des urnes.",
      },
      {
        title: "Une abstention encore incertaine",
        content:
          "Les instituts de sondage restent prudents sur le niveau de participation attendu, alors que les précédents scrutins locaux ont été marqués par une désaffection croissante des électeurs, particulièrement sensible dans les quartiers populaires et chez les plus jeunes générations. Plusieurs associations d'éducation civique multiplient les initiatives pour tenter d'enrayer cette tendance, sans certitude sur leur capacité à inverser un mouvement de fond observé depuis maintenant plusieurs cycles électoraux consécutifs.",
      },
      {
        title: "Des enjeux locaux parfois éclipsés",
        content:
          "Plusieurs observateurs regrettent que les débats nationaux tendent à prendre le pas sur les problématiques proprement municipales, comme la gestion des services publics de proximité ou l'aménagement urbain, pourtant au cœur des compétences des futurs élus. Cette nationalisation croissante des scrutins locaux inquiète une partie de la classe politique, qui y voit un facteur supplémentaire de désintérêt des électeurs pour un échelon pourtant considéré comme le plus proche de leurs préoccupations quotidiennes.",
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
          "Portée par la baisse des taux d'intérêt et une demande de logements toujours forte, la filière du bâtiment affiche des carnets de commandes en nette amélioration ce trimestre, un signal encourageant après deux années particulièrement difficiles marquées par de nombreuses défaillances d'entreprises. Les fédérations professionnelles évoquent une reprise progressive mais réelle, qui pourrait s'accélérer si les conditions de financement continuaient à s'assouplir dans les mois à venir.",
      },
      {
        title: "L'emploi reprend des couleurs",
        content:
          "Les fédérations professionnelles annoncent plusieurs milliers de créations de postes dans le second œuvre, un secteur qui peinait à recruter depuis la crise de 2023 et qui avait vu de nombreux artisans quitter la profession faute de commandes suffisantes. Les organismes de formation rapportent un regain d'intérêt pour les métiers du bâtiment chez les jeunes actifs, un mouvement encore modeste mais que les professionnels espèrent voir s'amplifier dans les prochaines années.",
      },
      {
        title: "Des tensions persistantes sur les matériaux",
        content:
          "Le prix de certains matériaux reste toutefois volatile, ce qui incite les professionnels à sécuriser leurs approvisionnements sur des périodes plus longues qu'auparavant, quitte à immobiliser davantage de trésorerie dans les stocks. Plusieurs entreprises ont mis en place des clauses de révision de prix plus systématiques dans leurs contrats, une pratique qui s'est généralisée depuis les épisodes de forte volatilité observés ces dernières années sur les marchés des matières premières.",
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
          "Après plusieurs saisons difficiles, les salles art et essai enregistrent un regain de fréquentation, porté par une programmation resserrée autour de quelques succès critiques qui ont su fidéliser un public exigeant et régulier. Les exploitants évoquent une audience plus jeune que par le passé, séduite par une offre qui se distingue nettement des propositions des grandes plateformes de streaming, notamment par la dimension collective de l'expérience en salle.",
      },
      {
        content:
          "Les distributeurs y voient un signe encourageant pour la diversité de l'offre, à l'heure où les plateformes de streaming continuent de dominer les usages quotidiens d'une large partie de la population. Plusieurs professionnels du secteur estiment que cette embellie reste néanmoins fragile et qu'elle dépendra largement de la capacité des salles indépendantes à continuer de proposer une programmation différenciée, capable de justifier le déplacement du public face à la facilité du visionnage à domicile.",
      },
      {
        title: "Le rôle clé des rencontres avec les réalisateurs",
        content:
          "Plusieurs exploitants attribuent ce regain d'intérêt à la multiplication des avant-premières et des échanges avec les équipes de films, un format plébiscité par un public plus jeune en quête d'une expérience qui dépasse la simple projection. Ces rencontres, souvent organisées en partenariat avec des associations locales ou des établissements scolaires, permettent également de sensibiliser de nouveaux spectateurs à des œuvres qu'ils n'auraient probablement pas découvertes autrement.",
      },
      {
        title: "Un modèle économique encore fragile",
        content:
          "Malgré ces signaux positifs, de nombreuses salles indépendantes continuent de dépendre fortement des subventions publiques pour équilibrer leurs comptes, un soutien dont plusieurs élus locaux réclament aujourd'hui la pérennisation dans un contexte budgétaire pourtant tendu. Les représentants de la profession appellent à une réflexion de fond sur le financement de ces établissements, qu'ils considèrent comme des acteurs essentiels de la vie culturelle locale, en particulier dans les villes moyennes.",
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
          "Les principaux éditeurs de navigateurs annoncent la suppression progressive des cookies tiers, une évolution qui bouleverse les pratiques de la publicité en ligne établies depuis plus de deux décennies. Cette transition, amorcée depuis plusieurs années déjà par certains acteurs, s'accélère nettement à mesure que les dernières échéances techniques approchent, contraignant l'ensemble de l'écosystème publicitaire à revoir en profondeur ses méthodes de ciblage et de mesure d'audience.",
      },
      {
        title: "Le secteur publicitaire en pleine réorganisation",
        content:
          "Les régies publicitaires accélèrent le déploiement de solutions alternatives fondées sur des données agrégées et anonymisées, moins précises mais jugées plus respectueuses de la vie privée des internautes. Plusieurs grands annonceurs ont déjà entamé des tests grandeur nature de ces nouvelles approches, avec des résultats jugés encourageants même s'ils restent, pour l'instant, en deçà des performances obtenues grâce au ciblage individualisé traditionnel.",
      },
      {
        title: "Un calendrier encore flou pour les éditeurs de sites",
        content:
          "De nombreux éditeurs indépendants s'inquiètent d'un manque de visibilité sur le calendrier exact de bascule, qui pourrait affecter une partie de leurs revenus publicitaires dans une période déjà marquée par une forte pression économique sur la presse en ligne. Plusieurs syndicats professionnels réclament un accompagnement spécifique pour les plus petites structures, qui disposent rarement des moyens techniques nécessaires pour s'adapter rapidement à ces nouvelles contraintes réglementaires et technologiques.",
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
          "La présence de l'espèce est désormais confirmée dans trois départements supplémentaires, relançant le débat entre défenseurs de la biodiversité et éleveurs inquiets pour leurs troupeaux dans des territoires où le prédateur n'avait plus été observé depuis plusieurs décennies. Les services scientifiques chargés du suivi de la population lupine confirment une expansion progressive mais régulière depuis maintenant plusieurs années, portée notamment par la recolonisation naturelle de certains massifs forestiers.",
      },
      {
        content:
          "Un plan d'accompagnement renforcé doit être présenté aux professionnels concernés dans les prochaines semaines, avec pour objectif de concilier la protection de l'espèce, désormais bien installée sur le territoire national, et le maintien d'une activité pastorale économiquement viable dans les zones les plus exposées. Les chambres d'agriculture des départements concernés ont d'ores et déjà demandé à être associées étroitement à l'élaboration de ce dispositif.",
      },
      {
        title: "Des mesures de protection des troupeaux renforcées",
        content:
          "Des subventions pour l'installation de clôtures électrifiées et le recours à des chiens de protection seront proposées aux éleveurs des zones nouvellement concernées, sur le modèle de dispositifs déjà expérimentés dans les massifs alpins depuis plusieurs années. Les premiers retours d'expérience font état d'une efficacité réelle mais partielle de ces mesures, qui ne suppriment pas totalement le risque de prédation mais permettent d'en réduire sensiblement la fréquence.",
      },
      {
        title: "Un débat qui dépasse la seule question agricole",
        content:
          "Au-delà des enjeux économiques pour la filière d'élevage, le retour du loup ravive des tensions plus anciennes entre acteurs ruraux et associations environnementales, chacun campant souvent sur des positions difficilement conciliables. Plusieurs élus locaux appellent à une gestion plus différenciée selon les territoires, estimant que les mesures nationales actuelles ne prennent pas suffisamment en compte les réalités très contrastées des zones d'élevage concernées par cette expansion.",
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
          "Le projet de réorganisation, présenté comme une mesure de rationalisation, suscite une forte opposition des avocats et des élus locaux qui redoutent un éloignement de la justice du quotidien pour les habitants des territoires concernés. Le ministère justifie ce projet par la nécessité de mutualiser certains moyens humains et matériels, dans un contexte de charge de travail croissante pour les juridictions déjà en sous-effectif chronique depuis plusieurs années.",
      },
      {
        title: "Des barreaux vent debout",
        content:
          "Plusieurs conseils de l'ordre ont voté des motions de protestation, redoutant un allongement des délais de traitement et une perte d'attractivité pour les jeunes avocats qui pourraient hésiter à s'installer dans des zones où l'activité judiciaire se réduirait sensiblement. Des rassemblements devant plusieurs palais de justice concernés ont déjà réuni des dizaines de professionnels, robe noire sur le dos, pour manifester leur opposition symbolique au projet.",
      },
      {
        title: "Une concertation promise par la Chancellerie",
        content:
          "Le ministère de la Justice assure qu'aucune décision ne sera prise sans consultation préalable des juridictions et des collectivités concernées, une promesse accueillie avec scepticisme par une partie des professionnels échaudés par de précédentes réformes menées selon eux dans la précipitation. Des réunions de concertation doivent débuter dans les prochaines semaines dans chacun des territoires potentiellement concernés par un regroupement de juridictions.",
      },
      {
        title: "Des conséquences redoutées pour les justiciables",
        content:
          "Au-delà des professionnels du droit, plusieurs associations d'aide aux victimes s'inquiètent des conséquences concrètes de cette réorganisation pour les justiciables les plus modestes, souvent dans l'incapacité de se déplacer sur de longues distances pour faire valoir leurs droits. Elles réclament, en cas de fermeture confirmée de certaines juridictions, la mise en place de permanences délocalisées régulières afin de maintenir un accès effectif à la justice sur l'ensemble du territoire concerné.",
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
          "Les premiers résultats montrent une réduction significative des symptômes chez la majorité des patients traités, ouvrant la voie à un essai de phase 3 dès l'an prochain si les autorités sanitaires donnent leur feu vert dans les délais espérés par l'équipe de recherche. Cette avancée est saluée comme l'une des plus importantes de ces dernières années pour une pathologie qui touche seulement quelques milliers de personnes à l'échelle nationale, et pour laquelle les options thérapeutiques restaient jusqu'ici très limitées.",
      },
      {
        content:
          "L'équipe de recherche reste toutefois prudente, rappelant qu'un nombre plus large de patients devra être suivi avant toute autorisation de mise sur le marché, une étape qui nécessite généralement plusieurs années de travaux complémentaires. Les chercheurs insistent sur l'importance de documenter précisément les effets secondaires observés durant cette phase, même mineurs, afin de garantir un profil de sécurité solide avant tout élargissement de la population traitée.",
      },
      {
        title: "Un espoir pour les associations de patients",
        content:
          "Les associations concernées saluent une avancée majeure après des années sans traitement ciblé, tout en appelant à un accès rapide et équitable une fois le médicament homologué, quel que soit le lieu de résidence ou la situation sociale des patients concernés. Plusieurs représentants de patients ont été associés dès les premières phases de l'essai, une pratique de plus en plus courante que les chercheurs jugent précieuse pour orienter les protocoles vers les besoins réels du quotidien.",
      },
      {
        title: "Un financement encore incertain pour la suite",
        content:
          "Le passage à la phase 3, plus coûteuse et plus longue, nécessitera des financements supplémentaires que l'équipe de recherche est encore en train de sécuriser auprès d'investisseurs publics et privés. Plusieurs fondations spécialisées dans les maladies rares ont déjà manifesté leur intérêt pour soutenir la suite du projet, un enjeu crucial pour des pathologies qui, en raison de leur faible prévalence, peinent souvent à attirer les financements des grands laboratoires pharmaceutiques.",
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
          "Réduire les débats sur l'avenir des collectivités à une simple formalité de calendrier, c'est prendre le risque de désincarner un peu plus l'échelon local aux yeux des citoyens, déjà nombreux à se détourner des urnes lors des scrutins municipaux. Une séance expédiée en quelques heures, sur un sujet qui engage pourtant l'organisation des territoires pour les décennies à venir, envoie un signal préoccupant sur la place réellement accordée à la délibération démocratique dans nos institutions locales.",
      },
      {
        title: "Un symptôme plus large",
        content:
          "Cette précipitation n'est pas un cas isolé : elle illustre une tendance de fond où les réformes territoriales se discutent de plus en plus loin des assemblées locales elles-mêmes, souvent arbitrées en amont dans des cercles restreints avant même d'être soumises au débat public. Les élus locaux, pourtant premiers concernés, se retrouvent régulièrement placés devant le fait accompli, avec des marges de manœuvre limitées pour amender des textes déjà largement verrouillés en coulisses.",
      },
      {
        title: "Redonner du temps au débat local",
        content:
          "Il serait pourtant simple, et peu coûteux, d'allouer davantage de temps à ces discussions essentielles, quitte à repousser légèrement certaines échéances administratives pour permettre une véritable appropriation collective des enjeux par les élus et par les citoyens qu'ils représentent. La démocratie locale ne se résume pas à un vote formel : elle suppose un débat contradictoire, nourri, et suffisamment long pour que chacun puisse en mesurer véritablement les implications concrètes sur le quotidien des habitants.",
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
          "Après trois jours de négociations tendues, les principales délégations sont parvenues à un compromis sur les objectifs de réduction des émissions, jugé insuffisant par plusieurs ONG présentes sur place mais salué comme une avancée réelle par la plupart des chefs de délégation. Les tractations se sont poursuivies jusqu'aux petites heures du matin, plusieurs pays menaçant à tour de rôle de quitter la table des négociations avant qu'un texte de compromis ne soit finalement trouvé.",
      },
      {
        title: "Des engagements financiers en suspens",
        content:
          "La question du financement des pays les plus vulnérables face au dérèglement climatique a occupé une grande partie des débats, sans qu'un accord chiffré ne soit finalement acté dans le texte final adopté au petit matin. Plusieurs pays en développement ont exprimé leur déception face à ce qu'ils considèrent comme un manque d'ambition persistant des économies les plus riches, historiquement responsables de la majeure partie des émissions cumulées de gaz à effet de serre.",
      },
      {
        title: "Un rendez-vous fixé pour l'an prochain",
        content:
          "Les délégations se sont accordées sur un prochain sommet de suivi, chargé d'évaluer les premiers effets concrets des engagements pris cette semaine et, le cas échéant, de les réviser à la hausse si les objectifs actuels s'avéraient insuffisants au regard des dernières données scientifiques disponibles. Ce mécanisme de révision régulière, déjà utilisé lors de précédents sommets, reste toutefois critiqué par certains experts qui y voient un moyen de repousser sans cesse les décisions les plus difficiles.",
      },
      {
        title: "Des réactions contrastées sur la scène internationale",
        content:
          "Si plusieurs chefs d'État ont salué un accord obtenu malgré des positions de départ très éloignées, de nombreuses organisations environnementales ont dénoncé un texte jugé trop timide au regard de l'urgence climatique rappelée une nouvelle fois par les derniers rapports scientifiques internationaux. Les marchés financiers, de leur côté, ont réagi de manière mesurée à l'annonce de l'accord, plusieurs analystes estimant que son impact concret sur les politiques énergétiques nationales resterait limité à court terme.",
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
          "Ce remaniement, le premier depuis plusieurs mois, vise à resserrer les rangs de la majorité à l'approche d'échéances législatives importantes qui s'annoncent particulièrement disputées selon les derniers sondages d'opinion. Plusieurs figures montantes de la majorité font leur entrée au gouvernement, un choix présenté par l'exécutif comme le signe d'un renouvellement générationnel assumé, tandis que d'autres ministres plus expérimentés voient leurs attributions élargies.",
      },
      {
        content:
          "Les oppositions dénoncent un simple jeu de chaises musicales, sans changement de cap sur le fond des politiques menées depuis le début du mandat, estimant que ce remaniement relève davantage de la communication politique que d'une réelle inflexion des orientations gouvernementales. Plusieurs éditorialistes partagent cette analyse, tout en reconnaissant que la nouvelle configuration ministérielle pourrait néanmoins modifier sensiblement les équilibres internes de la majorité dans les mois à venir.",
      },
      {
        title: "Trois profils aux parcours contrastés",
        content:
          "Les nouveaux ministres nommés viennent d'horizons variés, entre anciens élus locaux et figures issues de la société civile, un choix présenté comme un signal d'ouverture destiné à élargir la base politique du gouvernement au-delà de son socle traditionnel. Ces nominations ont été précédées de plusieurs jours de consultations discrètes, certains noms évoqués par la presse ayant finalement été écartés au profit de profils jugés plus consensuels par l'entourage du chef de l'État.",
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
          "Plusieurs élus dénoncent un redécoupage qui favoriserait certaines formations politiques, tandis que la commission en charge du dossier défend une méthode strictement démographique fondée sur les derniers recensements officiels disponibles. Ce nouveau tracé, présenté comme une simple mise à jour technique par ses concepteurs, modifie pourtant sensiblement les équilibres politiques de plusieurs circonscriptions historiques, ce qui explique en grande partie la vivacité des réactions suscitées depuis sa publication.",
      },
      {
        title: "Une méthode contestée",
        content:
          "Les critères retenus pour le nouveau tracé, notamment l'évolution démographique sur dix ans, sont jugés trop favorables aux zones périurbaines par plusieurs élus de circonscriptions rurales, qui redoutent une perte d'influence politique de leurs territoires au profit des grandes agglomérations. Plusieurs associations d'élus ruraux ont commandé une contre-expertise indépendante afin de vérifier la fiabilité des données démographiques utilisées pour justifier ce redécoupage controversé.",
      },
      {
        title: "Un recours déjà annoncé",
        content:
          "Plusieurs collectifs d'élus indiquent vouloir saisir le Conseil constitutionnel avant l'adoption définitive du texte, ce qui pourrait retarder son entrée en vigueur et compliquer l'organisation du prochain scrutin si la procédure judiciaire venait à s'éterniser. Les services du Conseil ont fait savoir qu'ils traiteraient ce dossier avec une attention particulière, compte tenu des précédents contentieux qui avaient déjà émaillé de précédentes opérations de redécoupage électoral dans le pays.",
      },
      {
        title: "Des précédents qui nourrissent la méfiance",
        content:
          "Ce n'est pas la première fois qu'un redécoupage électoral suscite une telle controverse : plusieurs opérations similaires menées par le passé avaient elles aussi fait l'objet de recours, parfois couronnés de succès pour les élus contestataires. Cette histoire contentieuse alimente aujourd'hui la méfiance d'une partie de la classe politique locale envers un exercice pourtant censé relever d'une logique purement technique et dépolitisée.",
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
          "L'annonce d'une pause dans le resserrement monétaire a déclenché un net rebond des valeurs technologiques et bancaires, portant les indices à leur plus haut niveau depuis six mois lors d'une séance particulièrement animée sur l'ensemble des places financières européennes. Les cambistes évoquent un net regain d'appétit pour le risque de la part des investisseurs institutionnels, encore prudents ces dernières semaines dans un contexte de forte incertitude macroéconomique.",
      },
      {
        title: "Les valeurs technologiques en tête",
        content:
          "Les principales capitalisations du secteur ont gagné plus de 4 % en une seule séance, portées par des perspectives de résultats trimestriels supérieures aux attentes formulées par plusieurs bureaux d'analyse ces dernières semaines. Cette performance remarquable a largement contribué à tirer l'ensemble des indices vers le haut, le secteur technologique représentant désormais une part significative de la capitalisation boursière totale des principales places financières mondiales.",
      },
      {
        title: "Une prudence de mise pour la suite",
        content:
          "Plusieurs analystes appellent toutefois à la prudence, estimant que ce rebond pourrait s'essouffler rapidement si les prochains indicateurs d'inflation venaient à surprendre à la hausse, ravivant du même coup les craintes d'un nouveau resserrement monétaire. Les prochaines publications macroéconomiques, attendues dans les jours qui viennent, seront scrutées de très près par l'ensemble des opérateurs de marché avant toute nouvelle prise de position significative.",
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
          "Après avoir délocalisé une partie de sa production il y a une décennie, le groupe mise sur l'automatisation pour rendre son site à nouveau compétitif face à la concurrence internationale, dans un contexte où le coût du transport et les risques géopolitiques rendent les chaînes d'approvisionnement longues de plus en plus incertaines. Cette décision, mûrie depuis plusieurs années, s'accompagne d'un investissement conséquent dans des équipements de dernière génération.",
      },
      {
        content:
          "Les collectivités locales, qui ont participé au financement du projet, saluent une décision perçue comme un signe de réindustrialisation du territoire après plusieurs années marquées par la fermeture successive de plusieurs sites industriels dans la région. Les élus locaux espèrent que cette annonce pourra faire tache d'huile et inciter d'autres entreprises du secteur à envisager des mouvements similaires dans les mois et années à venir.",
      },
      {
        title: "Des formations dès la rentrée",
        content:
          "Un partenariat avec les lycées professionnels de la région doit permettre de former les futurs opérateurs aux nouvelles lignes automatisées avant l'ouverture du site, une démarche jugée indispensable face à la pénurie de compétences techniques observée dans plusieurs bassins d'emploi industriels du pays. Les premières promotions d'apprentis devraient intégrer ces formations spécifiques dès la rentrée prochaine, en lien étroit avec les équipes techniques de l'entreprise.",
      },
      {
        title: "Un pari qui reste à confirmer",
        content:
          "Si l'annonce a été largement saluée, plusieurs économistes rappellent que la viabilité à long terme de ce type de relocalisation dépendra fortement de l'évolution des coûts de l'énergie et de la main-d'œuvre qualifiée dans les années à venir. D'autres tentatives similaires menées par le passé dans d'autres secteurs industriels n'ont pas toujours tenu leurs promesses initiales, ce qui invite à un optimisme prudent quant à la pérennité de ce nouveau projet.",
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
          "Portée par la remontée des taux d'emprunt ces dernières années, la correction des prix s'accentue dans plusieurs grandes villes, où les volumes de transactions restent toutefois limités par rapport aux années précédentes marquées par une activité particulièrement soutenue sur le marché résidentiel. Les notaires rapportent des délais de vente sensiblement rallongés, signe d'un marché où acheteurs et vendeurs peinent encore à s'accorder sur un juste prix.",
      },
      {
        title: "Des disparités marquées entre les villes",
        content:
          "La baisse dépasse les 5 % sur un an dans certaines métropoles particulièrement concernées par le repli, tandis que d'autres villes moyennes continuent d'afficher des prix stables, voire en légère hausse, portées par un regain d'attractivité résidentielle depuis quelques années. Ces trajectoires contrastées illustrent une recomposition plus large des dynamiques territoriales du marché immobilier français, encore accentuée par l'essor du télétravail observé depuis plusieurs années.",
      },
      {
        title: "Un marché encore attentiste",
        content:
          "Les professionnels du secteur notent un nombre croissant de vendeurs prêts à négocier, mais des acheteurs qui restent en attente d'une baisse plus marquée des taux d'intérêt avant de concrétiser leurs projets d'acquisition. Cette situation d'attente réciproque contribue à ralentir sensiblement le rythme des transactions, plusieurs agences immobilières évoquant une année particulièrement calme malgré un contexte de prix globalement plus favorable aux acquéreurs qu'il y a deux ans.",
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
          "Entre têtes d'affiche internationales et découvertes locales, l'édition de cette année entend renouer avec la diversité qui avait fait la réputation du festival à ses débuts, après plusieurs éditions jugées par certains observateurs trop centrées sur un même style musical. Les organisateurs revendiquent une programmation volontairement éclectique, mêlant des artistes confirmés à des propositions plus expérimentales portées par une nouvelle génération de musiciens.",
      },
      {
        title: "Une scène dédiée aux artistes émergents",
        content:
          "Pour la première fois, une scène entière sera consacrée aux talents locaux repérés lors d'un appel à candidatures qui a réuni plus de trois cents groupes venus de toute la région, un dispositif salué par les acteurs de la scène musicale indépendante. Cette initiative, pensée comme un tremplin pour de jeunes artistes encore peu connus du grand public, doit également permettre au festival de renforcer son ancrage territorial auprès des habitants.",
      },
      {
        title: "Une billetterie qui s'annonce tendue",
        content:
          "Les organisateurs anticipent une forte demande et recommandent aux festivaliers de réserver rapidement, alors que plusieurs jours affichent déjà complet en prévente plusieurs semaines avant le début de l'événement. Cette affluence anticipée s'explique en partie par le retour de plusieurs artistes très attendus, absents de la programmation depuis de nombreuses années et dont le retour a été accueilli avec un enthousiasme particulier par les habitués du festival.",
      },
      {
        title: "Un impact économique local significatif",
        content:
          "Au-delà de sa dimension culturelle, l'événement représente également un enjeu économique important pour les commerces et l'hôtellerie de la région, qui enregistrent traditionnellement un pic d'activité durant les jours du festival. Les collectivités locales, partenaires historiques de l'événement, saluent régulièrement les retombées indirectes de cette manifestation, devenue au fil des années un rendez-vous incontournable du calendrier culturel estival.",
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
          "Les éditeurs misent cette année sur un nombre record de primo-romanciers, dans un contexte où le marché du livre reste fragile malgré une fréquentation stable des librairies indépendantes, qui continuent de jouer un rôle central dans la découverte de nouvelles voix littéraires. Plusieurs maisons d'édition évoquent un renouvellement générationnel réel parmi les auteurs publiés cette rentrée, avec une attention particulière portée à la diversité des parcours et des univers représentés.",
      },
      {
        title: "Les librairies indépendantes en première ligne",
        content:
          "Face à ce volume inédit de nouveautés, les libraires indépendants jouent un rôle de plus en plus déterminant dans la mise en avant des textes les moins médiatisés, souvent noyés dans la masse des sorties si aucun relais local ne vient les signaler aux lecteurs. Plusieurs enseignes organisent déjà des rencontres avec les auteurs dans les semaines qui précèdent la rentrée, une manière de créer un lien direct entre les écrivains et leur futur lectorat.",
      },
      {
        title: "Des prix littéraires sous forte attente",
        content:
          "Les jurys des principaux prix d'automne annoncent une sélection particulièrement disputée cette année, avec plusieurs premiers romans déjà pressentis parmi les favoris dès les premières listes établies par la presse spécialisée. Cette effervescence autour des prix littéraires, si elle stimule les ventes des ouvrages sélectionnés, suscite aussi les critiques habituelles de certains auteurs et éditeurs qui dénoncent une concentration excessive de l'attention médiatique sur un nombre restreint de titres.",
      },
      {
        title: "Un marché du livre toujours sous tension",
        content:
          "Malgré l'abondance des nouveautés, les professionnels du secteur rappellent que le marché du livre reste structurellement fragile, confronté à la concurrence des écrans et à une érosion progressive du temps consacré à la lecture chez une partie du public, notamment les plus jeunes générations. Plusieurs initiatives de médiation autour du livre se multiplient dans les établissements scolaires pour tenter d'inverser cette tendance sur le long terme.",
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
          "Développé par un studio de moins de dix personnes, le jeu a suscité un engouement inattendu depuis la publication de ses premières images, au point de rivaliser avec les plus grosses productions du marché en termes de couverture médiatique et d'attentes du public. Cette réussite, rare pour une équipe de cette taille, illustre la capacité du secteur indépendant à produire des expériences marquantes avec des moyens sans commune mesure avec ceux des grands studios.",
      },
      {
        title: "Un développement mouvementé",
        content:
          "Le studio a dû repousser la sortie à deux reprises pour peaufiner l'équilibrage du jeu, une décision saluée par une communauté de joueurs restée fidèle malgré l'attente, qui a suivi de près chaque étape du développement via les réseaux sociaux et les journaux de bord réguliers publiés par l'équipe. Ces reports successifs, souvent mal perçus dans l'industrie, ont ici été largement compris et même encouragés par des joueurs soucieux de recevoir un jeu abouti plutôt qu'une sortie précipitée.",
      },
      {
        title: "Déjà des suites envisagées",
        content:
          "Face à l'accueil critique unanime, les développeurs n'excluent pas de prolonger l'univers du jeu, sans toutefois donner de calendrier précis pour un éventuel second opus qui nécessiterait probablement un développement tout aussi long et minutieux que le premier. L'équipe indique vouloir avant tout se concentrer sur le support post-lancement du titre actuel, notamment via des mises à jour de contenu gratuites promises aux joueurs dans les prochains mois.",
      },
      {
        title: "Un succès commercial qui dépasse les attentes",
        content:
          "Les premiers chiffres de vente communiqués par le studio dépassent largement les projections initiales, permettant à l'équipe d'envisager sereinement l'avenir après plusieurs années de développement financées sur fonds propres et grâce à une campagne de financement participatif. Ce succès commercial, rare pour une production de cette envergure, pourrait inspirer d'autres studios indépendants à se lancer dans des projets tout aussi ambitieux.",
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
          "Après plusieurs saisons saluées par la critique, la production a confirmé que cette ultime salve d'épisodes clôturera définitivement l'intrigue, sans laisser de porte ouverte à un spin-off contrairement à ce que de nombreux fans espéraient encore récemment. Cette annonce, faite lors d'un événement spécial retransmis en direct, a immédiatement suscité une vague de réactions sur les réseaux sociaux, entre tristesse de voir l'aventure s'achever et curiosité pour un dénouement très attendu.",
      },
      {
        title: "Un casting presque entièrement réuni",
        content:
          "La quasi-totalité des acteurs historiques de la série a confirmé son retour pour cette ultime saison, à l'exception d'un second rôle dont l'absence reste pour l'instant inexpliquée par la production, alimentant déjà de nombreuses spéculations parmi les fans les plus assidus. Plusieurs interprètes ont évoqué, lors de la présentation officielle, l'émotion particulière de retrouver une dernière fois un personnage qu'ils incarnent depuis maintenant plusieurs années.",
      },
      {
        title: "Une diffusion événement annoncée",
        content:
          "La plateforme de diffusion prévoit une sortie hebdomadaire plutôt qu'une mise en ligne groupée, un choix destiné à prolonger l'attente autour du dénouement de l'intrigue et à maximiser les discussions en ligne semaine après semaine, à la manière des diffusions télévisées traditionnelles. Ce format, de plus en plus rare à l'heure du visionnage groupé, est présenté par la plateforme comme un hommage assumé à l'expérience collective qui a fait le succès de la série à ses débuts.",
      },
      {
        title: "Des retombées économiques déjà anticipées",
        content:
          "Au-delà de l'aspect narratif, cette dernière saison représente également un enjeu commercial majeur pour la plateforme, qui espère capitaliser sur l'engouement suscité par la conclusion de la série pour attirer de nouveaux abonnés. Plusieurs produits dérivés sont d'ores et déjà en préparation, et une exposition itinérante consacrée à l'univers de la série doit accompagner la diffusion des derniers épisodes dans plusieurs grandes villes.",
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
          "Menés de dix points à l'entame du dernier quart-temps, les joueurs ont renversé la rencontre grâce à une série offensive décisive, portée par un capitaine des grands soirs qui a inscrit à lui seul dix-huit points dans les douze dernières minutes de jeu. La salle, comble depuis le début de la rencontre, a vécu un final à couper le souffle, avec un dénouement qui ne s'est joué qu'à la toute dernière possession de la prolongation.",
      },
      {
        title: "Une remontée collective",
        content:
          "Au-delà de la performance individuelle du capitaine, c'est l'ensemble du banc qui a répondu présent, avec une défense resserrée qui a totalement asphyxié l'attaque adverse dans les moments les plus critiques de la rencontre. L'entraîneur, visiblement ému au coup de sifflet final, a salué en conférence de presse l'état d'esprit collectif de son groupe, capable selon lui de puiser des ressources mentales rares dans les matchs à élimination directe.",
      },
      {
        title: "Une finale à haut risque",
        content:
          "Le club affrontera en finale une équipe invaincue depuis le début de la saison, dans ce qui s'annonce comme la rencontre la plus attendue de l'année sur la scène continentale du basketball. Les observateurs les plus expérimentés estiment que ce sera l'un des matchs les plus disputés de la décennie, tant les deux équipes affichent des profils complémentaires et un niveau de jeu exceptionnel depuis le début de la campagne.",
      },
      {
        title: "Une ferveur populaire grandissante",
        content:
          "Cette qualification a provoqué un véritable engouement dans la ville du club, où plusieurs milliers de supporters se sont massés devant des écrans géants installés en centre-ville pour suivre la fin de la rencontre. Les autorités locales évoquent déjà la mise en place d'un dispositif spécial pour accueillir dans de bonnes conditions l'affluence attendue lors de la diffusion publique de la finale, qui pourrait battre tous les records d'audience du club.",
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
          "Les résultats de la dernière journée pourraient rebattre les cartes du classement final, dans une compétition marquée cette année par une rare densité entre les équipes qui rend tout pronostic particulièrement hasardeux à quelques jours du dénouement. Jamais depuis plusieurs éditions un tel niveau d'incertitude n'avait entouré la dernière journée du tournoi, au grand plaisir des observateurs et des amateurs de rugby international.",
      },
      {
        title: "Trois équipes encore en lice",
        content:
          "Un scénario inédit se dessine où la différence de points inscrits pourrait départager les trois prétendants au titre, à égalité parfaite au nombre de victoires avant cette ultime journée décisive. Les statisticiens spécialisés multiplient déjà les simulations pour anticiper les différents cas de figure possibles selon les scores finaux des trois rencontres programmées simultanément, une configuration rarissime dans l'histoire récente de la compétition.",
      },
      {
        title: "Des absences qui pourraient peser",
        content:
          "Plusieurs cadres sont incertains pour cette dernière journée, ce qui pourrait rebattre les plans de sélectionneurs déjà sous pression après une saison marquée par un nombre de blessures supérieur à la moyenne des précédentes éditions. Les staffs médicaux de plusieurs équipes travaillent sans relâche ces derniers jours pour évaluer précisément la disponibilité de leurs joueurs clés avant l'annonce des compositions officielles, attendue avec impatience par les supporters.",
      },
      {
        title: "Une ambiance électrique attendue dans les stades",
        content:
          "Les trois rencontres décisives se joueront à guichets fermés, dans des stades qui promettent une ambiance électrique à la hauteur de l'enjeu sportif de cette ultime journée. Les diffuseurs télévisés annoncent des audiences potentiellement records, plusieurs chaînes ayant mobilisé des moyens de retransmission exceptionnels pour couvrir simultanément les trois matchs qui décideront du vainqueur final du tournoi.",
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
          "Les organisateurs promettent un tracé particulièrement sélectif, avec plusieurs ascensions inédites qui pourraient bouleverser la hiérarchie établie ces dernières saisons entre les principaux prétendants à la victoire finale. La présentation officielle du parcours, très attendue chaque année par les équipes professionnelles, a suscité de nombreuses réactions parmi les coureurs, certains évoquant déjà un tracé parmi les plus exigeants de la dernière décennie.",
      },
      {
        title: "Cinq étapes de haute montagne",
        content:
          "Le parcours comptera un nombre record d'étapes alpines, dont deux arrivées au sommet inédites, de quoi séduire les grimpeurs purs au détriment des spécialistes du contre-la-montre qui pourraient voir leurs chances de victoire finale sérieusement compromises. Les organisateurs assument pleinement ce choix, estimant que le spectacle offert par les grands cols de montagne reste l'un des principaux attraits de la compétition pour les millions de téléspectateurs suivant chaque étape.",
      },
      {
        title: "Les favoris déjà sur leurs gardes",
        content:
          "Plusieurs équipes annoncent avoir déjà reconnu les portions les plus exigeantes du tracé, signe de l'importance stratégique accordée à cette édition par les principaux prétendants à la victoire finale, qui préparent leur saison entière autour de cet objectif prioritaire. Certains directeurs sportifs évoquent des stages de reconnaissance spécifiquement organisés plusieurs mois à l'avance, un investissement logistique et financier considérable qui témoigne de l'enjeu que représente cette course dans le calendrier cycliste international.",
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
          "Après plusieurs années de retard liées à des recours administratifs, l'installation entre officiellement en service, une étape saluée par les acteurs de la filière renouvelable qui y voient une avancée majeure pour la transition énergétique du pays. La mise en service de ce parc, l'un des plus vastes jamais construits sur cette façade maritime, marque également une étape symbolique pour l'ensemble de la filière industrielle nationale de l'éolien en mer.",
      },
      {
        title: "Un chantier retardé par plusieurs recours",
        content:
          "Le projet avait fait l'objet de multiples contestations juridiques de la part d'associations de riverains et de pêcheurs, avant d'être validé en dernier ressort par la justice administrative après plusieurs années de procédures qui avaient considérablement retardé le calendrier initial du chantier. Les représentants des pêcheurs locaux, s'ils restent partagés sur le projet, saluent néanmoins les mesures de compensation négociées durant cette longue période de contestation.",
      },
      {
        title: "Un modèle amené à se répéter",
        content:
          "D'autres projets similaires sont déjà à l'étude sur la façade atlantique, dans le cadre des objectifs nationaux de développement de l'éolien en mer d'ici 2035, une ambition affichée de longue date par les pouvoirs publics mais dont la mise en œuvre concrète reste souvent freinée par des procédures longues et complexes. Les industriels du secteur espèrent que l'expérience acquise sur ce premier chantier permettra d'accélérer sensiblement le calendrier des prochains projets.",
      },
      {
        title: "Des retombées économiques locales attendues",
        content:
          "Au-delà de la production d'électricité, les collectivités littorales concernées misent sur les retombées économiques indirectes de ce type d'installation, notamment en matière d'emplois de maintenance qui devraient se maintenir sur plusieurs décennies. Un centre de formation dédié aux métiers de l'éolien offshore a d'ailleurs été inauguré à proximité du port qui accueille désormais la base de maintenance du parc nouvellement mis en service.",
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
          "Les syndicats enseignants réclament un report de la mise en œuvre, estimant que les établissements n'ont pas eu le temps nécessaire pour adapter leurs organisations pédagogiques à des changements pourtant substantiels dans la structure même de l'examen. Plusieurs proviseurs font état d'un manque criant de directives précises pour organiser concrètement les nouvelles modalités d'évaluation dès la rentrée prochaine, alimentant un climat d'incertitude palpable dans les salles des professeurs.",
      },
      {
        title: "Des inquiétudes sur le contrôle continu",
        content:
          "La part accrue accordée au contrôle continu suscite des critiques quant à l'égalité de traitement entre élèves selon les établissements, certains redoutant des écarts de notation importants entre lycées aux profils socio-économiques très différents. Plusieurs chercheurs en sciences de l'éducation ont publié des tribunes appelant à un mécanisme de péréquation renforcé pour limiter ces disparités, sans pour autant convaincre pleinement le ministère de revoir sa copie sur ce point précis.",
      },
      {
        title: "Le ministère maintient le cap",
        content:
          "Malgré la mobilisation, le ministère de l'Éducation nationale a confirmé son intention de maintenir le calendrier initial, tout en promettant un accompagnement renforcé des équipes pédagogiques dans les prochaines semaines, notamment via des formations spécifiques et la mise à disposition de nouveaux outils numériques de suivi. Cette fermeté du ministère n'a toutefois pas suffi à apaiser les tensions, plusieurs établissements évoquant déjà des actions de mobilisation à la rentrée.",
      },
      {
        title: "Les élèves eux aussi dans l'expectative",
        content:
          "Au-delà des enseignants, de nombreux lycéens et leurs familles expriment une inquiétude grandissante face à un examen dont les règles précises restent, à quelques mois de l'échéance, encore floues sur plusieurs points essentiels. Plusieurs associations de parents d'élèves réclament une communication plus claire et plus rapide de la part des autorités éducatives, estimant que cette incertitude prolongée nuit directement à la préparation sereine des candidats.",
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
          "À force de vouloir tout suivre en temps réel, on finit peut-être par ne plus rien regarder vraiment. Une question de rythme, plus que de technologie, qui interroge la manière dont nous avons collectivement laissé le flux continu d'informations redéfinir notre rapport au temps, à l'attention et, en creux, à nous-mêmes. Ce réflexe de consultation permanente, presque compulsif chez certains, mérite qu'on s'y arrête, non pas pour le condamner en bloc, mais pour en comprendre les ressorts profonds.",
      },
      {
        title: "Réapprendre la lenteur",
        content:
          "Quelques rédactions expérimentent déjà des formats plus longs, pensés pour être lus loin du réflexe du scroll infini, misant sur des créneaux de lecture dédiés plutôt que sur la captation permanente de l'attention. Un pari à contre-courant, mais qui trouve son public, preuve qu'une partie des lecteurs aspire elle aussi à ralentir, à condition qu'on lui en donne réellement les moyens éditoriaux et le temps nécessaire pour le faire.",
      },
      {
        title: "Un choix qui nous appartient encore",
        content:
          "Rien n'oblige, au fond, à subir cette accélération permanente : elle résulte autant de choix individuels que de logiques d'interfaces pensées pour maximiser le temps passé devant l'écran, souvent au détriment de notre propre bien-être. Reprendre la main sur ses habitudes numériques n'exige pas de renoncer à la technologie, mais simplement de réapprendre à en fixer soi-même les limites, plutôt que de les laisser dicter par la mécanique des notifications.",
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
      // Re-running the seed with updated content (e.g. more parts) should
      // actually apply that update, not silently skip it.
      await db.articlePart.deleteMany({ where: { articleId: existing.id } });
      await db.article.update({
        where: { id: existing.id },
        data: {
          parts: {
            create: validated.parts.map((part, index) => ({
              title: part.title || null,
              content: part.content,
              order: index,
            })),
          },
        },
      });

      console.log(`Mis à jour : ${slug}`);
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
