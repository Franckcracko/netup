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
          <Link href="https://netup.space" className="font-normal border-b border-purple-500">netup.space</Link>
        </h2>
        <p className="text-gray-300 mt-4">
          Al crear una cuenta y usar la plataforma NetUp, aceptas los siguientes Términos y Condiciones. Te recomendamos leerlos detenidamente.
        </p>
      </header>
      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">1. Aceptación de Términos</h2>
        <p className="mb-2">
          Al registrarte en NetUp, confirmas que:
        </p>
        <ul className="list-disc ml-6">
          <li>
            Eres estudiante o miembro de la comunidad educativa
          </li>
          <li>
            Toda la información que proporcionas es verdadera
          </li>
          <li>
            Cumplirás con las normas de respeto y uso responsable de la plataforma
          </li>
        </ul>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">2. Uso adecuado de la plataforma</h2>
        <p className="mb-2">
          En NetUp está estrictamente prohibido:
        </p>
        <ul className="list-disc ml-6">
          <li>Publicar contenido ofensivo, discriminatorio, violento o sexual</li>
          <li>Compartir noticias falsas, spam o enlaces maliciosos</li>
          <li>Usar la plataforma con fines ilegales o fraudulentos</li>
          <li>Suplantar a otras personas o instituciones</li>
          <li>Distribuir software o archivos dañinos</li>
        </ul>
        <p className="mt-2">
          NetUp se reserva el derecho de suspender o eliminar cuentas que infrinjan estas normas.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">3. Propiedad del contenido</h2>
        <p className="mb-2">
          El contenido que subes (textos, publicaciones, imágenes, etc.) es de tu propiedad. Sin embargo, al publicarlo en NetUp, otorgas permiso para mostrarlo dentro de la plataforma como parte de su funcionamiento.
        </p>
        <p>
          No utilizaremos tu contenido fuera de la plataforma sin tu consentimiento.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">4. Privacidad y protección de datos</h2>
        <p className="mb-2">
          Tu información personal será tratada conforme a nuestra{" "}
          <Link href="/privacy" className="underline text-blue-400 hover:text-blue-300">Política de Privacidad</Link>.
        </p>
        <p>
          Nos comprometemos a proteger tus datos mediante buenas prácticas de seguridad informática.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">5. Responsabilidad</h2>
        <p className="mb-2">
          NetUp es una plataforma educativa creada con fines colaborativos. No somos responsables del contenido publicado por los usuarios, pero moderaremos y atenderemos reportes de abuso o violaciones.
        </p>
        <p>
          El uso de la plataforma es bajo tu propia responsabilidad.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">6. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos Términos y Condiciones en cualquier momento. Notificaremos cualquier cambio importante a través de la plataforma.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">7. Cancelación de cuenta</h2>
        <p className="mb-2">
          Puedes eliminar tu cuenta en cualquier momento desde tu perfil.
        </p>
        <p>
          También podemos suspender tu cuenta si detectamos mal uso o violaciones a estos términos.
        </p>
      </section>

      <section className="mt-6 text-gray-300">
        <h2 className="text-xl font-semibold mb-2">8. Contacto</h2>
        <p>
          Para dudas, reportes o sugerencias, puedes escribirnos a:
        </p>
        <p className="mt-1 font-medium text-white">
          📧 brianleonardomtzcobos@gmail.com
        </p>
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
