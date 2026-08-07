import { Count, Dashboard, Projects, ProjectDetails } from "./pages";
import { UploadProjectTranscript } from "./pages/projects/transcripts/upload/upload-project-transcript";
import { CreateEditProject } from "./pages/projects/create-edit/create-edit-project";
import { TranscriptDetails } from "./pages/transcripts/details/transcript-details";
import { UploadTranscripts } from "./pages/transcripts/uploads/transcript-upload";
import { LinkTranscript } from "./pages/projects/transcripts/link/link-transcript";
import { Route, Routes } from "react-router";
import { EditProfile } from "./pages/profile/edit-profile/edit-profile";
import { ViewProfile } from "./pages/profile/view-profile/view-profile";
import { Transcripts } from "./pages/transcripts/listing/transcripts";
import { Register } from "./pages/register/register";
import { NavMenu } from "./layouts/nav-menu/nav-menu";
import { Landing } from "./pages/landing/landing";
import { Login } from "./pages/login/login";
import { Kwal } from "./pages/projects/analysis/kwal/kwal";

import "./App.css";

function Router() {
    return (
        <Routes>
            {/* Index is empty path */}
            <Route path="home" element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route element={<NavMenu />}>
                <Route index element={<Dashboard />} />
                <Route path="count" element={<Count />} />

                <Route path="projects" element={<Projects />} />
                <Route path="projects/create" element={<CreateEditProject />} />
                <Route
                    path="projects/:projectId"
                    element={<ProjectDetails />}
                />
                <Route path="projects/:projectId/kwal" element={<Kwal />} />
                <Route
                    path="projects/:projectId/transcripts/link"
                    element={<LinkTranscript />}
                />
                <Route
                    path="projects/:projectId/transcripts/upload"
                    element={<UploadProjectTranscript />}
                />

                <Route path="transcripts" element={<Transcripts />} />
                <Route
                    path="transcripts/upload"
                    element={<UploadTranscripts />}
                />
                <Route
                    path="transcripts/:transcriptId"
                    element={<TranscriptDetails />}
                />
                <Route path="profile" element={<ViewProfile />} />
                <Route path="profile/edit" element={<EditProfile />} />
            </Route>
        </Routes>
    );
}

export default Router;
