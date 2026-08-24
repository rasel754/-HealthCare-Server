import Stripe from "stripe";
import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../generated/prisma/enums";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPyament = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id,
    },
  });

  if (existingPyament) {
    console.log(`Event ${event.id} already processed. skipping...`);
    return { message:`Event ${event.id} already processed. skipping...` };
  }

  switch (event.type) {
    case "checkout.session.completed":{
       const session= event.data.object ;
       const appointmentID= session.metadata?.appointmentID;
       const paymentId= session.metadata?.paymentId;

       if(!paymentId || !appointmentID){
        console.log("missing paymentId or appointmentID in metadata");
        return{message:"missing paymentId or appointmentID in metadata"};
       }

       const appointment = await prisma.appointment.findUnique({
        where:{
            id:appointmentID
        }
       })
       if(!appointment){
        console.log(`Appointment not found for id: ${appointmentID}`);
        return{message:`Appointment not found for id: ${appointmentID}`};
       }

       await prisma.$transaction(async (tx)=>{
            await tx.appointment.update({
                where:{
                    id:appointmentID
                },
                data:{
                    paymentStatus:session.payment_status ==="paid"?
                    PaymentStatus.PAID:PaymentStatus.UNPAID
                }
            })

            await tx.payment.update({
                where:{
                    id:paymentId
                },
                data:{
                    stripeEventId:event.id,
                    status:session.payment_status ==="paid"
                    ? PaymentStatus.PAID:PaymentStatus.UNPAID,
                    paymentGatewayData:session as any
                }
            })
       })
       console.log(`processed checkout.session.completed for appointment ${appointmentID} and payment ${paymentId}`)
      break;
    }
    case "checkout.session.expired":{
        const session = event.data.object
        console.log(`checkout session  ${session.id} expired. marking associated appointment as unpaid`)

       break;
    }
    case "payment_intent.payment_failed":{
        const session =event.data.object;
        console.log(`payment_intent ${session.id} failed. marking associated appointment as unpaid`)
        break;
    }
    default:
        console.log(`Unknown event type: ${event.type}`);
        break;
  }

  return {message:`webhook event ${event.id} processed successfully`}
  
};

export const PaymentService ={
    handleStripeWebhookEvent
}