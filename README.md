# LR Stays — Marketplace de Alojamientos

Proyecto de curso de **Desarrollo de Sistemas de Información 3** — Ingeniería de Sistemas, Universidad El Bosque.

## Descripción

LR Stays es el frontend de un marketplace de alojamientos temporales para **Inversiones LR**. Permite a los huéspedes explorar los alojamientos disponibles, filtrarlos, ver su detalle, cotizar una estadía y registrar una reserva simulada.

No tiene backend: los datos se leen de un archivo JSON a través de un servicio Angular y las reservas se guardan en el navegador con `localStorage`.

## Integrantes

- Santiago Segura Peralta
- Juan Daniel Betancourt Morales

## Tecnologías utilizadas

- Angular 22 (componentes standalone y rutas)
- TypeScript 6
- RxJS 7
- HTML y CSS, con variables CSS como tokens de diseño
- Google Fonts (Inter) y Material Icons
- Metodología **Atomic Design** para organizar los componentes

## Requisitos para ejecutar la aplicación

- [Node.js](https://nodejs.org/) 24 LTS (probado con la versión 24.20.0)
- npm 11 (viene incluido con Node.js)
- Git

## Instrucciones de instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/SSEGURAP/Proyecto-de-Curso-Marketplace-de-Alojamientos.git
   ```
2. Entrar a la carpeta de la aplicación:
   ```bash
   cd Proyecto-de-Curso-Marketplace-de-Alojamientos/inversiones-lr-marketplace
   ```
3. Instalar las dependencias:
   ```bash
   npm install
   ```

## Instrucciones de ejecución

Dentro de la carpeta `inversiones-lr-marketplace`:

```bash
npm start
```

Abrir en el navegador: **http://localhost:4200**

## Principales funcionalidades

- **Página inicial:** nombre de la plataforma, descripción, buscador y alojamientos destacados.
- **Búsqueda:** desde el encabezado o el inicio se elige ciudad, fecha de llegada, fecha de salida y número de huéspedes; el catálogo se abre con esa búsqueda aplicada.
- **Listado de alojamientos:** imagen, nombre, ciudad, tipo, capacidad, precio por noche, calificación y servicios.
- **Filtros:** por ciudad, número de huéspedes, tipo de alojamiento y precio máximo. Los resultados cambian al instante, se pueden limpiar los filtros y se informa cuando no hay resultados.
- **Detalle del alojamiento:** galería y visor de fotos, descripción, ubicación, tipo, capacidad, habitaciones, camas, baños, precio, servicios, reglas, calificación y reseñas.
- **Cotización:** número de noches, subtotal, tarifa de limpieza, tarifa de servicio (10 % del subtotal) y total.
- **Reserva simulada:** después de una cotización válida, el botón Reservar solicita nombre y correo y guarda la reserva con estado `CONFIRMADA`.
- **Mis reservas:** lista las reservas realizadas, permite eliminarlas y muestra un mensaje cuando no hay ninguna.
- **Diseño adaptable** a escritorio, tableta y celular.

### Reglas de negocio implementadas

- La fecha de salida debe ser posterior a la fecha de llegada.
- La fecha de llegada no puede ser anterior a la fecha actual.
- El número de huéspedes debe ser mayor que cero y no puede superar la capacidad del alojamiento.
- El precio por noche debe ser mayor que cero.
- Solo se cotiza con fechas válidas y solo se reserva después de una cotización válida.
- La tarifa de servicio corresponde al 10 % del subtotal.
- No se muestran alojamientos inactivos.

## Estructura general del proyecto

```
inversiones-lr-marketplace/
├── public/                              Archivos públicos (favicon)
└── src/
    ├── index.html
    ├── styles.css                       Tokens de diseño (colores, tipografía, espaciado)
    ├── assets/
    │   ├── data/marketplace-data.json   Datos de alojamientos y reseñas
    │   └── images/                      Imágenes de los alojamientos
    └── app/
        ├── app.routes.ts                Rutas de la aplicación
        ├── models/                      Interfaces TypeScript (Alojamiento, Reserva, Cotización…)
        ├── services/                    AlojamientoService: datos, filtros, cotización y reservas
        ├── utils/                       Función para obtener la fecha actual
        ├── pages/                       Pantallas: home, catalog, detail, reservations
        └── components/
            ├── atoms/                   Elementos básicos: button, label, input, select, icon, badge…
            ├── molecules/               Combinaciones de átomos: search-bar, select-field, price-tag…
            └── organisms/               Secciones completas: header, hero, filter-sidebar,
                                         alojamiento-card, booking-card, detail-gallery, footer…
```

### Rutas

| Ruta | Pantalla |
|---|---|
| `/home` | Página inicial |
| `/alojamientos` | Listado con filtros (acepta `ciudad`, `llegada`, `salida` y `huespedes`) |
| `/alojamiento/:id` | Detalle, cotización y reserva |
| `/reservas` | Mis reservas |
