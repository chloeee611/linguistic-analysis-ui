import { useParams } from "react-router";

export const Transcript = () => {
    const { transcriptId } = useParams();

    return <div>Transcript {transcriptId}</div>;
};
