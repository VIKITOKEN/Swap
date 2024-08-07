import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NavBar from "../NavBar";
import App from "../../App";
import Points from "../Points";
import PointNav from "../PointNav";
import Community from "../Community";
import CommunityNav from "../CommunityNav";
import Swap from "../Swap";
import SwapNav from "../SwapNav";
import Footer from "../Footer";

const queryClient = new QueryClient();

const ParentComponent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <NavBar />
            <App />
          </Route>
          <Route path="/point">
            <PointNav />
            <Points />
            <Footer />
          </Route>
          <Route path="/community">
            <CommunityNav />
            <Community />
            <Footer />
          </Route>
          <Route path="/swap">
            <SwapNav />
            <Swap />
            <Footer />
          </Route>
        </Switch>
      </Router>
    </QueryClientProvider>
  );
};

export default ParentComponent;
