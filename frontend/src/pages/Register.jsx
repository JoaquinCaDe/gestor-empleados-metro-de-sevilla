import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
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
    <div className="container flex h-screen w-screen bg-black bg-opacity-80 backdrop-blur-sm flex-col items-center justify-center p-4">      <Link to="/" className="absolute left-4 top-4 md:left-8 md:top-8">
      <Button variant="ghost" className="text-white">← Volver</Button>
    </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">        <div className="flex flex-col space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Crear una cuenta</h1>
        <p className="text-sm text-muted-foreground">Ingresa tus datos para registrarte</p>
      </div>
        <Card className="bg-gray-900 bg-opacity-80 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
          <form onSubmit={handleSubmit}>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-gray-300">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    className="bg-gray-800 bg-opacity-50 placeholder-gray-500 text-white border-gray-600 focus:border-pink-500 focus:ring-pink-500 focus:ring focus:ring-opacity-40"
                    placeholder="Juan Pérez"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="username" className="text-gray-300">Nombre de usuario</Label>
                  <Input
                    id="username"
                    type="text"
                    className="bg-gray-800 bg-opacity-50 placeholder-gray-500 text-white border-gray-600 focus:border-pink-500 focus:ring-pink-500 focus:ring focus:ring-opacity-40"
                    placeholder="juanperez"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dne" className="text-gray-300">Número de empleado (DNE)</Label>
                  <Input
                    id="dne"
                    type="text"
                    className="bg-gray-800 bg-opacity-50 placeholder-gray-500 text-white border-gray-600 focus:border-pink-500 focus:ring-pink-500 focus:ring focus:ring-opacity-40"
                    placeholder="EMP123456"
                    value={dne}
                    onChange={(e) => setDne(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-gray-300">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    className="bg-gray-800 bg-opacity-50 placeholder-gray-500 text-white border-gray-600 focus:border-pink-500 focus:ring-pink-500 focus:ring focus:ring-opacity-40"
                    placeholder="nombre@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-gray-300">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    className="bg-gray-800 bg-opacity-50 placeholder-gray-500 text-white border-gray-600 focus:border-pink-500 focus:ring-pink-500 focus:ring focus:ring-opacity-40"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password" className="text-gray-300">Confirmar contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-gray-800 bg-opacity-50 placeholder-gray-500 text-white border-gray-600 focus:border-pink-500 focus:ring-pink-500 focus:ring focus:ring-opacity-40"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:opacity-90 shadow-md hover:shadow-pink-500/50 transition-transform" type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrarse"}
              </Button>
              <p className="mt-4 text-center text-sm text-gray-400">
                ¿Ya tienes una cuenta?{" "}
                <Link to="/iniciar-sesion" className="underline underline-offset-4 hover:text-pink-400">
                  Iniciar sesión
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
