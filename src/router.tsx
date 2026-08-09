import { TranscriptDetails } from "./pages/projects/transcripts/details";
import { CreateEditProject } from "./pages/projects/create-edit";
import { UploadTranscript } from "./pages/projects/transcripts/upload";
import { ProjectDashboard } from "./pages/projects/details";
import { ProjectProvider } from "./hooks/projects.hooks";
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
import { Home } from "./pages/dashboard";

import "./App.css";

function Router() {
    return (
        <Routes>
            {/* Index is empty path */}
            <Route
                element={
                    <UserProvider>
                        <ProjectProvider>
                            <NavMenu />
                        </ProjectProvider>
                    </UserProvider>
                }
            >
                <Route path="home" element={<Landing />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                <Route index element={<Home />} />

                <Route path="projects">
                    <Route index element={<Projects />} />
                    <Route path="create" element={<CreateEditProject />} />

                    <Route path=":projectId">
                        <Route index element={<ProjectDashboard />} />

                        <Route path="analysis">
                            <Route path="kwal" element={<Kwal />} />
                            <Route path="mlu" element={<Kwal />} />
                            <Route path="freq" element={<Kwal />} />
                            <Route path="lexrare" element={<Kwal />} />
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
