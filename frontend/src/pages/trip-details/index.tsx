import { Plus} from "lucide-react";
import { useState } from "react";
import { ImportantLinks } from "./important-links";
import { Guests } from "./guests";
import { Acitivities } from "./activities";
import { DestinationAndDateHeader } from "./destination-and-date-header";
import { Button } from "../../compoents/button";

export function TripDetailsPage() {
  const [isCreateActivityModalOpen, setIsCreateActivityModalOpen ] = useState(false)
  const [isCreateLinkModalOpen, setIsCreateLinkModalOpen ] = useState(false)
  const [isCreateInvitekModalOpen, setIsCreateInviteModalOpen ] = useState(false)

  function openCreateActivityModal() {
    setIsCreateActivityModalOpen(true)
  }

  function closeCreateActivityModal() {
    setIsCreateActivityModalOpen(false)
  }

  function openCreateLinkModal() {
    setIsCreateLinkModalOpen(true)
  }

  function closeCreateLinkModal() {
    setIsCreateLinkModalOpen(false)
  }

  function openCreateInvitekModal() {
    setIsCreateInviteModalOpen(true)
  }

  function closeCreateInvitekModal() {
    setIsCreateInviteModalOpen(false)
  }

  return(
    <div className="max-w-6xl h-screen px-6 py-10 mx-auto space-y-8 bg-pattern bg-center">
      <DestinationAndDateHeader/>

      <main className="flex gap-16 px-4 pb-10">
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

          <Acitivities 
          closeCreateActivityModal={closeCreateActivityModal}
          isCreateActivityModalOpen={isCreateActivityModalOpen}
          />
        </div>

        <div className="w-80 space-y-6">
          <ImportantLinks
          openCreateLinkModal={openCreateLinkModal}
          closeCreateLinkModal={closeCreateLinkModal}
          isCreateLinkModalOpen={isCreateLinkModalOpen}
          />

          <div className="h-px w-full bg-zinc-800" />

          <Guests 
          openCreateInvitekModal={openCreateInvitekModal}
          closeCreateInvitekModal={closeCreateInvitekModal}
          isCreateInvitekModalOpen={isCreateInvitekModalOpen}
          />

        </div>
      </main>
    </div>
  )
}