import React, {Component} from "react";
import classNames from "classnames";
import {AppTopbar} from "./AppTopbar";
import {AppMenu} from "./AppMenu";
import {AppInlineProfile} from "./AppInlineProfile";
import {Route} from "react-router-dom";
import {Dashboard} from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import {GardenPage} from "./components/GardenPage";
import {MarketPlots} from "./components/MarketPlots";
import {MarketSeeds} from "./components/MarketSeeds";
import {ScrollPanel} from "primereact/components/scrollpanel/ScrollPanel";
import "primereact/resources/themes/nova-light/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "fullcalendar/dist/fullcalendar.css";
import "./layout/layout.css";
import "./App.scss";
import steemConnectAPI from "./service/SteemConnectAPI";
import SCCallback from "./components/SCCallback";
import UserGarden from "./components/UserGarden";
import WelcomePage from "./components/WelcomePage";
import FAQPage from "./components/FAQPage";
import Stats from "./components/Stats";

export const StateContext = React.createContext();

class App extends Component {
  constructor() {
    const accessToken = localStorage.getItem("sc_token");

    if (accessToken) {
      steemConnectAPI.setAccessToken(accessToken);
    }

    super();
    this.state = {
      layoutMode: "static",
      layoutColorMode: "dark",
      staticMenuInactive: false,
      overlayMenuActive: false,
      mobileMenuActive: false,
      localState: {
        username: "",
        login: username =>
          this.setState(state => ({
            localState: {
              ...state.localState,
              username
            }
          })),
        steemConnectAPI,
        loginType: undefined
      }
    };

    this.onWrapperClick = this.onWrapperClick.bind(this);
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSidebarClick = this.onSidebarClick.bind(this);
    this.onMenuItemClick = this.onMenuItemClick.bind(this);
    this.createMenu();
  }

  onWrapperClick(event) {
    if (!this.menuClick) {
      this.setState({
        overlayMenuActive: true,
        mobileMenuActive: false
      });
    }

    this.menuClick = false;
  }

  onToggleMenu(event) {
    this.menuClick = true;

    if (this.isDesktop()) {
      if (this.state.layoutMode === "overlay") {
        this.setState({
          overlayMenuActive: !this.state.overlayMenuActive
        });
      } else if (this.state.layoutMode === "static") {
        this.setState({
          staticMenuInactive: !this.state.staticMenuInactive
        });
      }
    } else {
      const mobileMenuActive = this.state.mobileMenuActive;
      this.setState({
        mobileMenuActive: !mobileMenuActive
      });
    }

    event.preventDefault();
  }

  onSidebarClick(event) {
    this.menuClick = true;
    setTimeout(() => {
      this.layoutMenuScroller.moveBar();
    }, 500);
  }

  onMenuItemClick(event) {
    if (!event.item.items) {
      this.setState({
        overlayMenuActive: false,
        mobileMenuActive: false
      });
    }
  }

  createMenu() {
    this.menu = [
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-home",
        to: "/dashboard"
      },
      {
        label: "Ganja Farm",
        icon: "pi pi-fw pi-globe",
        items: [{label: "Garden", icon: "pi pi-fw pi-file", to: "/garden"}]
      },
      {
        label: "Marketplace",
        icon: "pi pi-fw pi-file",
        items: [
          {
            label: "Garden Plots",
            icon: "pi pi-fw pi-circle-off",
            to: "/market/gardenplots"
          },
          {
            label: "Seeds",
            icon: "pi pi-fw pi-circle-off",
            to: "/market/seedbank"
          }
        ]
      },
      {
        label: "Stats",
        icon: "pi pi-fw pi-file",
        to: "/stats"
      },
      {
        label: "CannaDex(Coming Soon)",
        icon: "pi pi-fw pi-file",
        command: () => {
          window.location = "https://steempeak.com/@hashkings";
        }
      },
      {
        label: "FAQ",
        icon: "pi pi-fw pi-circle-off",
        to: "/faq"
      }
    ];
  }

  addClass(element, className) {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  }

  removeClass(element, className) {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  }

  isDesktop() {
    return window.innerWidth > 1024;
  }

  componentDidUpdate() {
    if (this.state.mobileMenuActive)
      this.addClass(document.body, "body-overflow-hidden");
    else this.removeClass(document.body, "body-overflow-hidden");
  }

  componentDidMount() {
    if (!this.state.localState.username && localStorage.getItem("sc_token")) {
      this.state.localState.steemConnectAPI
        .me()
        .then(res => {
          this.state.localState.login(res.name);
        })
        .catch(e => {
          console.log(e);
          localStorage.removeItem("sc_token");
        });
    }
  }

  render() {
    let wrapperClass = classNames("layout-wrapper", {
      "layout-overlay": this.state.layoutMode === "overlay",
      "layout-static": this.state.layoutMode === "static",
      "layout-static-sidebar-inactive":
        this.state.staticMenuInactive && this.state.layoutMode === "static",
      "layout-overlay-sidebar-active":
        this.state.overlayMenuActive && this.state.layoutMode === "overlay",
      "layout-mobile-sidebar-active": this.state.mobileMenuActive
    });
    let sidebarClassName = classNames("layout-sidebar", {
      "layout-sidebar-dark": this.state.layoutColorMode === "dark"
    });

    return (
      <StateContext.Provider value={this.state.localState}>
        <div className={wrapperClass} onClick={this.onWrapperClick}>
          <AppTopbar onToggleMenu={this.onToggleMenu} />

          <div
            ref={el => (this.sidebar = el)}
            className={sidebarClassName}
            onClick={this.onSidebarClick}
          >
            <ScrollPanel
              ref={el => (this.layoutMenuScroller = el)}
              style={{height: "100%"}}
            >
              <div className="layout-sidebar-scroll-content">
                <div className="layout-logo">
                  <img
                    alt="Logo"
                    src="/assets/layout/images/hashkingsbanner.png"
                  />
                </div>
                <AppInlineProfile />
                <AppMenu
                  model={this.menu}
                  onMenuItemClick={this.onMenuItemClick}
                />
              </div>
            </ScrollPanel>
          </div>
          <div className="layout-main">
            <Route path="/login" component={LoginPage} />
            <Route path="/" exact component={WelcomePage} />
            <Route path="/garden/:username" component={UserGarden} />
            <Route exact path="/garden" component={GardenPage} />
            <Route path="/market/gardenplots" component={MarketPlots} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/market/seedbank" component={MarketSeeds} />
            <Route path="/callback" component={SCCallback} />
            <Route path="/faq" component={FAQPage} />
            <Route path="/stats" component={Stats} />
          </div>
          <div className="layout-mask" />
        </div>
      </StateContext.Provider>
    );
  }
}

export default App;
