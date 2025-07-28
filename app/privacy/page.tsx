"use server"

import Link from "next/link"


export default async function TermsScreen() {
  return (
    <main className="max-w-4xl py-6 px-4 mx-auto min-h-screen">
      <header>
        <h1 className="text-3xl font-semibold text-white mb-4">
          📜 Términos y Condiciones de Uso - NetUp
        </h1>
        <h2 className="text-lg font-semibold mb-2">
          Última actualización:{" "}
          <time dateTime="2025-07-28" className="font-normal">28 de julio de 2025</time>
        </h2>
        <h2 className="text-lg font-semibold">
          Dominio:{" "}
          <Link href="https://netup.space" target="_blank" className="font-normal border-b border-purple-500">netup.space</Link>
        </h2>
        <p className="text-gray-300 mt-4">
          En NetUp, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta Política de Privacidad explica qué información recopilamos, cómo la usamos y qué derechos tienes como usuario de nuestra plataforma.
        </p>
      </header>
      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">1. Información que recopilamos</h2>
        <p className="mb-2">
          En NetUp recopilamos información personal y técnica para poder brindarte nuestros servicios:
        </p>
        <ul className="list-disc ml-6">
          <li>Nombre de usuario y correo electrónico</li>
          <li>Contenido que publicas: textos, comentarios, grupos, etc.</li>
          <li>Información técnica como dirección IP, tipo de dispositivo y navegador</li>
        </ul>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">2. Uso de la información</h2>
        <p className="mb-2">
          Usamos tus datos personales únicamente para los siguientes fines:
        </p>
        <ul className="list-disc ml-6">
          <li>Crear y administrar tu cuenta</li>
          <li>Mostrar publicaciones, grupos y contenido dentro de NetUp</li>
          <li>Mejorar la experiencia del usuario y mantener la seguridad de la plataforma</li>
          <li>Enviar notificaciones relacionadas con tu actividad o el estado del sistema</li>
        </ul>
        <p className="mt-2 font-semibold">
          Nunca venderemos tus datos a terceros.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">3. Seguridad de los datos</h2>
        <p className="mb-2">
          Protegemos tu información mediante las siguientes medidas:
        </p>
        <ul className="list-disc ml-6">
          <li>Encriptación de contraseñas con algoritmos seguros</li>
          <li>Uso de HTTPS en toda la plataforma</li>
          <li>Protección contra ataques comunes como XSS, CSRF y SQL Injection</li>
          <li>Control de accesos y validaciones internas</li>
        </ul>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">4. Tus derechos como usuario</h2>
        <p className="mb-2">
          Como usuario de NetUp, tienes derecho a:
        </p>
        <ul className="list-disc ml-6">
          <li>Acceder a tus datos personales</li>
          <li>Modificar o actualizar tu información</li>
          <li>Eliminar tu cuenta y todos tus datos asociados</li>
        </ul>
        <p className="mt-2">
          Puedes hacerlo escribiéndonos al correo de contacto.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">5. Conservación de datos</h2>
        <p>
          Tus datos se conservarán mientras mantengas una cuenta activa. Si decides eliminar tu cuenta, eliminaremos tus datos salvo aquellos que debamos conservar por razones legales o técnicas.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">6. Uso de cookies</h2>
        <p className="mb-2">
          NetUp utiliza cookies funcionales para:
        </p>
        <ul className="list-disc ml-6">
          <li>Mantener tu sesión activa</li>
          <li>Mejorar la navegación dentro de la plataforma</li>
        </ul>
        <p className="mt-2">
          Puedes desactivarlas desde la configuración de tu navegador, aunque esto podría afectar el funcionamiento del sitio.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">7. Cambios en la política</h2>
        <p>
          Podremos actualizar esta Política de Privacidad en el futuro. Te avisaremos dentro de la plataforma si hay cambios importantes.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">8. Contacto</h2>
        <p className="mb-1">
          Si tienes dudas o deseas ejercer tus derechos sobre tus datos personales, puedes contactarnos en:
        </p>
        <p className="font-medium text-white">📧 brianleonardomtzcobos@gmail.com</p>
      </section>
      <footer className="text-center">
        <p className="mt-6 text-gray-400 text-sm">
          Estos Términos y Condiciones entran en vigencia a partir del 28 de julio de 2025.
        </p>
        <p className="mt-2 text-gray-500 text-sm">
          © 2025 NetUp. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  )
}
