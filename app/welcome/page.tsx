import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, MessageSquare, Heart, Zap, Globe, ArrowRight, Check} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function WelcomePage() {
  const features = [
    {
      icon: <Zap className="w-8 h-8 text-purple-400" />,
      title: "Interfaz Intuitiva",
      description: "Diseño moderno y fácil de usar que hace que conectar con otros sea natural y divertido.",
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-400" />,
      title: "Seguridad Robusta",
      description: "Sistema de autenticación avanzado que protege tu información y privacidad en todo momento.",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-purple-400" />,
      title: "Gestión de Posts",
      description: "Comparte tus ideas, fotos y momentos con herramientas de publicación potentes y flexibles.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Perfiles Personalizados",
      description: "Crea un perfil único que refleje tu personalidad y conecta con personas afines.",
    },
    {
      icon: <Heart className="w-8 h-8 text-purple-400" />,
      title: "Interacciones Sociales",
      description: "Sistema completo de reacciones, comentarios y mensajes para una comunicación auténtica.",
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-400" />,
      title: "Conexión Global",
      description: "Descubre y conecta con personas de todo el mundo que comparten tus intereses y pasiones.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <nav className="fixed top-0 w-full bg-[#1a1a1a]/95 backdrop-blur-sm border-b border-gray-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src={'/logo.webp'} alt="logo netup" width={20} height={20} />
              <span className="text-xl font-bold">NetUP</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white bg-transparent"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </nav>

      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-purple-600/20 text-purple-300 border-purple-600/30">
              🚀 Ahora en Beta
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Conecta, Comparte y{" "}
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                Descubre
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-300 mb-8 leading-relaxed">
              La red social del futuro está aquí. Experimenta conexiones auténticas con una interfaz diseñada para la
              nueva generación.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/">
                <Button size="lg" className="text-white bg-purple-600 hover:bg-purple-700 text-lg px-8 py-3">
                  Comenzar Ahora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Características que Marcan la Diferencia</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubre por qué NetUP está redefiniendo la experiencia de las redes sociales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-[#2d2d2d] border-gray-700 hover:border-purple-600/50 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Diseño que Inspira</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Una interfaz moderna y elegante que hace que cada interacción sea un placer
            </p>
          </div>

          <div className="grid gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Interfaz Intuitiva</h3>
                  <p className="text-gray-400">
                    Navegación fluida y controles intuitivos que hacen que usar NetUP sea natural desde el primer
                    momento.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Diseño Responsivo</h3>
                  <p className="text-gray-400">
                    Experiencia perfecta en todos los dispositivos, desde móviles hasta pantallas de escritorio.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Modo Oscuro</h3>
                  <p className="text-gray-400">
                    Diseño elegante en modo oscuro que reduce la fatiga visual y mejora la experiencia nocturna.
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="relative">
              <div className="bg-gradient-to-r from-purple-600/20 to-purple-400/20 rounded-2xl p-8">
                <img
                  src="/"
                  alt="NetUP Dashboard Preview"
                  className="w-full rounded-lg shadow-2xl"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            ¿Listo para Unirte a la{" "}
            <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Revolución Social?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Únete a miles de usuarios que ya están experimentando el futuro de las redes sociales. Es gratis y toma
            menos de un minuto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-8">
            <Link href="/sign-in">
              <Button className="text-white bg-purple-600 hover:bg-purple-700 whitespace-nowrap">
                Registrate
              </Button>
            </Link>
          </div>

          <p className="text-sm text-gray-500">
            Al registrarte, aceptas nuestros{" "}
            <Link href="/terms" className="text-purple-400 hover:text-purple-300">
              Términos de Servicio
            </Link>{" "}
            y{" "}
            <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
              Política de Privacidad
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0f0f0f] border-t border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Image src={'/logo.webp'} alt="logo netup" width={20} height={20} />

                <span className="text-xl font-bold">NetUP</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                La red social del futuro. Conecta con personas auténticas, comparte momentos únicos y descubre
                comunidades increíbles.
              </p>
            </div>

            {/* <div>
              <h3 className="font-semibold text-white mb-4">Producto</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Características
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Precios
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Documentación
                  </a>
                </li>
              </ul>
            </div> */}

            {/* <div>
              <h3 className="font-semibold text-white mb-4">Soporte</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Centro de Ayuda
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Estado del Servicio
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Comunidad
                  </a>
                </li>
              </ul>
            </div> */}
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 NetUP. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacidad
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Términos
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
