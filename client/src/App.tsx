import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Automation from "@/pages/Automation";
import Analytics from "@/pages/Analytics";
import Connections from "@/pages/Connections";
import Content from "@/pages/Content";
import Settings from "@/pages/Settings";
import Support from "@/pages/Support";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/automation" component={Automation} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/connections" component={Connections} />
        <Route path="/content" component={Content} />
        <Route path="/settings" component={Settings} />
        <Route path="/support" component={Support} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
