import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ShiftForm({ initialData, onSave, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "")
  const [start, setStart] = useState(initialData?.start || "09:00")
  const [end, setEnd] = useState(initialData?.end || "17:00")
  const [type, setType] = useState(initialData?.type || "morning")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({ title, start, end, type })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título del turno</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Turno mañana"
          required
        />
      </div>      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start">Hora de inicio</Label>
          <Input
            id="start"
            type="time"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            required
            className="[&::-webkit-calendar-picker-indicator]:filter-invert [&::-webkit-calendar-picker-indicator]:brightness-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end">Hora de fin</Label>
          <Input
            id="end"
            type="time"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            required
            className="[&::-webkit-calendar-picker-indicator]:filter-invert [&::-webkit-calendar-picker-indicator]:brightness-200"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo de turno</Label>
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger id="type">
            <SelectValue placeholder="Selecciona un tipo de turno" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Mañana</SelectItem>
            <SelectItem value="afternoon">Tarde</SelectItem>
            <SelectItem value="night">Noche</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="text-white">
          Cancelar
        </Button>
        <Button type="submit" className="text-white">Guardar</Button>
      </div>
    </form>
  )
}
