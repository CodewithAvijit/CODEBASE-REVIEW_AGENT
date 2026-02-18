package com.bridge.cagent;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
public class ControllerTests {
   @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGithubLoginRedirect() throws Exception {
        mockMvc.perform(get("/login/github"))
                .andExpect(status().isFound()) 
                .andExpect(header().string("Location", "/oauth2/authorization/github")); 
    }
}
