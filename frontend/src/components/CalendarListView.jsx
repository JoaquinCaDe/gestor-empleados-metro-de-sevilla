import { useState, useEffect } from "react"
import { Clock, Users, Edit, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
// import { useToast } from "@/components/ui/use-toast"
import { ShiftForm } from "./ShiftForm"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getAllShifts, createShift, updateShift, deleteShift, formatShiftsForCalendar } from "@/lib/shift"
import { getCurrentUser } from "@/lib/auth"

export function CalendarListView({ month }) {
  const [schedules, setSchedules] = useState({})
  const [selectedDate, setSelectedDate] = useState(null)
  const [isAddingShift, setIsAddingShift] = useState(false)
  const [isEditingShift, setIsEditingShift] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  // const { toast } = useToast()

  // Obtener el número de días en el mes
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()

  // Crear un array con los días del mes
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Formatear fecha para buscar en el objeto de horarios
  const formatDateKey = (day) => {
    return `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  // Obtener color según el tipo de turno
  const getScheduleColor = (type) => {
    switch (type) {
      case "morning":
        return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 border-pink-300 dark:border-pink-800"
      case "afternoon":
        return "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300 border-violet-300 dark:border-violet-800"
      case "night":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  // Manejar clic en un día
  const handleDayClick = (day) => {
    const dateKey = formatDateKey(day)
    setSelectedDate(dateKey)
    setDialogOpen(true)
  }
  // Añadir o actualizar un turno
  const handleSaveShift = async (shift) => {
    if (isEditingShift) {
      await updateShift(schedules[selectedDate].id, {
        start: `${selectedDate}T${shift.start}`,
        end: `${selectedDate}T${shift.end}`,
        title: shift.title,
        type: shift.type
      })
    } else {
      const user = getCurrentUser()
      await createShift({
        start: `${selectedDate}T${shift.start}`,
        end: `${selectedDate}T${shift.end}`,
        title: shift.title,
        type: shift.type,
        employee: user.id
      })
    } const currentUser = getCurrentUser()
    if (!currentUser) return

    const updated = await getAllShifts({
      startDate: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-01`,
      endDate: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()}`,
      employee: currentUser.id
    })
    setSchedules(formatShiftsForCalendar(updated))
    setIsAddingShift(false)
    setIsEditingShift(false)
  }
  // Eliminar un turno
  const handleDeleteShift = async () => {
    await deleteShift(schedules[selectedDate].id)
    const currentUser = getCurrentUser()
    if (!currentUser) return

    const updated = await getAllShifts({
      startDate: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-01`,
      endDate: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()}`,
      employee: currentUser.id
    })
    setSchedules(formatShiftsForCalendar(updated))
    setIsDeleteDialogOpen(false)
    setDialogOpen(false)
  }
  // Cargar turnos de la API al montar el componente
  useEffect(() => {
    async function loadShifts() {
      const currentUser = getCurrentUser()
      if (!currentUser) return

      const shifts = await getAllShifts({
        startDate: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-01`,
        endDate: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()}`,
        employee: currentUser.id
      })
      setSchedules(formatShiftsForCalendar(shifts))
    }
    loadShifts()
  }, [month])

  // Formatear fecha para mostrar
  const formatDisplayDate = (dateKey) => {
    const date = new Date(dateKey)
    return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
  }

  // Verificar si es el día actual
  const isToday = (day) => {
    const today = new Date()
    return (
      today.getDate() === day && today.getMonth() === month.getMonth() && today.getFullYear() === month.getFullYear()
    )
  }

  return (
    <div className="space-y-4">
      {days.map((day) => {
        const dateKey = formatDateKey(day)
        const schedule = schedules[dateKey]
        const today = isToday(day)
        const date = new Date(dateKey)

        return (
          <div
            key={day}
            className={cn(
              "flex items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer",
              today ? "border-pink-500 dark:border-pink-400" : "border-muted",
              schedule
                ? "bg-gradient-to-r from-pink-50/50 to-violet-50/50 dark:from-pink-950/20 dark:to-violet-950/20"
                : "",
            )}
            onClick={() => handleDayClick(day)}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mr-4",
                schedule
                  ? schedule.type === "morning"
                    ? "bg-gradient-to-br from-pink-200 to-pink-100 dark:from-pink-900 dark:to-pink-800"
                    : schedule.type === "afternoon"
                      ? "bg-gradient-to-br from-violet-200 to-violet-100 dark:from-violet-900 dark:to-violet-800"
                      : "bg-gradient-to-br from-indigo-200 to-indigo-100 dark:from-indigo-900 dark:to-indigo-800"
                  : "bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700",
              )}
            >
              <span className={cn("text-lg font-bold", today ? "text-pink-600 dark:text-pink-400" : "")}>{day}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-medium flex items-center">
                {date.toLocaleDateString("es-ES", { weekday: "long" })}
                {today && (
                  <span className="ml-2 text-xs bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 px-2 py-0.5 rounded-full">
                    Hoy
                  </span>
                )}
              </h3>
              <p className="text-sm text-muted-foreground">
                {date.toLocaleDateString("es-ES", { day: "numeric", month: "long" })}
              </p>
              {schedule ? (
                <div
                  className={cn(
                    "mt-1 text-sm font-medium px-2 py-0.5 rounded inline-flex items-center",
                    getScheduleColor(schedule.type),
                  )}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {schedule.title}: {schedule.start} - {schedule.end}
                </div>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground italic">Sin turno asignado</p>
              )}
            </div>
            <div>
              {schedule ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground" onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDate(dateKey)
                    setIsEditingShift(true)
                    setDialogOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedDate(dateKey)
                    setIsAddingShift(true)
                    setDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )
      })}

      {/* Diálogo para ver/editar/añadir turno */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{selectedDate && formatDisplayDate(selectedDate)}</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Gestión de turnos
          </DialogDescription>
        </DialogHeader>

        {selectedDate && (
          <>              {isAddingShift || isEditingShift ? (
            <ShiftForm
              initialData={isEditingShift ? schedules[selectedDate] : undefined}
              onSave={handleSaveShift}
              onCancel={() => {
                setIsAddingShift(false)
                setIsEditingShift(false)
              }}
            />
          ) : (
            <div className="space-y-4 mt-4">
              {schedules[selectedDate] ? (
                <div>
                  <div
                    className={cn(
                      "border rounded-md p-4 transition-all hover:shadow-md",
                      getScheduleColor(schedules[selectedDate].type),
                    )}
                  >
                    <div className="font-medium text-lg">{schedules[selectedDate].title}</div>
                    <div className="flex items-center mt-2 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {schedules[selectedDate].start} - {schedules[selectedDate].end}
                      </span>
                    </div>
                    {schedules[selectedDate].employees && schedules[selectedDate].employees.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-t-muted/30">
                        <div className="flex items-center mb-2 text-sm font-medium">
                          <Users className="h-4 w-4 mr-1" />
                          <span>Personal asignado:</span>
                        </div>
                        <ul className="space-y-1 text-sm">
                          {schedules[selectedDate].employees.map((employee, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-2 h-2 rounded-full bg-current mr-2" />
                              {employee}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setIsEditingShift(true)
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => setIsDeleteDialogOpen(true)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-muted-foreground mb-4">No hay turno asignado para este día.</p>
                  <Button className="text-white" onClick={() => setIsAddingShift(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Añadir turno
                  </Button>
                </div>
              )}
            </div>
          )}
          </>
        )}
      </DialogContent>
      </Dialog>

      {/* Diálogo de confirmación para eliminar */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el turno asignado para el día {selectedDate && new Date(selectedDate).getDate()} de{" "}
              {month.toLocaleDateString("es-ES", { month: "long" })}. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteShift} className="bg-destructive text-destructive-foreground">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
