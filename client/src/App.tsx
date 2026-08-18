/* Docklight Command: single operational shell with a persistent command-center route. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Workflow from "./pages/Workflow";
import Simulator from "./pages/Simulator";
import Orders from "./pages/Orders";
import Inventory from "./pages/Inventory";
import Dispatch from "./pages/Dispatch";
import Analytics from "./pages/Analytics";
import ExceptionReview from "./pages/ExceptionReview";
import Activity from "./pages/Activity";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/workflow/:stage" component={Workflow} />
      <Route path="/simulator" component={Simulator} />
      <Route path="/orders" component={Orders} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/dispatch" component={Dispatch} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/exceptions" component={ExceptionReview} />
      <Route path="/activity" component={Activity} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster position="bottom-right" />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
