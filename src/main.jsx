import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import Points from "./components/Points";
import NavBar from "./components/NavBar";
import Swap from "./components/Swap";
import Community from "./components/Community";
import Footer from "./components/Footer";
import SwapNav from "./components/SwapNav";
import PointNav from "./components/PointNav";
import CommunityNav from "./components/CommunityNav";
import { WalletProvider } from "./SwapConnect";
import { Connect } from '@stacks/connect-react';
import logo from "./assets/hero.png";

const appDetails = {
  name: "VikingSwap",
  icon: window.location.origin + logo,
};
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <NavBar />
        <App />
      </>
    ),
  },
  {
    path: "/point",
    element: (
      <>
        <PointNav />
        <Points />
        <Footer />
      </>
    ),
  },
  {
    path: "/community",
    element: (
      <>
        <CommunityNav />
        <Community />
        <Footer />
      </>
    ),
  },
  {
    path: "/swap",
    element: (
      <>
      <Connect
      authOptions={{
        appDetails,
        redirectTo: "/swap",
      }}
    >
        <WalletProvider>
        <SwapNav />
        <Swap />
        <Footer />
        </WalletProvider>
        </Connect>
      </>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
