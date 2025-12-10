// app.js - Versión tolerante y con diagnóstico de errores
// Asegúrate de incluir este script al final del body: <script src="app.js"></script>

// Helper: buscar el primer ID existente entre una lista
function $idAny(...ids) {
  for (let id of ids) {
    const el = document.getElementById(id);
    if (el) return el;
  }
  return null;
}

/* ============================================================
   CONFIG: elementos (soporta varios nombres que usaste)
   Busca el primer id que exista en el DOM para cada cosa.
============================================================ */

// Imágenes dinámicas
const inputImagen = $idAny('inputImagen', 'inputUrl');
const btnAgregarImagen = $idAny('btnAgregarImagen', 'btnAgregarImagen'); // mismo nombre usado en HTML
const galeria = $idAny('galeria', 'contenedorImagenes');

// Botón eliminar (variedades y/o imágenes) — puede existir uno solo
const btnEliminarPrimeraVariedad = $idAny('btnEliminarPrimera'); // tu HTML tiene este id (variedades)
const btnEliminarPrimeraImagen = $idAny('btnEliminarPrimeraImagen'); // opcional, si lo creas

// Variedades sonoras
const listaVariedades = $idAny('listaVariedades');
const inputNuevaVariedad = $idAny('inputNuevaVariedad');
const btnAgregarVariedad = $idAny('btnAgregarVariedad');

// Playlist y otros (si existen)
const btnAgregarPlaylist = null; // ejemplo si quisieras más bindings

// Pequeña función utilitaria para registrar en consola si algo no existe
function checkElement(name, el) {
  if (!el) console.warn(`(app.js) Elemento NO encontrado en DOM: ${name}`);
  else console.log(`(app.js) Elemento encontrado: ${name}`);
}

// Diagnóstico inicial (mira la consola del navegador)
checkElement('inputImagen / inputUrl', inputImagen);
checkElement('btnAgregarImagen', btnAgregarImagen);
checkElement('galeria / contenedorImagenes', galeria);
checkElement('btnEliminarPrimera (variedades)', btnEliminarPrimeraVariedad);
checkElement('btnEliminarPrimeraImagen', btnEliminarPrimeraImagen);
checkElement('listaVariedades', listaVariedades);
checkElement('inputNuevaVariedad', inputNuevaVariedad);
checkElement('btnAgregarVariedad', btnAgregarVariedad);

/* ============================================================
   UTIL: validar URL (simple)
============================================================ */
function urlPareceImagen(url) {
  if (!url || typeof url !== 'string') return false;
  const u = url.toLowerCase();
  // acepta aquellas que terminen en imagen o que sean enlaces https/http (más flexible)
  return (/\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/.test(u) || u.startsWith('http://') || u.startsWith('https://'));
}

/* ============================================================
   IMÁGENES DINÁMICAS
   - añade imagenes a #galeria o #contenedorImagenes
   - si el elemento no existe, no hace nada
============================================================ */
if (btnAgregarImagen && inputImagen && galeria) {
  btnAgregarImagen.addEventListener('click', function (e) {
    e.preventDefault();

    const url = inputImagen.value ? inputImagen.value.trim() : '';

    if (!url) {
      alert('Por favor ingresa una URL.');
      inputImagen.classList && inputImagen.classList.add('input-error');
      return;
    }

    if (!urlPareceImagen(url)) {
      // no descartamos por completo (algunas urls válidas no terminan en extensión),
      // pero avisamos al usuario y pedimos confirmación
      const continuar = confirm('La URL no tiene extensión de imagen reconocida. ¿Deseas intentarlo de todas formas?');
      if (!continuar) {
        inputImagen.classList && inputImagen.classList.add('input-error');
        return;
      }
    }

    // Crear columna (si estás usando bootstrap grid)
    const col = document.createElement('div');
    col.className = 'col-12 col-md-4 col-lg-3';

    // Crear imagen y manejo de error
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Imagen agregada dinámicamente';
    img.className = 'img-fluid rounded shadow-sm';

    img.onerror = function () {
      // Si falla la carga, mostrar alerta y remover el contenedor
      alert('No se pudo cargar la imagen. Revisa la URL o prueba otra imagen.');
      col.remove();
    };

    // Si carga bien, puedes agregar un pequeño fade-in
    img.onload = function () {
      img.style.opacity = 0;
      img.style.transition = 'opacity .25s ease';
      requestAnimationFrame(() => img.style.opacity = 1);
    };

    col.appendChild(img);
    galeria.appendChild(col);

    // limpiar input y quitar marca de error si existe
    inputImagen.value = '';
    inputImagen.classList && inputImagen.classList.remove('input-error');
  });
} else {
  console.warn('(app.js) Se omitió inicializar la galería dinámica porque faltan elementos en el DOM.');
}

/* ============================================================
   ELIMINAR PRIMER ELEMENTO - VARIEDADES
   Si existe btnEliminarPrimera (tu HTML tiene ese id), lo usamos para la lista
============================================================ */
if (btnEliminarPrimeraVariedad && listaVariedades) {
  btnEliminarPrimeraVariedad.addEventListener('click', function (e) {
    e.preventDefault();
    const primera = listaVariedades.firstElementChild;
    if (primera) primera.remove();
    else alert('No hay variedades para eliminar.');
  });
} else {
  console.warn('(app.js) Botón eliminar (variedades) o lista no encontrada; no se enlaza acción.');
}

/* ============================================================
   AGREGAR NUEVA VARIEDAD SONORA
============================================================ */
if (btnAgregarVariedad && inputNuevaVariedad && listaVariedades) {
  btnAgregarVariedad.addEventListener('click', function (e) {
    e.preventDefault();
    const texto = inputNuevaVariedad.value ? inputNuevaVariedad.value.trim() : '';
    if (!texto) {
      alert('Escribe una variedad antes de agregar.');
      inputNuevaVariedad.classList && inputNuevaVariedad.classList.add('input-error');
      return;
    }
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = texto;
    listaVariedades.appendChild(li);
    inputNuevaVariedad.value = '';
    inputNuevaVariedad.classList && inputNuevaVariedad.classList.remove('input-error');
  });
} else {
  console.warn('(app.js) No se inicializó sección "variedades sonoras" porque faltan elementos.');
}

/* ============================================================
   Si más adelante quieres agregar: eliminar primera imagen
   (si creas un botón con id="btnEliminarPrimeraImagen" entonces funcionará)
============================================================ */
if (btnEliminarPrimeraImagen && galeria) {
  btnEliminarPrimeraImagen.addEventListener('click', function (e) {
    e.preventDefault();
    const primeraImgCol = galeria.querySelector('div');
    if (primeraImgCol) primeraImgCol.remove();
    else alert('No hay imágenes para eliminar.');
  });
}

/* ============================================================
   Mensaje final
============================================================ */
console.log('(app.js) Inicialización completa. Revisa warnings para elementos faltantes.');

fetch("https://pixabay.com/api/sounds/?key=TU_API_KEY&q=animals")
  .then(response => response.json())
  .then(data => {
    data.hits.forEach(sound => {
      const audio = document.createElement("audio");
      audio.src = sound.previewURL;
      audio.controls = true;
      document.body.appendChild(audio);
    });
  });