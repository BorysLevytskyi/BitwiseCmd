import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faEnvelope, faDonate } from "@fortawesome/free-solid-svg-icons";
import { faGithub} from "@fortawesome/free-brands-svg-icons";
import './TopLinks.css';
import cmd from '../cmd';

function TopLinks() {

    return <ul className="top-links">                
                <li>
                    <button onClick={onDonate} className='link-button'>
                        <FontAwesomeIcon className='icon' icon={faDonate} size="lg" /><span className='link-text'>donate</span>
                    </button>
                </li>
                <li>
                    <a href="https://github.com/BorisLevitskiy/BitwiseCmd" target='_blank'><FontAwesomeIcon className="icon" icon={faGithub} size="lg" /><span className="link-text">github</span></a>
                </li>
                <li>
                    <a href="mailto:&#098;&#105;&#116;&#119;&#105;&#115;&#101;&#099;&#109;&#100;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;?subject=Feedback"><FontAwesomeIcon className="icon" icon={faEnvelope} size="lg" /><span className="link-text">idea or feedback</span></a>
                </li>
    </ul>;
}

const onDonate = () => {
    cmd.execute('donate');
    return true;
}

export default TopLinks;