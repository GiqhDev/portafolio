# Portafolio personal

Portafolio web de Gustavo Quintana, enfocado en presentar perfil profesional, servicios y proyectos de desarrollo de software.

## Stack

- HTML
- CSS
- JavaScript
- Boxicons
- ScrollReveal
- Typed.js

## Estado actual

- Base visual renovada y responsive
- Navegacion y secciones optimizadas
- Contacto por correo, LinkedIn y WhatsApp
- Galeria de proyectos reales con imagenes, stack y enlaces a repositorios
- Modal para ampliar capturas de cada proyecto
- Boton de volver arriba y formulario que prepara un correo sin configuracion adicional
- Open Graph tags para compartir en redes sociales
- Lazy loading en imagenes para mejor rendimiento
- Imagen social horizontal de GIQH Soft-Factory

## Contacto

El formulario prepara un mensaje con `mailto:`. El visitante debe tener un cliente de correo configurado, revisar el borrador y pulsar enviar. No existe un envio automatico ni se almacena el contenido en el sitio. Si JavaScript esta desactivado, usa los enlaces directos de correo o WhatsApp.

Los recursos fuente de `A_Implementar/` se conservan localmente y no forman parte del sitio publicado.

## Verificacion

Ejecuta `node --test tests/*.test.js` para comprobar el formulario, el modal y los enlaces de proyectos.

## Pendientes recomendados

- Agregar demos en vivo si alguno de los proyectos queda desplegado
- Conectar un dominio personalizado si quieres una version final mas profesional

## Publicacion

El sitio se publica mediante GitHub Pages desde la rama `main` y la carpeta `/ (root)`: [giqhdev.github.io/portafolio](https://giqhdev.github.io/portafolio/). No necesita build.

Para actualizarlo, integra `Dev` en `main` y comprueba la publicacion de Pages.

## Checklist antes de publicar

- Verificar que el PDF del CV abra correctamente desde `Resources/cv/`
- Confirmar que todos los enlaces a GitHub, LinkedIn y WhatsApp abran bien
- Probar el modal de imagenes en desktop y mobile
- Comprobar la vista previa social y las imagenes de proyectos
