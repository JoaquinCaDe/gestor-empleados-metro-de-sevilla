import { useState } from "react"
import { Link } from "react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, LogOut, Menu, User, TrainFrontTunnel } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarListView } from "@/components/CalendarListView"
import { MonthlyCalendar } from "@/components/MonthlyCalendar"
import { useAuth } from "@/contexts/AuthContext"


export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const { logout } = useAuth()

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  const handleLogout = () => {
    logout()
  }
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
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
                <div className="grid gap-4 py-4">                  <Link to="/profile">
                  <Button variant="ghost" className="w-full justify-start text-white">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Button>
                </Link>
                  <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-white">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </Button>
                </div>
              </SheetContent>
            </Sheet>            <div className="hidden md:flex md:items-center md:gap-4">
              <Link to="/profile">
                <Button variant="ghost" className="text-white">
                  <User className="mr-2 h-4 w-4" />
                  Perfil
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
      <main className="flex-1 container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Dashboard de Horarios
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handlePreviousMonth}>
                Anterior
              </Button>
              <div className="font-medium px-3 py-2 bg-muted rounded-md">
                {currentMonth.toLocaleDateString("es-ES", { month: "long", year: "numeric" })}
              </div>
              <Button variant="outline" onClick={handleNextMonth}>
                Siguiente
              </Button>
            </div>
          </div>          {/* Show only CalendarListView on mobile and small screens (md and below) */}
          <div className="md:hidden">
            <Card className="border-t-4 border-t-violet-500 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-violet-50 dark:from-pink-950/20 dark:to-violet-950/20 rounded-t-lg">
                <CardTitle className="flex items-center text-xl">
                  <CalendarIcon className="mr-2 h-5 w-5 text-violet-500" />
                  Lista de Horarios
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <CalendarListView month={currentMonth} />
              </CardContent>
            </Card>
          </div>

          {/* Show tabs on larger screens (md and up) */}
          <div className="hidden md:block">
            <Tabs defaultValue="calendar" className="w-full">
              <TabsList className="flex space-x-2 mb-6 bg-black bg-opacity-50 backdrop-blur-sm p-1 rounded-lg">
                <TabsTrigger value="calendar" className="flex-1 text-center py-2 text-gray-400 hover:text-gray-200 data-[state=active]:text-white relative data-[state=active]:before:content-[''] data-[state=active]:before:absolute data-[state=active]:before:bottom-0 data-[state=active]:before:left-4 data-[state=active]:before:right-4 data-[state=active]:before:h-1 data-[state=active]:before:bg-gradient-to-r data-[state=active]:before:from-pink-500 data-[state=active]:before:to-violet-500">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Vista Calendario
                </TabsTrigger>
                <TabsTrigger value="list" className="flex-1 text-center py-2 text-gray-400 hover:text-gray-200 data-[state=active]:text-white relative data-[state=active]:before:content-[''] data-[state=active]:before:absolute data-[state=active]:before:bottom-0 data-[state=active]:before:left-4 data-[state=active]:before:right-4 data-[state=active]:before:h-1 data-[state=active]:before:bg-gradient-to-r data-[state=active]:before:from-pink-500 data-[state=active]:before:to-violet-500">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Vista Lista
                </TabsTrigger>
              </TabsList>

              <TabsContent value="calendar">
                <Card className="border-t-4 border-t-pink-500 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-pink-50 to-violet-50 dark:from-pink-950/20 dark:to-violet-950/20 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <CalendarIcon className="mr-2 h-5 w-5 text-pink-500" />
                      Calendario Mensual
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <MonthlyCalendar month={currentMonth} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="list">
                <Card className="border-t-4 border-t-violet-500 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-pink-50 to-violet-50 dark:from-pink-950/20 dark:to-violet-950/20 rounded-t-lg">
                    <CardTitle className="flex items-center text-xl">
                      <CalendarIcon className="mr-2 h-5 w-5 text-violet-500" />
                      Lista de Horarios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <CalendarListView month={currentMonth} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Horarios Metro de Sevilla. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
