import React from 'react';
import {connect} from "react-redux";
import {Button, Card, Spinner} from "belle";
import "./resources/styles.css";
import {Navigate} from "react-router-dom";
import {bindActionCreators} from "redux";
import {changeTableFlag, load} from "../actions/actions";

function mapStateToProps(state){
    return {
        table: state.table,
        tableFlag: state.tableFlag
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        load: bindActionCreators(load, dispatch),
        changeTableFlag: bindActionCreators(changeTableFlag, dispatch)
    }
}

class Table extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            elemX: 0,
            elemY: 3,
            elemR: 1,
            elemId: 0,
            elemRes: "n",
            redirect: false,
            cardFlag: true,
            tabFlag: true
        }
    }


    showCard = (e) =>{this.card(e.currentTarget.id, e.currentTarget.className)}

    xInc = () => {
        if(this.state.elemX===4) this.setState({elemX: -4})
        else this.setState({elemX: this.state.elemX + 1})
        this.forceUpdate();
    }
    yInc = () => {
        if(this.state.elemY===3) this.setState({elemY: -5})
        else this.setState({elemY: this.state.elemY + 1})
        this.forceUpdate();
    }
    rInc = () => {
        if(this.state.elemR===4) this.setState({elemR: 1})
        else this.setState({elemR: this.state.elemR + 1})
        this.forceUpdate();
    }
    close = () => {this.setState({cardFlag: true})}
    upd = () => {
        this.sendUpdate(this.state.elemX, this.state.elemY, this.state.elemR, this.state.elemId)
        this.setState({cardFlag: true})
    }

    card(i, className) {
        const elem = this.props.table.table[i]
        if (className === "user-line"){
            let bul;
            if (elem.result) bul = "y"
            else bul = "n";
            this.setState({elemX: elem.x, elemY: elem.y, elemR: elem.r, elemRes: bul, elemId: elem.id, cardFlag: false})
        }
    }

    sendUpdate(x, y, r, id){
        let pointToUpdate = {
            x: x,
            y: y,
            r: r,
            result: false,
            id: id,
            token: parseInt(localStorage.getItem("token")),
            username: localStorage.getItem("user")
        }
        const requestOptions = {
            method: 'POST',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(pointToUpdate)
        };
        fetch('/misha-4/api/points/update', requestOptions)
            .then(async response => {
                if (response.status === 401) {
                    alert("Вы были отключены от сессии.")
                    throw new Error(response.status.toString())
                } else setTimeout(()=> {this.load()}, 300)
            }).catch((error) => {this.setState({redirect: true})})
    }

    load() {
        let tokenToSend = {token: parseInt(localStorage.getItem("token"))}
        const requestOptions = {
            method: 'POST',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(tokenToSend)
        };
        fetch('/misha-4/api/points/load', requestOptions)
            .then(async response => {
                if (response.status === 401) {
                    throw new Error(response.status.toString())
                } else if (response.ok){
                    return  await response.json();
                }
            }).then((data) => {this.setState({cardFlag: true}); this.props.load(data.table)})
            .catch((error) => {this.setState({redirect: true})})
    }


    render() {
        let tablePage;
        if(this.props.table.table.length>0){
            tablePage = <div className={"hands"}>
                <div className={"heigther"}>
                <table className={"scroll-table"}>
                <thead>
                <tr>
                    <td>X</td>
                    <td>Y</td>
                    <td>R</td>
                    <td>Result</td>
                </tr>
                </thead>
                </table>
                <div className={"scroll-table-body"}>
                    <table>
                <tbody>
                {
                    this.props.table.table.map(
                        (point, i) => (
                            <tr className={point.username===localStorage.getItem("user") ? "user-line" : ""} onClick={this.showCard} id={i} key={i}>
                                <td width={"100px"}>{point.x}</td>
                                <td width={"100px"}>{point.y}</td>
                                <td width={"100px"}>{point.r}</td>
                                <td width={"100px"}>{point.result ? 'Успех' : 'Провал'}</td>
                            </tr>
                        )
                    )
                }
                </tbody>
            </table>
                </div>
            </div>
            </div>
        } else {
           tablePage =  <div>
            <Card style={{ fontSize: 20,
                color: '#666',
                textAlign: 'center',
                borderTop: '1px solid #f2f2f2',
            }}>
                Загрузка... <Spinner characterStyle={{ fontSize: 20 }} />
            </Card>
            </div>
        }
        return (
            <div>
            <div className={"hands"}>
                {tablePage}
            </div>
                {(this.state.cardFlag) ? <div></div> : <div className={"card"}>
                    <div className={"cardFiller"}>
                        <div className={"cardBlocks"} id={"xSign"}>{this.state.elemX<0 ? "-" : "+"}</div>
                        <div className={"cardBlocks"} id={"x"}>{Math.abs(this.state.elemX)}</div>
                        <div className={"cardBlocks"} id={"ySign"}>{this.state.elemY<0 ? "-" : "+"}</div>
                        <div className={"cardBlocks"} id={"y"}>{Math.abs(this.state.elemY)}</div>
                        <div className={"cardBlocks"} id={"r"}>{this.state.elemR}</div>
                        <div className={"cardBlocks"} id={"res"}>{this.state.elemRes}</div>
                        <Button className={"card-btns"} onClick={this.xInc} id={"x-btn"}>X</Button>
                        <Button className={"card-btns"} onClick={this.yInc} id={"y-btn"}>Y</Button>
                        <Button className={"card-btns"} onClick={this.rInc} id={"r-btn"}>R</Button>
                        <Button primary className={"card-btns"} onClick={this.upd} id={"send-btn"}>></Button>
                        <Button className={"card-btns"} onClick={this.close} id={"close-btn"}>\</Button>
                    </div>
                </div>}
                {
                    this.state.redirect && <Navigate to='/' replace={true}/>
                }
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);