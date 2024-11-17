import { PageHeader } from "@/components/page-header-centered"

import { Uploader } from "./Uploader"

export default async function RecordAndTranscribeAudio() {
    return (
        <>
            <PageHeader
                heading="Transcribe Any Audio File"
                subheading="Quickly upload an audio file and get the transcribed text with a short summary as a bonus."
            />
            <Uploader maxFileSize={10 * 1000 * 1000} />
        </>
    )
}
