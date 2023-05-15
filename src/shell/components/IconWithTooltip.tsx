import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type IconWithToolTipProps = {
    icon: IconProp
}

function IconWithToolTip (props: React.PropsWithChildren<IconWithToolTipProps>)  {
    return <div className='tooltip-holder'>
        <button><FontAwesomeIcon icon={props.icon} /></button>

        <div className='tooltip solid-border solid-background'>
            {props.children}
        </div>
    </div>;
}

export default IconWithToolTip;