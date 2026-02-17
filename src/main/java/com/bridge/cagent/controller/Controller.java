package com.bridge.cagent.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.reactive.function.client.WebClient;

@RestController
@RequestMapping("/api")
public class Controller {
    private final WebClient webClient = WebClient.create();

    @GetMapping("/health")
    public String gethealth() {
        return "health";
    }

    public String getName(String name) {
        return name;
    }

    public Integer add(int a, int b) {
        return a + b;
    }

    @GetMapping("/fetch")
    public Mono<String> getFetch() {

        return webClient.get()
                .uri("https://jsonplaceholder.typicode.com/posts/1")
                .retrieve()
                .bodyToMono(String.class);
    }

}
