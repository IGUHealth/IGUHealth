"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = void 0;
var react_1 = require("react");
var Button_1 = require("./Button");
require("./header.css");
var Header = function (_a) {
    var user = _a.user, onLogin = _a.onLogin, onLogout = _a.onLogout, onCreateAccount = _a.onCreateAccount;
    return (<header>
    <div className="storybook-header">
      <div>
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g fill="none" fillRule="evenodd">
            <path d="M10 0h12a10 10 0 0110 10v12a10 10 0 01-10 10H10A10 10 0 010 22V10A10 10 0 0110 0z" fill="#FFF"/>
            <path d="M5.3 10.6l10.4 6v11.1l-10.4-6v-11zm11.4-6.2l9.7 5.5-9.7 5.6V4.4z" fill="#555AB9"/>
            <path d="M27.2 10.6v11.2l-10.5 6V16.5l10.5-6zM15.7 4.4v11L6 10l9.7-5.5z" fill="#91BAF8"/>
          </g>
        </svg>
        <h1>Acme</h1>
      </div>
      <div>
        {user ? (<>
            <span className="welcome">
              Welcome, <b>{user.name}</b>!
            </span>
            <Button_1.Button size="small" onClick={onLogout} label="Log out"/>
          </>) : (<>
            <Button_1.Button size="small" onClick={onLogin} label="Log in"/>
            <Button_1.Button primary size="small" onClick={onCreateAccount} label="Sign up"/>
          </>)}
      </div>
    </div>
  </header>);
};
exports.Header = Header;
