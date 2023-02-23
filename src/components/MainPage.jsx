import React from 'react';
import Belle, {Card, Spinner} from "belle";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {load, changeFlag, changeTableFlag} from "../actions/actions";
import Table from "./Table";
import "./resources/styles.css";
import {Navigate} from "react-router-dom";


const Button = Belle.Button;


function mapStateToProps(state){
    return {
        user: state.user,
        table: state.table,
        loadFlag: state.loadFlag,
        tableFlag: state.tableFlag
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        load: bindActionCreators(load, dispatch),
        changeFlag: bindActionCreators(changeFlag, dispatch),
        changeTableFlag: bindActionCreators(changeTableFlag, dispatch)
    }
}


function Alert(props) {
    return <strong>
          {Math.round(props.name)}
    </strong>;
}


const types = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

const ToggleGroup=({changeXHandler}) => (
        <div>
            {types.map((type) => (
                <Button className="button" onClick={changeXHandler} value={type}>
                    {type}
                </Button>
            ))}
        </div>
)

const r_types = [1, 2, 3, 4];

const RGroup=({changeRHandler}) => (
    <div>
        {r_types.map((type) => (
            <Button className="button" onClick={changeRHandler} value={type}>
                {type}
            </Button>
        ))}
    </div>
)

class MainPage extends React.Component{
    constructor(props) {
        super(props);
        this.refRange = React.createRef();
        this.refCanvas = React.createRef();
        this.refButtonSound = React.createRef();
        this.refAmbientSound = React.createRef();
        this.state = {
            val_x: 0,
            val_y: 3,
            val_r: 1,
            result: false,
            redirect: false,
            isTable: false,
            lastX: 0,
            lastY: 3,
            lastR: 1,
            token: parseInt(localStorage.getItem("token"))
        };
    }

    changeXHandler = (e) => {this.setState({val_x: e.currentTarget.value}); }
    changeYHandler = (e) => {this.setState({val_y: e.currentTarget.value}); }
    changeRHandler = (e) => {this.setState({val_r: e.currentTarget.value}); }
    tableHandler = () => {let bool = !this.state.isTable; this.setState({isTable: bool})}

