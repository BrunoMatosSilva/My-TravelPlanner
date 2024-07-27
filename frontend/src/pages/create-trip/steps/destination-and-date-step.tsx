import { ArrowRight, Calendar, MapPin, Settings2, X } from "lucide-react";
import { Button } from "../../../compoents/button";
import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css"
import { ptBR } from "date-fns/locale";

interface DestinationAndDateStepProps {
  isGuestsInputOpen: boolean,
  closeGuestsInput: () => void,
  openGuestsInput: () => void,
  setDestination: (destination: string) => void,
  setEventStartAndEndDate: (dates: DateRange | undefined) => void,
  eventStartAndEndDate: DateRange | undefined
}

export function DestinationAndDateStep({ 
  isGuestsInputOpen, 
  closeGuestsInput, 
  openGuestsInput,
  setDestination,
  setEventStartAndEndDate,
  eventStartAndEndDate
}: DestinationAndDateStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

  function openDatePicker() {
    setIsDatePickerOpen(true)
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false)
  }

  const displayedDate = eventStartAndEndDate && eventStartAndEndDate.from && eventStartAndEndDate.to
  ? format(eventStartAndEndDate.from, "d' de 'LLL", {locale: ptBR}).concat(' até ').concat(format(eventStartAndEndDate.to, "d' de 'LLL", {locale: ptBR})) 
  : null

  return(
          <div className="h-16 bg-zinc-900 px-4 rounded-xl flex items-center shadow-shape gap-3">
            <div className="flex items-center gap-2 flex-1">
                <MapPin className="size-5 text-zinc-400" />
                <input 
                disabled={isGuestsInputOpen} 
                type="text" 
                placeholder="Para onde você vai?" 
                className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1"
                onChange={(event) => setDestination(event.target.value)}
                />
            </div>
            
            <button
            onClick={openDatePicker}
            disabled={isGuestsInputOpen} 
            className="flex items-center gap-2 text-left w-[240px]"
            >
              <Calendar className="size-5 text-zinc-400" />
              <span   
              className="text-lg text-zinc-400 w-40 flex-1" 
              >
                {displayedDate || "Quando?"}
              </span>
            </button>

            {isDatePickerOpen && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
              <div className="rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Selecione a data</h2>
                    <button onClick={closeDatePicker}>
                      <X className="size-5 text-zinc-400" />
                    </button>
                  </div>
                </div>
    
                  <DayPicker 
                  mode="range" 
                  selected={eventStartAndEndDate} 
                  onSelect={setEventStartAndEndDate}
                  classNames={{
                    selected: `text-blue-800`,    
                  }}
                  />
                </div>
              </div>
            )}

            <div className="w-px h-6 bg-zinc-800" />

            {isGuestsInputOpen ? (
              <Button
              variant="secondary" 
              onClick={closeGuestsInput}
              >
                Alterar local/data
                <Settings2 className="size-5" />
              </Button>
            ) : (
              <Button
              variant="primary"
              onClick={openGuestsInput} 
              >
              Continuar
              <ArrowRight className="size-5 text-lime-950" />
              </Button>
            )}
          </div>
  )
}