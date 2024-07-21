import { CircleCheck, CircleDashed, UserCog } from "lucide-react";
import { Button } from "../../compoents/button";

export function Guests() {
    return (
            <div className="space-y-6">
              <h2 className="font-semibold text-xl">Convidados</h2>
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <span className="block font-medium text-zinc-100">Bruno Matos Silva</span>
                      <span className="block text-sm text-zinc-400 truncate">
                        brunomatossilvait@gmail.com
                      </span>
                    </div>
                    <CircleCheck className="size-5 text-lime-400" />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <span className="block font-medium text-zinc-100">Renata Queiroz Pereira</span>
                      <span className="block text-sm text-zinc-400 truncate">
                        renataqpereira@gmail.com
                      </span>
                    </div>
                    <CircleDashed className="size-5 text-zinc-400" />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <span className="block font-medium text-zinc-100">Igor Mota da Silva</span>
                      <span className="block text-sm text-zinc-400 truncate">
                        igormotadas@gmail.com
                      </span>
                    </div>
                    <CircleCheck className="size-5 text-lime-400" />
                  </div>

                </div>

              <Button
              variant="secondary"
              size="full"
              >
                <UserCog className="size-5" />
                Gerenciar convidados
              </Button>
            </div>
  )
}