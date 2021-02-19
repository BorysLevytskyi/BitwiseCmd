import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState} from 'react';
import { faClipboard} from "@fortawesome/free-solid-svg-icons";
import "./DonateResultView.css";
import { sendAnalyticsEvent } from '../analytics';

function DonateResultView() {

    const copyCss = navigator.clipboard != null ? "" : "hidden";
    const [state, setState] = useState('default');
    const copiedCss = state == "copied" ? "" : "hidden";

    const addr = "1HR3PCeBsv5BFijqqfCh4AY9UturmjfmQA";

    return <div className="donate-result-view">
        <p>Thank you for your interest in donation. At this point BitwiseCmd can only accept Bitcoin donations.</p>
        <p>
            <span>BTC Address:</span> <strong>{addr}</strong> <button onClick={() => copy()} title="copy" className={`copy-button ${copyCss}`}><FontAwesomeIcon icon={faClipboard} size="lg" />Copy</button> <span className={`soft ${copiedCss}`}>copied</span>
        </p>
        <p className="qrcode-container">
            <svg shape-rendering="crispEdges" height="200" width="200" viewBox="0 0 29 29" className="qrcode">
                <path fill="#FFFFFF" d="M0,0 h29v29H0z"></path>
                <path fill="#000000" d="M0 0h7v1H0zM10 0h1v1H10zM12 0h2v1H12zM16 0h5v1H16zM22,0 h7v1H22zM0 1h1v1H0zM6 1h1v1H6zM8 1h1v1H8zM10 1h1v1H10zM14 1h2v1H14zM17 1h2v1H17zM20 1h1v1H20zM22 1h1v1H22zM28,1 h1v1H28zM0 2h1v1H0zM2 2h3v1H2zM6 2h1v1H6zM12 2h1v1H12zM14 2h1v1H14zM18 2h1v1H18zM22 2h1v1H22zM24 2h3v1H24zM28,2 h1v1H28zM0 3h1v1H0zM2 3h3v1H2zM6 3h1v1H6zM8 3h3v1H8zM12 3h6v1H12zM19 3h1v1H19zM22 3h1v1H22zM24 3h3v1H24zM28,3 h1v1H28zM0 4h1v1H0zM2 4h3v1H2zM6 4h1v1H6zM9 4h1v1H9zM13 4h1v1H13zM16 4h1v1H16zM19 4h2v1H19zM22 4h1v1H22zM24 4h3v1H24zM28,4 h1v1H28zM0 5h1v1H0zM6 5h1v1H6zM8 5h2v1H8zM11 5h3v1H11zM15 5h2v1H15zM18 5h1v1H18zM22 5h1v1H22zM28,5 h1v1H28zM0 6h7v1H0zM8 6h1v1H8zM10 6h1v1H10zM12 6h1v1H12zM14 6h1v1H14zM16 6h1v1H16zM18 6h1v1H18zM20 6h1v1H20zM22,6 h7v1H22zM9 7h3v1H9zM15 7h2v1H15zM19 7h2v1H19zM0 8h5v1H0zM6 8h4v1H6zM11 8h1v1H11zM13 8h5v1H13zM21 8h1v1H21zM23 8h1v1H23zM25 8h1v1H25zM27 8h1v1H27zM2 9h1v1H2zM5 9h1v1H5zM7 9h1v1H7zM10 9h1v1H10zM12 9h1v1H12zM16 9h1v1H16zM20 9h1v1H20zM23 9h2v1H23zM27,9 h2v1H27zM0 10h1v1H0zM4 10h1v1H4zM6 10h1v1H6zM8 10h1v1H8zM10 10h1v1H10zM13 10h3v1H13zM18 10h1v1H18zM21 10h1v1H21zM23 10h1v1H23zM25 10h2v1H25zM0 11h3v1H0zM5 11h1v1H5zM7 11h2v1H7zM12 11h1v1H12zM15 11h2v1H15zM19 11h1v1H19zM21 11h1v1H21zM24 11h2v1H24zM27 11h1v1H27zM3 12h1v1H3zM6 12h1v1H6zM9 12h2v1H9zM12 12h6v1H12zM23 12h1v1H23zM26 12h1v1H26zM0 13h1v1H0zM2 13h2v1H2zM5 13h1v1H5zM7 13h1v1H7zM13 13h1v1H13zM16 13h1v1H16zM18 13h1v1H18zM20 13h2v1H20zM24 13h3v1H24zM28,13 h1v1H28zM1 14h1v1H1zM3 14h2v1H3zM6 14h1v1H6zM9 14h4v1H9zM14 14h4v1H14zM20 14h2v1H20zM25 14h2v1H25zM0 15h3v1H0zM4 15h2v1H4zM7 15h1v1H7zM11 15h1v1H11zM14 15h3v1H14zM18 15h1v1H18zM20 15h1v1H20zM22 15h1v1H22zM24 15h2v1H24zM5 16h2v1H5zM8 16h1v1H8zM11 16h1v1H11zM14 16h3v1H14zM20 16h1v1H20zM23 16h2v1H23zM26,16 h3v1H26zM0 17h1v1H0zM3 17h1v1H3zM5 17h1v1H5zM7 17h1v1H7zM12 17h1v1H12zM14 17h3v1H14zM18 17h2v1H18zM21 17h4v1H21zM26,17 h3v1H26zM0 18h1v1H0zM6 18h3v1H6zM10 18h1v1H10zM15 18h4v1H15zM24 18h2v1H24zM0 19h1v1H0zM2 19h1v1H2zM4 19h1v1H4zM8 19h3v1H8zM12 19h1v1H12zM14 19h2v1H14zM19 19h2v1H19zM25 19h1v1H25zM27,19 h2v1H27zM0 20h1v1H0zM4 20h1v1H4zM6 20h5v1H6zM12 20h1v1H12zM14 20h1v1H14zM16 20h2v1H16zM20 20h5v1H20zM26 20h2v1H26zM8 21h3v1H8zM17 21h4v1H17zM24,21 h5v1H24zM0 22h7v1H0zM8 22h1v1H8zM10 22h3v1H10zM15 22h2v1H15zM18 22h3v1H18zM22 22h1v1H22zM24 22h1v1H24zM26 22h1v1H26zM0 23h1v1H0zM6 23h1v1H6zM9 23h3v1H9zM14 23h2v1H14zM18 23h3v1H18zM24 23h1v1H24zM27,23 h2v1H27zM0 24h1v1H0zM2 24h3v1H2zM6 24h1v1H6zM8 24h1v1H8zM11 24h1v1H11zM16 24h3v1H16zM20,24 h9v1H20zM0 25h1v1H0zM2 25h3v1H2zM6 25h1v1H6zM8 25h1v1H8zM12 25h2v1H12zM15 25h2v1H15zM19 25h2v1H19zM24 25h1v1H24zM26,25 h3v1H26zM0 26h1v1H0zM2 26h3v1H2zM6 26h1v1H6zM8 26h3v1H8zM13 26h4v1H13zM21 26h1v1H21zM23 26h2v1H23zM26 26h2v1H26zM0 27h1v1H0zM6 27h1v1H6zM8 27h2v1H8zM12 27h2v1H12zM15 27h1v1H15zM18 27h4v1H18zM23 27h2v1H23zM27 27h1v1H27zM0 28h7v1H0zM8 28h3v1H8zM12 28h1v1H12zM14 28h2v1H14zM19 28h1v1H19zM21 28h2v1H21zM24 28h3v1H24z"></path>
            </svg>
        </p>
    </div>

    function copy() {
        navigator.clipboard.writeText(addr);
        setState('copied');
        setTimeout(() => setState('default'), 3000);
        sendAnalyticsEvent({eventCategory: "BtcAddressCopyButton", eventAction: "Clicked"})
    }
}

export default DonateResultView;