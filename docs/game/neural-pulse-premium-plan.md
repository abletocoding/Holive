# Holive Neural Pulse — Plan de elevación premium (Documento estrategico)

## 0. Resumen ejecutivo: 10 recomendaciones

1. **Abrir con un Train Hub.** El juego ya no debe sentirse como una pantalla escondida al final del sitio; debe abrir como un pequeño centro de entrenamiento con elección clara de modo.
2. **Separar modos por intención.** Classic Pulse es reto de memoria; Freestyle / Healing Drum es el diferenciador hero: una batería libre de ritmo y calma, no otro clon de Simon.
3. **Mantener honestidad científica.** Hablar de atención, ritmo, calma, repetición, timing sensorimotor y autorregulación suave; evitar promesas de curación, diagnóstico, terapia o "aumento cerebral" garantizado.
4. **Convertir lo web en app-feeling.** Pantalla completa, audio reactivo, progreso guardado, misiones, microcelebraciones, PWA futura y continuidad entre sesiones.
5. **Diseñar una identidad Holive.** Púrpura, oro, matriz sagrada, Holi como guía, cuencos, polvo dorado, respiración y foco sin estética genérica gamer.
6. **Crear misiones diarias y semanales.** Classic y Freestyle deben alimentar el mismo loop de hábito: completar una profundidad, sostener una sesión, probar un layout, volver mañana.
7. **Construir audio como producto.** Beds por estado, `heal` como cama de sanación, hits por pad, metrónomo opcional y mezcla cuidadosa para móvil con recomendación de audífonos.
8. **Guardar primero local, luego Supabase.** `localStorage` basta para MVP; Supabase entra cuando haya cuentas, historial, streaks, dashboards y segmentación de leads.
9. **Medir señales útiles.** No solo score: tiempo en modo, retorno, misiones completadas, sesiones Freestyle, uso de audio, CTA después de progreso real.
10. **Priorizar pulido antes que cantidad.** Un Classic sólido y un Freestyle memorable valen más que seis modos superficiales.

## 1. Resumen de investigación y límites honestos

### 1.1 Lumosity, FTC y el marco de honestidad

La categoría de "brain training" tiene historia sensible. El caso Lumosity / FTC mostró el riesgo de afirmar beneficios cognitivos generales sin respaldo suficiente. Para Holive, el principio rector debe ser:

- No prometer prevención, cura ni tratamiento.
- No decir que Neural Pulse "mejora el cerebro" de forma clínica.
- No usar ansiedad de salud como gancho.
- Sí afirmar que el juego entrena patrones dentro del propio juego: memoria de secuencia, atención sostenida, timing, calma práctica y repetición deliberada.

Lenguaje recomendado:

- "Practica ritmo y calma."
- "Entrena atención dentro del juego."
- "Sostén una secuencia y vuelve al pulso."
- "Un ritual breve para foco, respiración y presencia."

Lenguaje a evitar:

- "Cura estrés."
- "Aumenta neuroplasticidad garantizada."
- "Tratamiento cognitivo."
- "Mejora memoria clínica."

### 1.2 Juegos de ritmo y timing

Los juegos de ritmo funcionan porque convierten timing, feedback y anticipación en una experiencia corporal. Freestyle debe tomar esa fuerza sin volverse competitivo:

- Golpes con respuesta inmediata.
- Microvariación sonora.
- Metrónomo opcional, no obligación.
- Sesiones cortas con cierre suave.
- Feedback visual que acompaña el groove.

Classic trabaja memoria secuencial. Freestyle trabaja exploración sensorimotora: tocar, escuchar, ajustar tempo, repetir.

### 1.3 Binaural, cuencos y claims cuidadosos

Los binaural beats y sonidos tipo cuenco pueden comunicar calma y ritual, pero las afirmaciones deben ser prudentes. En producto:

- Presentarlos como ambiente sonoro opcional.
- Recomendar audífonos sin prometer efecto médico.
- Permitir silencio/mute siempre.
- Usar "beat", "carrier", "cama sonora", "ambiente heal", "ritmo y calma".

## 2. Principios de diseño

