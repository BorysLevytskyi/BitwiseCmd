import React from 'react';

function ErrorResultView(props : {errorMessage:string}) {
    
    return <div className="result">
                <div className="error">{props.errorMessage}</div>
        </div>;
}

export default ErrorResultView;
