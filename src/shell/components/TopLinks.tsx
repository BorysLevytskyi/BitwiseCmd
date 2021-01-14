import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faGithub} from "@fortawesome/free-brands-svg-icons";
import './TopLinks.css';

function TopLinks() {
    return <ul className="top-links">                
                <li>
                    <a href="https://github.com/BorisLevitskiy/BitwiseCmd"><FontAwesomeIcon className="icon" icon={faGithub} size="lg" />Project on GitHub</a>
                </li>
                <li>
                    <a href="https://twitter.com/BitwiseCmd"><FontAwesomeIcon className="icon" icon={faTwitter} size="lg" /><span className="link-text">Twitter</span></a>
                </li>
                <li>
                    <a href="mailto:&#098;&#105;&#116;&#119;&#105;&#115;&#101;&#099;&#109;&#100;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;?subject=Feedback"><FontAwesomeIcon className="icon" icon={faEnvelope} size="lg" /><span className="link-text">Send Feedback</span></a>
                </li>
    </ul>;
}

export default TopLinks;