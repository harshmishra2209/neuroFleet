package com.springBoot.simpleWebApp.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController
{
    @RequestMapping("/")
    public String greet()
    {
        System.out.println("im here");
        return "Welcome to Home Page!";
    }

    @RequestMapping("/about")
    public String about()
    {
        return "We are the BEST!";
    }


}
