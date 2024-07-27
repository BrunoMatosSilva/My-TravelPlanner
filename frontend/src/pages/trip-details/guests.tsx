import { CircleCheck, CircleDashed, UserCog } from "lucide-react";
import { Button } from "../../compoents/button";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { CreateInviteModal } from "./create-invite";

interface Guests {
  openCreateInvitekModal: () => void,
  closeCreateInvitekModal: () => void,
  isCreateInvitekModalOpen: boolean,
}

interface ParticipantsProps {
  id: string,
  name: string | null,
  email: string,
  is_confirmed: boolean
}[]

export function Guests({ 
  openCreateInvitekModal, 
  closeCreateInvitekModal, 
  isCreateInvitekModalOpen 
}:Guests) {
  const { tripId } = useParams()
  const [participants, setParticipants] = useState<ParticipantsProps[]>([])

  useEffect(() => {
    fetchParticipants()
  },[])

  const fetchParticipants = useCallback(() => {
    api.get(`/trips/${tripId}/participants`).then(response => setParticipants(response.data.participants))
  },[])

    return (
          <>
            <div className="space-y-6">
              <h2 className="font-semibold text-xl">Convidados</h2>
                <div className="space-y-5">
                  {participants.map((participant, index) => (
                    <div key={participant.id} className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <span className="block font-medium text-zinc-100">{participant.name || `Convidado ${index}`}</span>
                      <span className="block text-sm text-zinc-400 truncate">
                        {participant.email}
                      </span>
                    </div>
                    {participant.is_confirmed 
                    ? <CircleCheck className="size-5 text-lime-400" /> 
                    : <CircleDashed className="size-5 text-zinc-400" />
                    }
                  </div>
                  ))}

                </div>

              <Button
              onClick={openCreateInvitekModal}
              variant="secondary"
              size="full"
              >
                <UserCog className="size-5" />
                Gerenciar convidados
              </Button>
            </div>
            {isCreateInvitekModalOpen && (
              <CreateInviteModal
              closeInviteModal={closeCreateInvitekModal}
              refreshInvites={fetchParticipants}
              />
            )}
          </>
  )
}