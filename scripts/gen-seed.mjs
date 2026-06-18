// Genera scripts/seed-alertas.sql a partir de los clusters de noticias.
// Fuente de verdad de la consolidación de la página de Google Alerts
// "Enrique Milla Ochoa" (18 jun 2026): 31 fuentes -> 6 sucesos.
//
//   node scripts/gen-seed.mjs
//
import { writeFileSync } from 'node:fs';

const q = (s) => `'${String(s).replace(/'/g, "''")}'`;

// Cada evento: una noticia (alert_news) + sus fuentes (alert_sources).
// sources[0] se usa también como fuente principal (source_url/source_title).
const eventos = [
  {
    guid: 'evento:cedulas-colegio-enrique-milla-2026-06-07',
    titulo: 'Detienen a presunto personero por marcar 93 cédulas en el colegio Enrique Milla durante la segunda vuelta',
    resumen:
      'Durante la segunda vuelta presidencial del 7 de junio, la Policía intervino en el colegio Enrique Milla de Los Olivos a un hombre acusado de marcar e invalidar 93 cédulas; la votación se suspendió en un aula y al menos once personas quedaron detenidas.',
    cuerpo: [
      'El domingo 7 de junio de 2026, durante la jornada de la segunda vuelta presidencial, la institución educativa Enrique Milla Ochoa, en el distrito de Los Olivos, fue escenario de un presunto delito electoral. Personal de la Policía Nacional y de la ONPE intervino a un hombre de 81 años —identificado en distintos medios como Horacio Javier Rafaile Huamayalli— acusado de marcar e invalidar 93 cédulas de votación tras asegurar que se desempeñaba como personero.',
      'A raíz de los hechos, la votación se suspendió en el aula 106 del colegio y una de las mesas (061020) no pudo abrir con normalidad. La Policía trasladó a los intervenidos a la sede policial correspondiente y, según los reportes, al menos once o doce personas —entre ellas miembros de mesa y personeros— permanecieron detenidas en los días siguientes por presuntas irregularidades con las cédulas.',
      'El detenido fue vinculado por varios medios a Juntos por el Perú, agrupación de Roberto Sánchez. La organización emitió un comunicado deslindando responsabilidad y señalando que el ciudadano tendría militancia aprista; posteriormente admitió que la persona contaba con una credencial de personero de su organización. Fuerza Popular, por su parte, sostuvo que fueron sus propios personeros quienes denunciaron la aparición de las cédulas marcadas.',
      'El Jurado Nacional de Elecciones y la Defensoría del Pueblo se pronunciaron sobre lo ocurrido; la Defensoría rechazó los actos contrarios a la ley reportados durante la jornada. Días después, el 10 de junio, el Poder Judicial ordenó dejar sin efecto la detención del hombre de 81 años.',
    ].join('\n\n'),
    tag: 'Elecciones',
    emoji: '🗳️',
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
    guid: 'evento:ladron-cae-tercer-piso-los-olivos-2026-06',
    titulo: 'Presunto ladrón cae de un tercer piso durante un robo frustrado en Los Olivos',
    resumen:
      'Un delincuente quedó gravemente herido tras caer desde el tercer piso de una vivienda que intentaba robar en Los Olivos; el hecho quedó registrado por cámaras de videovigilancia.',
    cuerpo: [
      'Un presunto ladrón resultó gravemente herido luego de caer desde el tercer piso de una vivienda que intentaba asaltar en el distrito de Los Olivos. El sujeto quedó hospitalizado tras la caída durante el robo frustrado.',
      'El incidente, ocurrido en un asentamiento humano de la zona, quedó registrado por las cámaras de videovigilancia del lugar, que captaron el momento en que el hombre cayó desde el tercer piso de la casa.',
    ].join('\n\n'),
    tag: 'Seguridad',
    emoji: '🚨',
    sources: [
      ['Caretas', 'https://caretas.pe/nacional/los-olivos-presunto-ladron-termina-gravemente-herido-tras-caer-de-un-tercer-piso-durante-robo-fallido/', 'Ladrón cae de tercer piso durante robo en Los Olivos'],
      ['Perú 21', 'https://peru21.pe/policiales/los-olivos-ladron-cae-desde-tercer-piso-de-una-casa-que-intento-robar-video/', 'Los Olivos: ladrón cae desde tercer piso de una casa que intentó robar'],
      ['El Comercio Perú', 'https://elcomercio.pe/videos/pais/ladron-cae-del-tercer-piso-al-intentar-robar-casa-en-los-olivos-nnav-amtv-video-noticia/', 'Los Olivos: intentó entrar a una casa y terminó hospitalizado'],
    ],
  },
  {
    guid: 'evento:bebe-guarderia-babyland-los-olivos-2026-06',
    titulo: 'Investigan la muerte de un bebé por presunta negligencia en una guardería de Los Olivos',
    resumen:
      "Un bebé de un año falleció tras una presunta negligencia en la guardería 'Babyland', en Los Olivos. La PNP detuvo a la directora y a dos trabajadoras.",
    cuerpo: [
      'Un bebé de un año falleció tras una presunta negligencia en la guardería "Babyland", ubicada en el distrito de Los Olivos. Según el reporte, el menor ingresó al hospital con signos de violencia, incluyendo hematomas en el rostro.',
      'Tras los hechos, la Policía Nacional detuvo a la directora del establecimiento y a dos trabajadoras, mientras las autoridades continúan con las investigaciones del caso.',
    ].join('\n\n'),
    tag: 'Sucesos',
    emoji: '⚖️',
    sources: [
      ['La República', 'https://larepublica.pe/amp/sociedad/2026/06/14/bebe-de-un-ano-fallece-tras-presunta-negligencia-en-guarderia-babyland-en-los-olivos-pnp-detuvo-a-la-directora-y-dos-trabajadoras-617722', 'Bebé de un año fallece tras presunta negligencia en guardería Babyland en Los Olivos'],
    ],
  },
  {
    guid: 'evento:corte-agua-sedapal-2026-06-16',
    titulo: 'Sedapal anuncia corte de agua para el martes 16 de junio en varias zonas',
    resumen:
      'Sedapal programó un corte del servicio de agua para el martes 16 de junio y recomendó a los usuarios almacenar agua con anticipación.',
    cuerpo: [
      'Sedapal anunció un corte del servicio de agua potable para el martes 16 de junio en distintas zonas de Lima. La empresa recomendó a los usuarios tomar sus precauciones y almacenar agua con anticipación para evitar inconvenientes durante la interrupción.',
      'Se recomienda a los vecinos revisar las zonas afectadas por el corte para organizar el almacenamiento de agua con la debida antelación.',
    ].join('\n\n'),
    tag: 'Servicios',
    emoji: '🚰',
    sources: [
      ['Infobae', 'https://www.infobae.com/peru/2026/06/15/corte-de-agua-para-este-martes-16-de-junio-conoce-las-zonas-afectadas/', 'Corte de agua para este martes 16 de junio: conoce las zonas afectadas'],
    ],
  },
  {
    guid: 'evento:resultados-segunda-vuelta-onpe-2026',
    titulo: 'Segunda vuelta 2026: el conteo oficial de la ONPE avanza en un resultado ajustado',
    resumen:
      'Tras la segunda vuelta, el conteo oficial de la ONPE mostró un resultado estrecho entre Keiko Fujimori (Fuerza Popular) y Roberto Sánchez (Juntos por el Perú).',
    cuerpo: [
      'Concluida la jornada de la segunda vuelta presidencial de 2026, el conteo oficial de la ONPE avanzó con un resultado ajustado entre las dos candidaturas. Con cerca del 95% de las actas procesadas, los reportes ubicaban a Roberto Sánchez, de Juntos por el Perú, en torno al 50% de los votos, en una disputa cerrada con Keiko Fujimori, de Fuerza Popular.',
      'Al cierre de las mesas, los sondeos a boca de urna habían anticipado un escenario estrecho, a la espera del cómputo oficial de la ONPE que definiría al ganador de la elección.',
    ].join('\n\n'),
    tag: 'Elecciones',
    emoji: '🗳️',
    sources: [
      ['Trome.com', 'https://trome.com/actualidad/politica/resultados-del-conteo-oficial-de-la-onpe-de-la-segunda-vuelta-actas-procesadas-de-keiko-fujimori-de-fuerza-popular-y-de-roberto-sanchez-de-juntos-por-el-peru-noticia/', 'Resultados del conteo oficial de la ONPE de la segunda vuelta al 95.352%'],
      ['El Men', 'https://elmen.pe/keiko-gano-en-boca-de-urna/', 'Keiko ganó en boca de urna'],
    ],
  },
  {
    guid: 'evento:ricardo-belmont-cancer-2026-06',
    titulo: 'Ricardo Belmont revela que padece un cáncer irreversible',
    resumen:
      'El excandidato presidencial Ricardo Belmont reveló que padece un "cáncer irreversible" y compartió el pronóstico que le dieron los médicos.',
    cuerpo: [
      'El excandidato presidencial Ricardo Belmont reveló públicamente que padece lo que describió como "un cáncer irreversible". En sus declaraciones, contó que los médicos le habrían dado un pronóstico de al menos cinco años más de vida.',
      'La revelación fue difundida por medios nacionales, que recogieron las declaraciones del exhombre de prensa y dirigente sobre su estado de salud.',
    ].join('\n\n'),
    tag: 'Actualidad',
    emoji: '🎗️',
    sources: [
      ['RPP Noticias', 'https://rpp.pe/politica/actualidad/ricardo-belmont-revelo-que-padece-un-cancer-irreversible-noticia-1692706', 'Ricardo Belmont reveló que padece un cáncer irreversible'],
    ],
  },
];

