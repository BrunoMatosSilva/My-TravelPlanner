import fastify from "fastify"
import cors from "@fastify/cors"
import { serializerCompiler, validatorCompiler} from "fastify-type-provider-zod";
import { createTrip } from "./routes/trip/create-trip"
import { confirmTrip } from "./routes/trip/confirm-trip";
import { confirmParticipant } from "./routes/participant/confirm-participant";
import { createActivity } from "./routes/activity/create-activity";
import { getActivities } from "./routes/activity/get-activities";
import { createLink } from "./routes/link/create-link";
import { getLinks } from "./routes/link/get-links";
import { getParticipants } from "./routes/participant/get-participants";
import { createInvite } from "./routes/participant/create-invite";
import { updateTrip } from "./routes/trip/update-trip";
import { getTripsDetails } from "./routes/trip/get-trip-details";
import { getParticipant } from "./routes/participant/get-participant";
import { errorHandler } from "./error-handler";
import { deleteParticipant } from "./routes/participant/delete-participant";
import { deleteActivity } from "./routes/activity/delete-activity";
import { deleteTrip } from "./routes/trip/delete-trip";
import { deleteLink } from "./routes/link/delete-link";
import { updateLink } from "./routes/link/update-link";
import { updateActivity } from "./routes/activity/update-activity";
import { getActivityDetails } from "./routes/activity/get-activity-details";
import { env } from "../env";

const app = fastify()

app.register(cors, {
  origin: '*'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTripsDetails)
app.register(getParticipant)
app.register(deleteParticipant)
app.register(deleteActivity)
app.register(deleteTrip)
app.register(deleteLink)
app.register(updateLink)
app.register(updateActivity)
app.register(getActivityDetails)

app.listen({ port: env.PORT }).then(() => {
  console.log("Server running 🚀!")
})