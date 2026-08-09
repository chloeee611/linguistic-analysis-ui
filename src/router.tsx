import { TranscriptDetails } from "./pages/projects/transcripts/details";
import { CreateEditProject } from "./pages/projects/create-edit";
import { UploadTranscript } from "./pages/projects/transcripts/upload";
import { ProjectDetails } from "./pages/projects/details";
import { Route, Routes } from "react-router";
import { Transcripts } from "./pages/projects/transcripts/listing";
import { EditProfile } from "./pages/profile/edit-profile";
import { ViewProfile } from "./pages/profile/view-profile";
import { Dashboard } from "./pages/dashboard";
import { Projects } from "./pages/projects/listing";
import { Register } from "./pages/register";
import { NavMenu } from "./layouts/nav-menu/nav-menu";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Kwal } from "./pages/projects/analysis/kwal";

import "./App.css";

function Router() {
    return (
        <Routes>
            {/* Index is empty path */}
            <Route element={<NavMenu />}>
                <Route path="home" element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route index element={<Dashboard />} />

                <Route path="projects">
                    <Route index element={<Projects />} />
                    <Route path="create" element={<CreateEditProject />} />
                    <Route path=":projectId" element={<ProjectDetails />} />
                    <Route path=":projectId/kwal" element={<Kwal />} />
                    <Route path=":projectId/transcripts/upload" element={<UploadTranscript />} />
                    <Route path=":projectId/transcripts" element={<Transcripts />} />
                    <Route path=":projectId/transcripts/:transcriptId" element={<TranscriptDetails />} />
                </Route>

                <Route path="profile" element={<ViewProfile />} />
                <Route path="profile/edit" element={<EditProfile />} />
            </Route>
        </Routes>
    );
}

export default Router;
