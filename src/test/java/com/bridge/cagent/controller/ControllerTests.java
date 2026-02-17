package com.bridge.cagent.controller;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.net.URI;
import java.net.http.HttpClient;

import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import reactor.core.publisher.Mono;

import org.junit.jupiter.api.Test;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class ControllerTests {
    private Controller controller = new Controller();
    @Autowired
    private MockMvc mockMvc;

    @Disabled
    public void testGetHealth() {
        assertEquals("health", controller.gethealth());
    }

    @ParameterizedTest
    @CsvSource({
            "1, 1, 2, 'Simple Addition'",
            "2, 10, 12, 'Double Digit Addition'",
            "3, 3, 6, 'Small Numbers'"
    })
    public void testadd(int a, int b, int exp, String name) {
        assertEquals(exp, controller.add(a, b), "failed for " + name);
    }

    @Test
    public void testGetName() {
        assertNotNull(controller.getName("Avijit"));
    }

    @Test
    public void testGetPostsNative() throws Exception {
        Mono<String> response = controller.getFetch();
        String respone=response.block();
        assertNotNull(respone);
        assertTrue(respone.contains("userId"));
    }
}
