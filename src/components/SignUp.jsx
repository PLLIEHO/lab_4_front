import React from 'react';
import Belle from "belle";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {currentUser} from "../actions/actions";
import {Navigate} from 'react-router-dom';
import "./resources/styles.css";
const Button = Belle.Button;
const TextInput = Belle.TextInput;

function mapStateToProps(state){
    return {
        token: state.token
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        putUser: bindActionCreators(currentUser, dispatch)
    }
}


class SignUp extends React.Component{
    constructor(props) {
        super(props);
        this.refName = React.createRef();
        this.refPass = React.createRef();
        this.refNameL = React.createRef();
        this.refPassL = React.createRef();
        this.state = {
            user: "",
            password: "",
            logged: false,
            status: 0,
            redirect: false,
            gainToken: "",
            errorName: "",
            errorLog: "",
            errorNameL: "",
            errorLogL: ""
        };
    }

    register(user, password){
        if(user=== null || user === ""){
            this.setState({status: 0})
            return;
        }
        if(password===null || password === ""){
            this.setState({status: 1})
            return;
        }
        let userToAdd = {
            user: user,
            password: password
        }
        const requestOptions = {
            method: 'POST',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userToAdd)
        };
        fetch('/misha-4/api/users/register', requestOptions)
            .then(async response => {
                this.setState({status: response.status})
                if(response.ok){
                    return response.json();
                } else {
                    throw new Error(response.status.toString())
                }
            }).catch((error)=>{
                console.log(error)
        })
    }

    login(user, password) {
        if(user=== null || user === "") this.setState({gainToken: 0});
        if(password===null || password === "") this.setState({gainToken: 1});
        let userToAdd = {
            user: user,
            password: password
        }
        const requestOptions = {
            method: 'POST',
            data: {},
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(userToAdd)
        };
        fetch('/misha-4/api/users/login', requestOptions)
            .then(async response => {
                if(response.ok){
                    return await response.json();
                }
                else {
                    this.setState({gainToken: response.status});
                    throw new Error(response.status.toString());
                }
            }).then((data)=> {
                this.setState({gainToken: data.token})
            }).catch((error) => {
                console.log(error)
            })
    }

    changeNameHandler = (e) => {this.setState({user: e.currentTarget.value});}

    changePasswordHandler = (e) => {this.setState({password: e.currentTarget.value});}

    RegistrationHandler = () => {
        this.register(this.state.user, this.state.password);
        setTimeout(() => {
        let answer = this.state.status
        if(answer===0){
            this.setState({errorLog: ""})
            this.setState({errorName: "???? ???? ??????????????, ?????? ?????? ??????????!"})
        }
        else if(answer===1){
            this.setState({errorName: ""})
            this.setState({errorLog: "???? ???? ?????????? ????????????"})
        }
        else if(answer===406){
            this.setState({errorName: "?????????????????? ???????????? ???? ??????????????"})
            this.setState({errorLog: "???????????????????? ?????? ??????"})
        }
        else if(answer===409){
            this.setState({errorLog: ""})
            this.setState({errorName: "?????? ?????? ????????????"})
        }
        else if(answer===500){
            alert('???????????? ???????????? ????????????????????')
        }
        else if(answer===200){
            this.setState({errorName: ""})
            this.setState({errorLog: ""})
            this.login(this.state.user, this.state.password);
            setTimeout(() => {
            let gainToken = this.state.gainToken;
            localStorage.removeItem("token");
            localStorage.setItem("token", gainToken);
            localStorage.setItem("user", this.state.user)
                this.setState({redirect: true})
            }, 1000)
        }
        }, 500);
    }

    LoginHandler = () => {
        this.login(this.state.user, this.state.password);
        setTimeout(() => {
            let gainToken = this.state.gainToken;
            if(gainToken===0){
                this.setState({errorLogL: ""})
                this.setState({errorNameL: "???? ???? ??????????????, ?????? ?????? ??????????!"})
            }
            else if(gainToken===1){
                this.setState({errorNameL: ""})
                this.setState({errorLogL: "???? ???? ?????????? ????????????"})
            }
            else if(gainToken===401){
                this.setState({errorNameL: "?????? ?????? ?? ?????????????? ??????????????????"})
                this.setState({errorLogL: "????????????????????, ??????????????????????????????????"})
            }
            else if(gainToken===403){
                this.setState({errorNameL: ""})
                this.setState({errorLogL: "???? ?????????? ???????????????????????? ????????????"})
            }
            else if(gainToken===500){
                alert('???????????? ???????????? ????????????????????')
            }
            else {
                this.setState({errorNameL: ""})
                this.setState({errorLogL: ""})
                localStorage.removeItem("token");
                localStorage.setItem("token", gainToken);
                localStorage.setItem("user", this.state.user)
                this.setState({redirect: true})
            }
        }, 1000);
    }

    changeLoggedHandler = () => {
        let newLogged = !this.state.logged;
        this.setState({logged: newLogged});
    }

    componentDidMount() {
        if (localStorage.getItem("token") !== null) {
            let tokenToCheck = {
                token: parseInt(localStorage.getItem("token"))
            }
            const requestOptions = {
                method: 'POST',
                data: {},
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(tokenToCheck)
            };
            fetch('/misha-4/api/users/check', requestOptions)
                .then(async response => {
                    const data = await response.json();
                    if (data.result) {
                        this.setState({redirect: true})
                    }
                })
        }
    }


    render(){
        const isLoggedIn = this.state.logged;
        let page;
        if(!isLoggedIn){
            page = <div>
                <strong className={"head"}>??????????????????????????????????</strong>
            <div className={"color"}>
                <div className={"tbl-main"}>
                    <fieldset className="field" id="field-x">
                        <legend>???????????????? ??????:</legend>
                        <div className={"belle-input"}><TextInput className={"TextInput"} minRows={ 1 }
                                   placeholder="?????? ?? ?????? ????????????????????, ???????????????"
                                   onChange={this.changeNameHandler} value={this.state.user}
                                   style={{
                                       border: '1px solid #C8C8C8',
                                       padding: 10,
                                       //width: 280,
                                       borderRadius: 3,
                                       color: '#00CCFF',
                                       textShadow: '1px 1px 1px #000',
                                       boxShadow: 'inset 0 1px 2px #CCC'
                                   }}
                                   hoverStyle={{
                                       border: '1px solid #6C6C6C'
                                   }}
                                   focusStyle={{
                                       borderColor: '#53C7F2',
                                       boxShadow: 'inset 0 1px 2px #CCC, 0 0 8px #53C7F2'
                                   }} />
                        </div>
                        <br/>
                        <p ref={this.refName}>{this.state.errorName}</p>
                    </fieldset>
                    <fieldset className="field" id="field-y">
                        <legend>???????????????? ????????????:</legend>
                        <div className={"belle-input"}>
                        <TextInput minRows={ 1 }
                                   placeholder="???????????? ???? ???????????????? ?????? ??????????????!"
                                   onChange={this.changePasswordHandler}
                                   value={this.state.password}
                                   style={{
                                       border: '1px solid #C8C8C8',
                                       padding: 10,
                                       //width: 280,
                                       borderRadius: 3,
                                       color: '#00CCFF',
                                       textShadow: '1px 1px 1px #000',
                                       boxShadow: 'inset 0 1px 2px #CCC'
                                   }}
                                   hoverStyle={{
                                       border: '1px solid #6C6C6C'
                                   }}
                                   focusStyle={{
                                       borderColor: '#53C7F2',
                                       boxShadow: 'inset 0 1px 2px #CCC, 0 0 8px #53C7F2'
                                   }} />
                        </div>
                        <br/>
                        <p ref={this.refPass}>{this.state.errorLog}</p>
                    </fieldset>
                    <fieldset className="field" id="field-r">
                        <Button primary value={"???????????????????????????????? ????????"} onClick={this.RegistrationHandler}>???????????????????????????????? ????????</Button>
                        <Button value={"?? ?????? ??????????????! ?????????????"} onClick={this.changeLoggedHandler}>?? ?????? ??????????????! ?????????????</Button>
                    </fieldset>
                </div>
            </div>
            </div>;
        }
        else {
            page = <div>
                <strong className={"head"} width="100%">?????????? ????????????????, ?????? ?????</strong>
                <div className={"color"}>
                    <div className={"tbl-main"}>

                        <fieldset className="field" id="field-x">
                            <legend>?????????????? ??????:</legend>
                            <TextInput minRows={ 1 }
                                       placeholder="?????????????????? ??????, ??????????????!"
                                       onChange={this.changeNameHandler} value={this.state.user}
                                       style={{
                                           border: '1px solid #C8C8C8',
                                           padding: 10,
                                           borderRadius: 3,
                                           color: '#00CCFF',
                                           textShadow: '1px 1px 1px #000',
                                           boxShadow: 'inset 0 1px 2px #CCC'
                                       }}
                                       hoverStyle={{
                                           border: '1px solid #6C6C6C'
                                       }}
                                       focusStyle={{
                                           borderColor: '#53C7F2',
                                           boxShadow: 'inset 0 1px 2px #CCC, 0 0 8px #53C7F2'
                                       }} />
                            <br/>
                            <p ref={this.refNameL}>{this.state.errorNameL}</p>
                        </fieldset>
                        <fieldset className="field" id="field-y">
                            <legend>?????????????? ????????????:</legend>
                            <TextInput minRows={ 1 }
                                       placeholder="?????????????? ?????? ??????????????"
                                       onChange={this.changePasswordHandler}
                                       value={this.state.password}
                                       style={{
                                           border: '1px solid #C8C8C8',
                                           padding: 10,
                                           borderRadius: 3,
                                           color: '#00CCFF',
                                           textShadow: '1px 1px 1px #000',
                                           boxShadow: 'inset 0 1px 2px #CCC'
                                       }}
                                       hoverStyle={{
                                           border: '1px solid #6C6C6C'
                                       }}
                                       focusStyle={{
                                           borderColor: '#53C7F2',
                                           boxShadow: 'inset 0 1px 2px #CCC, 0 0 8px #53C7F2'
                                       }} />
                            <br/>
                            <p ref={this.refPassL}>{this.state.errorLogL}</p>
                        </fieldset>
                        <fieldset className="field" id="field-r">
                            <Button primary value={"??????????"} onClick={this.LoginHandler}>??????????</Button>
                            <Button value={"?? ????????????. ???? ???? ??????????????"} onClick={this.changeLoggedHandler}>?? ????????????. ???? ???? ??????????????</Button>
                        </fieldset>
                    </div>
                </div>
            </div>;
        }
        return(
            <div className={"wrapper"}>
                <div class={"img"}>
                    {page}
                    {
                        this.state.redirect && <Navigate to='/app' replace={true}/>
                    }
                </div>
                <div id={"admiral"}>?????????????? ?????????? -
                    <strong className={"bottom"}> ???????????? ???????????? ????????????????, P32101, ?????????????? 2225</strong>
                </div>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);