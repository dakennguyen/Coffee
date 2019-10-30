import React, { useState } from "react";
import { useAuth0 } from "../react-auth0-wrapper";
import Profile from './Profile';

const ExternalApi = () => {
    const [showResult, setShowResult] = useState(false);
    const [apiMessage, setApiMessage] = useState("");
    const {
        isAuthenticated,
        logout,
        loginWithRedirect
    } = useAuth0();
    const logoutWithRedirect = () => {
        localStorage.removeItem('token');
        logout({
            returnTo: window.location.origin
        });
    }

    const callApi = async () => {
        try {
            var token = localStorage.getItem('token');
            const response = await fetch(
                "https://localhost:5000/api/SampleData/CallApi",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const responseData = await response.json();

            setShowResult(true);
            setApiMessage(responseData);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {isAuthenticated && <Profile />}
            <h1>External API</h1>
            {!isAuthenticated && (
                <button onClick={() => loginWithRedirect({})}>Login</button>
            )}
            {isAuthenticated && (
                <div>
                    <button onClick={() => logoutWithRedirect()}>Logout</button>
                    <a href="https://coffee-central.eu.auth0.com/samlp/vygtRN1RZ0cPkSw1BnXwSfXFvypwrwjK?RelayState=http://localhost:3001" target="_blank"><button>Highland</button></a>
                    <a href="https://coffee-central.eu.auth0.com/samlp/RcXmOSC6gPLGGyOReYsMF38nGU10DzSi?RelayState=http://localhost:3002" target="_blank"><button>Starbucks</button></a>
                </div>
            )}
            <button onClick={callApi}>Ping API</button>
            {showResult && <code>{JSON.stringify(apiMessage, null, 2)}</code>}
        </>
    );
};

export default ExternalApi;
