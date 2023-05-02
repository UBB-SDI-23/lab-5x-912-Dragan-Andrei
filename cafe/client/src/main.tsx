import React from "react";
import ReactDOM from "react-dom/client";

// css
import "./assets/css/index.css";
import "./assets/css/fonts.css";

// utils
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { theme } from "./utils/theme";

// react components
import Home from "./components/Home";

import Menu from "./components/coffees/Menu";
import DetailedCoffeeItem from "./components/coffees/DetailedCoffeeItem";
import AddCoffee from "./components/coffees/AddCoffee";
import EditCoffee from "./components/coffees/EditCoffee";

import AddSale from "./components/sales/AddSale";

import AddLocation from "./components/locations/AddLocation";
import EditLocation from "./components/locations/EditLocation";
import LocationsMenu from "./components/locations/LocationsMenu";
import DetailedLocationItem from "./components/locations/DetailedLocationItem";
import SalesByLocation from "./components/locations/SalesByLocation";

import BlendsMenu from "./components/blends/BlendsMenu";
import DetailedBlendItem from "./components/blends/DetailedBlendItem";
import AddBlend from "./components/blends/AddBlend";
import EditBlend from "./components/blends/EditBlend";
import CountriesByBlends from "./components/blends/CountriesByBlends";

import Register from "./components/users/Register";
import Confirmation from "./components/users/Confirmation";

import NotFound from "./components/NotFound";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/coffees" element={<Menu />} />
          <Route path="/coffees/add" element={<AddCoffee />} />
          <Route path="/coffees/:id/edit/" element={<EditCoffee />} />
          <Route path="/coffees/:id" element={<DetailedCoffeeItem />} />

          <Route path="/locations" element={<LocationsMenu />} />
          <Route path="/locations/add" element={<AddLocation />} />
          <Route path="/locations/:id/edit/" element={<EditLocation />} />
          <Route path="/locations/:id" element={<DetailedLocationItem />} />
          <Route path="/locations/:id/add" element={<AddSale />} />
          <Route path="/locations/sales-by-location" element={<SalesByLocation />} />

          <Route path="/blends" element={<BlendsMenu />} />
          <Route path="/blends/:id" element={<DetailedBlendItem />} />
          <Route path="/blends/add" element={<AddBlend />} />
          <Route path="/blends/:id/edit" element={<EditBlend />} />
          <Route path="/blends/country" element={<CountriesByBlends />} />

          <Route path="/register" element={<Register />} />
          <Route path="/register/confirm/:code" element={<Confirmation />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
