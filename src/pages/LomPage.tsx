import React, { useEffect, useState } from "react";
import { LomForm } from "../features/Resources/LOM/LomForm";
import { Loading } from "../features/Loading/Loading";
import Container from "@material-ui/core/Container";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import MainService from "../api/service";
import { setLomSchema } from "../appSlice";
import { useCookies } from "react-cookie";

function LomPage() {
    const [loading, setLoading] = useState(true);
    const [cookies, setCookie] = useCookies(["JWT"]);
    const [limitedLomUseData, setLimitedLomUseData] = useState(undefined);
    const [error, setError] = useState(undefined);
    const location = useLocation();
    const dispatch = useDispatch();
    const searchParams = new URLSearchParams(location?.search);

    const handleCookie = (auth) => setCookie("JWT", auth, { maxAge: 86400 });


    useEffect(() => {
        const handleMessageParent = (message) => {
            if (
                location.pathname === "/lom" &&
                message?.data &&
                message?.data?.auth
            ) {
                handleCookie(message.data.auth);
                setLimitedLomUseData({});
                fetchLimitedLomData();
            }
        };
        window.addEventListener("message", handleMessageParent);
        if (location.pathname === "/lom") {
            setLimitedLomUseData({});
            fetchLimitedLomData();
        }

        return () => window.removeEventListener("message", handleMessageParent);
    }, []);


    const fetchLimitedLomData = async () => {
        let lomSchema = await MainService().getLomSchema();

        if (lomSchema && !lomSchema.error) {
            dispatch(setLomSchema(lomSchema));
            fetchCourseData(searchParams.get("courseId"));
        } else {
            setLimitedLomUseData(undefined);
            setLoading(false);
        }
    };


    const fetchCourseData = (courseId: string) => {
        setTimeout(async () => {
            let courseData = await MainService().getResource(courseId);
            if (courseData.error) {
                setError(courseData.error);
            } else {
                setLimitedLomUseData(courseData?.data?.description ? courseData : undefined);
            }
            setLoading(false);
        }, 1500);
    };

    if (loading)
        return (<Loading text="Loading user data..." />)

    if (error) {
        return (
            <Container maxWidth="md" disableGutters>
                <h1
                    style={{
                        padding: "0.5em",
                        marginTop: "0.5em",
                        textAlign: "center",
                        backgroundColor: "#fff",
                        width: "calc(100% - 2rem)",
                    }}
                >
                    Error
                </h1>
                <p style={{ textAlign: "center", padding: "1em" }}>
                    Resource not found. Contact with the administrator.
                </p>
            </Container>
        );
    }



    return (
        <Container maxWidth="md" disableGutters>
            { Object.keys(limitedLomUseData)?.length === 0
                ? ( <Loading text="Loading course data..." /> )
                : (
                    <>
                        <h1
                            style={{
                                padding: "0.5em",
                                marginTop: "0.5em",
                                textAlign: "center",
                                backgroundColor: "#fff",
                                width: "calc(100% - 2rem)",
                            }}
                        >
                            Limited use (LOM only)
                        </h1>
                        <LomForm data={limitedLomUseData} standard="lom" />
                        <div style={{ minHeight: "2.5em" }} />
                    </>
                )}
        </Container>
    );
}


export default LomPage;
