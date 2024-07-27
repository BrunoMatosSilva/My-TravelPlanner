import { Link2, Plus } from "lucide-react";
import { Button } from "../../compoents/button";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { CreateLinkModal } from "./create-link-modal";

interface Link {
  openCreateLinkModal: () => void,
  closeCreateLinkModal: () => void,
  isCreateLinkModalOpen: boolean
}

interface Links {
  id: string,
  title: string,
  url: string,
}[]

export function ImportantLinks({ 
  openCreateLinkModal, 
  closeCreateLinkModal, 
  isCreateLinkModalOpen 
}:Link) {
  const { tripId } = useParams()
  const [links, setLinks] = useState<Links[]>([])
  const emptyLinks = links.length > 0

  useEffect(() => {
    fetchLinks();
  },[tripId])

  const fetchLinks = useCallback(() => {
    api.get(`/trips/${tripId}/links`).then(response => setLinks(response.data.links))
  },[])

  return (
        <>
          <div className="space-y-6">
            <h2 className="font-semibold text-xl">Links importantes</h2>
              <div className="space-y-5">
                {links.map((link) => (
                  <div key={link.id} className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <span className="block font-medium text-zinc-100">{link.title}</span>
                    <a href={`${link.url}`} target="_blank" className="block text-sm text-zinc-400 truncate hover:text-zinc-200">
                      {link.url}
                    </a>
                  </div>
                  <Link2 className="size-5 text-zinc-400" />
                </div>
                ))}

                {!emptyLinks && (
                  <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <p className="text-sm text-zinc-500">Nenhum link cadastrado.</p>
                  </div>
                </div>
                )}

                
              </div>

            <Button
            variant="secondary"
            size="full"
            onClick={openCreateLinkModal}
            >
              <Plus className="size-5" />
              Cadastrar novo link
            </Button>
          </div>
          {isCreateLinkModalOpen && (
              <CreateLinkModal
              closeCreateLinkModal={closeCreateLinkModal}
              refreshLinks={fetchLinks}
              />
            )}
        </>
  )
}