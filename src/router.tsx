import { Count, Dashboard, Projects, ProjectDetails } from "./pages/analysis";
// import { useState, useEffect } from "react";
import { CreateEditProject } from "./pages/analysis/projects/create-edit/create-edit-project";
import { TranscriptDetails } from "./pages/analysis/transcripts/details/transcript-details";
import { UploadTranscripts } from "./pages/analysis/transcripts/uploads/transcript-upload";
import { Route, Routes } from "react-router";
import { Transcripts } from "./pages/analysis/transcripts/listing/transcripts";
import { Register } from "./pages/register/register";
import { NavMenu } from "./layouts/nav-menu/nav-menu";
import { Landing } from "./pages/landing/landing";
import { Login } from "./pages/login/login";
// import { api } from "./api/api";

import "./App.css";

function Router() {
    // const [users, setUsers] = useState<string[]>([]);

    // useEffect(() => {
    //     const fetchUsers = async () => {
    //         try {
    //             const { data } = await api.get<User[]>("/users");
    //             setUsers(data.map((user) => user.username));
    //             console.log(data);
    //         } catch (error) {
    //             console.error("Could not load users", error);
    //         }
    //     };
    //     fetchUsers();
    // }, []);

    // console.log(users);

    return (
        <Routes>
            {/* Index is empty path */}
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />

            <Route path="analysis" element={<NavMenu />}>
                <Route index element={<Dashboard />} />
                <Route path="count" element={<Count />} />

                <Route path="projects" element={<Projects />} />
                <Route path="projects/create" element={<CreateEditProject />} />
                <Route
                    path="projects/:projectId"
                    element={<ProjectDetails />}
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
            </Route>
        </Routes>
    );
}

export default Router;
