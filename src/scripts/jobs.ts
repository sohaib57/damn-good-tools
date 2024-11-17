import "./load-env"
import { exit } from "process"
import { CronJob } from "cron"

import { removeOutdatedChats } from "../lib/chat-pdf"

async function main() {
    new CronJob(
        "*/10 * * * *",
        async () => {
            await removeOutdatedChats()
        },
        null,
        true
    )
}

main()
    .then(() => {})
    .catch((err) => {
        console.error(err)
        exit(1)
    })
