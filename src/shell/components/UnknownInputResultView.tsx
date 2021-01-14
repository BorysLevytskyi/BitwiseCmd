import React from 'react';

function UnknownInputResultView(props : {input:string}) {
    
    return <div className="result">
                        <div className="error">¯\_(ツ)_/¯ Sorry, i don&prime;t know what <strong>{props.input}</strong> is</div>
                </div>;
}

export default UnknownInputResultView;
