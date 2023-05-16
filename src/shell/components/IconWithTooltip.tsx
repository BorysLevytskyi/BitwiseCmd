import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./IconWithTooltip.css";

export type IconWithToolTipProps = {
    icon: IconProp
}

function IconWithToolTip (props: React.PropsWithChildren<IconWithToolTipProps>)  {
    return <div className='tooltip-holder'>
        <span className="tooltip-icon"><FontAwesomeIcon icon={props.icon} /></span>

        <div className='tooltip solid-border solid-background'>
            {props.children}
        </div>
    </div>;
}

export default IconWithToolTip;