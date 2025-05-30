import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getUserProfile, updateUser, updatePassword } from "@/lib/profile"
import { useAuth } from "@/contexts/AuthContext"
// import { useToast } from "@/components/ui/use-toast"

export default function Profile() {
  const [profileUser, setProfileUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [dne, setDne] = useState("")
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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
        // })      } finally {
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

  const handleLogout = () => {
    logout()
    navigate("/iniciar-sesion")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-xl">Cargando perfil...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-8">Perfil de Usuario</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <form onSubmit={handleProfileUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dne">Número de empleado (DNE)</Label>
              <Input
                id="dne"
                value={dne}
                onChange={(e) => setDne(e.target.value)}
                required={user?.role === 'employee'}
              />
              {user?.role !== 'employee' && (
                <p className="text-sm text-muted-foreground">No requerido para administradores.</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Input
                id="role"
                value={user?.role === 'admin' ? 'Administrador' : 'Empleado'}
                disabled
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updating}>
              {updating ? "Actualizando..." : "Actualizar perfil"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
        </CardHeader>
        <form onSubmit={handlePasswordUpdate}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Contraseña actual</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva contraseña</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={updating}>
              {updating ? "Actualizando..." : "Cambiar contraseña"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <div className="flex gap-4 justify-between">
        <Button onClick={() => navigate("/")} variant="outline">
          Volver a la página principal
        </Button>
        <Button onClick={handleLogout} variant="destructive">
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
