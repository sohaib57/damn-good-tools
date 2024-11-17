import { db } from "./db"

export async function handleOrder(order: any, customData: any) {
    if (order.attributes.status != "paid") {
        return
    }

    await db.user.update({
        data: {
            premium: true,
        },
        where: {
            id: customData["user_id"],
        },
    })
}
