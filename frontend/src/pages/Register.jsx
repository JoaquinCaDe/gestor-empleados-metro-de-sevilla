import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { TrainFrontTunnel, ArrowLeft } from "lucide-react"
import { register } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"
// import { useToast } from "@/components/ui/use-toast"

export default function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [dne, setDne] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  // const { toast } = useToast()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/")
    }
  }, [isAuthenticated, navigate])
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      // toast({
      //   title: "Las contraseñas no coinciden",
      //   description: "Por favor verifica que ambas contraseñas sean iguales.",
      //   variant: "destructive",
      // })
      return
    }

    setIsLoading(true)

    try {
      // Registrar usuario con la API (removed role parameter)
      await register({
        name,
        email,
        username,
        password,
        dne
      });

      // toast({
      //   title: "Registro exitoso",
      //   description: "Tu cuenta ha sido creada correctamente.",
      // })

      alert("Registro exitoso: Tu cuenta ha sido creada correctamente.");
      navigate("/iniciar-sesion"); // Redirect to login instead of dashboard
    } catch (error) {
      console.error("Error al registrarse:", error);
      alert(`Error al registrarse: ${error.message}`);
      // toast({
      //   title: "Error al registrarse",
      //   description: error.message || "Ha ocurrido un error durante el registro. Intenta nuevamente.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Header with back button and branding */}
      <header className="p-6">
        <div className="container flex items-center justify-between max-w-6xl">
          {/* <Link to="/" className="flex items-center gap-2 text-white hover:text-pink-400 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Volver al inicio</span>
          </Link> */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-pink-500 to-violet-500 rounded-lg">
              <TrainFrontTunnel className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Horarios Metro de Sevilla
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Crear cuenta</h2>
            <p className="text-gray-400">Únete al equipo de Metro de Sevilla</p>
          </div>

          <Card className="border-t-4 border-t-pink-500 shadow-2xl bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-center text-white">Registro de empleado</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nombre completo</Label>
                    <Input
                      id="name"
                      type="text"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                      placeholder="Juan Pérez García"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-gray-300">Usuario</Label>
                      <Input
                        id="username"
                        type="text"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                        placeholder="jperez"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dne" className="text-gray-300">DNE</Label>
                      <Input
                        id="dne"
                        type="text"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                        placeholder="EMP123456"
                        value={dne}
                        onChange={(e) => setDne(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                      placeholder="juan.perez@metro-sevilla.es"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                      <Input
                        id="password"
                        type="password"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-gray-300">Confirmar</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6">
                <Button
                  className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-2.5 shadow-lg hover:shadow-pink-500/25 transform hover:scale-[1.02] transition-all duration-200"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Creando cuenta..." : "Registrarse"}
                </Button>
                <p className="text-center text-sm text-gray-400">
                  ¿Ya tienes una cuenta?{" "}
                  <Link to="/iniciar-sesion" className="text-pink-400 hover:text-pink-300 font-medium transition-colors">
                    Inicia sesión aquí
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>      {/* Footer */}
      <footer className="border-t border-gray-800 py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-16 max-w-6xl">
          <p className="text-sm text-gray-400 text-center">
            &copy; {new Date().getFullYear()} Horarios Metro de Sevilla - Metro de Sevilla. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
