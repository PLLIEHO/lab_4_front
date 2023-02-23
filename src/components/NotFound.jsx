import React from 'react';
import "./resources/styles.css";



class NotFound extends React.Component {

    render() {
        let page;
        page = <audio
            src="https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1whc1JQMfo8SQlmbR9USuYZQ_1kyB8HVe"
            autoPlay
        />
        return (
            <div className={"class-404"}>
                {page}
            </div>
        )
    }
}

export default NotFound