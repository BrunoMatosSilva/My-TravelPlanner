import { Plus} from "lucide-react";
import { useState } from "react";
import { CreateAcvitityModal } from "./create-activity-modal";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Acitivities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { Button } from "../../compoents/button";

export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen ] = useState(false)

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
  }

  return(
    <div className="max-w-6xl h-screen px-6 py-10 mx-auto space-y-8 bg-pattern bg-center">
      <DestinationAndDateHeader />

      <main className="flex gap-16 px-4">
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">Atividades</h2>

            <Button 
            variant="primary"
            onClick={openCreateActivityModal}
            >
              <Plus className="size-5 text-lime-950" />
              Cadastrar atividade
            </Button>
          </div>

          <Acitivities />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks />

          <div className="h-px w-full bg-zinc-800" />

          <Guests />

        </div>
      </main>
      {isCreateActivityModalOpen && (
        <CreateAcvitityModal 
        closeCreateActivityModal={closeCreateActivityModal}
        />
      )}
    </div>
  )
}