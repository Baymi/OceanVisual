import React from "react";

class SidePanel extends React.Component{
    render(){
        return(
            <div>
                {this.props.children}
            </div>
        )
    }
}
export default SidePanel;