1. **Ritual antes que arcade.** La experiencia puede tener reto, pero el tono es Holive: presencia, pureza, utilidad.
2. **Fallo sin castigo agresivo.** Classic puede perder señal; Freestyle no falla, acompaña.
3. **Mobile-first real.** Controles grandes, audio bajo gesto del usuario, layout vertical, safe areas, mínimo texto durante juego.
4. **Una pantalla, una intención.** Train Hub elige; Classic reta; Freestyle libera; misiones orientan.
5. **Feedback multisensorial.** Luz, vibración visual, audio, Holi, score y progreso deben sentirse conectados.
6. **Progreso visible sin manipulación.** Misiones y streaks motivan, pero sin vergüenza ni miedo a perder.
7. **Marca viva.** Holi no adorna: guía, celebra, invita a respirar y vuelve útil la experiencia.
8. **Privacidad gradual.** Jugar sin cuenta; guardar local; pedir email solo después de valor.

## 3. Visión: de minigame web a sensación de app

Neural Pulse debe evolucionar de "un minijuego al final de la landing" a "un módulo interactivo premium de Holive". La diferencia se nota en:

- Entrada dedicada con Train Hub.
- Pantalla completa y controles persistentes.
- Audio reactivo por modo.
- Estado guardado.
- Misiones diarias/semanales.
- Recompensas visuales.
- CTA contextual después de logro o sesión.
- PWA futura para volver desde pantalla de inicio.

El objetivo no es competir con apps clínicas. Es demostrar que Holive puede convertir marca, código, audio y narrativa en un producto vivo.

## 4. Sistema de misiones: Classic + Freestyle

### 4.1 Misiones diarias

Las misiones diarias deben mezclar reto y calma:

- Classic: superar una profundidad.
- Classic: alcanzar el puntaje objetivo del día.
- Freestyle: tocar cierto número de golpes.
- Freestyle: sostener una sesión de 3 minutos.
- Freestyle: probar un layout 4 / 6 / 8.
- Freestyle: ajustar pitch de un pad y tocar una secuencia libre.

### 4.2 Misiones semanales

Las misiones semanales dan estructura sin presión:

- Completar 3 días con al menos una misión.
- Jugar Classic y Freestyle en la misma semana.
- Mantener una sesión Freestyle de 5 minutos.
- Desbloquear una profundidad Classic y cerrar con Healing Drum.
- Probar dos temas Holive del kit.

### 4.3 Recompensas

Recompensas posibles:

- Badge de pulso.
- Tarjeta mantra.
- Certificado de profundidad.
- Tema visual Freestyle.
- Kit preset "Calma", "Raíz", "Lanzamiento", "Noche".
- Insight breve de Holi.

### 4.4 Persistencia

MVP:

- `localStorage` para progreso Classic.
- `localStorage` para kit Freestyle.
- `localStorage` para misiones del día.

P2:

- Supabase para historial de sesiones.
- Supabase para misiones semanales y streaks.
- Tabla de leads asociada a progreso voluntario.
- Export/share de resumen.

## 5. Modos de juego

### 5.0 Freestyle / Healing Drum — modo first-class

Freestyle es una **batería libre**, no Simon. No hay secuencia que memorizar, no hay "game over", no hay castigo. El jugador entra a una práctica de ritmo, respiración y presencia: toca pads afinados, escucha una cama `heal`, ajusta tempo, cambia layout y deja que el cuerpo encuentre pulso.

#### 5.0.1 Promesa de experiencia

Freestyle debe sentirse como:

- Zen, pero no vacío.
- Sagrado-matrix Holive: púrpura profundo, oro, grid suave, partículas, Holi acompañando.
- Cuenco + drum + pad: capa ceremonial, golpe físico y tono cálido.
- Sanación estética, no claim médico.
- Free play musical simple: cualquiera entiende tocar pads en 2 segundos.

#### 5.0.2 Kit / batería

El kit debe soportar:

- Layouts de 4, 6 y 8 pads.
- Pads grandes para móvil.
- Labels simples: Root, Seed, Stem, Aura, Mesh, Heal, Sun, Moon.
- Pitch por pad.
- Timbres por fase futura:
  - Cuenco suave.
  - Hand drum.
  - Digital pluck.
  - Warm pad.
  - Bell sparkle.

