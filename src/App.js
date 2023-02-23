import React from "react";
import Info from "./components/MainPage"
import SignUp from "./components/SignUp";
import {createStore} from "redux"
import allReducers from "./reducers";
import {Provider} from "react-redux";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import NotFound from "./components/NotFound";

const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <SignUp/>,
            errorElement: <NotFound/>,
        },
        {
            path: "/app",
            element: <Info/>,
            errorElement: <NotFound/>,
        },
        {
            path: "/*",
            element: <NotFound/>,
        }
    ],
    {
        basename: process.env.PUBLIC_URL
    });


const store = createStore(allReducers);

class App extends React.Component{
  render(){
    return (
        <div>
            <Provider store={store}>
                <RouterProvider router={router}/>
            </Provider>
        </div>
    );
  }
}

export default App;
