import { TranscriptMetadata } from "@/model/transcript.types";
import { Popover, Tag } from "antd";

export const parseMetadata = (key: keyof TranscriptMetadata, metadata: TranscriptMetadata) => {
    // Check for specific metadata key implementations
    switch (key) {
        case "id": {
            // Generate a popover tag structure
            return (
                <div style={{ display: "flex", gap: "5px" }}>
                    {Object.entries(metadata[key]).map(([key, value]) => (
                        <Popover
                            content={Object.entries(value).map(([prop, propValue]) => (
                                <div>{`${prop}: ${propValue}`}</div>
                            ))}
                        >
                            <Tag variant="solid" color="#E0E0E0" style={{ width: "fit-content", color: "black" }}>
                                {key}
                            </Tag>
                        </Popover>
                    ))}
                </div>
            );
        }
        case "participants": {
            // Create a basic key-value list of participants
            return Object.entries(metadata[key]).map(([key, value]) => <div>{`${key}: ${value}`}</div>);
        }
        default: {
            // Check the current metadata value type
            switch (typeof metadata[key]) {
                case "object":
                    // If it's an array, just join them by comma delimiter
                    if (Array.isArray(metadata[key])) {
                        return metadata[key].join(", ");
                    } else {
                        // Objects require specific handling per key
                        // This would be better with further value type detection
                        return JSON.stringify(metadata[key]);
                    }
                // These types can just be returned as they are
                case "string":
                case "number":
                    return metadata[key];
            }
        }
    }
};