const out = [];
out.push('-- AUTOGENERADO por scripts/gen-seed.mjs — NO editar a mano.');
out.push('-- Página Google Alerts "Enrique Milla Ochoa" (18 jun 2026): 31 fuentes -> 6 sucesos.');
out.push('-- Aplicar:  wrangler d1 execute enrique-milla-ochoa-forum --remote --file scripts/seed-alertas.sql');
out.push('');

for (const e of eventos) {
  const [pf, pu, pt] = e.sources[0];
  const principalTitulo = `${pt} (${pf})`;
  out.push(`-- ${e.guid}  (${e.sources.length} fuente(s))`);
  out.push(
    `INSERT OR IGNORE INTO alert_news (guid, source_url, source_title, titulo, resumen, cuerpo, tag, emoji, status) VALUES (\n  ${q(
      e.guid,
    )}, ${q(pu)}, ${q(principalTitulo)}, ${q(e.titulo)}, ${q(e.resumen)}, ${q(e.cuerpo)}, ${q(e.tag)}, ${q(e.emoji)}, 'draft'\n);`,
  );
  for (const [fuente, url, titulo] of e.sources) {
    out.push(
      `INSERT OR IGNORE INTO alert_sources (alert_id, fuente, url, titulo) SELECT id, ${q(fuente)}, ${q(
        url,
      )}, ${q(titulo)} FROM alert_news WHERE guid = ${q(e.guid)};`,
    );
  }
  out.push('');
}

const total = eventos.reduce((a, e) => a + e.sources.length, 0);
out.push(`-- Total: ${eventos.length} noticias, ${total} fuentes.`);

writeFileSync(new URL('./seed-alertas.sql', import.meta.url), out.join('\n') + '\n');
console.log(`Generado seed-alertas.sql: ${eventos.length} noticias, ${total} fuentes.`);