Implementación actual/próxima:

- `FreestyleKit` guarda `theme`, `padCount`, `tempo`, `metronome` y `pads`.
- `kitWithLayout` materializa coordenadas para 4 / 6 / 8.
- `saveFreestyleKit` persiste en `localStorage`.
- Supabase entra después para continuidad multi-dispositivo.

#### 5.0.3 Audio

Audio requerido:

- Bed `heal` con intención calmada.
- `playDrumHit` para cuerpo percusivo.
- `playPadHit` para tono/pitch.
- `playFreestyleHit` como combinación drum + pad.
- `playMetronomeClick` para ritmo asistido.
- Mute y volumen siempre visibles.

Claims:

- "Cama sonora para ritmo y calma."
- "Metrónomo opcional para sostener pulso."
- "Mejor con audífonos."

No claims:

- "Cura ansiedad."
- "Reprograma tu cerebro."
- "Terapia binaural."

#### 5.0.4 Customización

Freestyle debe ser personalizable sin volverse complejo:

- Layout: 4 / 6 / 8.
- Pitch: slider por pad seleccionado.
- Temas Holive:
  - Heal: calma púrpura/oro.
  - Pulse: contraste clásico.
  - Gold: brillo ceremonial.
  - Night: matriz profunda.
- Metrónomo on/off y tempo.
- Visuales:
  - Ripples por golpe.
  - Gold dust alrededor del pad activo.
  - Holi groove/bob en sesiones futuras.
  - Grid sagrado-matrix de fondo.

#### 5.0.5 Neuroplasticidad y regulación: claims cuidadosos

Freestyle se puede vincular con ideas generales de timing sensorimotor, repetición y flow. La forma honesta:

- El ritmo ayuda a organizar atención en el momento.
- La repetición puede facilitar entrada en flow.
- El tempo estable puede acompañar respiración y calma.
- El juego promueve práctica de ritmo y presencia.

La forma NO aceptable:

- Afirmar cura.
- Afirmar tratamiento.
- Afirmar cambios cerebrales medibles sin estudio.

Frase guía:

> Freestyle no promete curar: propone ritmo y calma, una práctica breve de atención corporal dentro del universo Holive.

#### 5.0.6 Diferenciador hero

Muchos juegos de memoria se sienten como Simon con skin. Freestyle rompe ese patrón:

- Convierte el producto en instrumento.
- Da valor aunque el usuario no quiera competir.
- Hace que Holive se sienta espiritual, técnico y útil.
- Crea clips/share potenciales: "mi ritmo Holive".
- Abre misiones que no dependen de ganar.

#### 5.0.7 CTA y negocio

Después de una sesión real:

- CTA suave: "¿Qué estás sincronizando esta semana?"
- Email opcional.
- Interés segmentado: calma, foco, negocio, automatización, cursos.
- Resumen de sesión en P2.

### 5.1 Classic Pulse

Classic Pulse es el modo de secuencia:

- Ver patrón.
- Repetir patrón.
- Subir profundidad.
- Desbloquear rewards.
- Mostrar LeadCapture tras progreso significativo.

Debe pulirse con:

- Mejor onboarding corto.
- Indicadores de dificultad.
- Sonidos por profundidad.
- Más claridad entre "watch" y "your turn".
- Animación de Holi al limpiar nivel.

### 5.2 Pulse Sync

Modo futuro orientado a timing:

- El jugador toca en sincronía con un pulso.
- Se mide cercanía temporal, no memoria.
- Puede preparar el puente entre Classic y Freestyle.
- Ideal para misiones de ritmo.

### 5.3 Echo Pattern

Modo futuro:

- Repetición auditiva/visual.
- Secuencias con variación de timbre.
- Entrena memoria auditiva dentro del juego.

### 5.4 Breath Gate

Modo futuro:

- Sesiones de respiración guiada sin sensores clínicos.
- Ritmo visual expand/contract.
- Audio suave.
- Claims: respiración guiada y calma percibida, no terapia.

