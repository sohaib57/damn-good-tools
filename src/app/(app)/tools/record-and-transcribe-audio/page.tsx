import { PageHeader } from "@/components/page-header-centered"

import { Recorder } from "./Recorder"

export default async function RecordAndTranscribeAudio() {
    return (
        <>
            <PageHeader
                heading="Record and Transcribe Audio"
                subheading="Quickly record an audio note and get transcribed text and a short summary as a bonus."
            />
            <Recorder maxRecordDuration={60 * 1000} />
        </>
    )
}
