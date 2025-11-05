import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState} from 'react';
import { faCoffee} from "@fortawesome/free-solid-svg-icons";
import "./DonateResultView.css";
import { sendAnalyticsEvent } from '../analytics';
import { faPaypal } from '@fortawesome/free-brands-svg-icons';

function DonateResultView() {

    const copyCss = navigator.clipboard !== null && navigator.clipboard !== undefined ? "" : "hidden";
    const [state, setState] = useState('default');
    const copiedCss = state === "copied" ? "" : "hidden";

    const addr = "bc1qyv08z29776uwdwy2m0c77gpgpupzr78jpcnraq";

    return <div className="donate-result-view">
        <p>Thank you for your interest in donation. At this point BitwiseCmd can accept donations via services listed below:</p>
       
        <div className='section'>
        <h3>buymeacoffee.com</h3>
        <p>
            <a className='button button-large' href='https://bmc.link/boryslevytB' onClick={() => onBuyMeCoffe()} target='_blank' rel="noreferrer">
                <FontAwesomeIcon icon={faCoffee} size='lg' /> Buy Me a Coffee
            </a>
        </p>
        <h3>PayPal</h3>
            <p>
                <a className='paypal-button button button-large' href='https://www.paypal.com/donate/?hosted_button_id=3GREJYC4T5AJ8' target='_blank' rel="noreferrer">
                    <FontAwesomeIcon icon={faPaypal} size='lg' />
                    Donate via PayPal
                </a>
            </p>
        </div>
        
        <div className='section'>
            <h3>Bitcoin</h3>
            <span>BTC Address:</span> <strong>{addr}</strong> 
                <button type="button" onClick={() => copy()} title="Copy this address into the Cliboard" className={`button copy-button ${copyCss}`}>
                   Copy
                </button> <span className={`soft ${copiedCss}`}>copied</span>
        </div>
    </div>

    function copy() {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(addr);
        }
        setState('copied');
        setTimeout(() => setState('default'), 3000);
        sendAnalyticsEvent({eventCategory: "Donation", eventAction: "CopyBTCAddressCopyClicked"})
    }

    function onBuyMeCoffe() {
        sendAnalyticsEvent({eventAction: "BuyMeCoffeeClicked", eventCategory: "Donation"})
    }
}

export default DonateResultView;