### 5.5 Mantra Mesh

Modo futuro:

- Elegir o desbloquear mantras Holive.
- Asociarlos a micro-retos.
- Convertir aprendizaje de marca en memoria emocional.

## 6. Mapeo de dominios

| Dominio | Classic Pulse | Freestyle / Healing Drum | Modos futuros | Señal de producto |
| --- | --- | --- | --- | --- |
| Memoria secuencial | Alto | Bajo | Echo Pattern | Profundidad, score |
| Timing | Medio | Alto | Pulse Sync | Precisión, tempo |
| Regulación / calma | Medio | Alto | Breath Gate | Duración, retorno |
| Ritmo corporal | Bajo | Alto | Pulse Sync | Hits, BPM, sesión |
| Audio | Beds por nivel | Heal bed, drum, pad, metronome | Timbres | Mute, volumen, uso |
| Visual | Nodos, trails, overlays | Ripples, gold dust, kit themes | Breath waves | Engagement |
| Persistencia | Progress, rewards | Kit, missions, sessions | Historial | localStorage/Supabase |
| Growth | Lead after deep progress | CTA after meaningful practice | Insights | Email opt-in |
| Brand | Holi coach | Holi groove / sanación | Mantras | Diferenciación |

Freestyle vive principalmente en **timing/regulación**: ritmo corporal, flow, calma y presencia. Classic vive en memoria y reto.

## 7. Prioridad de construcción

1. Classic polish: claridad, overlays, score, rewards, CTA.
2. Freestyle first-class: Train Hub, heal bed, kit, layout, pitch, metronome, visuals.
3. Misiones diarias: Classic + Freestyle.
4. Pulse Sync.
5. Echo Pattern.
6. Breath Gate.
7. Mantra Mesh.
8. PWA.
9. Supabase continuity.
10. AI summaries / pantallas inteligentes.

## 8. Roadmap P2

P2 debe llevar al producto de demo premium a hábito:

- Train Hub completo con tarjetas de modo, misiones y progreso.
- Freestyle robusto:
  - Layout 4 / 6 / 8.
  - Pitch por pad.
  - Temas visuales.
  - Presets guardables.
  - Métricas de sesión.
- Misiones diarias/semanales.
- Rewards cosméticos.
- Supabase para historial.
- PWA install prompt.
- Sync mode como tercer modo jugable.
- Echo y Breath como expansiones.
- IA opcional para resumen de sesión o recomendación de práctica, siempre con disclaimers.

## 9. Audio

### 9.1 Capas

- Ambient bed por modo.
- Binaural opcional y prudente.
- Hits cortos con decay natural.
- Drum body para Freestyle.
- Chime/celebration para logros.
- Metronome con accent cada 4 beats.

### 9.2 Reglas

- Audio solo tras gesto del usuario.
- Mute persistente visualmente claro.
- Volumen bajo por defecto.
- No bloquear gameplay si audio falla.
- Mobile Safari/Chrome first.

## 10. Visual

### 10.1 Classic

- Nodos púrpura/oro.
- Trails por dificultad.
- Distractores claros.
- Celebración Holi.
- Overlay legible.

### 10.2 Freestyle

- Pads grandes.
- Ripples por golpe.
- Polvo dorado.
- Fondo sacred-matrix.
- Holi groove futuro.
- Temas sin salir de paleta Holive.

### 10.3 Accesibilidad

- Reduced motion respetado.
- Labels por pad/nodo.
- Contraste suficiente.
- No depender solo de color.
- Botones táctiles con tamaño cómodo.

## 11. IA, pantallas inteligentes y narrativa

IA no debe entrar como gimmick. Usos aceptables:

- Resumen de sesión: "tocaste 4 minutos, tempo 72, tema Heal".
- Sugerencia de misión: "mañana prueba layout 4".
- Mantra contextual Holive.
- Insight no clínico: "tu práctica sostuvo ritmo constante".

Pantallas:

- Train Hub.
- Mission Drawer.
- Session Summary.
- Rewards.
- LeadCapture contextual.
- Settings audio/kit.

## 12. PWA

PWA convierte el minijuego en ritual recurrente:

