# CurvaGo 🏍️ — Carreteras con curvas · v1.3.0

Planificador de rutas **con curvas para moto**, en un único HTML, para móvil y sin instalación.
Genera rutas y **vueltas circulares desde tu posición**, las puntúa por diversión, te **guía con
voz** y guarda tu **historial** de rutas planificadas y realizadas.

Inspirado en CALIMOTO, construido sobre **OpenStreetMap** y el motor libre **BRouter**.
Interfaz **español/inglés**, tema **claro/oscuro/sistema**.

---

## 1. Qué app gratuita de voz es la más fiel a CALIMOTO

| App | Curvas | Vuelta circular | Voz gratis | Sigue tu línea exacta |
|---|---|---|---|---|
| **Kurviger** | Sí (4 niveles) | Sí | **No** (voz solo con Tourer+, ~30 EUR/año) | Sí |
| **OsmAnd** ✅ | Sí (vía GPX/BRouter) | No nativo | **Sí** | **Sí** |
| Organic Maps | Limitado | No | Sí | Parcial |
| Calimoto (free) | Sí | Sí | Sí, pero **región limitada** | Sí |

**Conclusión:** la réplica **gratuita y fiel** = **CurvaGo (planifica) -> OsmAnd (navega con voz)**.
CurvaGo pide a BRouter el GPX con **instrucciones de giro embebidas** (`turnInstructionMode=3`),
así OsmAnd anuncia los cruces reales por voz siguiendo **tu línea exacta**.

---

## 2. Novedades v1.3.0

- **Mapa que rota en sentido de marcha** durante el guiado (estilo navegador, "heading-up"), con la flecha del piloto siempre apuntando arriba. Se puede desactivar en ⚙.
- **Velocidad en grande** durante la ruta (badge inferior izquierdo).
- **Generador de rutas circulares rediseñado:** el origen queda en el perímetro y se reparten varios puntos para formar un bucle real (sin ida y vuelta por la misma carretera), con **calibración de distancia** (acierta la distancia pedida con ~6-8% de margen) y reintentos por varias direcciones.
- **Perfiles afinados como los trazaría un motero rutero:** menos "rat-running" por urbanizaciones, conectores con sentido y giros más naturales (penalización de giro), evitando recorridos extraños.

---

## 3. Cómo se usa (flujo nuevo v1.2.0)

1. Pulsa **＋ Generar ruta**. Se abre el asistente:
   - **Tipo de recorrido:** Circular · Ida y vuelta · Solo ida.
   - **Origen:** Mi ubicación (GPS) · Elegir en el mapa.
   - **Distancia** (si es circular) o **Destino** (si es ida y vuelta / solo ida).
   - **Tipo de ruta:** Rápida · Curvas · Sinuosa · Máxima diversión.
2. Pulsa **Generar** -> se traza la ruta y aparece el resumen (km · tiempo · curvas).
3. Pulsa **▶ Iniciar guiado** -> tarjeta grande de giros con voz (pantalla encendida).
   O bien **OsmAnd (voz)** para guiado con pantalla apagada, **Google Maps**, **★ Guardar** o **↺ Nueva ruta**.
4. **● Grabar ruta libre** (pantalla de inicio): registra un trayecto sin ruta previa.
5. **≣ Mis rutas:** historial de **Planificadas** y **Realizadas**.
6. **⚙ Ajustes:** idioma (ES/EN), tema (claro/oscuro/sistema), mapa, descargar zona offline,
   mantener pantalla encendida, voz, copia de seguridad, versión y actualización.

---

## 4. Cómo subirlo a GitHub - paso a paso

GitHub Pages es la mejor opción: **gratis**, sirve por **HTTPS** (obligatorio para GPS y PWA) e ideal para un sitio estático de un solo HTML.

### Opción A - Sin terminal (recomendada, todo en la web)

1. Entra en **github.com** e inicia sesión (usuario `Drivrie`).
2. Arriba a la derecha, **+ -> New repository**.
3. **Repository name:** `curvago`. Visibilidad **Public**. Pulsa **Create repository**.
4. En el repo vacío, pulsa **uploading an existing file** (enlace azul).
5. **Descomprime** `curvago.zip`. Arrastra **el contenido** de la carpeta
   (`index.html`, `manifest.webmanifest`, `sw.js`, `README.md`, `LICENSE`, `.nojekyll` y la carpeta `icons`)
   a la zona de subida. *Sube los archivos, no la carpeta `curvago` envolvente.*
6. Abajo, pulsa **Commit changes**.
7. Pestaña **Settings** -> menú lateral **Pages**.
8. **Build and deployment -> Source:** **Deploy from a branch**.
9. **Branch:** `main` y carpeta **/ (root)** -> **Save**.
10. Espera 1-2 min y recarga. Aparece la URL:
    **`https://drivrie.github.io/curvago/`**. Ábrela en el móvil.
11. En el móvil: **Compartir -> Añadir a pantalla de inicio** para instalarla a pantalla completa.

> Si subes sin querer la carpeta `curvago` dentro del repo, la URL sería
> `https://drivrie.github.io/curvago/curvago/`. Funciona igual, pero es más limpio subir el contenido a la raíz.

### Opción B - Con terminal (git)

```bash
# dentro de la carpeta descomprimida "curvago"
git init
git add .
git commit -m "CurvaGo v1.1.0"
git branch -M main
git remote add origin https://github.com/Drivrie/curvago.git
git push -u origin main
```
Luego: **Settings -> Pages -> Branch `main` / root -> Save**.

### Actualizar la app
Sustituye `index.html` (y lo que cambie), haz **Commit** (o `git push`). Al abrir la app verás
**"Nueva versión lista"** en ⚙. **Tus rutas guardadas NO se borran** al actualizar.

---

## 5. Estructura del repo

```
curvago/
├── index.html              · la app (v1.1.0)
├── manifest.webmanifest    · PWA (icono, nombre, pantalla completa)
├── sw.js                   · service worker (instalable + tiles offline; no toca tus datos)
├── icons/                  · 192 / 512 / maskable / apple + favicon
├── README.md  ·  LICENSE  ·  .nojekyll
```

---

## 6. Batería y límites honestos

- El mayor gasto es **pantalla encendida + GPS**: inherente a navegar con voz en una web. Puedes apagar el Wake Lock en ⚙. Para rutas largas, OsmAnd gasta menos y va con pantalla apagada.
- **Sin mapas offline completos** (descarga de zona = solo tiles visibles, con tope). Para offline real, usa OsmAnd.
- El algoritmo de curvas es una **aproximación** del de CALIMOTO (propietario, datos TomTom).
- Depende del servidor público **brouter.de**. Si falla, reintenta o monta el tuyo.

---

## 7. Créditos y licencias

Datos © **OpenStreetMap** (ODbL) · Enrutado **BRouter** · Teselas **CyclOSM / OpenTopoMap (CC-BY-SA)** ·
Mapa **Leaflet** (BSD-2) · Voz recomendada **OsmAnd** (libre). Código CurvaGo: **MIT** (`LICENSE`).
No afiliado a CALIMOTO, Kurviger ni OsmAnd.
