import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { faCoffee} from "@fortawesome/free-solid-svg-icons";
import "./DonateResultView.css";
import { sendAnalyticsEvent } from '../analytics';

function DonateResultView() {
    return <div className="donate-result-view">
        <p>Thank you for your interest in donation. At this point BitwiseCmd can accept donations via services listed below:</p>

        <div className='section'>
        <h3>buymeacoffee.com</h3>
        <p>
            <a className='button button-large' href='https://bmc.link/boryslevytB' onClick={() => onBuyMeCoffe()} target='_blank' rel="noreferrer">
                <FontAwesomeIcon icon={faCoffee} size='lg' /> Buy Me a Coffee
            </a>
        </p>
        </div>
    </div>

    function onBuyMeCoffe() {
        sendAnalyticsEvent({eventAction: "BuyMeCoffeeClicked", eventCategory: "Donation"})
    }
}

export default DonateResultView;
