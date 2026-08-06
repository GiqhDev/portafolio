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
- Boton de volver arriba y formulario de contacto funcionales
- Open Graph tags para compartir en redes sociales
- Lazy loading en imagenes para mejor rendimiento
- Formulario con Web3Forms (servicio gratuito)

## Configuracion del formulario de contacto

El formulario usa [Web3Forms](https://web3forms.com/) para enviar mensajes directamente a tu correo. Para configurarlo:

1. Ve a [web3forms.com](https://web3forms.com/) y crea una cuenta gratuita
2. Copia tu Access Key
3. Abre `index.html` y reemplaza `TU_ACCESS_KEY_AQUI` con tu Access Key real
4. Los mensajes se enviaran a tu correo registrado en Web3Forms

## Pendientes recomendados

- Optimizar peso de las imagenes principales (usar TinyPNG o convertir a WebP)
- Agregar demos en vivo si alguno de los proyectos queda desplegado
- Conectar un dominio personalizado si quieres una version final mas profesional

## Publicacion recomendada

La forma mas simple para este proyecto es GitHub Pages, porque el sitio es estatico y no necesita build.

1. Haz merge de la rama `Dev` a `main`.
2. En GitHub entra a `Settings > Pages`.
3. En `Build and deployment`, elige `Deploy from a branch`.
4. Selecciona la rama `main` y la carpeta `/ (root)`.
5. Guarda y espera a que GitHub publique el sitio.

## Checklist antes de publicar

- Verificar que el PDF del CV abra correctamente desde `Resources/cv/`
- Confirmar que todos los enlaces a GitHub, LinkedIn y WhatsApp abran bien
- Probar el modal de imagenes en desktop y mobile
- Reducir las imagenes mas pesadas si quieres una carga mas rapida en produccion
