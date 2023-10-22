
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createUser, deleteUser, updateUser } from '@/lib/actions/user.action'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {

    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
    }

    // Get the headers
    const headerPayload = headers();
    const svix_Id = headerPayload.get("svix-id");
    const svix_Timestamp = headerPayload.get("svix-timestamp");
    const svix_Signature = headerPayload.get("svix-signature");

    // If there are no headers, error out
    if (!svix_Id || !svix_Timestamp || !svix_Signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400
        })
    }

    // Get the body
    const payload = await req.json()
    const body = JSON.stringify(payload);

    // Create a new SVIX instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            "svix-id": svix_Id,
            "svix-timestamp": svix_Timestamp,
            "svix-signature": svix_Signature,
        }) as WebhookEvent
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400
        })
    }

    // Get the ID and type
    const { id } = evt.data;
    const eventType = evt.type;

    // console.log(`Webhook with and ID of ${id} and type of ${eventType}`)
    // console.log('Webhook body:', body)

    if (eventType === 'user.created') {
        const { id, first_name, last_name, email_addresses, image_url, username } = evt.data;

        // calling server action to save/update the user's data

        const mongoUser = await createUser({
            clerkId: id,
            name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
            email: email_addresses.join(','),
            username: username!,
            picture: image_url
        });

        return NextResponse.json({ message: 'OK', user: mongoUser });
    }

    if (eventType === 'user.updated') {
        const { id, first_name, last_name, email_addresses, image_url, username } = evt.data;

        // calling server action to save/update the user's data

        const mongoUser = await updateUser({
            clerkId: id,
            updateData: {
                name: `${first_name}${last_name ? ` ${last_name}` : ''}`,
                email: email_addresses.join(','),
                username: username!,
                picture: image_url
            },
            path: `/profile/${id}`
        });

        return NextResponse.json({ message: 'OK', user: mongoUser });
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;
        const deletedUser = await deleteUser({
            clerkId: id!
        });

        return NextResponse.json({ message: 'OK', user: deletedUser });
    }

    return new Response('', { status: 201 })
}