- Instalable.
- Icono Neural Pulse.
- Carga rápida.
- Offline básico para Freestyle/Classic local.
- Sync Supabase cuando haya red.
- Notificaciones solo si el usuario las pide.

## 13. Supabase phases

### Phase S0: local-first

- Progress local.
- Kit local.
- Missions local.

### Phase S1: leads + scores

- Score insert actual.
- LeadCapture actual.
- Campo opcional de modo/interés.

### Phase S2: accounts light

- Magic link.
- Historial de sesiones.
- Misiones semanales.
- Rewards persistentes.

### Phase S3: insights

- Dashboards agregados.
- Segmentación por interés.
- Resumen exportable.
- Recomendaciones no clínicas.

## 14. Métricas

### Producto

- Arena opens.
- Mode selection: Classic vs Freestyle.
- Classic starts/clears/misses.
- Freestyle starts.
- Freestyle hits.
- Freestyle session duration.
- Audio enabled/muted.
- Missions completed.
- Return next day.

### Negocio

- LeadCapture shown.
- LeadCapture submitted.
- CTA after Classic clear.
- CTA after Freestyle session.
- Locale.
- Interest text.

### Calidad

- Build success.
- Audio errors.
- Fullscreen failure rate.
- Mobile interaction issues.
- Time to first interaction.

## 15. Riesgos

1. **Claims científicos exagerados.** Mitigar con lenguaje "ritmo y calma".
2. **Audio molesto o invasivo.** Volumen bajo, mute claro, user gesture.
3. **Demasiados modos.** Priorizar Classic + Freestyle antes de expandir.
4. **Móvil saturado.** Controles grandes, pocos textos, layout simple.
5. **Pérdida de identidad.** Mantener Holi, oro/púrpura, sacred-matrix.
6. **Misiones manipulativas.** Evitar shame loops; usar invitación.
7. **Persistencia frágil.** Local-first con migración Supabase clara.

## 16. Preguntas para fundador

1. ¿Freestyle debe sentirse más ceremonial o más musical?
2. ¿Qué palabra prefiere la marca: sanación, calma, sincronía, enfoque?
3. ¿El CTA posterior a Freestyle debe ir a cursos, contacto o waitlist?
4. ¿Queremos ranking público o mantenerlo personal?
5. ¿Qué recompensas importan: certificados, badges, temas, mantras?
6. ¿Qué tanto debe aparecer Holi durante el juego?
7. ¿PWA es prioridad comercial o pulido posterior?
8. ¿Se quiere cuenta de usuario o experiencia sin fricción?
9. ¿Qué métricas definen éxito: leads, tiempo, retorno, shares?
10. ¿Qué tono legal/compliance queremos para claims de calma?

## 17. Apéndices

### Apéndice A: Copy recomendado

- "Elige tu ruta neural."
- "Classic reta tu memoria. Freestyle sostiene tu ritmo."
- "Tambor sanador Freestyle: toca, respira, vuelve al pulso."
- "Ritmo y calma; sin promesas médicas."
- "Holi acompaña tu práctica."

### Apéndice B: Eventos sugeridos

- `game_arena_entered`
- `game_mode_selected`
- `classic_level_started`
- `classic_level_cleared`
- `classic_score_recorded`
- `freestyle_started`
- `freestyle_hit`
- `freestyle_kit_changed`
- `freestyle_session_recorded`
- `mission_completed`
- `lead_capture_submitted`

### Apéndice C: Esquema Supabase futuro

Tablas:

- `game_sessions`
- `game_scores`
- `game_missions`
- `game_kits`
- `game_rewards`
- `leads`

Campos Freestyle:

- `mode`
- `duration_seconds`
- `hits`
- `tempo`
- `theme`
- `pad_count`
- `favorite_pad`
- `completed_missions`

### Apéndice D: Definición de "premium" para Neural Pulse

Premium no significa pesado. Significa:

- Se siente intencional.
- Responde rápido.
- Tiene sonido con criterio.
- Guarda progreso.
- Tiene una razón para volver.
- Convierte marca en experiencia.
- Deja al usuario con claridad, no ruido.
