import { TranscriptDetails } from "./pages/projects/transcripts/details";
import { UploadTranscript } from "./pages/projects/transcripts/upload";
import { ProjectDashboard } from "./pages/projects/details";
import { ProjectSettings } from "./pages/projects/settings";
import { ProjectProvider } from "./hooks/projects.hooks";
import { CreateProject } from "./pages/projects/create";
import { Route, Routes } from "react-router";
import { UserProvider } from "./hooks/user.hooks";
import { Transcripts } from "./pages/projects/transcripts/listing";
import { EditProfile } from "./pages/profile/edit-profile";
import { ViewProfile } from "./pages/profile/view-profile";
import { Projects } from "./pages/projects/listing";
import { Register } from "./pages/register";
import { NavMenu } from "./layouts/global-layout/global-layout";
import { Landing } from "./pages/landing";
import { Login } from "./pages/login";
import { Kwal } from "./pages/projects/analysis/kwal";
import { Results } from "./pages/projects/analysis/results";
import { Home } from "./pages/home";

import "./App.css";

function Router() {
    return (
        <Routes>
            <Route
                element={
                    <UserProvider>
                        <ProjectProvider>
                            <NavMenu />
                        </ProjectProvider>
                    </UserProvider>
                }
            >
                <Route index element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route path="home" element={<Home />} />

                <Route path="projects">
                    <Route index element={<Projects />} />
                    <Route path="create" element={<CreateProject />} />

                    <Route path=":projectId">
                        <Route index element={<ProjectDashboard />} />
                        <Route path="settings" element={<ProjectSettings />} />

                        <Route path="analysis">
                            <Route path="kwal" element={<Kwal />} />
                            <Route path="results" element={<Results />} />
                        </Route>

                        <Route path="transcripts">
                            <Route index element={<Transcripts />} />
                            <Route path="upload" element={<UploadTranscript />} />
                            <Route path=":transcriptId" element={<TranscriptDetails />} />
                        </Route>
                    </Route>
                </Route>

                <Route path="profile" element={<ViewProfile />} />
                <Route path="profile/edit" element={<EditProfile />} />
            </Route>
        </Routes>
    );
}

export default Router;
