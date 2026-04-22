# TiendaRopaFront

## Explicación del flujo
En este frontend, que consume una API REST hecha con PHP, el objetivo es brindarle tanto al usuario comprador como al usuario administrador un flujo intuitivo y un diseño agradable.
Estructura de componentes
El proyecto está compuesto por varios componentes que se comunican entre sí mediante NgModules. Cada módulo tiene su archivo .module.ts donde se declaran, importan y exportan los componentes, servicios y demás clases necesarias, permitiendo que puedan ser utilizados desde otros módulos.
Cada componente cuenta con su propio archivo HTML y CSS, que definen su estructura visual y estilos. El componente raíz es AppComponent (app.component.html), que actúa como esqueleto principal de la aplicación y contiene la directiva:
html
<div class="main-container">
  <router-outlet></router-outlet>
</div>
<router-outlet> es una directiva de Angular que actúa como marcador de posición dinámico: el router renderiza ahí el componente correspondiente según la ruta activa en ese momento.
Consumo de la API
Determinados componentes consumen la API a través de servicios. Por ejemplo:

product-list: utiliza el servicio correspondiente para traer todos los productos desde la API y los pasa a su template HTML para mostrarlos.
product-detail: implementa el método ngOnInit, que se ejecuta automáticamente al inicializar el componente. En él se busca un producto por su ID, se extraen sus variantes para mostrarlas, y se gestiona la funcionalidad de agregar el producto al carrito.


### Esqueleto principal (app.html)
Define la estructura base de la aplicación con tres secciones fijas:
- `<app-navbar>` — barra de navegación superior.
- `<router-outlet>` — zona dinámica donde Angular renderiza el componente correspondiente según la ruta actual.
- `<app-footer>` — pie de página.

El `<router-outlet>` está envuelto en un `<div class="main-container">` que limita el ancho máximo del contenido y lo centra.

### Módulo y ruteo
- **app-module.ts** — Declara todos los componentes e importa los módulos necesarios (`BrowserModule`, `HttpClientModule`, `FormsModule`, `AppRoutingModule`).
- **app-routing-module.ts** — Define las rutas:
  - `/productos` → `Products` (página principal con carrusel y listado).
  - `/producto/:id` → `ProductDetail` (detalle con variantes).
  - `/login` → `Login`.
  - `/carrito` → `Cart`.

### Componentes (`pages/`)

| Componente | Descripción |
|---|---|
| **Products** | Página contenedora que incluye el carrusel de ofertas (`app-carrousel`) y el listado 
(`app-product-list`). |
| **ProductList** | Obtiene todos los productos desde la API a través de `ProductService` y los muestra como cards. Soporta filtrado local por query param `q` (nombre, marca o descripción). |
| **ProductDetail** | Recibe el `id` por ruta, carga el producto y sus variantes con `ngOnInit()`. Permite seleccionar color y talle para agregar al carrito la variante específica. Incluye carrusel de imágenes y breadcrumb. |
| **Cart** | Se suscribe al `BehaviorSubject` del servicio de carrito y muestra los items en tiempo real. Permite vaciar el carrito y acceder al flujo de compra. |
| **Carrousel** | Slider de ofertas con flechas visibles en hover y puntos indicadores. |
| **Navbar** | Barra de navegación con links centrales, búsqueda desplegable, dropdown de usuario (login/registro) y botón de carrito con offcanvas y badge de cantidad. |
| **Footer** | Pie de página. |
| **InputNumber** | Componente reutilizable de contador (+/-) con límite máximo por stock. |

### Servicios (`core/services/`)

| Servicio | Descripción |
|---|---|
| **Api** | Wrapper de `HttpClient`. Define la `API_BASE_URL` y expone `http` para que otros servicios lo usen. |
| **ProductService** | Consume los endpoints de productos: `getProducts()`, `getProductById(id)`, `getProductsByCategory(categoryId)`. Retorna `Observable`. |
| **ClothesCartService** | Gestiona el estado del carrito con un `BehaviorSubject<CartItem[]>`. Identifica cada item por la combinación `id_producto + talle + color`. Limita la cantidad al stock disponible. |

### Modelos (`core/models/produc.model.ts`)

- **Product** — id, nombre, descripcion, precio, marca, imagen, activo, categoria, variantes.
- **ProductVariant** — id_variante, id_producto, talle, color, precio, stock, quantity (temporal para el contador).
- **ProductCategory** — id, nombre.
- **CartItem** — producto, variante, quantity.

## Comunicación entre componentes

1. **Servicios inyectables** — Decorados con `@Injectable({ providedIn: 'root' })`, son singletons accesibles desde cualquier componente mediante inyección de dependencias.
2. **Inputs/Outputs** — Componentes hijos como `InputNumber` reciben datos via `@Input()` y emiten eventos via `@Output()`.

## Ejecución

```bash
npm install
ng serve
```
La app corre en `http://localhost:4200` y consume la API en `http://localhost/tiendaRopa/tienda/api`.

