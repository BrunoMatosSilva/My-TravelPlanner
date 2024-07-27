import { Calendar, MapPin } from "lucide-react";
import { useParams } from "react-router-dom"
import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TripProps {
  id: string,
  destination: string,
  starts_at: string,
  ends_at: string,
  is_confirmed: boolean
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<TripProps | undefined>()

  useEffect(() => {
    fetchTrip()
  },[])

  const fetchTrip = useCallback(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  },[])

  const displayedDate = trip
  ? format(trip.starts_at, "d' de 'LLL", {locale: ptBR}).concat(' até ').concat(format(trip.ends_at, "d' de 'LLL", {locale: ptBR})) 
  : null

  return (
    <>
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between gap-5">
      <div className="flex items-center gap-2 flex-1">
        <MapPin className="size-5 text-zinc-400" />
        <span
        className="text-zinc-100"
        >
          {trip?.destination}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Calendar className="size-5 text-zinc-400" />
        <span  
        className="text-zinc-100"
        >
          {displayedDate}
        </span>
      </div>

     </div>
      </>
  )
}