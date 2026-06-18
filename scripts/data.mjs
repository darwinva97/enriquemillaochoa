// Fuente de verdad de la consolidación de la página de Google Alerts
// "Enrique Milla Ochoa" (18 jun 2026): 31 fuentes -> 6 sucesos.
// Lo consumen gen-seed.mjs (SQL) y fetch-images.mjs (descarga de imágenes).
//
// Los cuerpos están redactados a partir del texto real de las fuentes
// (Infobae, Perú21, RPP, Exitosa, La Lupa, Trome, etc.), sin inventar datos.
// image2: segunda imagen (inline) — { og:[fuente,url] } descarga el og:image
// de esa fuente, o { url, credit, creditUrl } usa una imagen directa.

export function slugify(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // quita tildes/diacríticos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export const eventos = [
  {
    slug: 'detienen-personero-93-cedulas-colegio-enrique-milla',
    guid: 'evento:cedulas-colegio-enrique-milla-2026-06-07',
    titulo: 'Detienen a presunto personero por marcar 93 cédulas en el colegio Enrique Milla durante la segunda vuelta',
    resumen:
      'Durante la segunda vuelta presidencial del 7 de junio, la Policía intervino en el colegio Enrique Milla de Los Olivos a un hombre acusado de marcar e invalidar 93 cédulas; la votación se suspendió en un aula y al menos once personas quedaron detenidas.',
    cuerpo: [
      'El domingo 7 de junio de 2026, en plena jornada de la segunda vuelta presidencial entre Keiko Fujimori (Fuerza Popular) y Roberto Sánchez (Juntos por el Perú), la institución educativa Enrique Milla Ochoa, en el distrito limeño de Los Olivos, se convirtió en el epicentro de uno de los incidentes electorales más comentados del día. Alrededor de las 8:00 de la mañana, apenas iniciada la votación, personal de la Oficina Nacional de Procesos Electorales (ONPE) advirtió que 93 cédulas de sufragio presentaban marcas en el borde del símbolo de una de las organizaciones políticas, por lo que los miembros de mesa se vieron obligados a declararlas inválidas.',
      'Según el parte policial recogido por La Lupa, el reporte se produjo cerca de las 8:20 a. m. en el aula 106, correspondiente a la mesa de sufragio N.° 061025. Tras la verificación de los efectivos, se constató que las 93 cédulas habían sido inutilizadas. La Policía Nacional intervino entonces a un adulto mayor —identificado en los distintos reportes como Oracio Javier Rafaile Huamayalli, de 80 u 81 años— quien, de acuerdo con los testigos y el personal de la ONPE citados por Infobae, había llegado temprano al local, se presentó como personero ante los miembros de mesa, accedió al material electoral y rayó varias actas frente a los presentes.',
      'La intervención, a cargo de la PNP y de personal de la ONPE, terminó con el hombre detenido en el primer salón del segundo piso del colegio, donde se levantó el acta policial antes de trasladarlo a la comisaría del sector. El Ministerio Público informó que la Tercera Fiscalía Provincial Especializada en Prevención del Delito de Lima Norte participó en la detención en flagrancia, por el presunto delito contra la voluntad popular en la modalidad de invalidación de cédulas de votación. Según la Fiscalía, el intervenido permaneció calmado y no presentó documentación que acreditara su condición de personero, sin que se conocieran sus motivaciones.',
      'El incidente obligó a suspender momentáneamente la votación en la mesa afectada. El personal de la ONPE activó los protocolos de contingencia para reponer el material dañado y reemplazar las actas rayadas con cédulas de refuerzo, de modo que, según la cobertura de Latina Noticias, el sufragio pudo continuar con normalidad poco después. "Los miembros de mesa están todos tranquilos, porque me imagino que también para ellos ha sido una experiencia bastante, no solo incómoda, sino perturbadora", relató un periodista presente en el local.',
      'El hecho no quedó aislado: tras la detención del presunto personero, la Policía también intervino a tres miembros de mesa del mismo colegio. El propio investigado negó cualquier responsabilidad. "Los que han rayado son los miembros de mesa. Yo no he rayado nada", declaró Huamayalli ante las cámaras. En total, distintos medios reportaron que entre once y doce personas permanecieron detenidas en Lima en las horas siguientes por presuntas irregularidades con las cédulas, mientras la Fiscalía y la PNP recopilaban información.',
      'La identidad política del detenido se convirtió en motivo de disputa. Juntos por el Perú, mediante un comunicado firmado por su vocero legal Roy Mendoza Navarro, deslindó cualquier vínculo: sostuvo que Rafaile Huamayalli no milita en su organización, que figura como miembro activo del Partido Aprista Peruano según el Registro de Organizaciones Políticas (ROP) del JNE, y que su personero acreditado en la mesa N.° 061025 era en realidad Edgardo Mario Coronado Sotelo. El partido calificó de "sumamente sospechoso" que el hombre accediera a las cédulas sin estar acreditado en esa mesa y exigió que se esclarezcan los hechos, denunciando un perjuicio a su imagen.',
      'Las versiones sobre su acreditación, sin embargo, no fueron del todo coincidentes entre los medios: mientras Juntos por el Perú aseguró que el ciudadano estaba acreditado como personero en otra mesa y otro colegio, otros reportes señalaron que la agrupación habría admitido que contaba con una credencial de la organización. Por su parte, Fuerza Popular afirmó que fueron sus propios personeros quienes denunciaron la aparición de las cédulas marcadas.',
      'Frente a la difusión de versiones de fraude, las autoridades electorales pidieron calma. El presidente del Jurado Nacional de Elecciones, Roberto Burneo, rechazó las narrativas de fraude impulsadas por "autoridades gubernamentales y organizaciones políticas" y subrayó que las cédulas marcadas fueron reemplazadas conforme a la ley y los protocolos: "Rechazamos cualquier declaración de fraude o intento de deslegitimar el proceso", afirmó. La Defensoría del Pueblo, en cambio, calificó lo ocurrido como una "nueva modalidad que linda con el fraude" y exhortó a los votantes a revisar y denunciar de inmediato cualquier marca en su cédula antes de sufragar.',
      'El desenlace judicial llegó tres días después. El 10 de junio, el Poder Judicial dispuso dejar sin efecto la detención de Rafaile Huamayalli y también la de los tres miembros de mesa, identificados como Tomás Alegre Díaz, Joseph Águila Peñaloza y Martín Alarcón de la Cruz. En la audiencia, la magistrada Fiorela Linares declaró improcedente el proceso inmediato solicitado por el Ministerio Público al considerar que "el pedido no se encuentra justificado" y que no se hallaron pruebas evidentes sobre la distribución de roles ni sobre cómo se habría cometido el presunto delito, según TV Perú.',
      'Uno de los liberados afirmó ante las cámaras que la detención "vulneró muchos derechos", entre ellos el de la libertad, mientras otro relató el impacto sobre su familia y descartó volver a ser miembro de mesa en el futuro. El caso quedó a la espera de una evaluación más profunda por parte de las autoridades judiciales y electorales, en un episodio que, pese a su repercusión, fue enmarcado por el JNE dentro de incidentes aislados que no configuran fraude.',
    ].join('\n\n'),
    tag: 'Elecciones',
    emoji: '🗳️',
    image2: { og: ['Infobae', 'https://www.infobae.com/peru/2026/06/10/el-poder-judicial-ordena-la-liberacion-del-hombre-de-81-anos-acusado-de-rayar-cedulas-en-los-olivos/'] },
    sources: [
      ['Infobae', 'https://www.infobae.com/peru/2026/06/07/un-hombre-de-81-anos-destruye-actas-electorales-tras-hacerse-pasar-por-personero-en-los-olivos-pnp-lo-detuvo/', 'Un hombre de 81 años raya varias actas electorales tras asegurar que es personero en Los Olivos'],
      ['Perú 21', 'https://peru21.pe/politica/los-olivos-suspenden-votacion-en-aula-de-colegio-enrique-milla-tras-incidentes/', 'Los Olivos: Suspenden votación en aula de colegio Enrique Milla tras incidentes'],
      ['Willax', 'https://willax.pe/politica/personero-jpp-roberto-sanchez-detenido-invalidar-cedulas-los-olivos-willax', 'Personero de JPP, partido de Roberto Sánchez, fue detenido por rayar cédulas de votación'],
      ['LA LUPA', 'https://lalupa.pe/peru/policia-detiene-a-hombre-acusado-de-destrozar-93-actas-de-votacion-en-los-olivos-112972', 'Policía detiene a hombre acusado de destrozar 93 actas de votación en Los Olivos'],
      ['YouTube', 'https://www.youtube.com/watch?v=OU5-JHU5jOM', 'Otra mesa con cédulas marcadas reportada en el colegio Enrique Milla de Los Olivos'],
      ['Exitosa Noticias', 'https://www.exitosanoticias.pe/elige-bien/juntos-peru-deslinda-responsabilidad-irregularidad-electoral-olivos-acusa-detenido-tiene-militancia-apra-n177277', 'Juntos por el Perú deslinda responsabilidad en irregularidad electoral en Los Olivos'],
      ['Trome.com', 'https://trome.com/actualidad/politica/segunda-vuelta-en-elecciones-2026-detienen-a-octogenario-acusado-de-rayar-mas-de-90-cedulas-en-los-olivos-video-noticia/', '¿Quién es el octogenario acusado de rayar más de 90 cédulas?'],
      ['Defensoría del Pueblo', 'https://www.defensoria.gob.pe/la-defensoria-del-pueblo-rechaza-los-actos-contrarios-a-la-ley-que-se-vienen-reportando-entre-las-incidencias-del-dia-como-las-marcas-en-las-cedulas-de-votacion-y-otras-de-caracter-relevante-que-comp/', 'La Defensoría del Pueblo rechaza los actos contrarios a la ley reportados durante la jornada'],
      ['Perú 21', 'https://peru21.pe/politica/jp-admite-que-personero-detenido-por-marcar-cedulas-tenia-credencial-de-su-organizacion/', 'JP admite que personero detenido por marcar cédulas tenía credencial de su organización'],
      ['Canal N', 'https://canaln.pe/actualidad/detienen-personeros-cedulas-marcadas-durante-jornada-electoral-n492555', 'Detienen a personeros por cédulas marcadas durante jornada electoral'],
      ['Diario La Razón', 'https://larazon.pe/cuatro-detenidos-por-tratar-de-favorecer-a-jpp-ilegalmente-en-los-olivos/', 'Cuatro detenidos por tratar de favorecer a JPP ilegalmente en Los Olivos'],
      ['soltvperu.com', 'https://soltvperu.com/investigan-personero-alterar-cedulas-electorales-olivos/', 'Investigan a personero acusado de alterar más de 90 cédulas electorales'],
      ['Infobae', 'https://www.infobae.com/peru/2026/06/10/el-poder-judicial-ordena-la-liberacion-del-hombre-de-81-anos-acusado-de-rayar-cedulas-en-los-olivos/', 'El Poder Judicial ordena la liberación del hombre de 81 años acusado de rayar cédulas'],
      ['El Comercio Perú', 'https://elcomercio.pe/peru/11-detenidos-en-lima-y-mas-de-20-intervenidos-en-regiones-por-presuntas-irregularidades-electorales-el-avance-de-las-investigaciones-noticia/', '11 detenidos en Lima y más de 20 intervenidos en regiones por presuntas irregularidades electorales'],
      ['Panamericana TV', 'https://panamericana.pe/locales/469631-autoridades-evaluan-posibles-infracciones-electorales-cometidas-personeros-miembros-mesa', 'Autoridades evalúan posibles infracciones electorales cometidas por personeros y miembros de mesa'],
      ['RPP Noticias', 'https://rpp.pe/politica/actualidad/fuerza-popular-dice-que-sus-personeros-fueron-quienes-denunciaron-aparicion-de-cedulas-rayadas-noticia-1692080', 'Fuerza Popular dice que sus personeros fueron quienes denunciaron aparición de cédulas rayadas'],
      ['ATV', 'https://www.atv.pe/noticia/detenidos-por-rayar-cedulas-de-sufragio-segunda-vuelta/', '11 detenidos por presuntamente rayar cédulas de sufragio en la segunda vuelta'],
      ['El Comercio Perú', 'https://elcomercio.pe/lima/policiales/segunda-vuelta-al-menos-unas-12-personas-siguen-detenidas-por-presuntos-delitos-electorales-ultimas-noticia/', 'Segunda vuelta: al menos unas 12 personas siguen detenidas por presuntos delitos electorales'],
      ['Canal N', 'https://canaln.pe/actualidad/tres-miembros-mesa-y-personero-jp-permanecen-detenidos-n492581', 'Tres miembros de mesa y personero de JP permanecen detenidos'],
      ['ATV', 'https://www.atv.pe/noticia/nuevos-detenidos-cedulas-rayadas-colegio-los-olivos/', 'Colegio donde ocurrió el caso de las cédulas rayadas registra nuevos detenidos'],
      ['Cosmos Televisión', 'https://cosmos.pe/329555/doce-detenidos-alteracion-cedulas-electorales-segunda-vuelta-lima', 'Doce detenidos por presunta alteración de cédulas electorales'],
      ['Canal N', 'https://canaln.pe/actualidad/personero-y-miembros-mesa-detenidos-cedulas-rayadas-n492565', 'Personero y miembros de mesa detenidos por cédulas rayadas'],
      ['Panamericana.pe', 'https://panamericana.pe/24horas/locales/469618-siguen-detenidos-sede-policial-involucrados-presuntas-irregularidades-cedulas-electorales/amp', 'Siguen detenidos en sede policial involucrados en presuntas irregularidades con cédulas'],
    ],
  },
  {
    slug: 'ladron-cae-tercer-piso-robo-los-olivos',
    guid: 'evento:ladron-cae-tercer-piso-los-olivos-2026-06',
    titulo: 'Presunto ladrón cae de un tercer piso durante un robo frustrado en el AA. HH. Enrique Milla Ochoa',
    resumen:
      'Un delincuente quedó gravemente herido tras caer desde el tercer piso de una vivienda que intentaba robar en el asentamiento humano Enrique Milla Ochoa, en Los Olivos; el hecho quedó registrado por cámaras de videovigilancia.',
    cuerpo: [
      'Un intento de robo terminó de manera aparatosa en el asentamiento humano Enrique Milla Ochoa, en el distrito de Los Olivos, cuando un presunto delincuente cayó desde el tercer piso de la vivienda a la que intentaba ingresar y resultó gravemente herido. El hecho, ocurrido durante la noche, quedó íntegramente registrado por las cámaras de videovigilancia de inmuebles cercanos.',
      'De acuerdo con el reporte de Perú21, las imágenes muestran al sujeto merodeando por la zona antes de decidir escalar la fachada del edificio. Tras varios intentos por trepar la estructura, el hombre logró alcanzar el tercer piso; sin embargo, cuando se disponía a ingresar al inmueble, perdió el equilibrio y se precipitó hacia la vía pública desde varios metros de altura.',
      'El fuerte estruendo de la caída alertó a la propietaria de la vivienda, quien salió de inmediato y encontró al sujeto tendido en la calle con visibles lesiones. La mujer solicitó el apoyo del Serenazgo de Los Olivos, cuyos agentes llegaron pocos minutos después junto a personal paramédico para brindar los primeros auxilios.',
      'Tras evaluar su estado, los socorristas determinaron que el hombre presentaba múltiples heridas producto del impacto, por lo que fue trasladado de emergencia al hospital Cayetano Heredia. Fuentes locales citadas por la prensa indicaron que permanece internado bajo observación médica especializada debido a la gravedad de sus lesiones.',
      'El caso, difundido también por Caretas y El Comercio, se suma a la preocupación vecinal por la inseguridad en la zona y volvió a poner en valor el papel de las cámaras de videovigilancia, que en esta ocasión permitieron reconstruir con detalle la secuencia del robo frustrado.',
    ].join('\n\n'),
    tag: 'Seguridad',
    emoji: '🚨',
    image2: { og: ['El Comercio Perú', 'https://elcomercio.pe/videos/pais/ladron-cae-del-tercer-piso-al-intentar-robar-casa-en-los-olivos-nnav-amtv-video-noticia/'] },
    sources: [
      ['Caretas', 'https://caretas.pe/nacional/los-olivos-presunto-ladron-termina-gravemente-herido-tras-caer-de-un-tercer-piso-durante-robo-fallido/', 'Ladrón cae de tercer piso durante robo en Los Olivos'],
      ['Perú 21', 'https://peru21.pe/policiales/los-olivos-ladron-cae-desde-tercer-piso-de-una-casa-que-intento-robar-video/', 'Los Olivos: ladrón cae desde tercer piso de una casa que intentó robar'],
      ['El Comercio Perú', 'https://elcomercio.pe/videos/pais/ladron-cae-del-tercer-piso-al-intentar-robar-casa-en-los-olivos-nnav-amtv-video-noticia/', 'Los Olivos: intentó entrar a una casa y terminó hospitalizado'],
    ],
  },
  {
    slug: 'bebe-fallece-negligencia-guarderia-babyland-los-olivos',
    guid: 'evento:bebe-guarderia-babyland-los-olivos-2026-06',
    titulo: 'Investigan la muerte de un bebé por presunta negligencia en una guardería de Los Olivos',
    resumen:
      "Un bebé de un año falleció tras una presunta negligencia en la guardería 'Babyland', en Los Olivos. La PNP detuvo a la directora y a dos trabajadoras.",
    cuerpo: [
      'La muerte de un bebé de un año en una guardería del distrito de Los Olivos abrió una investigación por presunta negligencia que mantiene en alerta a la comunidad. Según informó La República, el menor habría ingresado al hospital con signos de violencia, incluidos hematomas en el rostro, lo que activó de inmediato la intervención de las autoridades.',
      'El caso se registró en el establecimiento identificado como guardería "Babyland". Tras el deceso del menor y la advertencia sobre las lesiones que presentaba, la Policía Nacional del Perú detuvo a la directora del local y a dos trabajadoras, quienes quedaron a disposición de las investigaciones mientras se esclarecen los hechos.',
      'El suceso generó conmoción por tratarse de un establecimiento dedicado al cuidado de niños de corta edad, en el que las familias depositan su confianza durante las horas de trabajo. Vecinos y padres de la zona expresaron su preocupación ante un hecho que, de confirmarse la negligencia, revelaría graves fallas en el cuidado de los menores.',
      'Las autoridades trabajan para determinar las circunstancias exactas en que se produjo la muerte y establecer las responsabilidades que correspondan conforme a ley. Entre las diligencias pendientes figuran las pericias médico-legales que deben precisar la causa del fallecimiento del bebé.',
      'A la espera de esos resultados, el caso reabre el debate sobre la supervisión, las condiciones de seguridad y el personal a cargo en las guarderías y cunas del distrito, así como sobre los controles que ejercen las entidades competentes en este tipo de servicios.',
    ].join('\n\n'),
    tag: 'Sucesos',
    emoji: '⚖️',
    sources: [
      ['La República', 'https://larepublica.pe/sociedad/2026/06/14/bebe-de-un-ano-fallece-tras-presunta-negligencia-en-guarderia-babyland-en-los-olivos-pnp-detuvo-a-la-directora-y-dos-trabajadoras-617722', 'Bebé de un año fallece tras presunta negligencia en guardería Babyland en Los Olivos'],
    ],
  },
  {
    slug: 'corte-agua-sedapal-martes-16-junio',
    guid: 'evento:corte-agua-sedapal-2026-06-16',
    titulo: 'Sedapal anuncia corte de agua para el martes 16 de junio en Los Olivos y otros distritos',
    resumen:
      'Sedapal programó un corte del servicio de agua para el martes 16 de junio en sectores de San Juan de Lurigancho, Ate, Los Olivos y Lince por mantenimiento, y recomendó almacenar agua con anticipación.',
    cuerpo: [
      'Sedapal anunció la ejecución de un corte temporal del servicio de agua potable para el martes 16 de junio de 2026, como parte de su cronograma de mantenimiento preventivo de la red de distribución. Según informó Infobae, la medida alcanzará a sectores de los distritos de San Juan de Lurigancho, Ate, Los Olivos y Lince, e impactará tanto a viviendas como a locales comerciales.',
      'La empresa precisó que la suspensión y el posterior restablecimiento del suministro tendrán horarios diferenciados, dependiendo de la zona intervenida y del avance de los trabajos técnicos. Por ello, recomendó a los usuarios revisar el detalle del cronograma para identificar el horario correspondiente a su sector y organizar sus actividades.',
      'Sedapal exhortó a la población a tomar precauciones y almacenar agua con anticipación, especialmente para las actividades domésticas y comerciales que dependen de un abastecimiento continuo, a fin de reducir el impacto de la interrupción durante la jornada.',
      'De acuerdo con la entidad, este tipo de intervenciones forma parte de un plan de mejoras ejecutado por etapas, orientado a preservar la calidad del agua, reforzar la infraestructura hídrica y sostener la continuidad del servicio en Lima Metropolitana.',
      'La inclusión de Los Olivos en la programación implicó que los vecinos del distrito —y del entorno del AA. HH. Enrique Milla Ochoa— debieran prever el desabastecimiento, almacenando agua suficiente para el consumo y la higiene durante las horas que duró el corte.',
    ].join('\n\n'),
    tag: 'Servicios',
    emoji: '🚰',
    image2: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Water_faucet_4.jpg/1280px-Water_faucet_4.jpg',
      credit: 'Foto: Yasmine.shal / Wikimedia Commons (CC BY-SA 4.0)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Water_faucet_4.jpg',
    },
    sources: [
      ['Infobae', 'https://www.infobae.com/peru/2026/06/15/corte-de-agua-para-este-martes-16-de-junio-conoce-las-zonas-afectadas/', 'Corte de agua para este martes 16 de junio: conoce las zonas afectadas'],
    ],
  },
  {
    slug: 'segunda-vuelta-2026-conteo-onpe-resultado-ajustado',
    guid: 'evento:resultados-segunda-vuelta-onpe-2026',
    titulo: 'Segunda vuelta 2026: el conteo de la ONPE define la presidencia por un margen mínimo',
    resumen:
      'Tras la segunda vuelta del 7 de junio, el resultado entre Keiko Fujimori (Fuerza Popular) y Roberto Sánchez (Juntos por el Perú) se mantuvo en un margen mínimo, con sondeos y conteos rápidos que dieron resultados cruzados.',
    cuerpo: [
      'Concluida la jornada de la segunda vuelta presidencial del 7 de junio de 2026, el resultado entre Keiko Fujimori (Fuerza Popular) y Roberto Sánchez (Juntos por el Perú) se mantuvo en un margen extraordinariamente estrecho que tuvo en vilo al país durante días. El conteo oficial de la ONPE avanzó con lentitud y, hasta las 23:57 del martes 16 de junio, con el 99.152 % de las actas procesadas, ubicaba a Keiko Fujimori en el primer lugar con 50.100 % frente al 49.900 % de Roberto Sánchez, una diferencia de poco más de 36 mil votos, según el reporte de Trome.',
      'El recuento se movió como una verdadera montaña rusa. Al cierre de las mesas, el sondeo a boca de urna —el llamado Flash Electoral difundido a las 5:00 p. m. del domingo 7 de junio por Datum Internacional y América Multimedia— había dado una ligera ventaja a Keiko Fujimori, con 50.53 % frente a 49.47 % de Sánchez, lo que llevó a algunos sectores a celebrar un eventual triunfo de Fuerza Popular.',
      'Sin embargo, los conteos rápidos posteriores matizaron ese panorama. Tanto el de Datum como el de Ipsos y Transparencia arrojaron un empate técnico, con una ligera ventaja para el candidato de Juntos por el Perú: Datum otorgó 50.14 % a Sánchez, mientras que Ipsos y Transparencia lo dieron como ganador con 50.3 % frente al 49.7 % de Keiko Fujimori.',
      'La estrechez del resultado convirtió cada décima en decisiva y obligó a esperar el cómputo oficial al 100 %, que la ONPE proyectó recién para las semanas siguientes. En un escenario tan ajustado, los votos viciados, las impugnaciones y las actas observadas adquirieron un peso inusual, pues cualquiera de esas variables podía inclinar la balanza.',
      'Entre los incidentes que marcaron la jornada figuró el del colegio Enrique Milla Ochoa, en Los Olivos, donde la intervención de tres miembros de mesa y la detención de un hombre por 93 cédulas rayadas obligaron a activar los protocolos de contingencia de la ONPE. Aunque las autoridades electorales insistieron en que se trató de hechos aislados que no configuran fraude, episodios como ese alimentaron la tensión en una elección que se definía por márgenes mínimos.',
    ].join('\n\n'),
    tag: 'Elecciones',
    emoji: '🗳️',
    image2: {
      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Segunda_vuelta_elecciones_generales_de_Per%C3%BA_2021.jpg/1280px-Segunda_vuelta_elecciones_generales_de_Per%C3%BA_2021.jpg',
      credit: 'Foto: Txolo / Wikimedia Commons (CC BY-SA 4.0)',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Segunda_vuelta_elecciones_generales_de_Per%C3%BA_2021.jpg',
    },
    sources: [
      ['Trome.com', 'https://trome.com/actualidad/politica/resultados-del-conteo-oficial-de-la-onpe-de-la-segunda-vuelta-actas-procesadas-de-keiko-fujimori-de-fuerza-popular-y-de-roberto-sanchez-de-juntos-por-el-peru-noticia/', 'Resultados del conteo oficial de la ONPE de la segunda vuelta al 95.352%'],
      ['El Men', 'https://elmen.pe/keiko-gano-en-boca-de-urna/', 'Keiko ganó en boca de urna'],
    ],
  },
  {
    slug: 'ricardo-belmont-cancer-irreversible',
    guid: 'evento:ricardo-belmont-cancer-2026-06',
    titulo: 'Ricardo Belmont revela que padece un cáncer irreversible',
    resumen:
      'El exalcalde de Lima y excandidato presidencial Ricardo Belmont reveló que padece un "cáncer irreversible", diagnosticado el 24 de enero, y compartió el pronóstico que le dieron los médicos.',
    cuerpo: [
      'El empresario y exalcalde de Lima Ricardo Belmont Cassinelli reveló públicamente que padece un cáncer que él mismo describió como "irreversible". El excandidato presidencial por el Partido Cívico OBRAS hizo la confesión en una entrevista con el programa Sin Guion, recogida por RPP, en la que detalló el difícil momento de salud que atraviesa.',
      'Según relató, recibió el diagnóstico el pasado 24 de enero, apenas tres meses antes de las elecciones generales. "Si tú vieras mis resultados, no hubieras podido salir de tu casa; (...) era prácticamente un cáncer irreversible", contó Belmont, quien precisó que los médicos le indicaron que "tiene por lo menos para cinco años".',
      'El exhombre de prensa afirmó haber afrontado la campaña electoral pese al diagnóstico, "con estoicismo y mi espíritu de lucha", y enmarcó ese esfuerzo en un legado personal: "Es lo que le voy a dejar a mis hijos chicos", declaró durante la entrevista.',
      'Belmont aprovechó también para precisar los términos de su relación política con Juntos por el Perú. Aclaró que se trata de una "alianza electoral" y no de gobierno, y explicó que respaldó la candidatura de Roberto Sánchez luego de que este firmara las "líneas maestras" de su Partido Cívico OBRAS.',
      'La revelación, difundida por diversos medios nacionales, generó muestras de solidaridad hacia el dirigente, una figura conocida de la política y la televisión peruanas a lo largo de varias décadas.',
    ].join('\n\n'),
    tag: 'Actualidad',
    emoji: '🎗️',
    sources: [
      ['RPP Noticias', 'https://rpp.pe/politica/actualidad/ricardo-belmont-revelo-que-padece-un-cancer-irreversible-noticia-1692706', 'Ricardo Belmont reveló que padece un cáncer irreversible'],
    ],
  },
];