    exitHandler = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        let tokenToRemove = {token: this.state.token}
        const requestOptions = {
            method: 'POST',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(tokenToRemove)
        };
        fetch('/misha-4/api/users/exit', requestOptions)
            .then(() => this.setState({redirect: true}))
    }

    drawPoint(context, x, y, r, check) {
        const CANVAS_OFFSET_X = 180;
        const CANVAS_OFFSET_Y = 170;
        const CANVAS_SCALE_X = 111;
        const CANVAS_SCALE_Y = 111;
        x = x * CANVAS_SCALE_X / r + CANVAS_OFFSET_X;
        y = -y * CANVAS_SCALE_Y / r + CANVAS_OFFSET_Y;
        context.lineWidth = 2;
        context.beginPath();
        context.moveTo(x - 8, y);
        context.lineTo(x + 8, y);
        context.moveTo(x, y - 8);
        context.lineTo(x, y + 8);
        if (check===null) context.strokeStyle = "white";
        else if (check) context.strokeStyle = "green";
        else context.strokeStyle = "red";
        context.stroke();
    }


    canvasSetting() {
        const canvas = this.refCanvas.current;
        if (canvas === null) {console.log("Канвас в канаве");}
        canvas.getContext("2d");
        this.drawTable();
        this.drawPoint(canvas.getContext("2d"), this.state.val_x, this.state.val_y, parseInt(this.state.val_r), null);
    }

    moveHandler = (event) =>{
        let canvas = event.currentTarget;
        const CANVAS_OFFSET_X = 180;
        const CANVAS_OFFSET_Y = 170;
        const CANVAS_SCALE_X = 111;
        const CANVAS_SCALE_Y = 111;
        let rect = canvas.getBoundingClientRect();
        let sx = event.clientX - rect.left;
        let sy = event.clientY - rect.top;
        let radius = parseInt(this.state.val_r);
        let x = sx - CANVAS_OFFSET_X;
        let y = sy - CANVAS_OFFSET_Y;
        x = x / CANVAS_SCALE_X * radius;
        y = -y / CANVAS_SCALE_Y * radius;
        if (x <= -4)
            x = -4;
        if (x >= 4)
            x = 4;
        if (y <= -5)
            y = -5;
        if (y >= 3)
            y = 3;
        this.setState({lastX: x});
        this.setState({lastY: y});
    }

    clickHandler = (event) => {
        let canvas = event.currentTarget
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.canvasAnswer(Math.round(this.state.lastX), Math.round(this.state.lastY));
        this.drawTable();
        this.drawPoint(context, Math.round(this.state.lastX), Math.round(this.state.lastY), this.state.val_r, null);
    }

    clear() {
        let canvas = this.refCanvas.current;
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawTable(){
        const canvas = this.refCanvas.current;
        let tableToDraw = this.props.table.table;
        let r_val = parseInt(this.state.val_r);
        for(let i = 0; i<tableToDraw.length; i++){
            if(tableToDraw[i].r === r_val) this.drawPoint(canvas.getContext("2d"), tableToDraw[i].x, tableToDraw[i].y, tableToDraw[i].r, tableToDraw[i].result)
        }
    }

    canvasAnswer =(x, y) => {
        this.setState({val_x: x});
        this.setState({val_y: y});
        this.moveY(y);
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        const vitalStateChangeX = this.state.val_x !== nextState.val_x;
        const vitalStateChangeY = this.state.val_y !== nextState.val_y;
        const vitalStateChangeR = this.state.val_r !== nextState.val_r;
        const vitalStateChangeRes = this.state.result !== nextState.result;
        const vitalRedirectChange = this.state.redirect !== nextState.redirect;
        const vitalTableChange = this.state.isTable !== nextState.isTable;
        return vitalStateChangeX || vitalStateChangeY || vitalStateChangeR || vitalStateChangeRes || vitalRedirectChange || vitalTableChange
    }

    addPoint() {
        let pointToAdd = {
            x: this.state.val_x,
            y: this.state.val_y,
            r: this.state.val_r,
            result: this.state.result,
            token: this.state.token,
            username: localStorage.getItem("user")
        }
        const requestOptions = {
            method: 'PUT',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(pointToAdd)
        };
        fetch('/misha-4/api/points/add', requestOptions)
            .then(async response => {
                    if (response.status === 401) {
                        alert("Вы были отключены от сессии.")
                        throw new Error(response.status.toString())
                    } else {
                        this.load();
                        return await response.json();
                    }
            }).catch((error)=>{this.setState({redirect: true})})

    }
    moveY=(y)=>{this.refRange.current.value = y;}
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
            }).then((data) => {this.props.changeFlag(true); this.props.load(data.table)})
            .catch((error) => {this.setState({redirect: true})})
    }

    componentDidMount() {
        if(localStorage.getItem("token") == null) this.setState({redirect: true})
        setTimeout(()=>{this.load();})
        if(!this.state.isTable) {
            this.clear();
            this.canvasSetting();
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!this.state.isTable) {
            this.clear();
            this.canvasSetting();
        }
    }

    render(){
        const isTable = this.state.isTable;
        let page;
        if(!isTable){
            page = <div className={"wrapper"}>
                <div className={"btn-exit"}><Button onClick={this.exitHandler}>Выйти</Button></div>
                <div className={"top"}><b className={"head"}>Капитан: {localStorage.getItem("user")===null ? "Иван Иванов" : localStorage.getItem("user")}</b></div>
                <strong className={"strong-top"} width="100%">Ввод данных</strong>
                <div className={"color"}>
                    <div className={"tbl-main"}>

                        <fieldset className="field" id="field-x">
                            <legend>Выберите координату X:</legend>
                            <ToggleGroup changeXHandler={this.changeXHandler}/>
                            <div className={"resShow"}>X =
                                <Alert name={this.state.val_x}/>
                            </div>
                        </fieldset>
                        <fieldset className="field" id="field-y">
                            <legend>Выберите координату Y:</legend>
                            <input ref={this.refRange} type={"range"} id={"ranger"} min={-5} max={3} onChange={this.changeYHandler}/>
                            <div className={"resShow"}>Y =
                                <Alert name={this.state.val_y}/>
                            </div>
                        </fieldset>
                        <fieldset className="field" id="field-r">
                            <legend>Выберите радиус</legend>
                            <RGroup changeRHandler={this.changeRHandler}/>
                            <div className={"resShow"}>R =
                                <Alert name={this.state.val_r}/>
                            </div>
                        </fieldset>
                        <Button primary  className="buttonJmp" onClick={this.addPoint.bind(this)} style={{
                            background: '#DC143C'
                        }}>Прыжок!</Button>
                    </div>
                    <div>
                        <div className={"canvasPlace"}>
                            {this.props.loadFlag ? <canvas ref={this.refCanvas} onClick={this.clickHandler} onMouseMove={this.moveHandler} id="canvas" height="340" width="360"></canvas> : <Card style={{ fontSize: 20,
                                color: '#666',
                                textAlign: 'center',
                                borderTop: '1px solid #f2f2f2',
                            }}>
                                Загрузка... <Spinner characterStyle={{ fontSize: 20 }} />
                            </Card>

                            }
                        </div>
                    </div>
                </div>
            </div>
        } else {
            page = <div>
                    <Table load={this.load}></Table>
            </div>
        }
        return(
            <div><div className={"button-l"}><Button className={"tableBtn"} onClick={this.tableHandler}>{isTable ? "Вернуться" : "Бортовой журнал"}</Button></div>
                    {page}
                <div id={"admiral"}>Адмирал флота -
                    <strong className={"bottom"}> Грибов Михаил Олегович, вариант 2225</strong>
                </div>
                {this.state.redirect && <Navigate to='/' replace={true}/>}
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);