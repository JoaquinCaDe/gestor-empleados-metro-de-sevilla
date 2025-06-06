import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { TrainFrontTunnel, Menu, User, LogOut } from "lucide-react"
import { getUserProfile, updateUser /*, updatePassword */ } from "@/lib/profile"
import { useAuth } from "@/contexts/AuthContext"
// import { useToast } from "@/components/ui/use-toast"

export default function Profile() {
  const [, setProfileUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [dne, setDne] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  // Password-related state variables (commented out while password functionality is disabled)
  // const [currentPassword, setCurrentPassword] = useState("")
  // const [newPassword, setNewPassword] = useState("")
  // const [confirmPassword, setConfirmPassword] = useState("")
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()
  // const { toast } = useToast()

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated) {
      navigate("/iniciar-sesion")
      return
    }

    // Cargar el perfil del usuario
    const loadUserProfile = async () => {
      try {
        const userData = await getUserProfile()
        setProfileUser(userData)
        setName(userData.name || "")
        setEmail(userData.email || "")
        setDne(userData.dne || "")
      } catch (error) {
        console.error("Error al cargar el perfil:", error)
        alert("Error al cargar el perfil: " + error.message)
        // toast({
        //   title: "Error",
        //   description: "No se pudo cargar la información del perfil",
        //   variant: "destructive",
        // })
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [navigate, isAuthenticated])

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setUpdating(true)

    try {
      if (!user || !user.id) {
        throw new Error("No se pudo identificar al usuario")
      }

      const updatedUser = await updateUser(user.id, {
        name,
        email,
        dne,
      })

      setProfileUser(updatedUser)
      alert("¡Perfil actualizado correctamente!")
      // toast({
      //   title: "Perfil actualizado",
      //   description: "La información de tu perfil ha sido actualizada",
      // })
    } catch (error) {
      console.error("Error al actualizar el perfil:", error)
      alert("Error al actualizar el perfil: " + error.message)
      // toast({
      //   title: "Error",
      //   description: "No se pudo actualizar la información del perfil",
      //   variant: "destructive",
      // })
    } finally {
      setUpdating(false)
    }
  }

  // Password update function (commented out while password functionality is disabled)
  /*
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("Las contraseñas nuevas no coinciden")
      // toast({
      //   title: "Error",
      //   description: "Las contraseñas nuevas no coinciden",
      //   variant: "destructive",
      // })
      return
    }

    setUpdating(true)

    try {
      await updatePassword(currentPassword, newPassword)

      // Limpiar los campos de contraseña
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")

      alert("¡Contraseña actualizada correctamente!")
      // toast({
      //   title: "Contraseña actualizada",
      //   description: "Tu contraseña ha sido actualizada exitosamente",
      // })
    } catch (error) {
      console.error("Error al actualizar la contraseña:", error)
      alert("Error al actualizar la contraseña: " + error.message)
      // toast({
      //   title: "Error",
      //   description: "No se pudo actualizar la contraseña",
      //   variant: "destructive",
      // })
    } finally {
      setUpdating(false)
    }
  }
  */

  const handleLogout = () => {
    logout()
    navigate("/iniciar-sesion")
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-black text-white">
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-xl">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header/Navbar - Same as Dashboard */}
      <header className="sticky top-0 z-50 w-full border-b bg-black/90 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full">
              <TrainFrontTunnel className="absolute h-full w-full object-cover text-pink-500" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Horarios Metro de Sevilla
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="grid gap-4 py-4">
                  <Link to="/">
                    <Button variant="ghost" className="w-full justify-start text-white">
                      ← Dashboard
                    </Button>
                  </Link>
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden md:flex md:items-center md:gap-4">
              <Link to="/">
                <Button variant="ghost" className="text-white">
                  ← Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-10 px-4 max-w-4xl">
        <div className="flex flex-col gap-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent mb-2">
              Perfil de Usuario
            </h1>
            <p className="text-gray-400">Gestiona tu información personal y configuración de cuenta</p>
          </div>

          {/* User Info Card */}
          <Card className="border-t-4 border-t-pink-500 shadow-lg bg-gray-900/50 border-gray-700">
            <CardHeader className="bg-gradient-to-r from-pink-50/10 to-violet-50/10 rounded-t-lg">
              <CardTitle className="flex items-center text-xl text-white">
                <User className="mr-2 h-5 w-5 text-pink-500" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <form onSubmit={handleProfileUpdate}>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-300">Nombre completo</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-300">Correo electrónico</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dne" className="text-gray-300">Número de empleado (DNE)</Label>
                    <Input
                      id="dne"
                      value={dne}
                      onChange={(e) => setDne(e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-pink-500"
                      required={user?.role === 'employee'}
                    />
                    {user?.role !== 'employee' && (
                      <p className="text-sm text-gray-400">No requerido para administradores.</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-gray-300">Categoría</Label>
                    <Input
                      id="role"
                      value={user?.role === 'admin' ? 'Administrador' : 'Empleado'}
                      className="bg-gray-700/50 border-gray-600 text-gray-400"
                      disabled
                    />
                  </div>
                </div>              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-pink-500 to-violet-500 hover:opacity-90"
                >
                  {updating ? "Actualizando..." : "Actualizar perfil"}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Change Password Card */}
          {/* <Card className="border-t-4 border-t-violet-500 shadow-lg bg-gray-900/50 border-gray-700">
            <CardHeader className="bg-gradient-to-r from-pink-50/10 to-violet-50/10 rounded-t-lg">
              <CardTitle className="flex items-center text-xl text-white">
                🔒 Cambiar contraseña
              </CardTitle>
            </CardHeader>
            <form onSubmit={handlePasswordUpdate}>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-gray-300">Contraseña actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-password" className="text-gray-300">Nueva contraseña</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-gray-300">Confirmar nueva contraseña</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-violet-500"
                      required
                    />
                  </div>
                </div>              </CardContent>
              <CardFooter className="pt-6">
                <Button
                  type="submit"
                  disabled={updating}
                  className="bg-gradient-to-r from-violet-500 to-pink-500 hover:opacity-90"
                >
                  {updating ? "Actualizando..." : "Cambiar contraseña"}
                </Button>
              </CardFooter>
            </form>
          </Card> */}

        </div>
      </main>

      {/* Footer - Same as Dashboard */}
      <footer className="border-t border-gray-700 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Horarios Metro de Sevilla. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
