package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactAppController {
    
    /**
     * This controller handles client-side routing for React
     * It forwards all non-API routes to index.html
     */
    @RequestMapping(value = {
        "/", 
        "/{path:[^\\.]*}", 
        "/{path:^(?!api$).*}/**",
        "/tableDashboard",
        "/dashboard"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
