import React from 'react'

export default class AboutResultView extends React.Component {
    render() {
        return   <div className="aboutTpl">
                        <p> Created by <a href="http://boryslevytskyi.github.io/">Borys Levytskyi</a></p>
                        <p>If you have an idea, suggestion or you've spotted a bug here, please send it to <a href="mailto:&#098;&#105;&#116;&#119;&#105;&#115;&#101;&#099;&#109;&#100;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;?subject=Feedback">&#098;&#105;&#116;&#119;&#105;&#115;&#101;&#099;&#109;&#100;&#064;&#103;&#109;&#097;&#105;&#108;&#046;&#099;&#111;&#109;</a> or tweet on <a href="http://twitter.com/BitwiseCmd">@BitwiseCmd</a>. Your feedback is greatly appreciated.</p>
                        <p><a href="https://github.com/BorisLevitskiy/BitwiseCmd">Project on <strong>GitHub</strong></a></p>
                    </div>;
    }
}