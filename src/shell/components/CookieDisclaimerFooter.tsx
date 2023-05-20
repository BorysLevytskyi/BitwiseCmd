import { useState } from "react";
import "./CookieDisclaimerFooter.css";
import AppState from "../AppState";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function CookieDisclaimerFooter(props: { appSate: AppState }): JSX.Element {

    const [expanded, setShowMore] = useState(false);
    const longCss = expanded ? " expanded" : " collapsed";
    const shortCss = expanded ? " collapsed" : " expanded";
    const buttonText = expanded ? "Read Less" : "Read More";

    if (props.appSate.cookieDisclaimerHidden)
        return <React.Fragment></React.Fragment>;

    return <div className="cookie-disclaimer">

        <div className={"short" + shortCss}>
            <p>
                By using BitwiseCmd, you agree to the use of cookies for Google Analytics. These cookies help analyze and enhance your browsing experience. Click 'Read More' to learn about how your data is handled.
            </p>
        </div>

        <div className={"details" + longCss}>
            <p>By using BitwiseCmd, you agree to the use of cookies, including those used for Google Analytics. These cookies are employed to collect information about your usage of the website and help analyze and improve its performance and features.</p>

            <p>Google Analytics cookies allow BitwiseCmd to gather anonymous data such as the pages you visit, the duration of your stay on each page, the website you came from, and the browser and device you are using. This information helps understand which features and content are most popular and enables informed decisions to enhance your browsing experience.</p>

            <p>Rest assured that the data collected through Google Analytics cookies is used in an aggregated and anonymized manner. No personally identifiable information is collected, and your privacy and data protection are of utmost importance.</p>

            <p>By continuing to use BitwiseCmd, you consent to the use of Google Analytics cookies for the purposes described above. If you prefer not to have your data collected by Google Analytics cookies, you can adjust your browser settings to disable cookies or use browser extensions that block third-party cookies.</p>
        </div>
        <div>
            <p>
                <button className="button" onClick={() => setShowMore(!expanded)}><FontAwesomeIcon icon={expanded ? faCaretDown : faCaretUp} />{buttonText}</button> <button className="button" onClick={() => props.appSate.setCookieDisclaimerHidden(true)}><FontAwesomeIcon icon={faCircleXmark} />Hide</button>
            </p>
        </div>
    </div>
}

export default CookieDisclaimerFooter;