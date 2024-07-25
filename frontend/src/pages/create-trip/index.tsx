import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteQuestsStep } from "./steps/invite-quests-step";
import type { DateRange } from "react-day-picker";
import { api } from "../../lib/axios";

export function CreateTripPage() {
  const navigate = useNavigate()

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false)
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)

  const [destination, setDestination] = useState('')
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [eventStartAndEndDate, setEventStartAndEndDate] = useState<DateRange | undefined>()

  const [emailsToInvite, setEmailsToInvite] = useState([
    "brunomatossilvait@gmail.com", "renataqpereira@gmail.com"
  ])

  function openGuestsInput() {
    setIsGuestsInputOpen(true)
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false)
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true)
  }

  function closeGuestModal() {
    setIsGuestsModalOpen(false)
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true)
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const data = new FormData(event.currentTarget)
    const email = data.get('email')?.toString()

    if(!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }

    setEmailsToInvite([
      ...emailsToInvite,
      email
    ])

    event.currentTarget.reset()
  }

  function removeEmailfromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(invited => invited !== emailToRemove)

    setEmailsToInvite(newEmailList)
  }

  async function createTrip(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!destination) {
      return
    }

    if (!eventStartAndEndDate?.from || !eventStartAndEndDate?.to) {
      return
    }

    if (emailsToInvite.length === 0 ) {
      return
    }

    if (!ownerName || !ownerEmail) {
      return
    }

    const response = await api.post('/trips', {
      destination,
      starts_at: eventStartAndEndDate.from,
      ends_at: eventStartAndEndDate.to,
      emails_to_invite: emailsToInvite,
      owner_name: ownerName,
      owner_email: ownerEmail,
    })
    
    const { tripId } = response.data
    navigate(`/trips/${tripId}`)

  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className="flex flex-col items-center justify-center gap-4">
          <img src="/logo.svg" alt="My TravelPlaner" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>
        
        <div className="space-y-4">
          <DestinationAndDateStep 
            isGuestsInputOpen={isGuestsInputOpen}
            closeGuestsInput={closeGuestsInput}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            eventStartAndEndDate={eventStartAndEndDate}
            setEventStartAndEndDate={setEventStartAndEndDate}
          />

          {isGuestsInputOpen && (
            <InviteQuestsStep 
              openGuestsModal={openGuestsModal}
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
          com nossos <a className="text-zinc-300 underline" href="#">termos de uso</a> e <a className="text-zinc-300 underline" href="#">políticas de privacidade</a>.
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal 
          closeGuestModal={closeGuestModal}
          emailsToInvite={emailsToInvite}
          removeEmailfromInvites={removeEmailfromInvites}
          addNewEmailToInvite={addNewEmailToInvite}
        />
      )}

      {isConfirmTripModalOpen && (
          <ConfirmTripModal 
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
          setOwnerName={setOwnerName}
          setOwnerEmail={setOwnerEmail}
          />
      )}
    </div>
  )
}

