import { Mail, X } from "lucide-react";
import { Button } from "../../compoents/button";
import type { FormEvent } from "react";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface CreateInviteModalProps {
  closeInviteModal: () => void,
  refreshInvites: () => void
}

export function CreateInviteModal({ closeInviteModal, refreshInvites }: CreateInviteModalProps){
  const { tripId } = useParams()

  async function createInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)

    const email = data.get('email')?.toString()

    await api.post(`/trips/${tripId}/invites`, {
      email
    })

    refreshInvites()
    closeInviteModal()

  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
        <div className="w-[640px] rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Cadastrar convidado</h2>
              <button onClick={closeInviteModal}>
                <X className="size-5 text-zinc-400" />
              </button>
            </div>
            <p className="text-sm text-zinc-400">
              O convidado irá receber um e-mail para confirmar a participação na viagem.
            </p>
          </div>

          <form
            onSubmit={createInvite}
            className="flex flex-col gap-3"
            >
            <div className="h-14 px-4 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center gap-2">
              <Mail className="text-zinc-400 size-5" />
              <input 
              type="email" 
              name="email" 
              placeholder="O e-mail do convidado" 
              className="bg-transparent text-lg placeholder-zinc-400 w-40 outline-none flex-1" 
              />
            </div>

            <Button
            variant="primary"
            type="submit">
              Enviar convite
            </Button>
            </form>
        </div>
      </div>
  )
}